import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { DashboardPage } from '../page-objects/DashboardPage';
import { OrdersPage } from '../page-objects/OrdersPage';
import { TrackingPage } from '../page-objects/TrackingPage';
import { AuthUtils, TEST_USERS } from '../utils/auth-utils';

// Declare the types for our fixtures
type TestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  ordersPage: OrdersPage;
  trackingPage: TrackingPage;
  authUtils: AuthUtils;
};

// Extend the base test with our fixtures
export const test = base.extend<TestFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },

  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },

  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  },

  authUtils: async ({ page, context }, use) => {
    const authUtils = new AuthUtils(page, context);
    await use(authUtils);
  }
});

// Pre-authenticated fixtures for different user types
export const testWithAdmin = base.extend<TestFixtures & { authenticatedAs: 'admin' }>({
  authenticatedAs: ['admin', { option: true }],
  authUtils: async ({ page, context, authenticatedAs }, use) => {
    const authUtils = new AuthUtils(page, context);
    await authUtils.login(authenticatedAs);
    await use(authUtils);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  }
});

export const testWithCustomer = base.extend<TestFixtures & { authenticatedAs: 'customer' }>({
  authenticatedAs: ['customer', { option: true }],
  authUtils: async ({ page, context, authenticatedAs }, use) => {
    const authUtils = new AuthUtils(page, context);
    await authUtils.login(authenticatedAs);
    await use(authUtils);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  }
});

export const testWithDriver = base.extend<TestFixtures & { authenticatedAs: 'driver' }>({
  authenticatedAs: ['driver', { option: true }],
  authUtils: async ({ page, context, authenticatedAs }, use) => {
    const authUtils = new AuthUtils(page, context);
    await authUtils.login(authenticatedAs);
    await use(authUtils);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  }
});

// Custom test data fixtures
export const testWithOrderData = base.extend<TestFixtures & { orderData: any }>({
  orderData: [{
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    pickupAddress: '123 Pickup St, City, State 12345',
    deliveryAddress: '456 Delivery Ave, City, State 67890',
    packageWeight: '2.5',
    packageDimensions: '10x8x6',
    priority: 'STANDARD'
  }, { option: true }],
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  },
  authUtils: async ({ page, context }, use) => {
    const authUtils = new AuthUtils(page, context);
    await use(authUtils);
  }
});

// Mobile-specific test fixture
export const testMobile = base.extend<TestFixtures & { isMobile: boolean }>({
  isMobile: [true, { option: true }],
  page: async ({ page, isMobile }, use) => {
    if (isMobile) {
      await page.setViewportSize({ width: 375, height: 667 });
    }
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  },
  authUtils: async ({ page, context }, use) => {
    const authUtils = new AuthUtils(page, context);
    await use(authUtils);
  }
});

// Desktop-specific test fixture
export const testDesktop = base.extend<TestFixtures & { isDesktop: boolean }>({
  isDesktop: [true, { option: true }],
  page: async ({ page, isDesktop }, use) => {
    if (isDesktop) {
      await page.setViewportSize({ width: 1200, height: 800 });
    }
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  },
  authUtils: async ({ page, context }, use) => {
    const authUtils = new AuthUtils(page, context);
    await use(authUtils);
  }
});

// Slow motion test fixture for debugging
export const testSlow = base.extend<TestFixtures & { slowMotion: boolean }>({
  slowMotion: [true, { option: true }],
  page: async ({ page, slowMotion }, use) => {
    if (slowMotion) {
      await page.setDefaultTimeout(30000);
      await page.setDefaultNavigationTimeout(60000);
    }
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  ordersPage: async ({ page }, use) => {
    const ordersPage = new OrdersPage(page);
    await use(ordersPage);
  },
  trackingPage: async ({ page }, use) => {
    const trackingPage = new TrackingPage(page);
    await use(trackingPage);
  },
  authUtils: async ({ page, context }, use) => {
    const authUtils = new AuthUtils(page, context);
    await use(authUtils);
  }
});

// Export the base test for backward compatibility
export { expect } from '@playwright/test';
export { TEST_USERS } from '../utils/auth-utils';

// Helper function to create test data
export const createTestData = {
  user: (overrides: any = {}) => ({
    firstName: 'Test',
    lastName: 'User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPassword123!',
    ...overrides
  }),
  
  order: (overrides: any = {}) => ({
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+1234567890',
    pickupAddress: '123 Pickup St, City, State 12345',
    deliveryAddress: '456 Delivery Ave, City, State 67890',
    packageWeight: '2.5',
    packageDimensions: '10x8x6',
    priority: 'STANDARD',
    ...overrides
  }),
  
  tracking: (overrides: any = {}) => ({
    trackingNumber: `TRK${Date.now()}`,
    status: 'IN_TRANSIT',
    estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    ...overrides
  })
};

// Custom matchers for common assertions
export const customMatchers = {
  toBeValidEmail: (received: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);
    return {
      message: () => `expected ${received} to be a valid email address`,
      pass
    };
  },
  
  toBeValidPhone: (received: string) => {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    const pass = phoneRegex.test(received) && received.replace(/\D/g, '').length >= 10;
    return {
      message: () => `expected ${received} to be a valid phone number`,
      pass
    };
  },
  
  toBeValidTrackingNumber: (received: string) => {
    const trackingRegex = /^[A-Z]{3}\d+$/;
    const pass = trackingRegex.test(received);
    return {
      message: () => `expected ${received} to be a valid tracking number`,
      pass
    };
  }
};
