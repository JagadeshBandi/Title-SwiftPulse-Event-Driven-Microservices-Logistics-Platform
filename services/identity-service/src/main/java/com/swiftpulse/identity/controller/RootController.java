package com.swiftpulse.identity.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
public class RootController {
    
    private static final Logger log = LoggerFactory.getLogger(RootController.class);
    
    @GetMapping("/")
    public ResponseEntity<String> root() {
        log.info("Root endpoint called");
        String response = """
            {
                "message": "SwiftPulse Identity Service",
                "status": "running",
                "endpoints": {
                    "login": "/api/auth/simple/login",
                    "register": "/api/auth/simple/register",
                    "health": "/actuator/health"
                }
            }
            """;
        return ResponseEntity.ok(response);
    }
}
