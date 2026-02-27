package com.swiftpulse.tracking.controller;

import com.swiftpulse.tracking.document.TrackingUpdate;
import com.swiftpulse.tracking.service.TrackingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tracking")
@Tag(name = "Tracking", description = "GPS tracking and location services")
public class TrackingController {
    
    private final TrackingService trackingService;
    
    public TrackingController(TrackingService trackingService) {
        this.trackingService = trackingService;
    }
    
    @PostMapping("/update")
    @Operation(summary = "Update location", description = "Updates driver location for an order")
    public ResponseEntity<TrackingUpdate> updateLocation(@RequestParam Long orderId,
                                                          @RequestParam String trackingNumber,
                                                          @RequestParam Long driverId,
                                                          @RequestParam String driverName,
                                                          @RequestParam Double latitude,
                                                          @RequestParam Double longitude,
                                                          @RequestParam(required = false) Double speed,
                                                          @RequestParam(required = false) Double heading,
                                                          @RequestParam String status,
                                                          @RequestParam(required = false) String notes) {
        
        TrackingUpdate update = trackingService.updateLocation(
            orderId, trackingNumber, driverId, driverName, latitude, longitude, 
            speed, heading, status, notes
        );
        
        return ResponseEntity.ok(update);
    }
    
    @GetMapping("/{trackingNumber}")
    @Operation(summary = "Get current tracking", description = "Gets current tracking information")
    public ResponseEntity<Map<String, Object>> getCurrentTracking(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(trackingService.getCurrentTrackingInfo(trackingNumber));
    }
    
    @GetMapping("/{trackingNumber}/history")
    @Operation(summary = "Get location history", description = "Gets complete location history for tracking number")
    public ResponseEntity<List<TrackingUpdate>> getLocationHistory(@PathVariable String trackingNumber) {
        return ResponseEntity.ok(trackingService.getLocationHistory(trackingNumber));
    }
    
    @GetMapping("/order/{orderId}")
    @Operation(summary = "Get order tracking history")
    public ResponseEntity<List<TrackingUpdate>> getOrderTracking(@PathVariable Long orderId) {
        return ResponseEntity.ok(trackingService.getOrderLocationHistory(orderId));
    }
    
    @GetMapping("/driver/{driverId}/route")
    @Operation(summary = "Get driver route", description = "Gets driver route for time period")
    public ResponseEntity<List<TrackingUpdate>> getDriverRoute(@PathVariable Long driverId,
                                                                @RequestParam String start,
                                                                @RequestParam String end) {
        LocalDateTime startTime = LocalDateTime.parse(start);
        LocalDateTime endTime = LocalDateTime.parse(end);
        return ResponseEntity.ok(trackingService.getDriverRoute(driverId, startTime, endTime));
    }
}
