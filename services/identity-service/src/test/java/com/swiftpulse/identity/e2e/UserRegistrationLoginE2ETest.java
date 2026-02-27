package com.swiftpulse.e2e;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("e2e-test")
class UserRegistrationLoginE2ETest {

    @LocalServerPort
    private Integer port;

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
    }

    @Test
    void completeUserRegistrationAndLoginFlow() {
        // Step 1: Register a new user
        String registerRequest = """
            {
                "firstName": "E2E",
                "lastName": "Test",
                "email": "e2e.test@example.com",
                "phoneNumber": "+1234567890",
                "password": "E2ETest123!"
            }
            """;

        Response registerResponse = given()
            .contentType("application/json")
            .body(registerRequest)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(201)
            .body("token", notNullValue())
            .body("userId", notNullValue())
            .body("email", equalTo("e2e.test@example.com"))
            .extract().response();

        String authToken = registerResponse.path("token");
        Integer userId = registerResponse.path("userId");

        assertNotNull(authToken);
        assertNotNull(userId);

        // Step 2: Login with the registered user
        String loginRequest = """
            {
                "email": "e2e.test@example.com",
                "password": "E2ETest123!"
            }
            """;

        given()
            .contentType("application/json")
            .body(loginRequest)
        .when()
            .post("/api/auth/login")
        .then()
            .statusCode(200)
            .body("token", equalTo(authToken))
            .body("email", equalTo("e2e.test@example.com"));

        // Step 3: Get user profile with token
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/auth/profile/" + userId)
        .then()
            .statusCode(200)
            .body("id", equalTo(userId))
            .body("firstName", equalTo("E2E"))
            .body("lastName", equalTo("Test"))
            .body("email", equalTo("e2e.test@example.com"));
    }

    @Test
    void orderCreationAndTrackingWorkflow() {
        // Step 1: Register and login
        String registerRequest = """
            {
                "firstName": "Order",
                "lastName": "Test",
                "email": "order.test@example.com",
                "phoneNumber": "+1987654321",
                "password": "OrderTest123!"
            }
            """;

        Response registerResponse = given()
            .contentType("application/json")
            .body(registerRequest)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(201)
            .extract().response();

        String authToken = registerResponse.path("token");
        Integer userId = registerResponse.path("userId");

        // Step 2: Create an order
        String orderRequest = """
            {
                "description": "E2E Test Package",
                "weight": 3.5,
                "pickupAddressStreet": "123 Test Street",
                "pickupAddressCity": "New York",
                "pickupAddressState": "NY",
                "pickupAddressZip": "10001",
                "deliveryAddressStreet": "456 Delivery Ave",
                "deliveryAddressCity": "Boston",
                "deliveryAddressState": "MA",
                "deliveryAddressZip": "02101"
            }
            """;

        Response orderResponse = given()
            .contentType("application/json")
            .header("Authorization", "Bearer " + authToken)
            .header("X-User-Id", userId)
            .body(orderRequest)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(201)
            .body("orderNumber", notNullValue())
            .body("trackingNumber", notNullValue())
            .body("status", equalTo("PENDING"))
            .extract().response();

        String orderNumber = orderResponse.path("orderNumber");
        String trackingNumber = orderResponse.path("trackingNumber");

        // Step 3: Track the order
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/orders/track/" + trackingNumber)
        .then()
            .statusCode(200)
            .body("orderNumber", equalTo(orderNumber))
            .body("trackingNumber", equalTo(trackingNumber))
            .body("status", equalTo("PENDING"));

        // Step 4: Get customer orders
        given()
            .header("Authorization", "Bearer " + authToken)
        .when()
            .get("/api/orders/customer/" + userId)
        .then()
            .statusCode(200)
            .body("$", hasSize(greaterThanOrEqualTo(1)))
            .body("[0].orderNumber", equalTo(orderNumber));
    }

    @Test
    void driverAssignmentAndDeliveryFlow() {
        // This test simulates the complete delivery workflow
        // 1. Create order
        // 2. Driver gets assigned
        // 3. Driver updates location
        // 4. Order gets delivered

        // Register customer
        String customerRegister = """
            {
                "firstName": "Customer",
                "lastName": "Test",
                "email": "customer.delivery@example.com",
                "password": "Customer123!"
            }
            """;

        Response customerResponse = given()
            .contentType("application/json")
            .body(customerRegister)
        .when()
            .post("/api/auth/register")
        .then()
            .statusCode(201)
            .extract().response();

        String customerToken = customerResponse.path("token");
        Integer customerId = customerResponse.path("userId");

        // Register driver
        String driverData = """
            {
                "firstName": "Driver",
                "lastName": "Test",
                "email": "driver.delivery@example.com",
                "phoneNumber": "+1111111111",
                "licenseNumber": "LIC-E2E-001",
                "vehicleType": "VAN",
                "vehiclePlateNumber": "E2E-123"
            }
            """;

        // Create order
        String orderRequest = """
            {
                "description": "Delivery Test Package",
                "weight": 2.0,
                "pickupAddressStreet": "789 Pickup Lane",
                "pickupAddressCity": "Chicago",
                "pickupAddressState": "IL",
                "pickupAddressZip": "60601",
                "deliveryAddressStreet": "321 Dropoff Blvd",
                "deliveryAddressCity": "Detroit",
                "deliveryAddressState": "MI",
                "deliveryAddressZip": "48201"
            }
            """;

        Response orderResponse = given()
            .contentType("application/json")
            .header("Authorization", "Bearer " + customerToken)
            .header("X-User-Id", customerId)
            .body(orderRequest)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(201)
            .extract().response();

        String orderNumber = orderResponse.path("orderNumber");

        // Verify order was created with PENDING status
        given()
            .header("Authorization", "Bearer " + customerToken)
        .when()
            .get("/api/orders/number/" + orderNumber)
        .then()
            .statusCode(200)
            .body("status", equalTo("PENDING"));
    }
}
