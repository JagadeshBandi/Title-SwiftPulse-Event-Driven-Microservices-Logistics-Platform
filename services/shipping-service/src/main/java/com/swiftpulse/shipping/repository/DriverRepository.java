package com.swiftpulse.shipping.repository;

import com.swiftpulse.shipping.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    
    Optional<Driver> findByUserId(Long userId);
    
    Optional<Driver> findByEmail(String email);
    
    Optional<Driver> findByLicenseNumber(String licenseNumber);
    
    List<Driver> findByIsAvailableTrue();
    
    @Query("SELECT d FROM Driver d WHERE d.isAvailable = true AND d.currentLatitude IS NOT NULL AND d.currentLongitude IS NOT NULL")
    List<Driver> findAvailableDriversWithLocation();
    
    @Query("SELECT d FROM Driver d WHERE d.isAvailable = true ORDER BY d.rating DESC")
    List<Driver> findAvailableDriversOrderByRating();
    
    @Query("SELECT d FROM Driver d WHERE d.rating >= ?1 AND d.isAvailable = true")
    List<Driver> findHighRatedAvailableDrivers(Double minRating);
}
