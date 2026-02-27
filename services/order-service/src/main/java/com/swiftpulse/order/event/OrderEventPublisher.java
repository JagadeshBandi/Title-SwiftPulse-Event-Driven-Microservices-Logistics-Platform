package com.swiftpulse.order.event;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swiftpulse.order.entity.Order;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrderEventPublisher {
    
    private static final Logger log = LoggerFactory.getLogger(OrderEventPublisher.class);
    private static final String ORDER_EVENTS_TOPIC = "order-events";
    
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    
    public OrderEventPublisher(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }
    
    public void publishOrderCreatedEvent(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_CREATED");
            event.put("orderId", order.getId());
            event.put("customerId", order.getCustomerId());
            event.put("orderNumber", order.getOrderNumber());
            event.put("trackingNumber", order.getTrackingNumber());
            event.put("pickupAddress", buildAddress(order.getPickupAddressStreet(), order.getPickupAddressCity(), order.getPickupAddressState()));
            event.put("deliveryAddress", buildAddress(order.getDeliveryAddressStreet(), order.getDeliveryAddressCity(), order.getDeliveryAddressState()));
            event.put("pickupLatitude", order.getPickupLatitude());
            event.put("pickupLongitude", order.getPickupLongitude());
            event.put("deliveryLatitude", order.getDeliveryLatitude());
            event.put("deliveryLongitude", order.getDeliveryLongitude());
            event.put("weight", order.getWeight());
            event.put("priorityLevel", order.getPriorityLevel());
            event.put("timestamp", java.time.Instant.now().toString());
            
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_EVENTS_TOPIC, order.getId().toString(), eventJson);
            
            log.info("Published ORDER_CREATED event for order: {}", order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to publish ORDER_CREATED event for order: {}", order.getOrderNumber(), e);
        }
    }
    
    public void publishOrderStatusUpdatedEvent(Order order, String previousStatus) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "ORDER_STATUS_UPDATED");
            event.put("orderId", order.getId());
            event.put("orderNumber", order.getOrderNumber());
            event.put("trackingNumber", order.getTrackingNumber());
            event.put("previousStatus", previousStatus);
            event.put("newStatus", order.getStatus().name());
            event.put("customerId", order.getCustomerId());
            event.put("assignedDriverId", order.getAssignedDriverId());
            event.put("timestamp", java.time.Instant.now().toString());
            
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_EVENTS_TOPIC, order.getId().toString(), eventJson);
            
            log.info("Published ORDER_STATUS_UPDATED event for order: {}, status changed from {} to {}", 
                    order.getOrderNumber(), previousStatus, order.getStatus().name());
        } catch (Exception e) {
            log.error("Failed to publish ORDER_STATUS_UPDATED event for order: {}", order.getOrderNumber(), e);
        }
    }
    
    public void publishDriverAssignedEvent(Order order) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", "DRIVER_ASSIGNED");
            event.put("orderId", order.getId());
            event.put("orderNumber", order.getOrderNumber());
            event.put("trackingNumber", order.getTrackingNumber());
            event.put("driverId", order.getAssignedDriverId());
            event.put("customerId", order.getCustomerId());
            event.put("timestamp", java.time.Instant.now().toString());
            
            String eventJson = objectMapper.writeValueAsString(event);
            kafkaTemplate.send(ORDER_EVENTS_TOPIC, order.getId().toString(), eventJson);
            
            log.info("Published DRIVER_ASSIGNED event for order: {}, driver: {}", 
                    order.getOrderNumber(), order.getAssignedDriverId());
        } catch (Exception e) {
            log.error("Failed to publish DRIVER_ASSIGNED event for order: {}", order.getOrderNumber(), e);
        }
    }
    
    private String buildAddress(String street, String city, String state) {
        return String.format("%s, %s, %s", street, city, state);
    }
}
