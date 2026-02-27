package com.swiftpulse.performance;

import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;
import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

public class OrderServicePerformanceTest extends Simulation {

    HttpProtocolBuilder httpProtocol = http
        .baseUrl("http://localhost:8080")
        .acceptHeader("application/json")
        .contentTypeHeader("application/json");

    ScenarioBuilder createOrderScenario = scenario("Create Order")
        .exec(http("Create Order")
            .post("/api/orders")
            .header("X-User-Id", "100")
            .body(StringBody("""
                {
                    "description": "Performance Test Package",
                    "weight": 2.5,
                    "pickupAddressStreet": "123 Test St",
                    "pickupAddressCity": "Test City",
                    "pickupAddressState": "TS",
                    "pickupAddressZip": "12345",
                    "deliveryAddressStreet": "456 Test Ave",
                    "deliveryAddressCity": "Test City",
                    "deliveryAddressState": "TS",
                    "deliveryAddressZip": "12345"
                }
                """))
            .check(status().is(201))
            .check(jsonPath("$.orderNumber").exists())
        );

    ScenarioBuilder getOrdersScenario = scenario("Get Orders")
        .exec(http("Get Customer Orders")
            .get("/api/orders/customer/100")
            .check(status().is(200))
        );

    ScenarioBuilder trackOrderScenario = scenario("Track Order")
        .exec(http("Track Order")
            .get("/api/orders/track/TRK123456")
            .check(status().in(200, 404))
        );

    {
        setUp(
            createOrderScenario.injectOpen(
                rampUsersPerSec(1).to(10).during(60),
                constantUsersPerSec(10).during(120)
            ),
            getOrdersScenario.injectOpen(
                rampUsersPerSec(2).to(20).during(60),
                constantUsersPerSec(20).during(120)
            ),
            trackOrderScenario.injectOpen(
                rampUsersPerSec(5).to(50).during(60),
                constantUsersPerSec(50).during(120)
            )
        ).protocols(httpProtocol)
        .assertions(
            global().responseTime().max().lt(2000),
            global().successfulRequests().percent().gt(95.0)
        );
    }
}
