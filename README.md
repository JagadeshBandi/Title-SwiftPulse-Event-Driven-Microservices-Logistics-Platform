# SwiftPulse Logistics Platform

A modern logistics management system built with Java 17 and Spring Boot. This platform helps businesses manage their delivery operations with real-time tracking, automated routing, and comprehensive order management.

## What This Does

SwiftPulse handles the complete delivery workflow from when a customer places an order to when the package reaches their doorstep. It's built as a set of microservices so each part can scale independently and the system stays reliable even if one service has issues.

### The Main Services

**Infrastructure Services**
- **Discovery Server** (Port: 8761) - Keeps track of all running services
- **Config Server** (Port: 8888) - Central configuration management  
- **API Gateway** (Port: 8080) - Single entry point for all client requests

**Business Services**
- **Identity Service** (Port: 8081) - User accounts and authentication
- **Order Service** (Port: 8082) - Order processing and lifecycle management
- **Shipping Service** (Port: 8083) - Driver assignment and route planning
- **Tracking Service** (Port: 8084) - Real-time GPS tracking
- **Notification Service** (Port: 8085) - Email and SMS alerts

**Frontend**
- **Web Portal** (Port: 3000) - React dashboard for customers and staff

## Tech Stack

**Backend**
- Java 17 with Spring Boot 3.2
- Spring Security for authentication
- Spring Data JPA for database access
- Spring Kafka for event messaging
- PostgreSQL for relational data
- MongoDB for GPS tracking data
- Redis for caching

**Frontend**
- React 18 with modern hooks
- Material-UI for clean interface
- Real-time map integration
- Responsive design for mobile

**Infrastructure**
- Docker for containerization
- Maven for builds
- Eureka for service discovery
- Zipkin for distributed tracing
- Prometheus for metrics

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

## How It Works

### Order Processing
When a customer creates an order, here's what happens:
1. Order Service saves the order and sends an ORDER_CREATED event to Kafka
2. Shipping Service picks up the event, finds the nearest driver, and assigns them
3. Notification Service sends confirmation emails and SMS
4. Tracking Service starts monitoring the driver's GPS location

### Real-Time Tracking  
Drivers update their location every 30 seconds via mobile app. The Tracking Service stores these in MongoDB and pushes updates to the web dashboard through WebSockets.

### Security
- JWT tokens for authentication
- Role-based access (Customer, Driver, Admin)
- API Gateway handles all security checks
- Services trust each other through internal tokens

## Project Structure

```
├── common-dto/                    # Shared data models
├── infrastructure/                # Core services
│   ├── discovery-server/          # Eureka service registry
│   ├── config-server/            # Spring Cloud Config
│   └── api-gateway/              # Spring Cloud Gateway
├── services/                      # Business logic
│   ├── identity-service/          # User management
│   ├── order-service/             # Order processing
│   ├── shipping-service/          # Driver management
│   ├── tracking-service/          # GPS tracking
│   └── notification-service/      # Email/SMS
└── web-portal/                   # React frontend
```

## Getting Started

### What You Need
- Java 17 or newer
- Maven 3.8 or newer  
- Docker and Docker Compose
- Git

### Setting Up Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/your-org/swiftpulse-logistics-platform.git
   cd swiftpulse-logistics-platform
   ```

2. **Start the infrastructure**
   ```bash
   docker-compose up -d
   ```
   This spins up Kafka, PostgreSQL, MongoDB, Redis, Zipkin, and Prometheus.

3. **Build everything**
   ```bash
   mvn clean install
   ```

4. **Start the services** (open new terminals for each)
   
   **First the infrastructure services:**
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
   
   **Then the business services:**
   ```bash
   # Terminal 4
   cd services/identity-service
   mvn spring-boot:run
   
   # Terminal 5
   cd services/order-service
   mvn spring-boot:run
   ```

5. **Start the frontend**
   ```bash
   cd web-portal
   npm install
   npm start
   ```

### Where to Access Everything

- **Web App**: http://localhost:3000
- **API Gateway**: http://localhost:8080  
- **Service Registry**: http://localhost:8761
- **Config Server**: http://localhost:8888
- **Zipkin Tracing**: http://localhost:9411
- **Prometheus Metrics**: http://localhost:9090

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

## Development Notes

### Database Setup
Each service has its own database:
- Identity Service: PostgreSQL on port 5433
- Order Service: PostgreSQL on port 5434  
- Shipping Service: PostgreSQL on port 5435
- Tracking Service: MongoDB on port 27017

### Common Issues
- If services can't find each other, make sure Eureka is running first
- Database connection errors usually mean Docker isn't running
- Kafka needs to be running before starting business services
- Check the application.yml files for local configuration overrides

### Debugging Tips
- Use Zipkin (http://localhost:9411) to trace requests across services
- Prometheus (http://localhost:9090) shows system metrics
- Each service has health endpoints at /actuator/health
- Logs show up in the console when running services locally

## Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test locally
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Style
- Follow Java 17 conventions
- Keep methods small and focused
- Add comments for complex logic
- Update documentation when adding new features

### Testing
- Test your changes locally before submitting
- Make sure all services still start correctly
- Check that the frontend still connects to the APIs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with passion by the SwiftPulse team
