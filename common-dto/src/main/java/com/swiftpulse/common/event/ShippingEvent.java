package com.swiftpulse.common.event;

import com.swiftpulse.common.dto.OrderDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShippingEvent {
    private String eventId;
    private EventType eventType;
    private OrderDto order;
    private Long driverId;
    private String driverName;
    private LocalDateTime timestamp;
    private String sourceService;
    private String correlationId;
    
    public enum EventType {
        DRIVER_ASSIGNED,
        DRIVER_UNASSIGNED,
        ROUTE_OPTIMIZED,
        PICKUP_SCHEDULED,
        PICKUP_COMPLETED,
        DELIVERY_SCHEDULED
    }
    
    public static ShippingEvent createDriverAssigned(OrderDto order, Long driverId, String driverName, String sourceService) {
        return ShippingEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(EventType.DRIVER_ASSIGNED)
                .order(order)
                .driverId(driverId)
                .driverName(driverName)
                .timestamp(LocalDateTime.now())
                .sourceService(sourceService)
                .correlationId(UUID.randomUUID().toString())
                .build();
    }
}
