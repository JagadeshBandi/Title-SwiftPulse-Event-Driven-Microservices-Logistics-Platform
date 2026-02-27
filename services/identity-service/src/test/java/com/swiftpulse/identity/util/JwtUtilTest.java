package com.swiftpulse.identity.util;

import com.swiftpulse.identity.entity.User;
import com.swiftpulse.common.dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    private JwtUtil jwtUtil;
    private User testUser;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", "test-secret-key-for-testing-only-12345678901234567890");
        ReflectionTestUtils.setField(jwtUtil, "expiration", 3600000L); // 1 hour

        testUser = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john.doe@example.com")
                .userType(UserDto.UserType.CUSTOMER)
                .isActive(true)
                .build();
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        String token = jwtUtil.generateToken(testUser);
        
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        String token = jwtUtil.generateToken(testUser);
        String username = jwtUtil.extractUsername(token);
        
        assertEquals(testUser.getEmail(), username);
    }

    @Test
    void extractUserId_ShouldReturnCorrectUserId() {
        String token = jwtUtil.generateToken(testUser);
        String userId = jwtUtil.extractUserId(token);
        
        assertEquals(testUser.getId().toString(), userId);
    }

    @Test
    void extractUserType_ShouldReturnCorrectUserType() {
        String token = jwtUtil.generateToken(testUser);
        String userType = jwtUtil.extractUserType(token);
        
        assertEquals(testUser.getUserType().name(), userType);
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        String token = jwtUtil.generateToken(testUser);
        Date expiration = jwtUtil.extractExpiration(token);
        
        assertNotNull(expiration);
        assertTrue(expiration.after(new Date()));
    }

    @Test
    void validateToken_WithValidTokenAndUsername_ShouldReturnTrue() {
        String token = jwtUtil.generateToken(testUser);
        boolean isValid = jwtUtil.validateToken(token, testUser.getEmail());
        
        assertTrue(isValid);
    }

    @Test
    void validateToken_WithInvalidUsername_ShouldReturnFalse() {
        String token = jwtUtil.generateToken(testUser);
        boolean isValid = jwtUtil.validateToken(token, "different@example.com");
        
        assertFalse(isValid);
    }

    @Test
    void validateToken_WithExpiredToken_ShouldReturnFalse() {
        ReflectionTestUtils.setField(jwtUtil, "expiration", -1000L); // Expired token
        String token = jwtUtil.generateToken(testUser);
        boolean isValid = jwtUtil.validateToken(token, testUser.getEmail());
        
        assertFalse(isValid);
    }

    @Test
    void extractClaim_ShouldReturnCorrectClaim() {
        String token = jwtUtil.generateToken(testUser);
        String email = jwtUtil.extractClaim(token, claims -> claims.getSubject());
        
        assertEquals(testUser.getEmail(), email);
    }

    @Test
    void generateToken_WithDifferentUserTypes_ShouldIncludeCorrectUserType() {
        User adminUser = User.builder()
                .id(2L)
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .userType(UserDto.UserType.ADMIN)
                .isActive(true)
                .build();

        String adminToken = jwtUtil.generateToken(adminUser);
        String adminUserType = jwtUtil.extractUserType(adminToken);

        assertEquals(UserDto.UserType.ADMIN.name(), adminUserType);
    }

    @Test
    void tokenExpiration_ShouldBeAccurate() {
        long customExpiration = 7200000L; // 2 hours
        ReflectionTestUtils.setField(jwtUtil, "expiration", customExpiration);
        
        String token = jwtUtil.generateToken(testUser);
        Date expiration = jwtUtil.extractExpiration(token);
        Date expectedMinExpiration = new Date(System.currentTimeMillis() + customExpiration - 1000);
        Date expectedMaxExpiration = new Date(System.currentTimeMillis() + customExpiration + 1000);
        
        assertTrue(expiration.after(expectedMinExpiration) && expiration.before(expectedMaxExpiration));
    }
}
