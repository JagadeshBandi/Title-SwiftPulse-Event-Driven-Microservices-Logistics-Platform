package com.swiftpulse.order.database;

import com.swiftpulse.order.entity.Order;
import com.swiftpulse.order.repository.OrderRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@Testcontainers
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class OrderRepositoryDatabaseTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("swiftpulse_test")
            .withUsername("test")
            .withPassword("test");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private OrderRepository orderRepository;

    @Test
    void saveOrder_PersistToDatabase() {
        Order order = createTestOrder();
        Order saved = orderRepository.save(order);

        assertNotNull(saved.getId());
        assertEquals("ORD001", saved.getOrderNumber());
    }

    @Test
    void findByOrderNumber_ReturnsCorrectOrder() {
        Order order = createTestOrder();
        orderRepository.save(order);

        Optional<Order> found = orderRepository.findByOrderNumber("ORD001");

        assertTrue(found.isPresent());
        assertEquals("Test Package", found.get().getDescription());
    }

    @Test
    void findByCustomerId_ReturnsCustomerOrders() {
        Order order1 = createTestOrder();
        order1.setCustomerId(100L);
        orderRepository.save(order1);

        Order order2 = createTestOrder();
        order2.setOrderNumber("ORD002");
        order2.setTrackingNumber("TRK002");
        order2.setCustomerId(100L);
        orderRepository.save(order2);

        Order order3 = createTestOrder();
        order3.setOrderNumber("ORD003");
        order3.setTrackingNumber("TRK003");
        order3.setCustomerId(200L);
        orderRepository.save(order3);

        List<Order> customerOrders = orderRepository.findByCustomerId(100L);

        assertEquals(2, customerOrders.size());
    }

    @Test
    void findByStatus_ReturnsOrdersWithStatus() {
        Order pendingOrder = createTestOrder();
        pendingOrder.setStatus(Order.OrderStatus.PENDING);
        orderRepository.save(pendingOrder);

        Order confirmedOrder = createTestOrder();
        confirmedOrder.setOrderNumber("ORD002");
        confirmedOrder.setTrackingNumber("TRK002");
        confirmedOrder.setStatus(Order.OrderStatus.CONFIRMED);
        orderRepository.save(confirmedOrder);

        List<Order> pendingOrders = orderRepository.findByStatus(Order.OrderStatus.PENDING);

        assertEquals(1, pendingOrders.size());
        assertEquals(Order.OrderStatus.PENDING, pendingOrders.get(0).getStatus());
    }

    @Test
    void updateOrder_ModifiesExistingOrder() {
        Order order = createTestOrder();
        Order saved = orderRepository.save(order);

        saved.setStatus(Order.OrderStatus.CONFIRMED);
        saved.setAssignedDriverId(50L);
        Order updated = orderRepository.save(saved);

        assertEquals(Order.OrderStatus.CONFIRMED, updated.getStatus());
        assertEquals(50L, updated.getAssignedDriverId());
    }

    @Test
    void deleteOrder_RemovesFromDatabase() {
        Order order = createTestOrder();
        Order saved = orderRepository.save(order);
        Long orderId = saved.getId();

        orderRepository.deleteById(orderId);

        Optional<Order> found = orderRepository.findById(orderId);
        assertFalse(found.isPresent());
    }

    @Test
    void countByStatus_ReturnsCorrectCount() {
        for (int i = 0; i < 5; i++) {
            Order order = createTestOrder();
            order.setOrderNumber("ORD" + String.format("%03d", i));
            order.setTrackingNumber("TRK" + String.format("%03d", i));
            order.setStatus(Order.OrderStatus.DELIVERED);
            orderRepository.save(order);
        }

        Long count = orderRepository.countByStatus(Order.OrderStatus.DELIVERED);

        assertEquals(5L, count);
    }

    @Test
    void findPendingOrders_ReturnsUnassignedOrders() {
        Order pendingOrder = createTestOrder();
        pendingOrder.setStatus(Order.OrderStatus.PENDING);
        orderRepository.save(pendingOrder);

        Order assignedOrder = createTestOrder();
        assignedOrder.setOrderNumber("ORD002");
        assignedOrder.setTrackingNumber("TRK002");
        assignedOrder.setStatus(Order.OrderStatus.ASSIGNED);
        orderRepository.save(assignedOrder);

        List<Order> pendingOrders = orderRepository.findPendingOrders();

        assertTrue(pendingOrders.stream().allMatch(o -> 
            o.getStatus() == Order.OrderStatus.PENDING || 
            o.getStatus() == Order.OrderStatus.CONFIRMED
        ));
    }

    @Test
    void uniqueConstraints_PreventDuplicateOrderNumber() {
        Order order1 = createTestOrder();
        orderRepository.save(order1);

        Order order2 = createTestOrder();
        order2.setTrackingNumber("TRK002");

        assertThrows(Exception.class, () -> orderRepository.save(order2));
    }

    private Order createTestOrder() {
        Order order = new Order();
        order.setCustomerId(100L);
        order.setOrderNumber("ORD001");
        order.setTrackingNumber("TRK001");
        order.setDescription("Test Package");
        order.setWeight(2.5);
        order.setPickupAddressStreet("123 Test St");
        order.setPickupAddressCity("Test City");
        order.setPickupAddressState("TS");
        order.setPickupAddressZip("12345");
        order.setDeliveryAddressStreet("456 Test Ave");
        order.setDeliveryAddressCity("Test City");
        order.setDeliveryAddressState("TS");
        order.setDeliveryAddressZip("12345");
        order.setEstimatedCost(BigDecimal.valueOf(25.00));
        order.setStatus(Order.OrderStatus.PENDING);
        return order;
    }
}
