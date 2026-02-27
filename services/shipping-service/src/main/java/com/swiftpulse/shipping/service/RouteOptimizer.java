package com.swiftpulse.shipping.service;

import com.swiftpulse.shipping.entity.Driver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RouteOptimizer {
    
    private static final Logger log = LoggerFactory.getLogger(RouteOptimizer.class);
    
    private static final double EARTH_RADIUS_KM = 6371.0;
    
    public Driver findNearestDriver(List<Driver> availableDrivers, Double pickupLat, Double pickupLon) {
        if (availableDrivers.isEmpty()) {
            return null;
        }
        
        Driver nearestDriver = null;
        double minDistance = Double.MAX_VALUE;
        
        for (Driver driver : availableDrivers) {
            if (driver.getCurrentLatitude() != null && driver.getCurrentLongitude() != null) {
                double distance = calculateDistance(
                    driver.getCurrentLatitude(), driver.getCurrentLongitude(),
                    pickupLat, pickupLon
                );
                
                if (distance < minDistance) {
                    minDistance = distance;
                    nearestDriver = driver;
                }
            }
        }
        
        if (nearestDriver != null) {
            log.info("Found nearest driver {} at distance {} km", nearestDriver.getId(), String.format("%.2f", minDistance));
        }
        
        return nearestDriver;
    }
    
    public double calculateDistance(Double lat1, Double lon1, Double lat2, Double lon2) {
        double lat1Rad = Math.toRadians(lat1);
        double lat2Rad = Math.toRadians(lat2);
        double lon1Rad = Math.toRadians(lon1);
        double lon2Rad = Math.toRadians(lon2);
        
        double dLat = lat2Rad - lat1Rad;
        double dLon = lon2Rad - lon1Rad;
        
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(lat1Rad) * Math.cos(lat2Rad) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return EARTH_RADIUS_KM * c;
    }
    
    public double calculateEstimatedTime(Double distanceKm, Double averageSpeedKmh) {
        if (averageSpeedKmh == null || averageSpeedKmh <= 0) {
            averageSpeedKmh = 30.0;
        }
        return (distanceKm / averageSpeedKmh) * 60;
    }
    
    public String generateRouteJson(Double pickupLat, Double pickupLon, Double deliveryLat, Double deliveryLon) {
        return String.format(
            "{\"pickup\":{\"lat\":%.6f,\"lng\":%.6f},\"delivery\":{\"lat\":%.6f,\"lng\":%.6f},\"distanceKm\":%.2f}",
            pickupLat, pickupLon, deliveryLat, deliveryLon,
            calculateDistance(pickupLat, pickupLon, deliveryLat, deliveryLon)
        );
    }
}
