package com.swiftpulse.observability;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.Timer;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ObservabilityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private MeterRegistry meterRegistry;

    @Test
    void actuatorHealthEndpoint_ReturnsHealthStatus() throws Exception {
        mockMvc.perform(get("/actuator/health"))
            .andExpect(status().isOk());
    }

    @Test
    void actuatorInfoEndpoint_ReturnsApplicationInfo() throws Exception {
        mockMvc.perform(get("/actuator/info"))
            .andExpect(status().isOk());
    }

    @Test
    void actuatorMetricsEndpoint_ReturnsMetrics() throws Exception {
        mockMvc.perform(get("/actuator/metrics"))
            .andExpect(status().isOk());
    }

    @Test
    void actuatorPrometheusEndpoint_ReturnsPrometheusMetrics() throws Exception {
        mockMvc.perform(get("/actuator/prometheus"))
            .andExpect(status().isOk());
    }

    @Test
    void customMetrics_CreatedAndIncremented() {
        Counter orderCreatedCounter = Counter.builder("orders.created")
            .description("Total orders created")
            .register(meterRegistry);

        orderCreatedCounter.increment();
        orderCreatedCounter.increment();

        assertEquals(2.0, orderCreatedCounter.count());
    }

    @Test
    void timerMetrics_RecordTiming() {
        Timer orderProcessingTimer = Timer.builder("order.processing.time")
            .description("Order processing time")
            .register(meterRegistry);

        orderProcessingTimer.record(() -> {
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        assertTrue(orderProcessingTimer.count() > 0);
        assertTrue(orderProcessingTimer.mean() > 0);
    }

    @Test
    void httpRequestMetrics_AreCollected() throws Exception {
        // Make some HTTP requests
        mockMvc.perform(get("/api/orders"))
            .andExpect(status().isOk());

        // Verify metrics were collected
        assertNotNull(meterRegistry.find("http.server.requests").timer());
    }

    @Test
    void jvmMetrics_AreAvailable() {
        assertNotNull(meterRegistry.find("jvm.memory.used").gauge());
        assertNotNull(meterRegistry.find("jvm.gc.pause").timer());
        assertNotNull(meterRegistry.find("jvm.threads.live").gauge());
    }

    @Test
    void systemMetrics_AreAvailable() {
        assertNotNull(meterRegistry.find("system.cpu.usage").gauge());
        assertNotNull(meterRegistry.find("process.uptime").gauge());
    }

    @Test
    void logEventsMetrics_AreCollected() {
        // Log some events
        org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ObservabilityTest.class);
        logger.info("Test info message");
        logger.error("Test error message");

        // Verify log metrics exist
        assertNotNull(meterRegistry.find("log.events").counter());
    }
}
