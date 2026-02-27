package com.swiftpulse.order.controller;

import com.swiftpulse.order.dto.CreateOrderRequest;
import com.swiftpulse.order.dto.OrderResponse;
import com.swiftpulse.order.entity.Order;
import com.swiftpulse.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@Tag(name = "Orders", description = "Order management APIs")
public class OrderController {
    
    private static final Logger log = LoggerFactory.getLogger(OrderController.class);
    
    private final OrderService orderService;
    
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }
    
    @PostMapping
    @Operation(summary = "Create new order", description = "Creates a new delivery order")
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request,
                                                      @RequestHeader("X-User-Id") Long customerId) {
        log.info("Creating order for customer: {}", customerId);
        OrderResponse response = orderService.createOrder(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @GetMapping("/{orderId}")
    @Operation(summary = "Get order by ID", description = "Retrieves order details by order ID")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long orderId) {
        OrderResponse response = orderService.getOrderById(orderId);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/number/{orderNumber}")
    @Operation(summary = "Get order by number", description = "Retrieves order details by order number")
    public ResponseEntity<OrderResponse> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/track/{trackingNumber}")
    @Operation(summary = "Track order", description = "Retrieves order details by tracking number")
    public ResponseEntity<OrderResponse> trackOrder(@PathVariable String trackingNumber) {
        OrderResponse response = orderService.getOrderByTrackingNumber(trackingNumber);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/customer/{customerId}")
    @Operation(summary = "Get customer orders", description = "Retrieves all orders for a customer")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders(@PathVariable Long customerId) {
        List<OrderResponse> orders = orderService.getOrdersByCustomer(customerId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/status/{status}")
    @Operation(summary = "Get orders by status", description = "Retrieves all orders with specified status")
    public ResponseEntity<List<OrderResponse>> getOrdersByStatus(@PathVariable String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        List<OrderResponse> orders = orderService.getOrdersByStatus(orderStatus);
        return ResponseEntity.ok(orders);
    }
    
    @PutMapping("/{orderId}/status")
    @Operation(summary = "Update order status", description = "Updates the status of an order")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long orderId,
                                                            @RequestParam String status) {
        Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
        OrderResponse response = orderService.updateOrderStatus(orderId, orderStatus);
        return ResponseEntity.ok(response);
    }
    
    @PutMapping("/{orderId}/assign-driver")
    @Operation(summary = "Assign driver", description = "Assigns a driver to an order")
    public ResponseEntity<OrderResponse> assignDriver(@PathVariable Long orderId,
                                                     @RequestParam Long driverId) {
        OrderResponse response = orderService.assignDriver(orderId, driverId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{orderId}")
    @Operation(summary = "Cancel order", description = "Cancels an existing order")
    public ResponseEntity<Void> cancelOrder(@PathVariable Long orderId) {
        orderService.cancelOrder(orderId);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/pending")
    @Operation(summary = "Get pending orders", description = "Retrieves all pending orders awaiting driver assignment")
    public ResponseEntity<List<OrderResponse>> getPendingOrders() {
        List<OrderResponse> orders = orderService.getPendingOrders();
        return ResponseEntity.ok(orders);
    }
}
