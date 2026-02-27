package com.swiftpulse.tracking.repository;

import com.swiftpulse.tracking.document.TrackingUpdate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrackingUpdateRepository extends MongoRepository<TrackingUpdate, String> {
    
    List<TrackingUpdate> findByOrderIdOrderByTimestampDesc(Long orderId);
    
    List<TrackingUpdate> findByTrackingNumberOrderByTimestampDesc(String trackingNumber);
    
    List<TrackingUpdate> findByDriverIdAndTimestampBetween(Long driverId, LocalDateTime start, LocalDateTime end);
    
    Optional<TrackingUpdate> findFirstByTrackingNumberOrderByTimestampDesc(String trackingNumber);
    
    List<TrackingUpdate> findByOrderIdAndTimestampBetween(Long orderId, LocalDateTime start, LocalDateTime end);
}
