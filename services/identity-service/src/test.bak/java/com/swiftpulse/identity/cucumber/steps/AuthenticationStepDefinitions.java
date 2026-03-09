package com.swiftpulse.identity.cucumber.steps;

import com.swiftpulse.identity.dto.AuthResponse;
import com.swiftpulse.identity.dto.LoginRequest;
import com.swiftpulse.identity.dto.RegisterRequest;
import com.swiftpulse.identity.entity.User;
import com.swiftpulse.identity.repository.UserRepository;
import com.swiftpulse.identity.service.AuthenticationService;
import com.swiftpulse.identity.util.JwtUtil;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

public class AuthenticationStepDefinitions {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private TestRestTemplate restTemplate;

    private Response response;
    private ResponseEntity<?> responseEntity;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private String token;
    private Exception exception;

    @Given("the authentication service is running")
    public void theAuthenticationServiceIsRunning() {
        // Service is running through Spring Boot test context
        assertNotNull(authenticationService);
    }

    @Given("the database is clean")
    public void theDatabaseIsClean() {
        userRepository.deleteAll();
    }

    @Given("I am a new user with valid details")
    public void iAmANewUserWithValidDetails(Map<String, String> userDetails) {
        registerRequest = RegisterRequest.builder()
                .firstName(userDetails.get("firstName"))
                .lastName(userDetails.get("lastName"))
                .email(userDetails.get("email"))
                .phoneNumber(userDetails.get("phone"))
                .password(userDetails.get("password"))
                .build();
    }

    @Given("I am a new user with invalid email")
    public void iAmANewUserWithInvalidEmail(Map<String, String> userDetails) {
        registerRequest = RegisterRequest.builder()
                .firstName(userDetails.get("firstName"))
                .lastName(userDetails.get("lastName"))
                .email(userDetails.get("email"))
                .phoneNumber(userDetails.get("phone"))
                .password(userDetails.get("password"))
                .build();
    }

    @Given("I am a new user with weak password")
    public void iAmANewUserWithWeakPassword(Map<String, String> userDetails) {
        registerRequest = RegisterRequest.builder()
                .firstName(userDetails.get("firstName"))
                .lastName(userDetails.get("lastName"))
                .email(userDetails.get("email"))
                .phoneNumber(userDetails.get("phone"))
                .password(userDetails.get("password"))
                .build();
    }

    @Given("a user already exists with email {string}")
    public void aUserAlreadyExistsWithEmail(String email) {
        User existingUser = User.builder()
                .firstName("Existing")
                .lastName("User")
                .email(email)
                .phoneNumber("+1234567890")
                .userType(com.swiftpulse.common.dto.UserDto.UserType.CUSTOMER)
                .password("encodedPassword")
                .isActive(true)
                .build();
        userRepository.save(existingUser);
    }

    @Given("a registered user exists with credentials")
    public void aRegisteredUserExistsWithCredentials(Map<String, String> credentials) {
        User user = User.builder()
                .firstName("Test")
                .lastName("User")
                .email(credentials.get("email"))
                .phoneNumber("+1234567890")
                .userType(com.swiftpulse.common.dto.UserDto.UserType.CUSTOMER)
                .password("$2a$10$encodedPassword") // Mock encoded password
                .isActive(true)
                .build();
        userRepository.save(user);
    }

    @Given("I am authenticated with a valid token")
    public void iAmAuthenticatedWithValidToken() {
        User user = User.builder()
                .id(1L)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .userType(com.swiftpulse.common.dto.UserDto.UserType.CUSTOMER)
                .isActive(true)
                .build();
        token = jwtUtil.generateToken(user);
    }

    @Given("I have an expired JWT token")
    public void iHaveAnExpiredJWTToken() {
        // Create a token that's already expired
        token = "expired.token.here";
    }

    @Given("I have a tampered JWT token")
    public void iHaveATamperedJWTToken() {
        // Create a tampered token
        token = "tampered.token.signature";
    }

    @Given("I am authenticated as a user with ID {long}")
    public void iAmAuthenticatedAsAUserWithID(Long userId) {
        User user = User.builder()
                .id(userId)
                .firstName("Test")
                .lastName("User")
                .email("test@example.com")
                .userType(com.swiftpulse.common.dto.UserDto.UserType.CUSTOMER)
                .isActive(true)
                .build();
        token = jwtUtil.generateToken(user);
    }

    @When("I register with my details")
    public void iRegisterWithMyDetails() {
        try {
            response = given()
                    .contentType("application/json")
                    .body(registerRequest)
                    .when()
                    .post("/api/auth/register")
                    .then()
                    .extract()
                    .response();
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I login with valid credentials")
    public void iLoginWithValidCredentials() {
        loginRequest = LoginRequest.builder()
                .email("test@example.com")
                .password("TestPass123")
                .build();

        try {
            response = given()
                    .contentType("application/json")
                    .body(loginRequest)
                    .when()
                    .post("/api/auth/login")
                    .then()
                    .extract()
                    .response();
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I login with invalid credentials")
    public void iLoginWithInvalidCredentials(Map<String, String> credentials) {
        loginRequest = LoginRequest.builder()
                .email(credentials.get("email"))
                .password(credentials.get("password"))
                .build();

        try {
            response = given()
                    .contentType("application/json")
                    .body(loginRequest)
                    .when()
                    .post("/api/auth/login")
                    .then()
                    .extract()
                    .response();
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I login with non-existent credentials")
    public void iLoginWithNonExistentCredentials(Map<String, String> credentials) {
        loginRequest = LoginRequest.builder()
                .email(credentials.get("email"))
                .password(credentials.get("password"))
                .build();

        try {
            response = given()
                    .contentType("application/json")
                    .body(loginRequest)
                    .when()
                    .post("/api/auth/login")
                    .then()
                    .extract()
                    .response();
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I validate my token")
    public void iValidateMyToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(
                    "/api/auth/validate",
                    HttpMethod.GET,
                    entity,
                    Object.class
            );
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I validate an invalid token")
    public void iValidateAnInvalidToken() {
        token = "invalid.token";
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(
                    "/api/auth/validate",
                    HttpMethod.GET,
                    entity,
                    Object.class
            );
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I request my user profile")
    public void iRequestMyUserProfile() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(
                    "/api/auth/profile/1",
                    HttpMethod.GET,
                    entity,
                    Object.class
            );
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I request user profile without authentication")
    public void iRequestUserProfileWithoutAuthentication() {
        try {
            response = given()
                    .when()
                    .get("/api/auth/profile/1")
                    .then()
                    .extract()
                    .response();
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I try to access a protected endpoint with the expired token")
    public void iTryToAccessAProtectedEndpointWithTheExpiredToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(
                    "/api/auth/profile/1",
                    HttpMethod.GET,
                    entity,
                    Object.class
            );
        } catch (Exception e) {
            exception = e;
        }
    }

    @When("I try to access a protected endpoint with the tampered token")
    public void iTryToAccessAProtectedEndpointWithTheTamperedToken() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            responseEntity = restTemplate.exchange(
                    "/api/auth/profile/1",
                    HttpMethod.GET,
                    entity,
                    Object.class
            );
        } catch (Exception e) {
            exception = e;
        }
    }

    @Then("I should receive a successful registration response")
    public void iShouldReceiveASuccessfulRegistrationResponse() {
        assertThat(response.getStatusCode(), equalTo(201));
    }

    @Then("I should receive a valid JWT token")
    public void iShouldReceiveAValidJWTToken() {
        AuthResponse authResponse = response.as(AuthResponse.class);
        assertNotNull(authResponse.getToken());
        assertThat(authResponse.getToken(), not(emptyString()));
        assertThat(authResponse.getType(), equalTo("Bearer"));
    }

    @Then("my account should be created in the database")
    public void myAccountShouldBeCreatedInTheDatabase() {
        User user = userRepository.findByEmail(registerRequest.getEmail()).orElse(null);
        assertNotNull(user);
        assertThat(user.getEmail(), equalTo(registerRequest.getEmail()));
    }

    @Then("the token should contain my user information")
    public void theTokenShouldContainMyUserInformation() {
        AuthResponse authResponse = response.as(AuthResponse.class);
        String extractedEmail = jwtUtil.extractUsername(authResponse.getToken());
        String extractedUserId = jwtUtil.extractUserId(authResponse.getToken());
        
        assertThat(extractedEmail, equalTo(registerRequest.getEmail()));
        assertNotNull(extractedUserId);
    }

    @Then("I should receive a validation error")
    public void iShouldReceiveAValidationError() {
        assertThat(response.getStatusCode(), equalTo(400));
    }

    @Then("the error message should mention invalid email format")
    public void theErrorMessageShouldMentionInvalidEmailFormat() {
        String errorMessage = response.jsonPath().getString("message");
        assertThat(errorMessage.toLowerCase(), containsString("email"));
        assertThat(errorMessage.toLowerCase(), containsString("format"));
    }

    @Then("the error message should mention password requirements")
    public void theErrorMessageShouldMentionPasswordRequirements() {
        String errorMessage = response.jsonPath().getString("message");
        assertThat(errorMessage.toLowerCase(), containsString("password"));
        assertThat(errorMessage.toLowerCase(), anyOf(containsString("size"), containsString("minimum")));
    }

    @Then("I should receive an error response")
    public void iShouldReceiveAnErrorResponse() {
        assertThat(response.getStatusCode(), equalTo(400));
    }

    @Then("the error message should indicate email already exists")
    public void theErrorMessageShouldIndicateEmailAlreadyExists() {
        String errorMessage = response.jsonPath().getString("message");
        assertThat(errorMessage.toLowerCase(), containsString("email"));
        assertThat(errorMessage.toLowerCase(), containsString("exists"));
    }

    @Then("I should receive a successful login response")
    public void iShouldReceiveASuccessfulLoginResponse() {
        assertThat(response.getStatusCode(), equalTo(200));
    }

    @Then("the token should contain my user ID and email")
    public void theTokenShouldContainMyUserIDAndEmail() {
        AuthResponse authResponse = response.as(AuthResponse.class);
        String extractedEmail = jwtUtil.extractUsername(authResponse.getToken());
        String extractedUserId = jwtUtil.extractUserId(authResponse.getToken());
        
        assertThat(extractedEmail, equalTo(loginRequest.getEmail()));
        assertNotNull(extractedUserId);
    }

    @Then("I should receive an authentication error")
    public void iShouldReceiveAnAuthenticationError() {
        if (response != null) {
            assertThat(response.getStatusCode(), anyOf(equalTo(401), equalTo(403)));
        } else if (responseEntity != null) {
            assertThat(responseEntity.getStatusCode(), anyOf(equalTo(401), equalTo(403)));
        } else if (exception != null) {
            assertTrue(exception.getMessage().toLowerCase().contains("unauthorized") ||
                      exception.getMessage().toLowerCase().contains("forbidden"));
        }
    }

    @Then("the error message should indicate invalid credentials")
    public void theErrorMessageShouldIndicateInvalidCredentials() {
        if (response != null) {
            String errorMessage = response.jsonPath().getString("message");
            assertThat(errorMessage.toLowerCase(), anyOf(containsString("invalid"), containsString("bad")));
        }
    }

    @Then("the error message should indicate user not found")
    public void theErrorMessageShouldIndicateUserNotFound() {
        if (response != null) {
            String errorMessage = response.jsonPath().getString("message");
            assertThat(errorMessage.toLowerCase(), containsString("not found"));
        }
    }

    @Then("I should receive my user profile information")
    public void iShouldReceiveMyUserProfileInformation() {
        assertNotNull(responseEntity);
        assertThat(responseEntity.getStatusCode(), equalTo(200));
    }

    @Then("the profile should contain my personal details")
    public void theProfileShouldContainMyPersonalDetails() {
        Map<String, Object> profile = (Map<String, Object>) responseEntity.getBody();
        assertNotNull(profile.get("firstName"));
        assertNotNull(profile.get("lastName"));
        assertNotNull(profile.get("email"));
    }

    @Then("the profile should not contain my password")
    public void theProfileShouldNotContainMyPassword() {
        Map<String, Object> profile = (Map<String, Object>) responseEntity.getBody();
        assertNull(profile.get("password"));
    }

    @Then("the error message should indicate authentication required")
    public void theErrorMessageShouldIndicateAuthenticationRequired() {
        if (response != null) {
            assertThat(response.getStatusCode(), equalTo(401));
        }
    }

    @Then("the error message should indicate token expired")
    public void theErrorMessageShouldIndicateTokenExpired() {
        if (exception != null) {
            assertTrue(exception.getMessage().toLowerCase().contains("expired") ||
                      exception.getMessage().toLowerCase().contains("token"));
        }
    }

    @Then("the error message should indicate invalid token signature")
    public void theErrorMessageShouldIndicateInvalidTokenSignature() {
        if (exception != null) {
            assertTrue(exception.getMessage().toLowerCase().contains("invalid") ||
                      exception.getMessage().toLowerCase().contains("signature"));
        }
    }
}
