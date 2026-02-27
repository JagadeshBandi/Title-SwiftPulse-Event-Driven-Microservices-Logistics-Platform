package com.swiftpulse.order.service;

import com.swiftpulse.order.dto.CreateOrderRequest;
import com.swiftpulse.order.dto.OrderResponse;
import com.swiftpulse.order.entity.Order;
import com.swiftpulse.order.event.OrderEventPublisher;
import com.swiftpulse.order.mapper.OrderMapper;
import com.swiftpulse.order.repository.OrderRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderService {
    
    private static final Logger log = LoggerFactory.getLogger(OrderService.class);
    
    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final OrderEventPublisher orderEventPublisher;
    
    public OrderService(OrderRepository orderRepository, OrderMapper orderMapper, OrderEventPublisher orderEventPublisher) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.orderEventPublisher = orderEventPublisher;
    }
    
    public OrderResponse createOrder(Long customerId, CreateOrderRequest request) {
        log.info("Creating new order for customer: {}", customerId);
        
        Order order = orderMapper.toEntity(request);
        order.setCustomerId(customerId);
        order.setOrderNumber(generateOrderNumber());
        order.setTrackingNumber(generateTrackingNumber());
        
        if (order.getEstimatedCost() == null) {
            order.setEstimatedCost(calculateEstimatedCost(order.getWeight(), order.getDeliveryType()));
        }
        
        order.setEstimatedDeliveryDate(calculateEstimatedDeliveryDate(order.getDeliveryType()));
        order.setStatus(Order.OrderStatus.PENDING);
        
        Order savedOrder = orderRepository.save(order);
        log.info("Order created successfully: {}", savedOrder.getOrderNumber());
        
        orderEventPublisher.publishOrderCreatedEvent(savedOrder);
        
        return orderMapper.toResponse(savedOrder);
    }
    
    public OrderResponse getOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        return orderMapper.toResponse(order);
    }
    
    public OrderResponse getOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with number: " + orderNumber));
        return orderMapper.toResponse(order);
    }
    
    public OrderResponse getOrderByTrackingNumber(String trackingNumber) {
        Order order = orderRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Order not found with tracking number: " + trackingNumber));
        return orderMapper.toResponse(order);
    }
    
    public List<OrderResponse> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customerId)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<OrderResponse> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status)
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    public OrderResponse updateOrderStatus(Long orderId, Order.OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        String previousStatus = order.getStatus().name();
        order.setStatus(newStatus);
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Order {} status updated from {} to {}", orderId, previousStatus, newStatus.name());
        
        orderEventPublisher.publishOrderStatusUpdatedEvent(updatedOrder, previousStatus);
        
        return orderMapper.toResponse(updatedOrder);
    }
    
    public OrderResponse assignDriver(Long orderId, Long driverId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        order.setAssignedDriverId(driverId);
        order.setStatus(Order.OrderStatus.ASSIGNED);
        
        Order updatedOrder = orderRepository.save(order);
        log.info("Driver {} assigned to order {}", driverId, orderId);
        
        orderEventPublisher.publishDriverAssignedEvent(updatedOrder);
        
        return orderMapper.toResponse(updatedOrder);
    }
    
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED) {
            throw new RuntimeException("Cannot cancel delivered order");
        }
        
        order.setStatus(Order.OrderStatus.CANCELLED);
        orderRepository.save(order);
        
        log.info("Order {} cancelled", orderId);
    }
    
    public List<OrderResponse> getPendingOrders() {
        return orderRepository.findPendingOrders()
                .stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    private String generateOrderNumber() {
        return "ORD" + System.currentTimeMillis() + new Random().nextInt(1000);
    }
    
    private String generateTrackingNumber() {
        return "TRK" + UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
    
    private BigDecimal calculateEstimatedCost(Double weight, String deliveryType) {
        double baseRate = 10.0;
        double weightRate = weight * 2.0;
        double typeMultiplier = "EXPRESS".equalsIgnoreCase(deliveryType) ? 2.0 : 1.0;
        
        return BigDecimal.valueOf((baseRate + weightRate) * typeMultiplier);
    }
    
    private LocalDateTime calculateEstimatedDeliveryDate(String deliveryType) {
        int daysToAdd = "EXPRESS".equalsIgnoreCase(deliveryType) ? 1 : 3;
        return LocalDateTime.now().plusDays(daysToAdd);
    }
}
