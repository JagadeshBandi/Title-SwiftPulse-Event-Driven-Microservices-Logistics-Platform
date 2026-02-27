package com.swiftpulse.shipping.controller;

import com.swiftpulse.shipping.entity.Driver;
import com.swiftpulse.shipping.entity.Shipment;
import com.swiftpulse.shipping.service.ShippingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shipping")
@Tag(name = "Shipping", description = "Driver management and shipment operations")
public class ShippingController {
    
    private final ShippingService shippingService;
    
    public ShippingController(ShippingService shippingService) {
        this.shippingService = shippingService;
    }
    
    @GetMapping("/shipments/{shipmentId}")
    @Operation(summary = "Get shipment by ID")
    public ResponseEntity<Shipment> getShipmentById(@PathVariable Long shipmentId) {
        try {
            return ResponseEntity.ok(shippingService.getShipmentByOrderId(shipmentId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/shipments/{shipmentId}/status")
    @Operation(summary = "Update shipment status")
    public ResponseEntity<Shipment> updateShipmentStatus(@PathVariable Long shipmentId,
                                                          @RequestParam String status) {
        Shipment.ShipmentStatus shipmentStatus = Shipment.ShipmentStatus.valueOf(status.toUpperCase());
        return ResponseEntity.ok(shippingService.updateShipmentStatus(shipmentId, shipmentStatus));
    }
    
    @GetMapping("/drivers/{driverId}/shipments")
    @Operation(summary = "Get driver shipments")
    public ResponseEntity<List<Shipment>> getDriverShipments(@PathVariable Long driverId) {
        return ResponseEntity.ok(shippingService.getDriverShipments(driverId));
    }
    
    @GetMapping("/drivers/{driverId}/shipments/active")
    @Operation(summary = "Get active driver shipments")
    public ResponseEntity<List<Shipment>> getActiveDriverShipments(@PathVariable Long driverId) {
        return ResponseEntity.ok(shippingService.getActiveDriverShipments(driverId));
    }
    
    @PostMapping("/drivers")
    @Operation(summary = "Register new driver")
    public ResponseEntity<Driver> registerDriver(@RequestBody Driver driver) {
        return ResponseEntity.ok(shippingService.registerDriver(driver));
    }
    
    @PutMapping("/drivers/{driverId}/location")
    @Operation(summary = "Update driver location")
    public ResponseEntity<Driver> updateDriverLocation(@PathVariable Long driverId,
                                                        @RequestParam Double latitude,
                                                        @RequestParam Double longitude) {
        return ResponseEntity.ok(shippingService.updateDriverLocation(driverId, latitude, longitude));
    }
    
    @GetMapping("/drivers/available")
    @Operation(summary = "Get available drivers")
    public ResponseEntity<List<Driver>> getAvailableDrivers() {
        return ResponseEntity.ok(shippingService.getAvailableDrivers());
    }
    
    @GetMapping("/drivers/{driverId}")
    @Operation(summary = "Get driver by ID")
    public ResponseEntity<Driver> getDriverById(@PathVariable Long driverId) {
        return shippingService.getDriverById(driverId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
