package com.swiftpulse.order.mapper;

import com.swiftpulse.order.dto.CreateOrderRequest;
import com.swiftpulse.order.dto.OrderResponse;
import com.swiftpulse.order.entity.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {
    
    public Order toEntity(CreateOrderRequest request) {
        if (request == null) {
            return null;
        }
        
        Order order = new Order();
        order.setDescription(request.getDescription());
        order.setWeight(request.getWeight());
        order.setPackageType(request.getPackageType());
        order.setDeliveryType(request.getDeliveryType());
        order.setPriorityLevel(request.getPriorityLevel());
        order.setPickupAddressStreet(request.getPickupAddressStreet());
        order.setPickupAddressCity(request.getPickupAddressCity());
        order.setPickupAddressState(request.getPickupAddressState());
        order.setPickupAddressZip(request.getPickupAddressZip());
        order.setPickupLatitude(request.getPickupLatitude());
        order.setPickupLongitude(request.getPickupLongitude());
        order.setDeliveryAddressStreet(request.getDeliveryAddressStreet());
        order.setDeliveryAddressCity(request.getDeliveryAddressCity());
        order.setDeliveryAddressState(request.getDeliveryAddressState());
        order.setDeliveryAddressZip(request.getDeliveryAddressZip());
        order.setDeliveryLatitude(request.getDeliveryLatitude());
        order.setDeliveryLongitude(request.getDeliveryLongitude());
        order.setEstimatedCost(request.getEstimatedCost());
        order.setStatus(Order.OrderStatus.PENDING);
        
        return order;
    }
    
    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }
        
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setCustomerId(order.getCustomerId());
        response.setOrderNumber(order.getOrderNumber());
        response.setTrackingNumber(order.getTrackingNumber());
        response.setDescription(order.getDescription());
        response.setWeight(order.getWeight());
        response.setPackageType(order.getPackageType());
        response.setDeliveryType(order.getDeliveryType());
        response.setPickupAddress(buildAddress(order.getPickupAddressStreet(), order.getPickupAddressCity(), order.getPickupAddressState(), order.getPickupAddressZip()));
        response.setDeliveryAddress(buildAddress(order.getDeliveryAddressStreet(), order.getDeliveryAddressCity(), order.getDeliveryAddressState(), order.getDeliveryAddressZip()));
        response.setPriorityLevel(order.getPriorityLevel());
        response.setEstimatedCost(order.getEstimatedCost());
        response.setEstimatedDeliveryDate(order.getEstimatedDeliveryDate());
        response.setStatus(order.getStatus().name());
        response.setAssignedDriverId(order.getAssignedDriverId());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        
        return response;
    }
    
    private String buildAddress(String street, String city, String state, String zip) {
        return String.format("%s, %s, %s %s", street, city, state, zip);
    }
}
