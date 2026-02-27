package com.swiftpulse.order.service;

import com.swiftpulse.order.dto.CreateOrderRequest;
import com.swiftpulse.order.dto.OrderResponse;
import com.swiftpulse.order.entity.Order;
import com.swiftpulse.order.event.OrderEventPublisher;
import com.swiftpulse.order.mapper.OrderMapper;
import com.swiftpulse.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderMapper orderMapper;

    @Mock
    private OrderEventPublisher orderEventPublisher;

    @InjectMocks
    private OrderService orderService;

    private CreateOrderRequest createOrderRequest;
    private Order order;
    private OrderResponse orderResponse;

    @BeforeEach
    void setUp() {
        createOrderRequest = new CreateOrderRequest();
        createOrderRequest.setDescription("Test Package");
        createOrderRequest.setWeight(2.5);
        createOrderRequest.setPickupAddressStreet("123 Pickup St");
        createOrderRequest.setPickupAddressCity("New York");
        createOrderRequest.setPickupAddressState("NY");
        createOrderRequest.setPickupAddressZip("10001");
        createOrderRequest.setDeliveryAddressStreet("456 Delivery Ave");
        createOrderRequest.setDeliveryAddressCity("Boston");
        createOrderRequest.setDeliveryAddressState("MA");
        createOrderRequest.setDeliveryAddressZip("02101");

        order = new Order();
        order.setId(1L);
        order.setCustomerId(100L);
        order.setOrderNumber("ORD123456");
        order.setTrackingNumber("TRK789012");
        order.setDescription("Test Package");
        order.setWeight(2.5);
        order.setStatus(Order.OrderStatus.PENDING);

        orderResponse = new OrderResponse();
        orderResponse.setId(1L);
        orderResponse.setOrderNumber("ORD123456");
        orderResponse.setTrackingNumber("TRK789012");
        orderResponse.setStatus("PENDING");
    }

    @Test
    void createOrder_Success() {
        when(orderMapper.toEntity(any(CreateOrderRequest.class))).thenReturn(order);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderMapper.toResponse(any(Order.class))).thenReturn(orderResponse);
        doNothing().when(orderEventPublisher).publishOrderCreatedEvent(any(Order.class));

        OrderResponse result = orderService.createOrder(100L, createOrderRequest);

        assertNotNull(result);
        assertEquals("ORD123456", result.getOrderNumber());
        assertEquals("PENDING", result.getStatus());
        verify(orderRepository).save(any(Order.class));
        verify(orderEventPublisher).publishOrderCreatedEvent(any(Order.class));
    }

    @Test
    void getOrderById_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderMapper.toResponse(order)).thenReturn(orderResponse);

        OrderResponse result = orderService.getOrderById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void getOrderById_NotFound() {
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> orderService.getOrderById(999L));
    }

    @Test
    void getOrdersByCustomer_Success() {
        when(orderRepository.findByCustomerIdOrderByCreatedAtDesc(100L))
            .thenReturn(Arrays.asList(order));
        when(orderMapper.toResponse(order)).thenReturn(orderResponse);

        List<OrderResponse> results = orderService.getOrdersByCustomer(100L);

        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    void updateOrderStatus_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        order.setStatus(Order.OrderStatus.CONFIRMED);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderMapper.toResponse(order)).thenReturn(orderResponse);
        doNothing().when(orderEventPublisher).publishOrderStatusUpdatedEvent(any(Order.class), anyString());

        OrderResponse result = orderService.updateOrderStatus(1L, Order.OrderStatus.CONFIRMED);

        assertNotNull(result);
        verify(orderEventPublisher).publishOrderStatusUpdatedEvent(any(Order.class), anyString());
    }

    @Test
    void assignDriver_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        order.setAssignedDriverId(50L);
        order.setStatus(Order.OrderStatus.ASSIGNED);
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(orderMapper.toResponse(order)).thenReturn(orderResponse);
        doNothing().when(orderEventPublisher).publishDriverAssignedEvent(any(Order.class));

        OrderResponse result = orderService.assignDriver(1L, 50L);

        assertNotNull(result);
        verify(orderEventPublisher).publishDriverAssignedEvent(any(Order.class));
    }

    @Test
    void cancelOrder_Success() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        assertDoesNotThrow(() -> orderService.cancelOrder(1L));
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void cancelOrder_DeliveredOrder_ThrowsException() {
        order.setStatus(Order.OrderStatus.DELIVERED);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThrows(RuntimeException.class, () -> orderService.cancelOrder(1L));
    }
}
