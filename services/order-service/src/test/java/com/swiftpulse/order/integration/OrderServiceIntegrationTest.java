package com.swiftpulse.integration;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.KafkaContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration-test")
@Testcontainers
class OrderServiceIntegrationTest {

    @LocalServerPort
    private Integer port;

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine")
            .withDatabaseName("swiftpulse_orders")
            .withUsername("test")
            .withPassword("test");

    @Container
    static KafkaContainer kafka = new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.5.0"));

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.kafka.bootstrap-servers", kafka::getBootstrapServers);
    }

    @BeforeEach
    void setUp() {
        RestAssured.baseURI = "http://localhost";
        RestAssured.port = port;
    }

    @Test
    void createOrder_Success() {
        String requestBody = """
            {
                "description": "Test Package",
                "weight": 2.5,
                "pickupAddressStreet": "123 Pickup St",
                "pickupAddressCity": "New York",
                "pickupAddressState": "NY",
                "pickupAddressZip": "10001",
                "deliveryAddressStreet": "456 Delivery Ave",
                "deliveryAddressCity": "Boston",
                "deliveryAddressState": "MA",
                "deliveryAddressZip": "02101"
            }
            """;

        given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .statusCode(201)
            .body("orderNumber", notNullValue())
            .body("trackingNumber", notNullValue())
            .body("status", equalTo("PENDING"))
            .body("customerId", equalTo(100));
    }

    @Test
    void getOrderById_Success() {
        // First create an order
        String requestBody = """
            {
                "description": "Test Package",
                "weight": 2.5,
                "pickupAddressStreet": "123 Pickup St",
                "pickupAddressCity": "New York",
                "pickupAddressState": "NY",
                "pickupAddressZip": "10001",
                "deliveryAddressStreet": "456 Delivery Ave",
                "deliveryAddressCity": "Boston",
                "deliveryAddressState": "MA",
                "deliveryAddressZip": "02101"
            }
            """;

        Response createResponse = given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .extract().response();

        Integer orderId = createResponse.path("id");

        given()
            .contentType("application/json")
        .when()
            .get("/api/orders/" + orderId)
        .then()
            .statusCode(200)
            .body("id", equalTo(orderId))
            .body("description", equalTo("Test Package"));
    }

    @Test
    void updateOrderStatus_Success() {
        // Create an order first
        String requestBody = """
            {
                "description": "Test Package",
                "weight": 2.5,
                "pickupAddressStreet": "123 Pickup St",
                "pickupAddressCity": "New York",
                "pickupAddressState": "NY",
                "pickupAddressZip": "10001",
                "deliveryAddressStreet": "456 Delivery Ave",
                "deliveryAddressCity": "Boston",
                "deliveryAddressState": "MA",
                "deliveryAddressZip": "02101"
            }
            """;

        Response createResponse = given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .extract().response();

        Integer orderId = createResponse.path("id");

        given()
            .contentType("application/json")
            .queryParam("status", "CONFIRMED")
        .when()
            .put("/api/orders/" + orderId + "/status")
        .then()
            .statusCode(200)
            .body("status", equalTo("CONFIRMED"));
    }

    @Test
    void cancelOrder_Success() {
        // Create an order first
        String requestBody = """
            {
                "description": "Test Package",
                "weight": 2.5,
                "pickupAddressStreet": "123 Pickup St",
                "pickupAddressCity": "New York",
                "pickupAddressState": "NY",
                "pickupAddressZip": "10001",
                "deliveryAddressStreet": "456 Delivery Ave",
                "deliveryAddressCity": "Boston",
                "deliveryAddressState": "MA",
                "deliveryAddressZip": "02101"
            }
            """;

        Response createResponse = given()
            .contentType("application/json")
            .header("X-User-Id", "100")
            .body(requestBody)
        .when()
            .post("/api/orders")
        .then()
            .extract().response();

        Integer orderId = createResponse.path("id");

        given()
            .contentType("application/json")
        .when()
            .delete("/api/orders/" + orderId)
        .then()
            .statusCode(204);
    }
}
