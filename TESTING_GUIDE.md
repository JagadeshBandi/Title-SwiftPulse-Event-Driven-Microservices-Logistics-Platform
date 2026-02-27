# SwiftPulse Testing Guide

## Project Overview
SwiftPulse is an event-driven microservices logistics platform built with Java 21, Spring Boot 3, and React. This guide outlines the testing requirements and scope for the testing team.

## Architecture Summary

### Backend Microservices
1. **Discovery Server** (Port: 8761) - Netflix Eureka
2. **Config Server** (Port: 8888) - Spring Cloud Config
3. **API Gateway** (Port: 8080) - Spring Cloud Gateway
4. **Identity Service** (Port: 8081) - JWT Authentication
5. **Order Service** (Port: 8082) - Order Management
6. **Shipping Service** (Port: 8083) - Driver Assignment
7. **Tracking Service** (Port: 8084) - GPS Tracking
8. **Notification Service** (Port: 8085) - Email/SMS

### Frontend
- **Web Portal** (Port: 3000) - React-based UI

### Infrastructure
- PostgreSQL (3 instances for different services)
- MongoDB (Tracking data)
- Redis (Caching)
- Apache Kafka (Event streaming)
- Zipkin (Distributed tracing)
- Prometheus (Metrics)

## Testing Scope

### 1. Unit Testing

#### Backend Services (Java/JUnit 5)
Each microservice requires comprehensive unit tests:

**Identity Service:**
- `AuthenticationService` - Login, register, token validation
- `JwtUtil` - Token generation, parsing, validation
- `UserRepository` - Database operations
- `SecurityConfig` - Security filter chain
- Controllers - Request/response handling

**Order Service:**
- `OrderService` - CRUD operations, business logic
- `OrderRepository` - Database queries
- `OrderController` - REST endpoints
- `OrderEventPublisher` - Kafka event publishing
- `OrderMapper` - DTO conversions

**Shipping Service:**
- `DriverService` - Driver assignment algorithms
- `RouteOptimizationService` - Route calculation
- `ShippingEventListener` - Kafka consumers
- `DriverRepository` - Driver management

**Tracking Service:**
- `TrackingService` - GPS coordinate processing
- `TrackingUpdateRepository` - MongoDB operations
- `GeospatialQueryService` - Location queries
- `TrackingEventPublisher` - Event streaming

**Notification Service:**
- `NotificationService` - Email/SMS sending
- `KafkaEventListener` - Event consumption
- `NotificationTemplateService` - Message templates

#### Frontend (React/Jest/React Testing Library)

**Components:**
- `Header` - Navigation, user menu, notifications
- `Sidebar` - Menu navigation, active states
- `Login` - Form validation, authentication flow
- `Register` - Registration form, validation
- `Dashboard` - Statistics display, charts
- `Orders` - Order listing, search, pagination
- `CreateOrder` - Multi-step form, validation
- `OrderDetail` - Order information display
- `Tracking` - Map integration, tracking display

**Services:**
- `authService` - API calls, error handling
- `orderService` - CRUD operations
- `trackingService` - Tracking API calls

**Hooks:**
- `useAuth` - Authentication state
- `useOrders` - Order data fetching
- `useTracking` - Real-time tracking

**Context:**
- `AuthContext` - Authentication provider

### 2. Integration Testing

#### API Integration Tests
- End-to-end API flows through Gateway
- Service-to-service communication via OpenFeign
- Database integration for each service
- Kafka event publishing and consumption
- Redis caching operations

#### Frontend-Backend Integration
- Login flow (Frontend → Identity Service)
- Order creation (Frontend → Order Service → Kafka → Shipping Service)
- Tracking updates (Frontend → Tracking Service)
- Real-time map updates

### 3. End-to-End Testing

#### User Workflows
1. **Registration & Login**
   - User registration
   - Email verification (if applicable)
   - Login with credentials
   - Token persistence
   - Logout

2. **Order Creation Flow**
   - User creates order
   - Order saved to database
   - ORDER_CREATED event published
   - Shipping Service assigns driver
   - Notification sent to user
   - Order appears in dashboard

3. **Tracking Flow**
   - Driver sends GPS coordinates
   - Tracking data stored in MongoDB
   - Real-time updates to web portal
   - Map displays current location
   - Status updates trigger notifications

4. **Complete Delivery Flow**
   - Order created → Confirmed → Assigned → Picked Up → In Transit → Delivered
   - Verify state transitions
   - Verify all notifications sent
   - Verify tracking updates at each stage

### 4. Performance Testing

#### Backend Performance
- API response times (< 500ms target)
- Database query performance
- Kafka message throughput
- Service startup times
- Memory usage under load
- Circuit breaker behavior under stress

#### Frontend Performance
- Page load times (< 3s target)
- Map rendering performance
- Real-time update handling
- Form submission response times
- Dashboard chart rendering

### 5. Security Testing

#### Authentication & Authorization
- JWT token validation
- Token expiration handling
- Refresh token mechanism (if applicable)
- Role-based access control (RBAC)
- API endpoint security
- CORS configuration

#### Data Security
- SQL injection prevention
- NoSQL injection prevention (MongoDB)
- XSS prevention in web portal
- CSRF protection
- Input validation
- Sensitive data encryption

#### Infrastructure Security
- Service-to-service authentication
- Database connection security
- Kafka security
- Docker container security

### 6. Event-Driven Architecture Testing

#### Kafka Testing
- Event publishing reliability
- Event consumption ordering
- Message persistence
- Consumer group behavior
- Partition handling
- Error handling and dead letter queues
- Event schema validation

#### Event Flow Testing
- ORDER_CREATED → Shipping Service assignment
- DRIVER_ASSIGNED → Notification Service email
- LOCATION_UPDATED → Tracking Service storage
- DELIVERED → Final notifications

### 7. Database Testing

#### PostgreSQL (Identity, Order, Shipping Services)
- Schema validation
- Migration scripts
- Connection pooling
- Transaction management
- Query performance
- Data integrity constraints
- Index effectiveness

#### MongoDB (Tracking Service)
- Geospatial index queries
- Write performance for high-frequency GPS data
- Aggregation pipeline performance
- Data retention policies
- Replication (if configured)

### 8. Resilience Testing

#### Circuit Breaker Testing (Resilience4j)
- Failure threshold testing
- Recovery behavior
- Fallback mechanism testing
- Half-open state behavior
- Time-based recovery

#### Service Discovery Testing (Eureka)
- Service registration
- Service deregistration
- Heartbeat mechanism
- Client-side load balancing

### 9. Observability Testing

#### Distributed Tracing (Zipkin)
- Trace ID propagation
- Span creation accuracy
- Service dependency visualization
- Latency measurement

#### Metrics (Prometheus)
- Custom metrics collection
- Endpoint availability metrics
- Business metrics (orders created, delivered)
- Alert threshold testing

### 10. Infrastructure Testing

#### Docker Compose
- Service startup order
- Network connectivity
- Volume persistence
- Environment variable injection
- Health checks

#### Database Initialization
- SQL scripts execution
- MongoDB initialization
- Seed data insertion
- Index creation

## Testing Tools Recommended

### Backend Testing
- **JUnit 5** - Unit testing framework
- **Mockito** - Mocking framework
- **Spring Boot Test** - Integration testing
- **TestContainers** - Database and infrastructure testing
- **RestAssured** - API testing
- **Kafka Test** - Event testing
- **Gatling/JMeter** - Performance testing

### Frontend Testing
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing
- **Cypress/Playwright** - E2E testing
- **MSW (Mock Service Worker)** - API mocking
- **Lighthouse** - Performance auditing

### Security Testing
- **OWASP ZAP** - Security scanner
- **SonarQube** - Code quality and security
- **Dependency Check** - Vulnerability scanning

## Test Data Requirements

### Sample Users
```json
{
  "admin": {
    "email": "admin@swiftpulse.com",
    "password": "admin123",
    "role": "ADMIN"
  },
  "customer": {
    "email": "customer@example.com",
    "password": "customer123",
    "role": "CUSTOMER"
  },
  "driver": {
    "email": "driver@example.com",
    "password": "driver123",
    "role": "DRIVER"
  }
}
```

### Sample Orders
- Various package types (Envelope, Package, Box, Pallet)
- Different delivery types (Standard, Express, Overnight)
- Multiple priority levels (Low, Medium, High, Urgent)
- Various status transitions

### Sample Tracking Data
- GPS coordinates for major cities
- Driver movement patterns
- Status change timestamps

## Environment Setup for Testing

### Local Development
```bash
# Start infrastructure
docker-compose up -d

# Run backend services
cd infrastructure/discovery-server && mvn spring-boot:run
cd infrastructure/api-gateway && mvn spring-boot:run
cd services/identity-service && mvn spring-boot:run
cd services/order-service && mvn spring-boot:run

# Run frontend
cd web-portal
npm install
npm start
```

### Test Environment Variables
```properties
# Database
DB_USERNAME=testuser
DB_PASSWORD=testpass

# JWT
JWT_SECRET=test-secret-key-for-testing-only
JWT_EXPIRATION=3600000

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Services
IDENTITY_SERVICE_URL=http://localhost:8081
ORDER_SERVICE_URL=http://localhost:8082
```

## CI/CD Integration

### Test Execution Pipeline
1. **Code Quality Check**
   - SonarQube analysis
   - Dependency vulnerability scan

2. **Unit Tests**
   - Backend: `mvn test`
   - Frontend: `npm test`

3. **Integration Tests**
   - Docker Compose integration tests
   - Kafka flow tests

4. **E2E Tests**
   - Cypress/Playwright test execution

5. **Performance Tests**
   - Load testing with Gatling
   - Frontend performance with Lighthouse

6. **Security Tests**
   - OWASP ZAP scan
   - Container security scan

## Bug Reporting Template

```markdown
## Bug Report

**Service:** [Identity/Order/Shipping/Tracking/Notification/Web Portal]

**Severity:** [Critical/High/Medium/Low]

**Environment:** [Local/Dev/Staging]

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
What should happen

**Actual Result:**
What actually happens

**Logs/Stack Trace:**
```
[Error logs]
```

**Screenshots:**
[If applicable]

**Additional Context:**
Any other relevant information
```

## Success Criteria

### Minimum Test Coverage
- **Unit Tests:** 80% code coverage
- **Integration Tests:** All critical paths covered
- **E2E Tests:** All user workflows covered
- **Performance:** API < 500ms, Frontend < 3s load time
- **Security:** No critical or high vulnerabilities

### Definition of Done
- All unit tests passing
- Integration tests passing
- E2E tests passing
- Performance benchmarks met
- Security scan clean
- Code review approved
- Documentation updated

## Contact & Support

For testing-related questions or issues:
- Create issues in the repository
- Tag with `testing` label
- Include relevant logs and reproduction steps

---

**Note:** This testing guide should be treated as a living document. Update it as the project evolves and new features are added.
