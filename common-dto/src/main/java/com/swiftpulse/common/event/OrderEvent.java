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
public class OrderEvent {
    private String eventId;
    private EventType eventType;
    private OrderDto order;
    private LocalDateTime timestamp;
    private String sourceService;
    private String correlationId;
    
    public enum EventType {
        ORDER_CREATED,
        ORDER_CONFIRMED,
        ORDER_CANCELLED,
        ORDER_UPDATED,
        PAYMENT_COMPLETED,
        PAYMENT_FAILED
    }
    
    public static OrderEvent createOrderCreated(OrderDto order, String sourceService) {
        return OrderEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(EventType.ORDER_CREATED)
                .order(order)
                .timestamp(LocalDateTime.now())
                .sourceService(sourceService)
                .correlationId(UUID.randomUUID().toString())
                .build();
    }
}
