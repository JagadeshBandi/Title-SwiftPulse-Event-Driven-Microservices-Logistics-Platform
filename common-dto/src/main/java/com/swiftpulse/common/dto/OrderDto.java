package com.swiftpulse.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    
    @NotNull(message = "Customer ID is required")
    private Long customerId;
    
    @NotBlank(message = "Order number is required")
    private String orderNumber;
    
    @NotNull(message = "Weight is required")
    @Positive(message = "Weight must be positive")
    private BigDecimal weight;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    @NotNull(message = "Package type is required")
    private PackageType packageType;
    
    @NotNull(message = "Delivery type is required")
    private DeliveryType deliveryType;
    
    private AddressDto pickupAddress;
    private AddressDto deliveryAddress;
    
    @NotNull(message = "Priority level is required")
    private PriorityLevel priorityLevel;
    
    private BigDecimal estimatedCost;
    private LocalDateTime estimatedDeliveryDate;
    
    private OrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private String trackingNumber;
    private Long assignedDriverId;
    
    public enum PackageType {
        ENVELOPE, PACKAGE, BOX, PALLET, CRATE
    }
    
    public enum DeliveryType {
        STANDARD, EXPRESS, OVERNIGHT, SAME_DAY
    }
    
    public enum PriorityLevel {
        LOW, MEDIUM, HIGH, URGENT
    }
    
    public enum OrderStatus {
        PENDING, CONFIRMED, ASSIGNED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, CANCELLED, RETURNED
    }
}
