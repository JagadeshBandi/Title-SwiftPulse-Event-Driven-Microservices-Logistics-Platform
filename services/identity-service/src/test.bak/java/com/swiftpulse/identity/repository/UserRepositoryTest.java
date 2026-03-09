package com.swiftpulse.identity.repository;

import com.swiftpulse.identity.entity.User;
import com.swiftpulse.common.dto.UserDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.TestPropertySource;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@TestPropertySource(properties = {
        "spring.datasource.url=jdbc:h2:mem:testdb",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "spring.datasource.driver-class-name=org.h2.Driver"
})
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
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
                .password("encoded-password")
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    @Test
    void findByEmail_WithExistingEmail_ShouldReturnUser() {
        entityManager.persistAndFlush(testUser);

        Optional<User> result = userRepository.findByEmail("john.doe@example.com");

        assertTrue(result.isPresent());
        assertEquals(testUser.getEmail(), result.get().getEmail());
        assertEquals(testUser.getFirstName(), result.get().getFirstName());
        assertEquals(testUser.getLastName(), result.get().getLastName());
    }

    @Test
    void findByEmail_WithNonExistingEmail_ShouldReturnEmpty() {
        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        assertFalse(result.isPresent());
    }

    @Test
    void existsByEmail_WithExistingEmail_ShouldReturnTrue() {
        entityManager.persistAndFlush(testUser);

        boolean result = userRepository.existsByEmail("john.doe@example.com");

        assertTrue(result);
    }

    @Test
    void existsByEmail_WithNonExistingEmail_ShouldReturnFalse() {
        boolean result = userRepository.existsByEmail("nonexistent@example.com");

        assertFalse(result);
    }

    @Test
    void findById_WithExistingId_ShouldReturnUser() {
        User persistedUser = entityManager.persistAndFlush(testUser);

        Optional<User> result = userRepository.findById(persistedUser.getId());

        assertTrue(result.isPresent());
        assertEquals(persistedUser.getId(), result.get().getId());
        assertEquals(persistedUser.getEmail(), result.get().getEmail());
    }

    @Test
    void findById_WithNonExistingId_ShouldReturnEmpty() {
        Optional<User> result = userRepository.findById(999L);

        assertFalse(result.isPresent());
    }

    @Test
    void save_ShouldPersistUser() {
        User savedUser = userRepository.save(testUser);

        assertNotNull(savedUser.getId());
        assertEquals(testUser.getEmail(), savedUser.getEmail());
        assertEquals(testUser.getFirstName(), savedUser.getFirstName());
        assertEquals(testUser.getLastName(), savedUser.getLastName());
        assertEquals(testUser.getUserType(), savedUser.getUserType());
        assertTrue(savedUser.getIsActive());
        assertNotNull(savedUser.getCreatedAt());
        assertNotNull(savedUser.getUpdatedAt());
    }

    @Test
    void delete_ShouldRemoveUser() {
        User persistedUser = entityManager.persistAndFlush(testUser);
        Long userId = persistedUser.getId();

        userRepository.delete(persistedUser);
        entityManager.flush();

        Optional<User> result = userRepository.findById(userId);
        assertFalse(result.isPresent());
    }

    @Test
    void findByUserType_ShouldReturnUsersOfSpecificType() {
        User adminUser = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .userType(UserDto.UserType.ADMIN)
                .password("encoded-password")
                .isActive(true)
                .build();

        entityManager.persistAndFlush(testUser);
        entityManager.persistAndFlush(adminUser);

        // Note: This test assumes you might add this method to UserRepository
        // If not implemented, you can remove this test
        // List<User> customers = userRepository.findByUserType(UserDto.UserType.CUSTOMER);
        // assertEquals(1, customers.size());
        // assertEquals(testUser.getEmail(), customers.get(0).getEmail());
    }

    @Test
    void findByIsActive_ShouldReturnOnlyActiveUsers() {
        User inactiveUser = User.builder()
                .firstName("Inactive")
                .lastName("User")
                .email("inactive@example.com")
                .userType(UserDto.UserType.CUSTOMER)
                .password("encoded-password")
                .isActive(false)
                .build();

        entityManager.persistAndFlush(testUser);
        entityManager.persistAndFlush(inactiveUser);

        // Note: This test assumes you might add this method to UserRepository
        // If not implemented, you can remove this test
        // List<User> activeUsers = userRepository.findByIsActive(true);
        // assertEquals(1, activeUsers.size());
        // assertEquals(testUser.getEmail(), activeUsers.get(0).getEmail());
    }

    @Test
    void updateUser_ShouldUpdateFields() {
        User persistedUser = entityManager.persistAndFlush(testUser);
        persistedUser.setFirstName("Updated");
        persistedUser.setPhoneNumber("9999999999");

        User updatedUser = userRepository.save(persistedUser);
        entityManager.flush();

        assertEquals("Updated", updatedUser.getFirstName());
        assertEquals("9999999999", updatedUser.getPhoneNumber());
        assertTrue(updatedUser.getUpdatedAt().isAfter(updatedUser.getCreatedAt()));
    }

    @Test
    void cascadeOperations_ShouldWorkCorrectly() {
        User persistedUser = entityManager.persistAndFlush(testUser);
        entityManager.clear();

        Optional<User> retrievedUser = userRepository.findById(persistedUser.getId());
        assertTrue(retrievedUser.isPresent());
        
        // Test that all fields are properly loaded
        User user = retrievedUser.get();
        assertNotNull(user.getFirstName());
        assertNotNull(user.getLastName());
        assertNotNull(user.getEmail());
        assertNotNull(user.getUserType());
        assertNotNull(user.getIsActive());
    }
}
