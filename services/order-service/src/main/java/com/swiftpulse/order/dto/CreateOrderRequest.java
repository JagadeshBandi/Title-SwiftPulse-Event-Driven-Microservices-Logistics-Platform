package com.swiftpulse.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class CreateOrderRequest {
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private Double weight;
    
    private String packageType;
    private String deliveryType;
    private String priorityLevel;
    
    @NotBlank(message = "Pickup street address is required")
    private String pickupAddressStreet;
    
    @NotBlank(message = "Pickup city is required")
    private String pickupAddressCity;
    
    @NotBlank(message = "Pickup state is required")
    private String pickupAddressState;
    
    @NotBlank(message = "Pickup ZIP code is required")
    private String pickupAddressZip;
    
    private Double pickupLatitude;
    private Double pickupLongitude;
    
    @NotBlank(message = "Delivery street address is required")
    private String deliveryAddressStreet;
    
    @NotBlank(message = "Delivery city is required")
    private String deliveryAddressCity;
    
    @NotBlank(message = "Delivery state is required")
    private String deliveryAddressState;
    
    @NotBlank(message = "Delivery ZIP code is required")
    private String deliveryAddressZip;
    
    private Double deliveryLatitude;
    private Double deliveryLongitude;
    
    private BigDecimal estimatedCost;

    public CreateOrderRequest() {}

    // Getters and Setters
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public String getPackageType() { return packageType; }
    public void setPackageType(String packageType) { this.packageType = packageType; }
    
    public String getDeliveryType() { return deliveryType; }
    public void setDeliveryType(String deliveryType) { this.deliveryType = deliveryType; }
    
    public String getPriorityLevel() { return priorityLevel; }
    public void setPriorityLevel(String priorityLevel) { this.priorityLevel = priorityLevel; }
    
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
    
    public BigDecimal getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(BigDecimal estimatedCost) { this.estimatedCost = estimatedCost; }
}
