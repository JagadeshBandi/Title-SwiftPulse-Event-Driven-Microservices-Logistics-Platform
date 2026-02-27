package com.swiftpulse.order.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "customer_id", nullable = false)
    private Long customerId;
    
    @Column(name = "order_number", nullable = false, unique = true)
    private String orderNumber;
    
    @Column(name = "tracking_number", nullable = false, unique = true)
    private String trackingNumber;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private Double weight;
    
    @Column(name = "package_type")
    private String packageType;
    
    @Column(name = "delivery_type")
    private String deliveryType;
    
    @Column(name = "pickup_address_street")
    private String pickupAddressStreet;
    
    @Column(name = "pickup_address_city")
    private String pickupAddressCity;
    
    @Column(name = "pickup_address_state")
    private String pickupAddressState;
    
    @Column(name = "pickup_address_zip")
    private String pickupAddressZip;
    
    @Column(name = "pickup_latitude")
    private Double pickupLatitude;
    
    @Column(name = "pickup_longitude")
    private Double pickupLongitude;
    
    @Column(name = "delivery_address_street")
    private String deliveryAddressStreet;
    
    @Column(name = "delivery_address_city")
    private String deliveryAddressCity;
    
    @Column(name = "delivery_address_state")
    private String deliveryAddressState;
    
    @Column(name = "delivery_address_zip")
    private String deliveryAddressZip;
    
    @Column(name = "delivery_latitude")
    private Double deliveryLatitude;
    
    @Column(name = "delivery_longitude")
    private Double deliveryLongitude;
    
    @Column(name = "priority_level")
    private String priorityLevel;
    
    @Column(name = "estimated_cost", precision = 10, scale = 2)
    private BigDecimal estimatedCost;
    
    @Column(name = "estimated_delivery_date")
    private LocalDateTime estimatedDeliveryDate;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OrderStatus status;
    
    @Column(name = "assigned_driver_id")
    private Long assignedDriverId;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum OrderStatus {
        PENDING, CONFIRMED, ASSIGNED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    }
    
    public Order() {}
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    
    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    
    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public String getPackageType() { return packageType; }
    public void setPackageType(String packageType) { this.packageType = packageType; }
    
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    
    public String getPickupAddressStreet() { return pickupAddressStreet; }
    public void setPickupAddressStreet(String pickupAddressStreet) { this.pickupAddressStreet = pickupAddressStreet; }
    
    public String getPickupAddressCity() { return pickupAddressCity; }
    public void setPickupAddressCity(String pickupAddressCity) { this.pickupAddressCity = pickupAddressCity; }
    
    public String getPickupAddressState() { return pickupAddressState; }
    public void setPickupAddressState(String pickupAddressState) { this.pickupAddressState = pickupAddressState; }
    
    public String getPickupAddressZip() { return pickupAddressZip; }
    public void setPickupAddressZip(String pickupAddressZip) { this.pickupAddressZip = pickupAddressZip; }
    
    public Double getPickupLatitude() { return pickupLatitude; }
    public void setPickupLatitude(Double pickupLatitude) { this.pickupLatitude = pickupLatitude; }
    
    public Double getPickupLongitude() { return pickupLongitude; }
    public void setPickupLongitude(Double pickupLongitude) { this.pickupLongitude = pickupLongitude; }
    
    public String getDeliveryAddressStreet() { return deliveryAddressStreet; }
    public void setDeliveryAddressStreet(String deliveryAddressStreet) { this.deliveryAddressStreet = deliveryAddressStreet; }
    
    public String getDeliveryAddressCity() { return deliveryAddressCity; }
    public void setDeliveryAddressCity(String deliveryAddressCity) { this.deliveryAddressCity = deliveryAddressCity; }
    
    public String getDeliveryAddressState() { return deliveryAddressState; }
    public void setDeliveryAddressState(String deliveryAddressState) { this.deliveryAddressState = deliveryAddressState; }
    
    public String getDeliveryAddressZip() { return deliveryAddressZip; }
    public void setDeliveryAddressZip(String deliveryAddressZip) { this.deliveryAddressZip = deliveryAddressZip; }
    
    public Double getDeliveryLatitude() { return deliveryLatitude; }
    public void setDeliveryLatitude(Double deliveryLatitude) { this.deliveryLatitude = deliveryLatitude; }
    
    public Double getDeliveryLongitude() { return deliveryLongitude; }
    public void setDeliveryLongitude(Double deliveryLongitude) { this.deliveryLongitude = deliveryLongitude; }
    
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    
    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
    
    public LocalDateTime getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDateTime estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    
    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }
    
    public Long getAssignedDriverId() { return assignedDriverId; }
    public void setAssignedDriverId(Long assignedDriverId) { this.assignedDriverId = assignedDriverId; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
