package com.swiftpulse.identity.controller;

import com.swiftpulse.common.exception.ResourceNotFoundException;
import com.swiftpulse.identity.dto.AuthResponse;
import com.swiftpulse.identity.dto.LoginRequest;
import com.swiftpulse.identity.dto.RegisterRequest;
import com.swiftpulse.identity.service.AuthenticationService;
import com.swiftpulse.identity.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication and user management APIs")
public class AuthenticationController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthenticationController.class);
    
    private final AuthenticationService authenticationService;
    private final JwtUtil jwtUtil;
    
    public AuthenticationController(AuthenticationService authenticationService, JwtUtil jwtUtil) {
        this.authenticationService = authenticationService;
        this.jwtUtil = jwtUtil;
    }
    
    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns JWT token")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registration request received for email: {}", request.getEmail());
        AuthResponse response = authenticationService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/login")
    @Operation(summary = "Authenticate user", description = "Authenticates user credentials and returns JWT token")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Login request received for email: {}", request.getEmail());
        AuthResponse response = authenticationService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profile/{userId}")
    @Operation(summary = "Get user profile", description = "Retrieves user profile information")
    public ResponseEntity<Object> getUserProfile(@PathVariable Long userId) {
        log.info("Profile request received for user ID: {}", userId);
        Object userDto = authenticationService.getUserProfile(userId);
        return ResponseEntity.ok(userDto);
    }
    
    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Validates JWT token and returns user info")
    public ResponseEntity<Object> validateToken(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        Long userId = extractUserIdFromToken(jwt);
        
        if (userId == null) {
            throw new ResourceNotFoundException("Invalid token", "token");
        }
        
        Object userDto = authenticationService.getUserProfile(userId);
        return ResponseEntity.ok(userDto);
    }
    
    private Long extractUserIdFromToken(String token) {
        try {
            return Long.parseLong(jwtUtil.extractUserId(token));
        } catch (Exception e) {
            log.error("Error extracting user ID from token", e);
            return null;
        }
    }
}
