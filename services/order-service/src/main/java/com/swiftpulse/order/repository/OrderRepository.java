package com.swiftpulse.order.repository;

import com.swiftpulse.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    Optional<Order> findByOrderNumber(String orderNumber);
    
    Optional<Order> findByTrackingNumber(String trackingNumber);
    
    List<Order> findByCustomerId(Long customerId);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    List<Order> findByAssignedDriverId(Long driverId);
    
    @Query("SELECT o FROM Order o WHERE o.customerId = ?1 ORDER BY o.createdAt DESC")
    List<Order> findByCustomerIdOrderByCreatedAtDesc(Long customerId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = ?1")
    Long countByStatus(Order.OrderStatus status);
    
    @Query("SELECT o FROM Order o WHERE o.status IN ('PENDING', 'CONFIRMED', 'ASSIGNED') ORDER BY o.createdAt ASC")
    List<Order> findPendingOrders();
}
