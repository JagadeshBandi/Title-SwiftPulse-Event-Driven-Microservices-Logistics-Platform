package com.swiftpulse.common.event;

import com.swiftpulse.common.dto.TrackingUpdateDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackingEvent {
    private String eventId;
    private EventType eventType;
    private TrackingUpdateDto trackingUpdate;
    private LocalDateTime timestamp;
    private String sourceService;
    private String correlationId;
    
    public enum EventType {
        LOCATION_UPDATED,
        STATUS_CHANGED,
        DELIVERY_COMPLETED,
        DELIVERY_ATTEMPTED,
        EXCEPTION_OCCURRED
    }
    
    public static TrackingEvent createLocationUpdated(TrackingUpdateDto trackingUpdate, String sourceService) {
        return TrackingEvent.builder()
                .eventId(UUID.randomUUID().toString())
                .eventType(EventType.LOCATION_UPDATED)
                .trackingUpdate(trackingUpdate)
                .timestamp(LocalDateTime.now())
                .sourceService(sourceService)
                .correlationId(UUID.randomUUID().toString())
                .build();
    }
}
