package com.swiftpulse.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private NotificationService notificationService;

    @BeforeEach
    void setUp() {
        // Setup if needed
    }

    @Test
    void sendEmail_Success() {
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        assertDoesNotThrow(() -> 
            notificationService.sendEmail("test@example.com", "Test Subject", "Test Body")
        );

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendSMS_Success() {
        assertDoesNotThrow(() -> 
            notificationService.sendSMS("+1234567890", "Test SMS message")
        );
    }

    @Test
    void handleOrderEvents_OrderCreated() throws Exception {
        String eventJson = "{\"eventType\":\"ORDER_CREATED\",\"orderId\":100,\"orderNumber\":\"ORD123\",\"trackingNumber\":\"TRK456\",\"customerId\":50}";
        java.util.Map<String, Object> event = new java.util.HashMap<>();
        event.put("eventType", "ORDER_CREATED");
        event.put("orderId", 100);
        event.put("orderNumber", "ORD123");
        event.put("trackingNumber", "TRK456");
        event.put("customerId", 50);

        when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(event);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        notificationService.handleOrderEvents(eventJson);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void handleOrderEvents_OrderStatusUpdated() throws Exception {
        String eventJson = "{\"eventType\":\"ORDER_STATUS_UPDATED\",\"orderNumber\":\"ORD123\",\"newStatus\":\"IN_TRANSIT\",\"customerId\":50}";
        java.util.Map<String, Object> event = new java.util.HashMap<>();
        event.put("eventType", "ORDER_STATUS_UPDATED");
        event.put("orderNumber", "ORD123");
        event.put("newStatus", "IN_TRANSIT");
        event.put("customerId", 50);

        when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(event);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        notificationService.handleOrderEvents(eventJson);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void handleOrderEvents_DriverAssigned() throws Exception {
        String eventJson = "{\"eventType\":\"DRIVER_ASSIGNED\",\"orderNumber\":\"ORD123\",\"driverId\":10,\"customerId\":50}";
        java.util.Map<String, Object> event = new java.util.HashMap<>();
        event.put("eventType", "DRIVER_ASSIGNED");
        event.put("orderNumber", "ORD123");
        event.put("driverId", 10);
        event.put("customerId", 50);

        when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(event);
        doNothing().when(mailSender).send(any(SimpleMailMessage.class));

        notificationService.handleOrderEvents(eventJson);

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void handleOrderEvents_InvalidEvent() throws Exception {
        String eventJson = "{\"eventType\":\"UNKNOWN_EVENT\"}";
        java.util.Map<String, Object> event = new java.util.HashMap<>();
        event.put("eventType", "UNKNOWN_EVENT");

        when(objectMapper.readValue(anyString(), any(Class.class))).thenReturn(event);

        assertDoesNotThrow(() -> notificationService.handleOrderEvents(eventJson));
    }

    @Test
    void handleOrderEvents_ExceptionHandling() throws Exception {
        String eventJson = "invalid json";
        when(objectMapper.readValue(anyString(), any(Class.class)))
            .thenThrow(new RuntimeException("JSON parse error"));

        assertDoesNotThrow(() -> notificationService.handleOrderEvents(eventJson));
    }
}
