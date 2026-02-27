package com.swiftpulse.common.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private String eventId;
    private EventType eventType;
    private String recipient;
    private NotificationChannel channel;
    private String subject;
    private String message;
    private Map<String, Object> metadata;
    private LocalDateTime timestamp;
    private String sourceService;
    private String correlationId;
    
    public enum EventType {
        ORDER_CONFIRMED,
        ORDER_SHIPPED,
        OUT_FOR_DELIVERY,
        DELIVERED,
        DELIVERY_DELAYED,
        PAYMENT_RECEIVED,
        PAYMENT_FAILED,
        ACCOUNT_CREATED,
        PASSWORD_CHANGED
    }
    
    public enum NotificationChannel {
        EMAIL, SMS, PUSH_NOTIFICATION, WEBHOOK
    }
    
    public static NotificationEvent createOrderConfirmed(String recipientEmail, String orderNumber, String sourceService) {
        return NotificationEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(EventType.ORDER_CONFIRMED)
                .recipient(recipientEmail)
                .channel(NotificationChannel.EMAIL)
                .subject("Order Confirmed: " + orderNumber)
                .message("Your order " + orderNumber + " has been confirmed and is being processed.")
                .timestamp(LocalDateTime.now())
                .sourceService(sourceService)
                .correlationId(UUID.randomUUID().toString())
                .build();
    }
}
