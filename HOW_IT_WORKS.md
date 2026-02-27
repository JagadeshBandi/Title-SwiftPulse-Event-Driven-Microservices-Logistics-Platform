# SwiftPulse Application - How It Works

## System Architecture Overview

SwiftPulse is an event-driven microservices logistics platform. Here's how all the components work together:

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                            │
│  ┌──────────────────┐  ┌──────────────────┐                 │
│  │   Web Portal     │  │   Mobile App     │                 │
│  │   (React)        │  │   (Future)       │                 │
│  │   Port: 3000     │  │                  │                 │
│  └────────┬─────────┘  └──────────────────┘                 │
│           │                                                  │
│           │ HTTP/REST                                        │
│           ▼                                                  │
├─────────────────────────────────────────────────────────────┤
│                    GATEWAY LAYER                            │
│  ┌─────────────────────────────────────────────────────────┐│
│  │              API Gateway (Spring Cloud)                  ││
│  │              Port: 8080                                  ││
│  │  • Routes requests to appropriate services              ││
│  │  • Rate limiting and security                           ││
│  │  • Circuit breaker patterns                             ││
│  └──────────────────────┬────────────────────────────────────┘│
│                         │                                    │
│                         │                                    │
├─────────────────────────┼────────────────────────────────────┤
│                    SERVICE LAYER                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │  Identity  │ │   Order    │ │  Shipping  │                │
│  │  Service   │ │  Service   │ │  Service   │                │
│  │  :8081     │ │  :8082     │ │  :8083     │                │
│  └─────┬──────┘ └─────┬──────┘ └─────┬──────┘                │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐                │
│  │  Tracking  │ │Notification│ │   Config   │                │
│  │  Service   │ │  Service   │ │  Server    │                │
│  │  :8084     │ │  :8085     │ │  :8888     │                │
│  └────────────┘ └────────────┘ └────────────┘                │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │              Discovery Server (Eureka)                   │  │
│  │              Port: 8761                                  │  │
│  │  • Service registration and discovery                  │  │
│  └─────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│                   MESSAGING LAYER                             │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                 Apache Kafka                             │  │
│  │  • Event streaming between services                     │  │
│  │  • Topics: order-events, tracking-events, etc.         │  │
│  └─────────────────────────────────────────────────────────┘  │
├───────────────────────────────────────────────────────────────┤
│                    DATA LAYER                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐               │
│  │ PostgreSQL │ │ PostgreSQL │ │ PostgreSQL │               │
│  │ Identity   │ │  Orders    │ │  Shipping  │               │
│  │  :5433     │ │  :5434     │ │  :5435     │               │
│  └────────────┘ └────────────┘ └────────────┘               │
│  ┌────────────┐ ┌────────────┐                               │
│  │  MongoDB   │ │   Redis    │                               │
│  │  Tracking  │ │   Cache    │                               │
│  │  :27017    │ │  :6379     │                               │
│  └────────────┘ └────────────┘                               │
├───────────────────────────────────────────────────────────────┤
│               OBSERVABILITY LAYER                           │
│  ┌────────────┐ ┌────────────┐                               │
│  │   Zipkin   │ │ Prometheus │                               │
│  │  Tracing   │ │  Metrics   │                               │
│  │  :9411     │ │  :9090     │                               │
│  └────────────┘ └────────────┘                               │
└───────────────────────────────────────────────────────────────┘
```

## Core Workflows

### 1. User Registration & Login Flow

```
User (Web Portal)
    │
    │ POST /api/auth/register
    │ {name, email, password, ...}
    ▼
API Gateway (Port 8080)
    │
    │ Routes to Identity Service
    ▼
Identity Service (Port 8081)
    │
    ├─► Validates input
    ├─► Checks if email exists
    ├─► Hashes password (BCrypt)
    ├─► Saves to PostgreSQL (identity DB)
    ├─► Generates JWT Token
    │
    │ Returns: {token, userId, email, name}
    ▼
User receives token → Stored in localStorage
    │
    │ Subsequent requests include:
    │ Authorization: Bearer <token>
    ▼
All protected endpoints validate JWT
```

### 2. Order Creation Flow (Event-Driven)

```
Logged-in User (Web Portal)
    │
    │ POST /api/orders
    │ {description, weight, addresses, ...}
    │ + Authorization: Bearer <token>
    ▼
API Gateway
    │
    │ Validates JWT
    │ Routes to Order Service
    ▼
Order Service (Port 8082)
    │
    ├─► Validates user token (calls Identity Service)
    ├─► Generates order number (SP1000001)
    ├─► Generates tracking number (TK123456789)
    ├─► Calculates estimated cost
    ├─► Saves to PostgreSQL (orders DB)
    │
    ├─► Publishes Event to Kafka:
    │   Topic: "order-events"
    │   Event: ORDER_CREATED
    │   Data: {orderId, customerId, pickup, delivery, ...}
    │
    │ Returns: Order details with tracking number
    ▼
User sees: "Order created successfully!"
    │
    │ Background Processing:
    ▼
Kafka Message Bus
    │
    ├─► Shipping Service listens to "order-events"
    │
    ▼
Shipping Service (Port 8083)
    │
    ├─► Consumes ORDER_CREATED event
    ├─► Finds available driver near pickup location
    ├─► Assigns driver to order
    ├─► Calculates optimal route
    ├─► Updates order with driverId
    │
    ├─► Publishes Event to Kafka:
    │   Topic: "shipping-events"
    │   Event: DRIVER_ASSIGNED
    │   Data: {orderId, driverId, driverName, eta}
    │
    ▼
Kafka Message Bus
    │
    ├─► Notification Service listens
    │
    ▼
Notification Service (Port 8085)
    │
    ├─► Consumes DRIVER_ASSIGNED event
    ├─► Sends email to customer
    │   "Your order has been assigned to Driver John"
    ├─► Sends SMS with tracking link
    │
    ▼
Customer receives notifications
```

### 3. Real-Time Tracking Flow

```
Driver Mobile App (Future)
    │
    │ Every 30 seconds sends:
    │ POST /api/tracking/update
    │ {orderId, lat, lng, speed, status}
    │ + Driver JWT token
    ▼
API Gateway
    │
    ▼
Tracking Service (Port 8084)
    │
    ├─► Validates driver authorization
    ├─► Stores GPS coordinates in MongoDB
    │   Collection: "tracking_updates"
    │   Document: {
    │     orderId: 123,
    │     location: {type: "Point", coordinates: [lng, lat]},
    │     timestamp: ISODate(),
    │     status: "IN_TRANSIT"
    │   }
    │
    ├─► Publishes Event to Kafka:
    │   Topic: "tracking-events"
    │   Event: LOCATION_UPDATED
    │   Data: {orderId, lat, lng, timestamp}
    │
    │ Returns: Success confirmation
    ▼
Kafka Message Bus
    │
    ├─► Web Portal subscribes via WebSocket
    │
    ▼
Web Portal (React)
    │
    ├─► Receives location update
    ├─► Updates map marker position
    ├─► Updates status display
    │
    ▼
Customer sees driver moving on map in real-time!
```

### 4. Order Status Tracking by Customer

```
Customer (Web Portal)
    │
    │ Enters tracking number: "TK123456789"
    │ OR clicks on order from dashboard
    │
    │ GET /api/tracking/{trackingNumber}
    │ + Customer JWT token
    ▼
API Gateway
    │
    ▼
Tracking Service (Port 8084)
    │
    ├─► Queries MongoDB for tracking data
    │   db.tracking_updates.find({trackingNumber: "TK123456789"})
    │   .sort({timestamp: -1})
    │   .limit(50)
    │
    ├─► Fetches order details from Order Service (via Feign)
    ├─► Fetches driver info from Shipping Service (via Feign)
    │
    │ Returns: {
    │   trackingNumber: "TK123456789",
    │   status: "IN_TRANSIT",
    │   currentLocation: {lat: 40.7128, lng: -74.0060},
    │   driverName: "John Doe",
    │   estimatedDelivery: "2024-02-27T15:00:00Z",
    │   routeHistory: [...],
    │   timeline: [
    │     {status: "ORDER_CREATED", time: "..."},
    │     {status: "DRIVER_ASSIGNED", time: "..."},
    │     {status: "PICKED_UP", time: "..."},
    │     {status: "IN_TRANSIT", time: "..."}
    │   ]
    │ }
    ▼
Web Portal displays:
┌─────────────────────────────────────┐
│  Tracking: TK123456789              │
│  Status: IN_TRANSIT                 │
│                                     │
│  [MAP showing driver location]      │
│                                     │
│  Driver: John Doe                   │
│  Estimated Delivery: Today 3:00 PM  │
│                                     │
│  Timeline:                          │
│  [COMPLETED] Order Created - 9:00 AM         │
│  [COMPLETED] Driver Assigned - 9:15 AM       │
│  [COMPLETED] Picked Up - 10:30 AM            │
│  [IN PROGRESS] In Transit - Current            │
│  [PENDING] Out for Delivery                 │
│  [PENDING] Delivered                        │
└─────────────────────────────────────┘
```

## Database Architecture

### PostgreSQL (Relational Data)

**Identity Database (Port 5433)**
```sql
users table:
- id, first_name, last_name, email, password (hashed)
- phone_number, user_type (CUSTOMER/DRIVER/ADMIN)
- address, city, state, zip_code, country
- is_active, created_at, updated_at
```

**Orders Database (Port 5434)**
```sql
orders table:
- id, customer_id, order_number (unique)
- weight, description, package_type, delivery_type
- pickup_address_* (street, city, state, zip, lat, lng)
- delivery_address_* (street, city, state, zip, lat, lng)
- priority_level, estimated_cost, estimated_delivery_date
- status (PENDING/CONFIRMED/ASSIGNED/IN_TRANSIT/OUT_FOR_DELIVERY/DELIVERED)
- tracking_number, assigned_driver_id
- created_at, updated_at
```

**Shipping Database (Port 5435)**
```sql
drivers table:
- id, user_id (reference to identity), license_number
- vehicle_type, vehicle_plate_number, is_available
- current_latitude, current_longitude, last_location_update
- rating, total_deliveries, created_at, updated_at

shipments table:
- id, order_id (unique), driver_id
- route_optimization (JSON with route data)
- estimated_pickup_time, estimated_delivery_time
- actual_pickup_time, actual_delivery_time
- pickup_confirmed, delivery_confirmed, status
- created_at, updated_at
```

### MongoDB (High-Write GPS Data)

**Tracking Database (Port 27017)**
```javascript
tracking_updates collection:
{
  _id: ObjectId,
  orderId: 123,
  trackingNumber: "TK123456789",
  location: {
    type: "Point",
    coordinates: [-74.0060, 40.7128] // [lng, lat]
  },
  latitude: 40.7128,
  longitude: -74.0060,
  locationDescription: "New York, NY",
  status: "IN_TRANSIT",
  notes: "Moving on I-95",
  timestamp: ISODate("2024-02-27T12:00:00Z"),
  driverId: 5,
  driverName: "John Doe",
  speed: 45.5, // mph
  heading: 180, // degrees
  accuracy: 10 // meters
}

// Geospatial index for location queries
db.tracking_updates.createIndex({"location": "2dsphere"})
```

### Redis (Caching)

**Cache Database (Port 6379)**
```
Key-Value pairs for:
- Active user sessions
- Frequently accessed orders
- Driver availability status
- Rate limiting counters
```

## Service Communication Patterns

### 1. Synchronous (REST/Feign)
Used for immediate data needs:

```java
// Order Service calls Identity Service to validate user
@FeignClient("identity-service")
public interface IdentityClient {
    @GetMapping("/api/auth/validate")
    UserDto validateToken(@RequestHeader("Authorization") String token);
}

// Order Service calls Shipping Service to get driver info
@FeignClient("shipping-service")
public interface ShippingClient {
    @GetMapping("/api/shipping/drivers/{id}")
    DriverDto getDriver(@PathVariable Long id);
}
```

### 2. Asynchronous (Kafka Events)
Used for decoupled processing:

**Event Producers:**
- Order Service → `order-events` topic
- Shipping Service → `shipping-events` topic
- Tracking Service → `tracking-events` topic

**Event Consumers:**
- Shipping Service ← listens to `order-events`
- Notification Service ← listens to all topics
- Tracking Service ← listens to `shipping-events`

## Security Architecture

### Authentication Flow
```
1. User login → Identity Service validates credentials
2. Identity Service generates JWT token
3. Token contains: userId, email, userType, expiration
4. Frontend stores token in localStorage
5. Each request includes: Authorization: Bearer <token>
6. API Gateway validates token signature
7. Services extract user info from token
8. Role-based access control (RBAC) checks permissions
```

### JWT Token Structure
```json
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "123",
  "email": "customer@example.com",
  "userType": "CUSTOMER",
  "iat": 1709030400,
  "exp": 1709116800
}

Signature: HMACSHA256(base64UrlEncode(header) + "." + 
         base64UrlEncode(payload), secret)
```

## Fault Tolerance

### Circuit Breaker Pattern
```
When Notification Service is down:
Order Service → Circuit Breaker detects failure
              → Opens circuit (stops calling)
              → Fallback: Log error, continue without notification
              → Order creation succeeds
              → User gets order confirmation (without email)
              
After 30 seconds:
              → Circuit enters half-open state
              → Test call to Notification Service
              → If success: Close circuit, resume normal flow
              → If failure: Keep circuit open
```

### Service Discovery
```
1. Each service starts and registers with Eureka
2. Eureka tracks: serviceName, instanceId, host, port, health
3. API Gateway asks Eureka: "Where is order-service?"
4. Eureka returns: ["localhost:8082", "localhost:8082"]
5. Gateway load balances between instances
6. If instance fails, Eureka removes from registry
7. Clients automatically switch to healthy instances
```

## Data Consistency

### Eventual Consistency Model
```
Order Creation:
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Order     │────▶│    Kafka    │────▶│   Shipping  │
│   Service   │     │   (Event)   │     │   Service   │
│  (Strong    │     │  (At least  │     │  (Eventual  │
│Consistency) │     │   once)     │     │Consistency) │
└─────────────┘     └─────────────┘     └─────────────┘

User sees order immediately (Order DB is source of truth)
Driver assignment happens asynchronously (may take 1-5 seconds)
```

### Saga Pattern for Distributed Transactions
```
1. Order Service: Create order (local transaction)
2. Publish ORDER_CREATED event
3. Shipping Service: Assign driver (local transaction)
4. If assignment fails:
   - Publish DRIVER_ASSIGNMENT_FAILED event
   - Order Service compensates: Mark order as "FAILED"
   - Notification Service: Notify customer
```

## Monitoring & Observability

### Distributed Tracing with Zipkin
```
Request: POST /api/orders
│
├─► Gateway (traceId: abc123, spanId: gateway-1)
│   └─► Identity Service (parent: gateway-1, spanId: identity-1)
│
├─► Order Service (parent: gateway-1, spanId: order-1)
│   ├─► PostgreSQL (parent: order-1, spanId: db-1)
│   └─► Kafka (parent: order-1, spanId: kafka-1)
│
├─► Shipping Service (async, traceId: abc123)
│   └─► PostgreSQL
│
View in Zipkin UI:
Timeline showing each service call with durations
Total request time: 245ms
├─ Gateway: 15ms
├─ Identity: 45ms
├─ Order Service: 85ms
│  ├─ DB: 25ms
│  └─ Kafka: 15ms
└─ (Async) Shipping: 120ms
```

### Prometheus Metrics
```
# Application metrics
http_requests_total{service="order-service",status="200"} 1500
http_request_duration_seconds_sum{service="order-service"} 45.2

# Business metrics
orders_created_total 523
orders_delivered_total 498
average_delivery_time_minutes 145

# JVM metrics
jvm_memory_used_bytes{area="heap"} 256000000
jvm_gc_collection_seconds_sum 12.5
```

## Key Features Summary

### 1. **Real-Time Tracking**
- Driver sends GPS coordinates every 30 seconds
- Stored in MongoDB with geospatial indexing
- Customer sees live map updates
- Historical route visualization

### 2. **Event-Driven Architecture**
- Kafka handles 10,000+ events/second
- Services are decoupled and independently scalable
- Retry mechanisms for failed events
- Dead letter queues for poison messages

### 3. **High Availability**
- Circuit breakers prevent cascade failures
- Service discovery with Eureka
- Load balancing across instances
- Database per service isolation

### 4. **Security**
- JWT-based authentication
- Role-based access control
- Encrypted passwords (BCrypt)
- API Gateway as security checkpoint

### 5. **Scalability**
- Each service scales independently
- Stateless services (JWT tokens)
- Horizontal scaling with Eureka
- Database connection pooling

## Running the Application

### Step-by-Step Startup:

1. **Start Infrastructure**
```bash
docker-compose up -d
# Starts: Kafka, PostgreSQL x3, MongoDB, Redis, Zipkin, Prometheus
```

2. **Start Services** (in order)
```bash
# Terminal 1: Service Registry
cd infrastructure/discovery-server && mvn spring-boot:run

# Terminal 2: Config Server
cd infrastructure/config-server && mvn spring-boot:run

# Terminal 3: API Gateway
cd infrastructure/api-gateway && mvn spring-boot:run

# Terminal 4: Identity Service
cd services/identity-service && mvn spring-boot:run

# Terminal 5: Order Service
cd services/order-service && mvn spring-boot:run
```

3. **Start Frontend**
```bash
cd web-portal
npm install
npm start
```

4. **Access Application**
- Web Portal: http://localhost:3000
- Register new account
- Login
- Create orders
- Track deliveries

---

**This architecture ensures the application is scalable, fault-tolerant, and maintainable!**
