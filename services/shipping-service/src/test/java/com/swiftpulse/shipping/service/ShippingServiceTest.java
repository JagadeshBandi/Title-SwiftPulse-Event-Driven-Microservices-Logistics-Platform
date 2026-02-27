package com.swiftpulse.shipping.service;

import com.swiftpulse.shipping.entity.Driver;
import com.swiftpulse.shipping.entity.Shipment;
import com.swiftpulse.shipping.repository.DriverRepository;
import com.swiftpulse.shipping.repository.ShipmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShippingServiceTest {

    @Mock
    private DriverRepository driverRepository;

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private RouteOptimizer routeOptimizer;

    @InjectMocks
    private ShippingService shippingService;

    private Driver driver;
    private Shipment shipment;

    @BeforeEach
    void setUp() {
        driver = new Driver();
        driver.setId(1L);
        driver.setFirstName("John");
        driver.setLastName("Doe");
        driver.setEmail("john@example.com");
        driver.setLicenseNumber("LIC123456");
        driver.setIsAvailable(true);
        driver.setCurrentLatitude(40.7128);
        driver.setCurrentLongitude(-74.0060);
        driver.setRating(4.5);
        driver.setTotalDeliveries(10);

        shipment = new Shipment();
        shipment.setId(1L);
        shipment.setOrderId(100L);
        shipment.setDriverId(1L);
        shipment.setOrderNumber("ORD123");
        shipment.setTrackingNumber("TRK456");
        shipment.setStatus(Shipment.ShipmentStatus.ASSIGNED);
        shipment.setPickupLatitude(40.7580);
        shipment.setPickupLongitude(-73.9855);
        shipment.setDeliveryLatitude(40.6782);
        shipment.setDeliveryLongitude(-73.9442);
    }

    @Test
    void registerDriver_Success() {
        when(driverRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(driverRepository.findByLicenseNumber(anyString())).thenReturn(Optional.empty());
        when(driverRepository.save(any(Driver.class))).thenReturn(driver);

        Driver result = shippingService.registerDriver(driver);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertTrue(result.getIsAvailable());
        assertEquals(5.0, result.getRating());
    }

    @Test
    void registerDriver_DuplicateEmail_ThrowsException() {
        when(driverRepository.findByEmail(anyString())).thenReturn(Optional.of(driver));

        assertThrows(RuntimeException.class, () -> shippingService.registerDriver(driver));
    }

    @Test
    void updateDriverLocation_Success() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));
        when(driverRepository.save(any(Driver.class))).thenReturn(driver);

        Driver result = shippingService.updateDriverLocation(1L, 40.7500, -73.9800);

        assertNotNull(result);
        assertEquals(40.7500, result.getCurrentLatitude());
        assertEquals(-73.9800, result.getCurrentLongitude());
        assertNotNull(result.getLastLocationUpdate());
    }

    @Test
    void getAvailableDrivers_Success() {
        when(driverRepository.findByIsAvailableTrue()).thenReturn(Arrays.asList(driver));

        List<Driver> results = shippingService.getAvailableDrivers();

        assertNotNull(results);
        assertEquals(1, results.size());
        assertTrue(results.get(0).getIsAvailable());
    }

    @Test
    void getShipmentByOrderId_Success() {
        when(shipmentRepository.findByOrderId(100L)).thenReturn(Optional.of(shipment));

        Shipment result = shippingService.getShipmentByOrderId(100L);

        assertNotNull(result);
        assertEquals(100L, result.getOrderId());
        assertEquals("ORD123", result.getOrderNumber());
    }

    @Test
    void updateShipmentStatus_ToCompleted_Success() {
        when(shipmentRepository.findById(1L)).thenReturn(Optional.of(shipment));
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));
        when(driverRepository.save(any(Driver.class))).thenReturn(driver);
        when(shipmentRepository.save(any(Shipment.class))).thenReturn(shipment);

        shipment.setStatus(Shipment.ShipmentStatus.COMPLETED);
        Shipment result = shippingService.updateShipmentStatus(1L, Shipment.ShipmentStatus.COMPLETED);

        assertNotNull(result);
        assertEquals(Shipment.ShipmentStatus.COMPLETED, result.getStatus());
        assertTrue(result.getDeliveryConfirmed());
        assertNotNull(result.getActualDeliveryTime());
    }

    @Test
    void getDriverShipments_Success() {
        when(shipmentRepository.findByDriverId(1L)).thenReturn(Arrays.asList(shipment));

        List<Shipment> results = shippingService.getDriverShipments(1L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(1L, results.get(0).getDriverId());
    }

    @Test
    void getActiveDriverShipments_Success() {
        when(shipmentRepository.findActiveShipmentsByDriver(1L)).thenReturn(Arrays.asList(shipment));

        List<Shipment> results = shippingService.getActiveDriverShipments(1L);

        assertNotNull(results);
        assertFalse(results.isEmpty());
    }

    @Test
    void getDriverById_Success() {
        when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

        Optional<Driver> result = shippingService.getDriverById(1L);

        assertTrue(result.isPresent());
        assertEquals("John", result.get().getFirstName());
    }

    @Test
    void getDriverById_NotFound() {
        when(driverRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Driver> result = shippingService.getDriverById(999L);

        assertFalse(result.isPresent());
    }
}
