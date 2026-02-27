package com.swiftpulse.order.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.listener.ContainerProperties;
import org.springframework.kafka.listener.KafkaMessageListenerContainer;
import org.springframework.kafka.listener.MessageListener;
import org.springframework.kafka.test.EmbeddedKafkaBroker;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.kafka.test.utils.ContainerTestUtils;
import org.springframework.kafka.test.utils.KafkaTestUtils;

import java.util.Map;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = { "order-events", "shipping-events", "tracking-events" })
class KafkaIntegrationTest {

    @Autowired
    private EmbeddedKafkaBroker embeddedKafka;

    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    @Test
    void orderCreatedEventPublishingAndConsumption() throws InterruptedException {
        // Setup consumer
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("test-group", "true", embeddedKafka);
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(consumerProps);
        ContainerProperties containerProperties = new ContainerProperties("order-events");
        
        BlockingQueue<ConsumerRecord<String, String>> records = new LinkedBlockingQueue<>();
        containerProperties.setMessageListener((MessageListener<String, String>) records::add);
        
        KafkaMessageListenerContainer<String, String> container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.start();
        ContainerTestUtils.waitForAssignment(container, embeddedKafka.getPartitionsPerTopic());

        // Publish event
        String orderEvent = """
            {
                "eventType": "ORDER_CREATED",
                "orderId": 100,
                "customerId": 50,
                "orderNumber": "ORD123456",
                "trackingNumber": "TRK789012"
            }
            """;
        
        kafkaTemplate.send("order-events", "100", orderEvent);

        // Consume and verify
        ConsumerRecord<String, String> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals("100", received.key());
        assertTrue(received.value().contains("ORDER_CREATED"));
        assertTrue(received.value().contains("ORD123456"));

        container.stop();
    }

    @Test
    void driverAssignedEventFlow() throws InterruptedException {
        // Setup consumer for shipping events
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("shipping-test-group", "true", embeddedKafka);
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(consumerProps);
        ContainerProperties containerProperties = new ContainerProperties("shipping-events");
        
        BlockingQueue<ConsumerRecord<String, String>> records = new LinkedBlockingQueue<>();
        containerProperties.setMessageListener((MessageListener<String, String>) records::add);
        
        KafkaMessageListenerContainer<String, String> container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.start();
        ContainerTestUtils.waitForAssignment(container, embeddedKafka.getPartitionsPerTopic());

        // Publish driver assigned event
        String driverEvent = """
            {
                "eventType": "DRIVER_ASSIGNED",
                "orderId": 100,
                "driverId": 25,
                "driverName": "John Doe"
            }
            """;
        
        kafkaTemplate.send("shipping-events", "100", driverEvent);

        // Consume and verify
        ConsumerRecord<String, String> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals("100", received.key());
        assertTrue(received.value().contains("DRIVER_ASSIGNED"));
        assertTrue(received.value().contains("John Doe"));

        container.stop();
    }

    @Test
    void locationUpdateEventProcessing() throws InterruptedException {
        // Setup consumer for tracking events
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("tracking-test-group", "true", embeddedKafka);
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(consumerProps);
        ContainerProperties containerProperties = new ContainerProperties("tracking-events");
        
        BlockingQueue<ConsumerRecord<String, String>> records = new LinkedBlockingQueue<>();
        containerProperties.setMessageListener((MessageListener<String, String>) records::add);
        
        KafkaMessageListenerContainer<String, String> container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.start();
        ContainerTestUtils.waitForAssignment(container, embeddedKafka.getPartitionsPerTopic());

        // Publish location update event
        String locationEvent = """
            {
                "eventType": "LOCATION_UPDATED",
                "orderId": 100,
                "trackingNumber": "TRK789012",
                "latitude": 40.7580,
                "longitude": -73.9855,
                "speed": 45.5
            }
            """;
        
        kafkaTemplate.send("tracking-events", "100", locationEvent);

        // Consume and verify
        ConsumerRecord<String, String> received = records.poll(10, TimeUnit.SECONDS);
        assertNotNull(received);
        assertEquals("100", received.key());
        assertTrue(received.value().contains("LOCATION_UPDATED"));
        assertTrue(received.value().contains("40.7580"));

        container.stop();
    }

    @Test
    void multipleEventTypesProcessing() throws InterruptedException {
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("multi-test-group", "true", embeddedKafka);
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(consumerProps);
        ContainerProperties containerProperties = new ContainerProperties("order-events");
        
        BlockingQueue<ConsumerRecord<String, String>> records = new LinkedBlockingQueue<>();
        containerProperties.setMessageListener((MessageListener<String, String>) records::add);
        
        KafkaMessageListenerContainer<String, String> container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.start();
        ContainerTestUtils.waitForAssignment(container, embeddedKafka.getPartitionsPerTopic());

        // Publish multiple events
        String[] events = {
            """{"eventType": "ORDER_CREATED", "orderId": 1}""",
            """{"eventType": "ORDER_STATUS_UPDATED", "orderId": 1, "status": "CONFIRMED"}""",
            """{"eventType": "ORDER_STATUS_UPDATED", "orderId": 1, "status": "ASSIGNED"}""",
            """{"eventType": "ORDER_STATUS_UPDATED", "orderId": 1, "status": "IN_TRANSIT"}"""
        };

        for (String event : events) {
            kafkaTemplate.send("order-events", "1", event);
        }

        // Verify all events are consumed
        for (int i = 0; i < events.length; i++) {
            ConsumerRecord<String, String> received = records.poll(5, TimeUnit.SECONDS);
            assertNotNull(received, "Event " + i + " was not received");
            assertEquals("1", received.key());
        }

        container.stop();
    }

    @Test
    void eventOrderingGuarantee() throws InterruptedException {
        Map<String, Object> consumerProps = KafkaTestUtils.consumerProps("ordering-test-group", "true", embeddedKafka);
        DefaultKafkaConsumerFactory<String, String> consumerFactory = new DefaultKafkaConsumerFactory<>(consumerProps);
        ContainerProperties containerProperties = new ContainerProperties("order-events");
        
        BlockingQueue<ConsumerRecord<String, String>> records = new LinkedBlockingQueue<>();
        containerProperties.setMessageListener((MessageListener<String, String>) records::add);
        
        KafkaMessageListenerContainer<String, String> container = new KafkaMessageListenerContainer<>(consumerFactory, containerProperties);
        container.start();
        ContainerTestUtils.waitForAssignment(container, embeddedKafka.getPartitionsPerTopic());

        // Send events in sequence
        for (int i = 0; i < 10; i++) {
            String event = String.format("""{"sequence": %d, "timestamp": %d}""", i, System.currentTimeMillis());
            kafkaTemplate.send("order-events", "sequence-test", event);
        }

        // Consume and verify ordering
        int lastSequence = -1;
        for (int i = 0; i < 10; i++) {
            ConsumerRecord<String, String> received = records.poll(5, TimeUnit.SECONDS);
            assertNotNull(received);
            
            String value = received.value();
            int currentSequence = Integer.parseInt(value.replaceAll(".*\"sequence\": (\\d+).*", "$1"));
            assertTrue(currentSequence > lastSequence, "Events should be consumed in order");
            lastSequence = currentSequence;
        }

        container.stop();
    }
}
