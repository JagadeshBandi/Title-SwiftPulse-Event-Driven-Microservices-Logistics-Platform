# SwiftPulse E2E Testing with Playwright

This directory contains comprehensive end-to-end tests for the SwiftPulse Logistics Platform using Playwright.

## Quick Start

### Prerequisites
- Node.js 18+ 
- All SwiftPulse services running (see main README)
- Docker infrastructure running

### Installation
```bash
cd web-portal
npm install
npx playwright install
```

### Running Tests

#### Run all tests
```bash
npm run test:e2e
```

#### Run tests with UI
```bash
npm run test:e2e:ui
```

#### Run tests in headed mode
```bash
npm run test:e2e:headed
```

#### Run tests in debug mode
```bash
npm run test:e2e:debug
```

#### Generate tests with codegen
```bash
npm run test:e2e:codegen
```

## 📁 Test Structure

```
tests/
├── api/                    # API integration tests
│   ├── api-client.ts      # API client utility
│   └── api-integration.spec.ts
├── e2e/                    # End-to-end tests
│   ├── auth/
│   │   └── login.spec.ts
│   ├── orders/
│   │   └── order-management.spec.ts
│   └── tracking/
│       └── tracking.spec.ts
├── fixtures/               # Test fixtures and data
│   └── test-fixtures.ts
├── page-objects/          # Page Object Models
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── OrdersPage.ts
│   └── TrackingPage.ts
├── utils/                  # Test utilities
│   └── auth-utils.ts
├── visual/                 # Visual regression tests
│   └── visual-regression.spec.ts
├── global-setup.ts         # Global test setup
├── global-teardown.ts      # Global test teardown
└── README.md               # This file
```

## 🎯 Test Categories

### 1. Authentication Tests (`e2e/auth/`)
- Login functionality
- Registration process
- Session management
- Password reset
- Role-based access

### 2. Order Management Tests (`e2e/orders/`)
- Order creation
- Order listing and filtering
- Order updates
- Order deletion
- Bulk operations

### 3. Tracking Tests (`e2e/tracking/`)
- Package tracking
- Map integration
- Timeline display
- Real-time updates
- Mobile tracking

### 4. API Integration Tests (`api/`)
- Authentication endpoints
- Order CRUD operations
- Tracking endpoints
- Admin functions
- Error handling

### 5. Visual Regression Tests (`visual/`)
- Cross-browser consistency
- Responsive design
- Component snapshots
- Dark mode
- Accessibility

## 🔧 Configuration

### Playwright Config (`playwright.config.ts`)
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile and desktop viewports
- Reporting (HTML, JSON, JUnit)
- Parallel execution
- Screenshot/video on failure

### Test Fixtures
- Pre-configured user accounts
- Order data templates
- Authentication utilities
- Page objects

### Environment Variables
```bash
# Test environment
NODE_ENV=test

# Base URLs
BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:8080

# Test credentials
ADMIN_EMAIL=testadmin@swiftpulse.com
ADMIN_PASSWORD=testpass123
CUSTOMER_EMAIL=testcustomer@swiftpulse.com
CUSTOMER_PASSWORD=testpass123
```

## 📊 Reporting

### HTML Report
```bash
npm run test:e2e
# View report: npx playwright show-report
```

### Coverage
```bash
# Generate coverage report
npm run test:e2e -- --coverage
```

### Visual Reports
Visual regression tests generate screenshots in `test-results/screenshots/`

## 🎨 Page Object Model

The test suite uses the Page Object Model pattern for maintainable tests:

### BasePage
Common utilities and methods shared across all pages.

### LoginPage
Authentication-related interactions and assertions.

### DashboardPage
Main dashboard functionality and user info.

### OrdersPage
Order management operations and data validation.

### TrackingPage
Package tracking and map interactions.

## 🔐 Test Users

### Default Test Users
- **Admin**: `testadmin@swiftpulse.com` / `testpass123`
- **Customer**: `testcustomer@swiftpulse.com` / `testpass123`
- **Driver**: `testdriver@swiftpulse.com` / `testpass123`

### Creating Test Users
```typescript
import { AuthUtils } from '../utils/auth-utils';

const newUser = AuthUtils.generateTestUser('CUSTOMER');
await authUtils.register(newUser);
```

## 📱 Mobile Testing

Tests run on multiple viewports:
- **Mobile**: 375x667 (iPhone)
- **Tablet**: 768x1024 (iPad)
- **Desktop**: 1200x800

### Mobile-Specific Tests
- Touch interactions
- Responsive layouts
- Mobile navigation
- Performance on slower connections

## 🌐 Cross-Browser Testing

Tests run on:
- **Chrome/Chromium** (latest)
- **Firefox** (latest)
- **Safari/WebKit** (latest)
- **Microsoft Edge** (latest)

### Browser-Specific Tests
- CSS compatibility
- JavaScript behavior
- Feature detection
- Performance variations

## 🔍 Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```
- Pauses execution at each step
- Opens browser inspector
- Allows step-by-step execution

### VS Code Integration
Install Playwright VS Code extension for:
- Test discovery
- Run/debug tests
- Test explorer
- Code completion

### Trace Viewer
```bash
# Run tests with trace
npm run test:e2e -- --trace on

# View trace
npx playwright show-trace trace.zip
```

## 📈 Performance Testing

### Load Testing
```bash
# Run with multiple workers
npm run test:e2e -- --workers 4
```

### Performance Metrics
- Page load times
- API response times
- Resource usage
- Memory consumption

## 🎯 Best Practices

### Test Organization
- Group related tests in `describe` blocks
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)
- Keep tests independent

### Data Management
- Use test fixtures for consistent data
- Clean up test data after tests
- Use deterministic test data
- Avoid hardcoded values

### Error Handling
- Test both success and failure scenarios
- Validate error messages
- Test edge cases
- Handle network failures

### Maintenance
- Regular test review
- Update locators when UI changes
- Keep page objects updated
- Monitor test flakiness

## 🚨 Common Issues

### Test Flakiness
- Use proper waits (`waitForSelector`)
- Avoid fixed timeouts
- Handle async operations
- Check element states

### Network Issues
- Test offline scenarios
- Handle slow connections
- Mock external services
- Retry failed requests

### Environment Issues
- Ensure all services are running
- Check database connectivity
- Verify Docker containers
- Clear browser state

## 📝 Writing New Tests

### 1. Create Page Object (if needed)
```typescript
export class NewPage extends BasePage {
  constructor(page: Page) {
    super(page);
    // Define locators
  }
  
  async performAction(): Promise<void> {
    // Define actions
  }
}
```

### 2. Write Test
```typescript
import { test } from '../fixtures/test-fixtures';

test('should perform new functionality', async ({ newPage }) => {
  await newPage.goto();
  await newPage.performAction();
  // Assertions
});
```

### 3. Add Fixtures (if needed)
```typescript
export const testWithNewFeature = base.extend<TestFixtures & { newFeature: any }>({
  newFeature: [defaultValue, { option: true }],
  // ... other fixtures
});
```

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
- name: Run E2E Tests
  run: |
    npm run test:e2e
    npm run test:e2e -- --reporter=junit
```

### Docker
```dockerfile
FROM mcr.microsoft.com/playwright:v1.40.0
COPY . /app
WORKDIR /app/web-portal
RUN npm install && npx playwright install
CMD ["npm", "run", "test:e2e"]
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [Reporting Guide](https://playwright.dev/docs/test-reporters)

## 🤝 Contributing

1. Follow existing test patterns
2. Add page objects for new pages
3. Include both positive and negative tests
4. Update documentation
5. Run tests before submitting

## 📞 Support

For questions or issues:
- Check Playwright documentation
- Review existing tests for examples
- Contact the testing team
- Create an issue in the repository
