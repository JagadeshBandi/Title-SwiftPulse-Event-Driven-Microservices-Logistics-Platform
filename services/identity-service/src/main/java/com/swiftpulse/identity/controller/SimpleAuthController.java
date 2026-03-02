package com.swiftpulse.identity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth/simple")
public class SimpleAuthController {
    
    private static final Logger log = LoggerFactory.getLogger(SimpleAuthController.class);
    
    @PostMapping("/login")
    public ResponseEntity<String> simpleLogin(@RequestBody String credentials) {
        log.info("Simple login endpoint called with: {}", credentials);
        
        // Simple mock authentication - accept any login for now
        String response = """
            {
                "token": "mock-jwt-token-12345",
                "message": "Login successful",
                "user": {
                    "id": 1,
                    "email": "admin@swiftpulse.com",
                    "firstName": "Admin",
                    "lastName": "User",
                    "role": "ADMIN"
                },
                "expiresIn": 86400000
            }
            """;
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/register")
    public ResponseEntity<String> simpleRegister(@RequestBody String userData) {
        log.info("Simple register endpoint called with: {}", userData);
        
        // Simple mock registration - accept any registration for now
        String response = """
            {
                "token": "mock-jwt-token-new-user-67890",
                "message": "Registration successful",
                "user": {
                    "id": 2,
                    "email": "newuser@swiftpulse.com",
                    "firstName": "New",
                    "lastName": "User",
                    "role": "CUSTOMER"
                },
                "expiresIn": 86400000
            }
            """;
        
        return ResponseEntity.status(201).body(response);
    }
}
