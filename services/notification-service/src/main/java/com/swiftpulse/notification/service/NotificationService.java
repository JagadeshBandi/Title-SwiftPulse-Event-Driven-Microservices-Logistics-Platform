package com.swiftpulse.notification.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);
    
    private final JavaMailSender mailSender;
    private final ObjectMapper objectMapper;
    
    public NotificationService(JavaMailSender mailSender, ObjectMapper objectMapper) {
        this.mailSender = mailSender;
        this.objectMapper = objectMapper;
    }
    
    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void handleOrderEvents(String eventJson) {
        try {
            Map<String, Object> event = objectMapper.readValue(eventJson, HashMap.class);
            String eventType = (String) event.get("eventType");
            
            switch (eventType) {
                case "ORDER_CREATED":
                    handleOrderCreated(event);
                    break;
                case "ORDER_STATUS_UPDATED":
                    handleOrderStatusUpdated(event);
                    break;
                case "DRIVER_ASSIGNED":
                    handleDriverAssigned(event);
                    break;
                default:
                    log.debug("Unhandled event type: {}", eventType);
            }
        } catch (Exception e) {
            log.error("Error processing notification event: {}", eventJson, e);
        }
    }
    
    private void handleOrderCreated(Map<String, Object> event) {
        String orderNumber = (String) event.get("orderNumber");
        String trackingNumber = (String) event.get("trackingNumber");
        Long customerId = Long.valueOf(event.get("customerId").toString());
        
        log.info("Sending order confirmation for order: {}", orderNumber);
        
        String subject = "Order Confirmation - " + orderNumber;
        String body = String.format(
            "Your order has been created successfully!\n\n" +
            "Order Number: %s\n" +
            "Tracking Number: %s\n\n" +
            "You can track your delivery at: http://localhost:3000/tracking/%s\n\n" +
            "Thank you for choosing SwiftPulse!",
            orderNumber, trackingNumber, trackingNumber
        );
        
        sendEmail(getCustomerEmail(customerId), subject, body);
    }
    
    private void handleOrderStatusUpdated(Map<String, Object> event) {
        String orderNumber = (String) event.get("orderNumber");
        String newStatus = (String) event.get("newStatus");
        Long customerId = Long.valueOf(event.get("customerId").toString());
        
        log.info("Sending status update for order: {}, status: {}", orderNumber, newStatus);
        
        String subject = "Order Update - " + orderNumber;
        String body = String.format(
            "Your order status has been updated to: %s\n\n" +
            "Order Number: %s\n\n" +
            "Track your order at: http://localhost:3000/tracking/%s",
            newStatus, orderNumber, event.get("trackingNumber")
        );
        
        sendEmail(getCustomerEmail(customerId), subject, body);
    }
    
    private void handleDriverAssigned(Map<String, Object> event) {
        String orderNumber = (String) event.get("orderNumber");
        Long driverId = Long.valueOf(event.get("driverId").toString());
        Long customerId = Long.valueOf(event.get("customerId").toString());
        
        log.info("Sending driver assignment notification for order: {}", orderNumber);
        
        String subject = "Driver Assigned - " + orderNumber;
        String body = String.format(
            "A driver has been assigned to your order!\n\n" +
            "Order Number: %s\n" +
            "Driver ID: %d\n\n" +
            "Your delivery is on its way!",
            orderNumber, driverId
        );
        
        sendEmail(getCustomerEmail(customerId), subject, body);
    }
    
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);
            message.setFrom("notifications@swiftpulse.com");
            
            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
        }
    }
    
    public void sendSMS(String phoneNumber, String message) {
        log.info("SMS notification sent to: {} - {}", phoneNumber, message);
    }
    
    private String getCustomerEmail(Long customerId) {
        return "customer" + customerId + "@example.com";
    }
}
