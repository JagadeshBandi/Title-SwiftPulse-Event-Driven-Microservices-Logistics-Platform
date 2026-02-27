package com.swiftpulse.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingUpdateDto {
    private Long id;
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotBlank(message = "Tracking number is required")
    private String trackingNumber;
    
    @NotNull(message = "Latitude is required")
    private Double latitude;
    
    @NotNull(message = "Longitude is required")
    private Double longitude;
    
    private String locationDescription;
    
    @NotNull(message = "Status is required")
    private TrackingStatus status;
    
    private String notes;
    private LocalDateTime timestamp;
    
    private Long driverId;
    private String driverName;
    
    private Double speed;
    private Double heading;
    private Double accuracy;
    
    public enum TrackingStatus {
        PICKED_UP, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, DELIVERY_ATTEMPTED, DELAYED, EXCEPTION
    }
}
