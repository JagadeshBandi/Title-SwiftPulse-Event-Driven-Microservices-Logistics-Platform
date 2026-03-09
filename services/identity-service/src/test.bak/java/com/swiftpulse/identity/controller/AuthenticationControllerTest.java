package com.swiftpulse.identity.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swiftpulse.common.dto.UserDto;
import com.swiftpulse.common.exception.ResourceNotFoundException;
import com.swiftpulse.identity.dto.AuthResponse;
import com.swiftpulse.identity.dto.LoginRequest;
import com.swiftpulse.identity.dto.RegisterRequest;
import com.swiftpulse.identity.service.AuthenticationService;
import com.swiftpulse.identity.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthenticationController.class)
class AuthenticationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private JwtUtil jwtUtil;

    @Autowired
    private ObjectMapper objectMapper;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private AuthResponse authResponse;
    private UserDto userDto;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .password("password123")
                .address("123 Main St")
                .city("New York")
                .state("NY")
                .zipCode("10001")
                .country("USA")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john.doe@example.com")
                .password("password123")
                .build();

        authResponse = AuthResponse.builder()
                .token("jwt-token")
                .userId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .userType("CUSTOMER")
                .build();

        userDto = UserDto.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .phoneNumber("1234567890")
                .userType(UserDto.UserType.CUSTOMER)
                .address("123 Main St")
                .city("New York")
                .state("NY")
                .zipCode("10001")
                .country("USA")
                .isActive(true)
                .build();
    }

    @Test
    void register_WithValidRequest_ShouldReturn201AndAuthResponse() throws Exception {
        when(authenticationService.register(any(RegisterRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.userType").value("CUSTOMER"));
    }

    @Test
    void register_WithInvalidRequest_ShouldReturn400() throws Exception {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .firstName("") // Invalid empty first name
                .email("invalid-email") // Invalid email format
                .password("") // Invalid empty password
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_WithValidCredentials_ShouldReturn200AndAuthResponse() throws Exception {
        when(authenticationService.login(any(LoginRequest.class))).thenReturn(authResponse);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.userType").value("CUSTOMER"));
    }

    @Test
    void login_WithInvalidCredentials_ShouldReturn401() throws Exception {
        when(authenticationService.login(any(LoginRequest.class)))
                .thenThrow(new IllegalArgumentException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getUserProfile_WithValidUserId_ShouldReturn200AndUserDto() throws Exception {
        when(authenticationService.getUserProfile(anyLong())).thenReturn(userDto);

        mockMvc.perform(get("/api/auth/profile/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.phoneNumber").value("1234567890"))
                .andExpect(jsonPath("$.userType").value("CUSTOMER"))
                .andExpect(jsonPath("$.address").value("123 Main St"))
                .andExpect(jsonPath("$.city").value("New York"))
                .andExpect(jsonPath("$.state").value("NY"))
                .andExpect(jsonPath("$.zipCode").value("10001"))
                .andExpect(jsonPath("$.country").value("USA"))
                .andExpect(jsonPath("$.isActive").value(true));
    }

    @Test
    void getUserProfile_WithNonExistentUserId_ShouldReturn404() throws Exception {
        when(authenticationService.getUserProfile(anyLong()))
                .thenThrow(new ResourceNotFoundException("User", 1L));

        mockMvc.perform(get("/api/auth/profile/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void validateToken_WithValidToken_ShouldReturn200AndUserDto() throws Exception {
        when(jwtUtil.extractUserId(anyString())).thenReturn("1");
        when(authenticationService.getUserProfile(anyLong())).thenReturn(userDto);

        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer valid-jwt-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturn404() throws Exception {
        when(jwtUtil.extractUserId(anyString())).thenThrow(new RuntimeException("Invalid token"));

        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isNotFound());
    }

    @Test
    void validateToken_WithMalformedToken_ShouldReturn404() throws Exception {
        when(jwtUtil.extractUserId(anyString())).thenReturn(null);

        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "Bearer malformed-token"))
                .andExpect(status().isNotFound());
    }

    @Test
    void validateToken_WithoutBearerPrefix_ShouldStillWork() throws Exception {
        when(jwtUtil.extractUserId(anyString())).thenReturn("1");
        when(authenticationService.getUserProfile(anyLong())).thenReturn(userDto);

        mockMvc.perform(get("/api/auth/validate")
                        .header("Authorization", "token-without-bearer"))
                .andExpect(status().isOk());
    }

    @Test
    void register_WithMissingFields_ShouldReturnValidationErrors() throws Exception {
        RegisterRequest missingFieldsRequest = RegisterRequest.builder()
                .firstName("John")
                // Missing lastName, email, password, etc.
                .build();

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingFieldsRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_WithMissingFields_ShouldReturnValidationErrors() throws Exception {
        LoginRequest missingFieldsRequest = LoginRequest.builder()
                .email("john.doe@example.com")
                // Missing password
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(missingFieldsRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void endpoints_ShouldHandleContentTypeValidation() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("invalid content"))
                .andExpect(status().isUnsupportedMediaType());
    }
}
