package com.swiftpulse.identity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/test")
public class TestAuthController {
    
    private static final Logger log = LoggerFactory.getLogger(TestAuthController.class);
    
    @PostMapping("/login")
    public ResponseEntity<String> testLogin(@RequestBody String credentials) {
        log.info("Test login endpoint called with: {}", credentials);
        return ResponseEntity.ok("{\"token\":\"test-token\",\"message\":\"Login successful\",\"user\":{\"email\":\"admin@swiftpulse.com\",\"role\":\"ADMIN\"}}");
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("{\"status\":\"ok\",\"message\":\"Auth service is healthy\"}");
    }
}
