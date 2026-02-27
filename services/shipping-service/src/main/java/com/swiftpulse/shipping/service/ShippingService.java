package com.swiftpulse.shipping.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swiftpulse.shipping.entity.Driver;
import com.swiftpulse.shipping.entity.Shipment;
import com.swiftpulse.shipping.repository.DriverRepository;
import com.swiftpulse.shipping.repository.ShipmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class ShippingService {
    
    private static final Logger log = LoggerFactory.getLogger(ShippingService.class);
    
    private final DriverRepository driverRepository;
    private final ShipmentRepository shipmentRepository;
    private final RouteOptimizer routeOptimizer;
    private final ObjectMapper objectMapper;
    
    public ShippingService(DriverRepository driverRepository, ShipmentRepository shipmentRepository, 
                          RouteOptimizer routeOptimizer, ObjectMapper objectMapper) {
        this.driverRepository = driverRepository;
        this.shipmentRepository = shipmentRepository;
        this.routeOptimizer = routeOptimizer;
        this.objectMapper = objectMapper;
    }
    
    @KafkaListener(topics = "order-events", groupId = "shipping-service")
    public void handleOrderCreatedEvent(String eventJson) {
        try {
            Map<String, Object> event = objectMapper.readValue(eventJson, HashMap.class);
            String eventType = (String) event.get("eventType");
            
            if ("ORDER_CREATED".equals(eventType)) {
                Long orderId = Long.valueOf(event.get("orderId").toString());
                String orderNumber = (String) event.get("orderNumber");
                String trackingNumber = (String) event.get("trackingNumber");
                Double pickupLat = Double.valueOf(event.get("pickupLatitude").toString());
                Double pickupLon = Double.valueOf(event.get("pickupLongitude").toString());
                Double deliveryLat = Double.valueOf(event.get("deliveryLatitude").toString());
                Double deliveryLon = Double.valueOf(event.get("deliveryLongitude").toString());
                
                log.info("Received ORDER_CREATED event for order: {}", orderNumber);
                assignDriverToOrder(orderId, orderNumber, trackingNumber, pickupLat, pickupLon, deliveryLat, deliveryLon);
            }
        } catch (Exception e) {
            log.error("Error processing order event: {}", eventJson, e);
        }
    }
    
    public void assignDriverToOrder(Long orderId, String orderNumber, String trackingNumber, 
                                     Double pickupLat, Double pickupLon, Double deliveryLat, Double deliveryLon) {
        List<Driver> availableDrivers = driverRepository.findAvailableDriversWithLocation();
        
        if (availableDrivers.isEmpty()) {
            log.warn("No available drivers for order: {}", orderNumber);
            return;
        }
        
        Driver nearestDriver = routeOptimizer.findNearestDriver(availableDrivers, pickupLat, pickupLon);
        
        if (nearestDriver == null) {
            log.warn("Could not find nearest driver for order: {}", orderNumber);
            return;
        }
        
        double distanceToPickup = routeOptimizer.calculateDistance(
            nearestDriver.getCurrentLatitude(), nearestDriver.getCurrentLongitude(), pickupLat, pickupLon
        );
        double totalDistance = distanceToPickup + routeOptimizer.calculateDistance(pickupLat, pickupLon, deliveryLat, deliveryLon);
        double estimatedMinutes = routeOptimizer.calculateEstimatedTime(totalDistance, 30.0);
        
        Shipment shipment = new Shipment();
        shipment.setOrderId(orderId);
        shipment.setDriverId(nearestDriver.getId());
        shipment.setOrderNumber(orderNumber);
        shipment.setTrackingNumber(trackingNumber);
        shipment.setStatus(Shipment.ShipmentStatus.ASSIGNED);
        shipment.setPickupLatitude(pickupLat);
        shipment.setPickupLongitude(pickupLon);
        shipment.setDeliveryLatitude(deliveryLat);
        shipment.setDeliveryLongitude(deliveryLon);
        shipment.setEstimatedPickupTime(LocalDateTime.now().plusMinutes((long) (distanceToPickup / 30.0 * 60)));
        shipment.setEstimatedDeliveryTime(LocalDateTime.now().plusMinutes((long) estimatedMinutes));
        shipment.setRouteData(routeOptimizer.generateRouteJson(pickupLat, pickupLon, deliveryLat, deliveryLon));
        shipment.setDistanceKm(totalDistance);
        
        shipmentRepository.save(shipment);
        
        nearestDriver.setIsAvailable(false);
        driverRepository.save(nearestDriver);
        
        log.info("Driver {} assigned to order {}. Est. pickup: {}, Est. delivery: {}", 
                nearestDriver.getId(), orderNumber, shipment.getEstimatedPickupTime(), shipment.getEstimatedDeliveryTime());
    }
    
    public Shipment getShipmentByOrderId(Long orderId) {
        return shipmentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("Shipment not found for order: " + orderId));
    }
    
    public Shipment updateShipmentStatus(Long shipmentId, Shipment.ShipmentStatus newStatus) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found: " + shipmentId));
        
        shipment.setStatus(newStatus);
        
        if (newStatus == Shipment.ShipmentStatus.AT_PICKUP) {
            shipment.setActualPickupTime(LocalDateTime.now());
            shipment.setPickupConfirmed(true);
        } else if (newStatus == Shipment.ShipmentStatus.COMPLETED) {
            shipment.setActualDeliveryTime(LocalDateTime.now());
            shipment.setDeliveryConfirmed(true);
            
            Driver driver = driverRepository.findById(shipment.getDriverId())
                    .orElseThrow(() -> new RuntimeException("Driver not found: " + shipment.getDriverId()));
            driver.setIsAvailable(true);
            driver.setTotalDeliveries(driver.getTotalDeliveries() + 1);
            driverRepository.save(driver);
        }
        
        return shipmentRepository.save(shipment);
    }
    
    public List<Shipment> getDriverShipments(Long driverId) {
        return shipmentRepository.findByDriverId(driverId);
    }
    
    public List<Shipment> getActiveDriverShipments(Long driverId) {
        return shipmentRepository.findActiveShipmentsByDriver(driverId);
    }
    
    public Driver registerDriver(Driver driver) {
        if (driverRepository.findByEmail(driver.getEmail()).isPresent()) {
            throw new RuntimeException("Driver with email already exists: " + driver.getEmail());
        }
        if (driverRepository.findByLicenseNumber(driver.getLicenseNumber()).isPresent()) {
            throw new RuntimeException("Driver with license number already exists: " + driver.getLicenseNumber());
        }
        
        driver.setIsAvailable(true);
        driver.setRating(5.0);
        driver.setTotalDeliveries(0);
        
        return driverRepository.save(driver);
    }
    
    public Driver updateDriverLocation(Long driverId, Double latitude, Double longitude) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found: " + driverId));
        
        driver.setCurrentLatitude(latitude);
        driver.setCurrentLongitude(longitude);
        driver.setLastLocationUpdate(LocalDateTime.now());
        
        return driverRepository.save(driver);
    }
    
    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByIsAvailableTrue();
    }
    
    public Optional<Driver> getDriverById(Long driverId) {
        return driverRepository.findById(driverId);
    }
}
