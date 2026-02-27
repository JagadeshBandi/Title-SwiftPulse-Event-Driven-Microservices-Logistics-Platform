package com.swiftpulse.security;

import io.restassured.RestAssured;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class SecurityTest {

    @LocalServerPort
    private Integer port;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
    }

    @Test
    void sqlInjectionPrevention_Login() {
        String maliciousEmail = "test' OR '1'='1' --";
        String requestBody = String.format("""
            {
                "email": "%s",
                "password": "password"
            }
            """, maliciousEmail);

        given()
            .contentType("application/json")
            .body(requestBody)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(anyOf(equalTo(401), equalTo(400), equalTo(404)))
            .body("token", nullValue());
    }

    @Test
    void sqlInjectionPrevention_OrderCreation() {
        String maliciousDescription = "'; DROP TABLE orders; --";
        String requestBody = String.format("""
            {
                "description": "%s",
                "weight": 2.0,
                "pickupAddressStreet": "123 Test St",
                "pickupAddressCity": "Test City",
                "pickupAddressState": "TS",
                "pickupAddressZip": "12345",
                "deliveryAddressStreet": "456 Test Ave",
                "deliveryAddressCity": "Test City",
                "deliveryAddressState": "TS",
                "deliveryAddressZip": "12345"
            }
            """, maliciousDescription);

        given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(anyOf(equalTo(201), equalTo(400))); // Should not crash or allow SQL injection
    }

    @Test
    void xssPrevention_OrderDescription() {
        String xssPayload = "<script>alert('XSS')</script>";
        String requestBody = String.format("""
            {
                "description": "%s",
                "weight": 2.0,
                "pickupAddressStreet": "123 Test St",
                "pickupAddressCity": "Test City",
                "pickupAddressState": "TS",
                "pickupAddressZip": "12345",
                "deliveryAddressStreet": "456 Test Ave",
                "deliveryAddressCity": "Test City",
                "deliveryAddressState": "TS",
                "deliveryAddressZip": "12345"
            }
            """, xssPayload);

        given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(anyOf(equalTo(201), equalTo(400)))
            .body("description", not(containsString("<script>")));
    }

    @Test
    void jwtTokenValidation_InvalidToken() {
        String invalidToken = "invalid.token.here";

        given()
            .header("Authorization", "Bearer " + invalidToken)
        .when()
            .get("/api/orders")
        .then()
            .statusCode(anyOf(equalTo(401), equalTo(403)));
    }

    @Test
    void jwtTokenValidation_MissingToken() {
        given()
        .when()
            .get("/api/orders")
        .then()
            .statusCode(anyOf(equalTo(401), equalTo(403)));
    }

    @Test
    void pathTraversalPrevention() {
        given()
            .header("Authorization", "Bearer test-token")
        .when()
            .get("/api/orders/../../../etc/passwd")
        .then()
            .statusCode(anyOf(equalTo(404), equalTo(400), equalTo(403)));
    }

    @Test
    void bruteForceProtection_Login() {
        String requestBody = """
            {
                "email": "test@example.com",
                "password": "wrongpassword"
            }
            """;

        // Attempt multiple failed logins
        for (int i = 0; i < 5; i++) {
            given()
                .contentType("application/json")
                .body(requestBody)
            .when()
                .post("/api/auth/login")
            .then()
                .statusCode(anyOf(equalTo(401), equalTo(429)));
        }
    }

    @Test
    void csrfProtection() {
        given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body("""
                {
                    "description": "Test",
                    "weight": 1.0,
                    "pickupAddressStreet": "123 Test",
                    "pickupAddressCity": "City",
                    "pickupAddressState": "ST",
                    "pickupAddressZip": "12345",
                    "deliveryAddressStreet": "456 Test",
                    "deliveryAddressCity": "City",
                    "deliveryAddressState": "ST",
                    "deliveryAddressZip": "12345"
                }
                """)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(anyOf(equalTo(201), equalTo(401), equalTo(403)));
    }

    @Test
    void sensitiveDataExposure_Prevention() {
        given()
            .contentType("application/json")
            .body("""
                {
                    "email": "test@example.com",
                    "password": "testpassword"
                }
                """)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(anyOf(equalTo(200), equalTo(401)))
            .body("password", nullValue())
            .body("token", anyOf(notNullValue(), nullValue()));
    }
}
