package com.swiftpulse.identity.service;

import com.swiftpulse.common.exception.ResourceNotFoundException;
import com.swiftpulse.identity.dto.AuthResponse;
import com.swiftpulse.identity.dto.LoginRequest;
import com.swiftpulse.identity.dto.RegisterRequest;
import com.swiftpulse.identity.entity.User;
import com.swiftpulse.identity.enums.UserType;
import com.swiftpulse.identity.repository.UserRepository;
import com.swiftpulse.identity.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class AuthenticationService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthenticationService.class);
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    public AuthenticationService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                               JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }
    
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .userType(UserType.CUSTOMER)
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .country(request.getCountry())
                .password(passwordEncoder.encode(request.getPassword()))
                .isActive(true)
                .build();
        
        user = userRepository.save(user);
        log.info("User registered successfully with ID: {}", user.getId());
        
        String token = jwtUtil.generateToken(user);
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userType(user.getUserType().name())
                .build();
    }
    
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getEmail()));
        
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("User account is deactivated");
        }
        
        String token = jwtUtil.generateToken(user);
        log.info("User authenticated successfully with ID: {}", user.getId());
        
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .userType(user.getUserType().name())
                .build();
    }
    
    public Object getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        
        // Create a simple user profile response
        return new Object() {
            public final Long id = user.getId();
            public final String firstName = user.getFirstName();
            public final String lastName = user.getLastName();
            public final String email = user.getEmail();
            public final String phoneNumber = user.getPhoneNumber();
            public final UserType userType = user.getUserType();
            public final String address = user.getAddress();
            public final String city = user.getCity();
            public final String state = user.getState();
            public final String zipCode = user.getZipCode();
            public final String country = user.getCountry();
            public final Boolean isActive = user.getIsActive();
            public final LocalDateTime createdAt = user.getCreatedAt();
            public final LocalDateTime updatedAt = user.getUpdatedAt();
        };
    }
}
