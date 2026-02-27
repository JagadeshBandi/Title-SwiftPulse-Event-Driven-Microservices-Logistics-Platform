package com.swiftpulse.shipping.repository;

import com.swiftpulse.shipping.entity.Shipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    
    Optional<Shipment> findByOrderId(Long orderId);
    
    Optional<Shipment> findByOrderNumber(String orderNumber);
    
    Optional<Shipment> findByTrackingNumber(String trackingNumber);
    
    List<Shipment> findByDriverId(Long driverId);
    
    List<Shipment> findByStatus(Shipment.ShipmentStatus status);
    
    @Query("SELECT s FROM Shipment s WHERE s.driverId = ?1 AND s.status IN ('ASSIGNED', 'EN_ROUTE_TO_PICKUP', 'AT_PICKUP', 'EN_ROUTE_TO_DELIVERY')")
    List<Shipment> findActiveShipmentsByDriver(Long driverId);
    
    @Query("SELECT s FROM Shipment s WHERE s.status = 'ASSIGNED' ORDER BY s.createdAt ASC")
    List<Shipment> findPendingShipments();
    
    @Query("SELECT COUNT(s) FROM Shipment s WHERE s.driverId = ?1 AND s.status = 'COMPLETED'")
    Long countCompletedShipmentsByDriver(Long driverId);
}
