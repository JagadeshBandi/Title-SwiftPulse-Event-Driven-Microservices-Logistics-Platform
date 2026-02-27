package com.swiftpulse.tracking.service;

import com.swiftpulse.tracking.document.TrackingUpdate;
import com.swiftpulse.tracking.repository.TrackingUpdateRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class TrackingService {
    
    private static final Logger log = LoggerFactory.getLogger(TrackingService.class);
    
    private final TrackingUpdateRepository trackingRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    public TrackingService(TrackingUpdateRepository trackingRepository, SimpMessagingTemplate messagingTemplate) {
        this.trackingRepository = trackingRepository;
        this.messagingTemplate = messagingTemplate;
    }
    
    public TrackingUpdate updateLocation(Long orderId, String trackingNumber, Long driverId, String driverName,
                                         Double latitude, Double longitude, Double speed, Double heading,
                                         String status, String notes) {
        
        TrackingUpdate update = new TrackingUpdate();
        update.setOrderId(orderId);
        update.setTrackingNumber(trackingNumber);
        update.setDriverId(driverId);
        update.setDriverName(driverName);
        update.setLatitude(latitude);
        update.setLongitude(longitude);
        update.setSpeed(speed);
        update.setHeading(heading);
        update.setStatus(status);
        update.setNotes(notes);
        update.setTimestamp(LocalDateTime.now());
        update.setLocationDescription(getLocationDescription(latitude, longitude));
        
        TrackingUpdate saved = trackingRepository.insert(update);
        log.info("Location updated for order {}: {}, {}", orderId, latitude, longitude);
        
        Map<String, Object> locationUpdate = new HashMap<>();
        locationUpdate.put("orderId", orderId);
        locationUpdate.put("trackingNumber", trackingNumber);
        locationUpdate.put("latitude", latitude);
        locationUpdate.put("longitude", longitude);
        locationUpdate.put("speed", speed);
        locationUpdate.put("heading", heading);
        locationUpdate.put("status", status);
        locationUpdate.put("timestamp", update.getTimestamp().toString());
        
        messagingTemplate.convertAndSend("/topic/tracking/" + trackingNumber, locationUpdate);
        messagingTemplate.convertAndSend("/topic/tracking/order/" + orderId, locationUpdate);
        
        return saved;
    }
    
    public Optional<TrackingUpdate> getLatestLocation(String trackingNumber) {
        return trackingRepository.findFirstByTrackingNumberOrderByTimestampDesc(trackingNumber);
    }
    
    public List<TrackingUpdate> getLocationHistory(String trackingNumber) {
        return trackingRepository.findByTrackingNumberOrderByTimestampDesc(trackingNumber);
    }
    
    public List<TrackingUpdate> getOrderLocationHistory(Long orderId) {
        return trackingRepository.findByOrderIdOrderByTimestampDesc(orderId);
    }
    
    public List<TrackingUpdate> getDriverRoute(Long driverId, LocalDateTime start, LocalDateTime end) {
        return trackingRepository.findByDriverIdAndTimestampBetween(driverId, start, end);
    }
    
    private String getLocationDescription(Double latitude, Double longitude) {
        return String.format("Location at %.4f, %.4f", latitude, longitude);
    }
    
    public Map<String, Object> getCurrentTrackingInfo(String trackingNumber) {
        Optional<TrackingUpdate> latest = getLatestLocation(trackingNumber);
        
        Map<String, Object> info = new HashMap<>();
        
        if (latest.isPresent()) {
            TrackingUpdate update = latest.get();
            info.put("trackingNumber", trackingNumber);
            info.put("currentLatitude", update.getLatitude());
            info.put("currentLongitude", update.getLongitude());
            info.put("currentLocation", update.getLocationDescription());
            info.put("status", update.getStatus());
            info.put("driverName", update.getDriverName());
            info.put("lastUpdated", update.getTimestamp());
            info.put("speed", update.getSpeed());
            info.put("heading", update.getHeading());
            info.put("found", true);
        } else {
            info.put("trackingNumber", trackingNumber);
            info.put("found", false);
            info.put("message", "No tracking information available");
        }
        
        return info;
    }
}
