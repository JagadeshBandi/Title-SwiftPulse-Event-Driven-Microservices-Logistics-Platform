package com.swiftpulse.identity.service;

import com.swiftpulse.common.dto.UserDto;
import com.swiftpulse.common.exception.ResourceNotFoundException;
import com.swiftpulse.identity.dto.AuthResponse;
import com.swiftpulse.identity.dto.LoginRequest;
import com.swiftpulse.identity.dto.RegisterRequest;
import com.swiftpulse.identity.entity.User;
import com.swiftpulse.identity.repository.UserRepository;
import com.swiftpulse.identity.util.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;
    private AuthResponse expectedAuthResponse;

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

        testUser = User.builder()
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

        expectedAuthResponse = AuthResponse.builder()
                .token("jwt-token")
                .userId(1L)
                .email("john.doe@example.com")
                .firstName("John")
                .lastName("Doe")
                .userType("CUSTOMER")
                .build();
    }

    @Test
    void register_WithValidRequest_ShouldReturnAuthResponse() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse result = authenticationService.register(registerRequest);

        assertNotNull(result);
        assertEquals(expectedAuthResponse.getToken(), result.getToken());
        assertEquals(expectedAuthResponse.getUserId(), result.getUserId());
        assertEquals(expectedAuthResponse.getEmail(), result.getEmail());
        assertEquals(expectedAuthResponse.getFirstName(), result.getFirstName());
        assertEquals(expectedAuthResponse.getLastName(), result.getLastName());
        assertEquals(expectedAuthResponse.getUserType(), result.getUserType());

        verify(userRepository).existsByEmail(registerRequest.getEmail());
        verify(passwordEncoder).encode(registerRequest.getPassword());
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken(any(User.class));
    }

    @Test
    void register_WithExistingEmail_ShouldThrowException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authenticationService.register(registerRequest)
        );

        assertEquals("Email already exists", exception.getMessage());
        verify(userRepository).existsByEmail(registerRequest.getEmail());
        verifyNoInteractions(passwordEncoder, jwtUtil);
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_WithValidCredentials_ShouldReturnAuthResponse() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse result = authenticationService.login(loginRequest);

        assertNotNull(result);
        assertEquals(expectedAuthResponse.getToken(), result.getToken());
        assertEquals(expectedAuthResponse.getUserId(), result.getUserId());
        assertEquals(expectedAuthResponse.getEmail(), result.getEmail());
        assertEquals(expectedAuthResponse.getFirstName(), result.getFirstName());
        assertEquals(expectedAuthResponse.getLastName(), result.getLastName());
        assertEquals(expectedAuthResponse.getUserType(), result.getUserType());

        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verify(jwtUtil).generateToken(testUser);
    }

    @Test
    void login_WithNonExistentUser_ShouldThrowException() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> authenticationService.login(loginRequest)
        );

        assertEquals("User", exception.getResourceName());
        assertEquals("john.doe@example.com", exception.getResourceValue());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void login_WithInactiveUser_ShouldThrowException() {
        Authentication authentication = mock(Authentication.class);
        UserDetails userDetails = mock(UserDetails.class);
        User inactiveUser = User.builder()
                .id(1L)
                .email("john.doe@example.com")
                .isActive(false)
                .build();

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userDetails.getUsername()).thenReturn("john.doe@example.com");
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(inactiveUser));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> authenticationService.login(loginRequest)
        );

        assertEquals("User account is deactivated", exception.getMessage());
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(userRepository).findByEmail(loginRequest.getEmail());
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void getUserProfile_WithValidUserId_ShouldReturnUserDto() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        UserDto result = authenticationService.getUserProfile(1L);

        assertNotNull(result);
        assertEquals(testUser.getId(), result.getId());
        assertEquals(testUser.getFirstName(), result.getFirstName());
        assertEquals(testUser.getLastName(), result.getLastName());
        assertEquals(testUser.getEmail(), result.getEmail());
        assertEquals(testUser.getPhoneNumber(), result.getPhoneNumber());
        assertEquals(testUser.getUserType(), result.getUserType());
        assertEquals(testUser.getAddress(), result.getAddress());
        assertEquals(testUser.getCity(), result.getCity());
        assertEquals(testUser.getState(), result.getState());
        assertEquals(testUser.getZipCode(), result.getZipCode());
        assertEquals(testUser.getCountry(), result.getCountry());
        assertEquals(testUser.getIsActive(), result.getIsActive());

        verify(userRepository).findById(1L);
    }

    @Test
    void getUserProfile_WithNonExistentUserId_ShouldThrowException() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        ResourceNotFoundException exception = assertThrows(
                ResourceNotFoundException.class,
                () -> authenticationService.getUserProfile(1L)
        );

        assertEquals("User", exception.getResourceName());
        assertEquals(1L, exception.getResourceValue());
        verify(userRepository).findById(1L);
    }

    @Test
    void register_WithDifferentUserTypes_ShouldSetCustomerAsDefault() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(any(User.class))).thenReturn("jwt-token");

        AuthResponse result = authenticationService.register(registerRequest);

        assertEquals(UserDto.UserType.CUSTOMER, testUser.getUserType());
        verify(userRepository).save(argThat(user -> UserDto.UserType.CUSTOMER.equals(user.getUserType())));
    }
}
