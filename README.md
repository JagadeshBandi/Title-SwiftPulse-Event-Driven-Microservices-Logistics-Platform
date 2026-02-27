# SwiftPulse - Event-Driven Microservices Logistics Platform

## Overview

SwiftPulse is a high-performance, distributed logistics management system built using Java 21 and Spring Boot 3. The platform is designed to handle the entire lifecycle of a delivery from order ingestion to real-time geospatial tracking using an asynchronous, event-driven architecture.

## Architecture

### Microservices Architecture

The system follows a microservices architecture with the following components:

#### Infrastructure Services
- **Discovery Server** (Port: 8761) - Netflix Eureka for service registry
- **Config Server** (Port: 8888) - Spring Cloud Config for centralized configuration
- **API Gateway** (Port: 8080) - Spring Cloud Gateway for routing and security

#### Business Services
- **Identity Service** (Port: 8081) - User authentication and authorization with JWT
- **Order Service** (Port: 8082) - Order management and lifecycle
- **Shipping Service** (Port: 8083) - Driver assignment and route optimization
- **Tracking Service** (Port: 8084) - Real-time GPS tracking with MongoDB
- **Notification Service** (Port: 8085) - Email/SMS notifications

#### Frontend
- **Web Portal** (Port: 3000) - React-based web application for users

#### Shared Components
- **Common DTO** - Shared data models and events
- **Docker Compose** - Infrastructure orchestration

## Technology Stack

### Backend Technologies
- **Java 21** - Latest Java with Virtual Threads support
- **Spring Boot 3.2** - Modern Spring framework
- **Spring Cloud 2023** - Microservices orchestration
- **Spring Security 6** - Authentication and authorization
- **Spring Data JPA** - Database abstraction
- **Spring Kafka** - Event streaming

### Database Technologies
- **PostgreSQL** - Primary relational database (Orders, Users, Shipping)
- **MongoDB** - NoSQL for high-write GPS tracking data
- **Redis** - Caching and session management

### Messaging & Communication
- **Apache Kafka** - Event-driven messaging backbone
- **OpenFeign** - Service-to-service communication
- **Resilience4j** - Circuit breaker pattern

### Observability & Monitoring
- **Zipkin** - Distributed tracing
- **Prometheus** - Metrics collection
- **Spring Boot Actuator** - Application monitoring

### Frontend Technologies
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Query** - Server state management
- **React Leaflet** - Map integration
- **Recharts** - Data visualization

### DevOps & Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Local development environment
- **Maven** - Build and dependency management

## Web Portal (Frontend)

The web portal provides a modern React-based user interface for interacting with the SwiftPulse logistics platform.

### Features
- **Dashboard** - Overview with statistics, charts, and recent activity
- **Order Management** - Create, view, and track orders
- **Real-time Tracking** - Live shipment tracking with interactive maps
- **User Authentication** - JWT-based login and registration
- **Responsive Design** - Works on desktop and mobile devices

### Technology Stack
- React 18 with functional components and hooks
- Material-UI (MUI) for modern design components
- React Router for navigation
- Axios for API communication
- React Query for server state management
- React Leaflet for map integration
- Recharts for data visualization

### Running the Web Portal

```bash
cd web-portal
npm install
npm start
```

The web portal will be available at http://localhost:3000

### Web Portal Pages
- **Dashboard** - Main overview with statistics and charts
- **Orders** - List and manage all orders
- **Create Order** - Multi-step form for creating new orders
- **Order Detail** - Detailed view of specific order with timeline
- **Tracking** - Real-time shipment tracking with map view
- **Login/Register** - User authentication

## Key Features

### Event-Driven Architecture
- Asynchronous communication via Kafka topics
- Loose coupling between services
- Event sourcing for audit trails
- Fault-tolerant message processing

### Real-Time Tracking
- GPS coordinate processing with MongoDB geospatial indexing
- WebSocket support for live updates
- High-frequency location updates handling
- Geofencing and route optimization

### Security & Authentication
- JWT-based authentication
- Role-based access control (RBAC)
- API Gateway security filters
- Service-to-service authentication

### Resilience & Scalability
- Circuit breaker patterns with Resilience4j
- Service discovery with Eureka
- Load balancing through Gateway
- Database per service pattern

### Observability
- Distributed tracing with Zipkin
- Metrics with Prometheus
- Centralized logging
- Health checks and monitoring

## Quick Start

### Prerequisites
- Java 21 or higher
- Maven 3.8 or higher
- Docker and Docker Compose
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SwiftPulse-Event-Driven-Microservices-Logistics-Platform
   ```

2. **Start Infrastructure Services**
   ```bash
   docker-compose up -d
   ```
   
   This will start:
   - Kafka (ports 9092, 9101)
   - PostgreSQL databases (ports 5433, 5434, 5435)
   - MongoDB (port 27017)
   - Redis (port 6379)
   - Zipkin (port 9411)
   - Prometheus (port 9090)

3. **Build the Project**
   ```bash
   mvn clean install
   ```

4. **Start Services in Order**
   
   Start infrastructure services first:
   ```bash
   # Terminal 1
   cd infrastructure/discovery-server
   mvn spring-boot:run
   
   # Terminal 2
   cd infrastructure/config-server
   mvn spring-boot:run
   
   # Terminal 3
   cd infrastructure/api-gateway
   mvn spring-boot:run
   ```
   
   Then start business services:
   ```bash
   # Terminal 4
   cd services/identity-service
   mvn spring-boot:run
   
   # Terminal 5
   cd services/order-service
   mvn spring-boot:run
   ```

### Access Points

- **API Gateway**: http://localhost:8080
- **Eureka Dashboard**: http://localhost:8761
- **Config Server**: http://localhost:8888
- **Zipkin**: http://localhost:9411
- **Prometheus**: http://localhost:9090
- **Web Portal**: http://localhost:3000

## Testing

Test cases have been removed from this repository as per project requirements. The testing team will create and maintain comprehensive test suites separately.

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile/{userId}` - Get user profile

### Order Endpoints
- `POST /api/orders` - Create new order
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order
- `GET /api/orders/customer/{customerId}` - Get customer orders

### Tracking Endpoints
- `GET /api/tracking/{trackingNumber}` - Get tracking information
- `POST /api/tracking/update` - Update location
- `GET /api/tracking/live/{orderId}` - Live tracking

## Database Schema

### PostgreSQL Tables
- **users** (Identity Service)
- **orders** (Order Service)
- **drivers, shipments** (Shipping Service)

### MongoDB Collections
- **tracking_updates** (Tracking Service)
- **delivery_sessions** (Tracking Service)

## Event Flow

### Order Processing Flow
1. Customer creates order via API Gateway
2. Order Service validates and saves order
3. Order Service publishes ORDER_CREATED event to Kafka
4. Shipping Service consumes event and assigns driver
5. Shipping Service publishes DRIVER_ASSIGNED event
6. Notification Service sends confirmation email
7. Tracking Service begins GPS monitoring

### Real-Time Tracking Flow
1. Driver app sends GPS coordinates to Tracking Service
2. Tracking Service stores in MongoDB with geospatial indexing
3. Tracking Service publishes LOCATION_UPDATED event
4. WebSocket clients receive live updates
5. Notification Service sends delivery status updates

## Development Guidelines

### Code Standards
- Follow Java 21 best practices
- Use Lombok for boilerplate reduction
- Implement proper error handling
- Use MapStruct for object mapping

### Frontend Development
- Use functional components with hooks
- Follow Material-UI design patterns
- Implement proper form validation
- Handle loading and error states

### Security Considerations
- Never commit secrets to repository
- Use environment variables for configuration
- Implement proper input validation
- Follow OWASP security guidelines

### Performance Optimization
- Use connection pooling for databases
- Implement proper caching strategies
- Optimize Kafka consumer configurations
- Monitor JVM performance metrics

## Monitoring & Alerting

### Key Metrics
- Service response times
- Error rates and types
- Database connection pool usage
- Kafka consumer lag
- JVM memory and CPU usage

### Health Checks
- Database connectivity
- External service availability
- Kafka cluster health
- Disk space usage

## Deployment

### Production Considerations
- Use Kubernetes for orchestration
- Implement proper secret management
- Set up CI/CD pipelines
- Configure backup and disaster recovery
- Implement proper logging aggregation

### Environment Configuration
- Development: Local Docker Compose
- Staging: Kubernetes cluster
- Production: Multi-zone Kubernetes deployment

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Submit pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**SwiftPulse** - Delivering excellence in logistics management through modern microservices architecture.
