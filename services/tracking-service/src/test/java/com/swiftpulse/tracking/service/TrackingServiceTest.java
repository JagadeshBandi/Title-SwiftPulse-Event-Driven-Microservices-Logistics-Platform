package com.swiftpulse.tracking.service;

import com.swiftpulse.tracking.document.TrackingUpdate;
import com.swiftpulse.tracking.repository.TrackingUpdateRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TrackingServiceTest {

    @Mock
    private TrackingUpdateRepository trackingRepository;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private TrackingService trackingService;

    private TrackingUpdate trackingUpdate;

    @BeforeEach
    void setUp() {
        trackingUpdate = new TrackingUpdate();
        trackingUpdate.setId("track123");
        trackingUpdate.setOrderId(100L);
        trackingUpdate.setTrackingNumber("TRK456");
        trackingUpdate.setDriverId(1L);
        trackingUpdate.setDriverName("John Doe");
        trackingUpdate.setLatitude(40.7580);
        trackingUpdate.setLongitude(-73.9855);
        trackingUpdate.setSpeed(45.5);
        trackingUpdate.setHeading(180.0);
        trackingUpdate.setStatus("IN_TRANSIT");
        trackingUpdate.setNotes("Moving on I-95");
        trackingUpdate.setTimestamp(LocalDateTime.now());
    }

    @Test
    void updateLocation_Success() {
        when(trackingRepository.save(any(TrackingUpdate.class))).thenReturn(trackingUpdate);

        TrackingUpdate result = trackingService.updateLocation(
            100L, "TRK456", 1L, "John Doe", 40.7580, -73.9855,
            45.5, 180.0, "IN_TRANSIT", "Moving on I-95"
        );

        assertNotNull(result);
        assertEquals(100L, result.getOrderId());
        assertEquals("TRK456", result.getTrackingNumber());
        assertEquals(40.7580, result.getLatitude());
        assertEquals(-73.9855, result.getLongitude());

        verify(trackingRepository).save(any(TrackingUpdate.class));
        verify(messagingTemplate, times(2)).convertAndSend(anyString(), any(Map.class));
    }

    @Test
    void getLatestLocation_Success() {
        when(trackingRepository.findFirstByTrackingNumberOrderByTimestampDesc("TRK456"))
            .thenReturn(Optional.of(trackingUpdate));

        Optional<TrackingUpdate> result = trackingService.getLatestLocation("TRK456");

        assertTrue(result.isPresent());
        assertEquals("TRK456", result.get().getTrackingNumber());
        assertEquals(40.7580, result.get().getLatitude());
    }

    @Test
    void getLocationHistory_Success() {
        when(trackingRepository.findByTrackingNumberOrderByTimestampDesc("TRK456"))
            .thenReturn(Arrays.asList(trackingUpdate));

        List<TrackingUpdate> results = trackingService.getLocationHistory("TRK456");

        assertNotNull(results);
        assertEquals(1, results.size());
    }

    @Test
    void getOrderLocationHistory_Success() {
        when(trackingRepository.findByOrderIdOrderByTimestampDesc(100L))
            .thenReturn(Arrays.asList(trackingUpdate));

        List<TrackingUpdate> results = trackingService.getOrderLocationHistory(100L);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(100L, results.get(0).getOrderId());
    }

    @Test
    void getDriverRoute_Success() {
        LocalDateTime start = LocalDateTime.now().minusHours(2);
        LocalDateTime end = LocalDateTime.now();

        when(trackingRepository.findByDriverIdAndTimestampBetween(1L, start, end))
            .thenReturn(Arrays.asList(trackingUpdate));

        List<TrackingUpdate> results = trackingService.getDriverRoute(1L, start, end);

        assertNotNull(results);
        assertEquals(1, results.size());
        assertEquals(1L, results.get(0).getDriverId());
    }

    @Test
    void getCurrentTrackingInfo_Found() {
        when(trackingRepository.findFirstByTrackingNumberOrderByTimestampDesc("TRK456"))
            .thenReturn(Optional.of(trackingUpdate));

        Map<String, Object> result = trackingService.getCurrentTrackingInfo("TRK456");

        assertNotNull(result);
        assertEquals("TRK456", result.get("trackingNumber"));
        assertTrue((Boolean) result.get("found"));
        assertEquals(40.7580, result.get("currentLatitude"));
        assertEquals(-73.9855, result.get("currentLongitude"));
        assertEquals("John Doe", result.get("driverName"));
    }

    @Test
    void getCurrentTrackingInfo_NotFound() {
        when(trackingRepository.findFirstByTrackingNumberOrderByTimestampDesc("TRK999"))
            .thenReturn(Optional.empty());

        Map<String, Object> result = trackingService.getCurrentTrackingInfo("TRK999");

        assertNotNull(result);
        assertEquals("TRK999", result.get("trackingNumber"));
        assertFalse((Boolean) result.get("found"));
    }
}
