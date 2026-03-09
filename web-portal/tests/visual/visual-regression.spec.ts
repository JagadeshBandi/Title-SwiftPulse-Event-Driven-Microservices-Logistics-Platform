import { test, expect } from '../fixtures/test-fixtures';
import { TEST_USERS } from '../utils/auth-utils';

test.describe('Visual Regression Tests', () => {
  test.describe('Authentication Pages', () => {
    test('should match login page screenshot', async ({ page }) => {
      await page.goto('/login');
      
      await expect(page.locator('body')).toHaveScreenshot('login-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match registration page screenshot', async ({ page }) => {
      await page.goto('/login');
      await page.click('a:has-text("Register"), button:has-text("Sign Up")');
      
      await expect(page.locator('body')).toHaveScreenshot('registration-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match login page with validation errors', async ({ page }) => {
      await page.goto('/login');
      await page.click('button[type="submit"]');
      
      // Wait for validation errors to appear
      await page.waitForSelector('.error, .validation-error');
      
      await expect(page.locator('body')).toHaveScreenshot('login-validation-errors.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Dashboard Visual Tests', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should match admin dashboard screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('admin-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match customer dashboard screenshot', async ({ page, authUtils }) => {
      await authUtils.login('customer');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('customer-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match dashboard with charts', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Wait for charts to render
      await page.waitForSelector('canvas, svg', { timeout: 10000 });
      
      await expect(page.locator('body')).toHaveScreenshot('dashboard-with-charts.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match dashboard with notifications', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Open notifications
      const notificationButton = page.locator('button[aria-label*="notification"], .notification-bell');
      if (await notificationButton.isVisible()) {
        await notificationButton.click();
        await page.waitForSelector('.notifications-dropdown');
        
        await expect(page.locator('body')).toHaveScreenshot('dashboard-notifications.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Orders Page Visual Tests', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should match orders list screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('orders-list.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match create order modal screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      // Open create order modal
      await page.click('button:has-text("Create Order")');
      await page.waitForSelector('[data-testid="create-order-modal"]');
      
      await expect(page.locator('body')).toHaveScreenshot('create-order-modal.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match order details screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      // Click on first order if available
      const orderItems = page.locator('[data-testid="order-item"]');
      if (await orderItems.count() > 0) {
        await orderItems.first().click();
        await page.waitForLoadState('networkidle');
        
        await expect(page.locator('body')).toHaveScreenshot('order-details.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });

    test('should match filtered orders screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      // Apply filter
      const statusFilter = page.locator('select[name="statusFilter"], .status-filter');
      if (await statusFilter.isVisible()) {
        await statusFilter.selectOption('PENDING');
        await page.waitForTimeout(1000);
        
        await expect(page.locator('body')).toHaveScreenshot('filtered-orders.png', {
          fullPage: true,
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Tracking Page Visual Tests', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    test('should match tracking page screenshot', async ({ page, authUtils }) => {
      await authUtils.login('customer');
      await page.goto('/tracking');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('tracking-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tracking results screenshot', async ({ page, authUtils }) => {
      await authUtils.login('customer');
      await page.goto('/tracking');
      await page.waitForLoadState('networkidle');
      
      // Track a package
      await page.fill('input[name="tracking"], input[placeholder*="tracking"]', 'TRK123456789');
      await page.click('button:has-text("Track")');
      await page.waitForSelector('[data-testid="tracking-info"]');
      
      await expect(page.locator('body')).toHaveScreenshot('tracking-results.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tracking with map screenshot', async ({ page, authUtils }) => {
      await authUtils.login('customer');
      await page.goto('/tracking');
      await page.waitForLoadState('networkidle');
      
      // Track a package
      await page.fill('input[name="tracking"], input[placeholder*="tracking"]', 'TRK123456789');
      await page.click('button:has-text("Track")');
      await page.waitForSelector('[data-testid="tracking-info"]');
      
      // Wait for map to load if present
      await page.waitForTimeout(2000);
      
      await expect(page.locator('body')).toHaveScreenshot('tracking-with-map.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tracking timeline screenshot', async ({ page, authUtils }) => {
      await authUtils.login('customer');
      await page.goto('/tracking');
      await page.waitForLoadState('networkidle');
      
      // Track a package
      await page.fill('input[name="tracking"], input[placeholder*="tracking"]', 'TRK123456789');
      await page.click('button:has-text("Track")');
      await page.waitForSelector('[data-testid="tracking-info"]');
      
      // Wait for timeline
      await page.waitForSelector('[data-testid="timeline"]', { timeout: 5000 });
      
      await expect(page.locator('body')).toHaveScreenshot('tracking-timeline.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Responsive Design Visual Tests', () => {
    test('should match mobile login page screenshot', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto('/login');
      
      await expect(page.locator('body')).toHaveScreenshot('mobile-login.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match mobile dashboard screenshot', async ({ page, authUtils }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await authUtils.login('customer');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('mobile-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match mobile orders page screenshot', async ({ page, authUtils }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('mobile-orders.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match tablet dashboard screenshot', async ({ page, authUtils }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('tablet-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match wide desktop screenshot', async ({ page, authUtils }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('wide-desktop-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Component Visual Tests', () => {
    test('should match navigation bar screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      const navigation = page.locator('nav, [data-testid="navigation"]');
      await expect(navigation).toHaveScreenshot('navigation-bar.png', {
        animations: 'disabled'
      });
    });

    test('should match order card component screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      await page.waitForLoadState('networkidle');
      
      const orderCards = page.locator('[data-testid="order-card"], .order-card');
      if (await orderCards.count() > 0) {
        await expect(orderCards.first()).toHaveScreenshot('order-card.png', {
          animations: 'disabled'
        });
      }
    });

    test('should match stats cards screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      const statsCards = page.locator('[data-testid="stats"], .stats-card');
      if (await statsCards.count() > 0) {
        await expect(statsCards.first()).toHaveScreenshot('stats-card.png', {
          animations: 'disabled'
        });
      }
    });

    test('should match form components screenshot', async ({ page }) => {
      await page.goto('/login');
      
      const loginForm = page.locator('form');
      await expect(loginForm).toHaveScreenshot('login-form.png', {
        animations: 'disabled'
      });
    });

    test('should match button states screenshot', async ({ page }) => {
      await page.goto('/login');
      
      // Normal state
      const loginButton = page.locator('button[type="submit"]');
      await expect(loginButton).toHaveScreenshot('button-normal.png', {
        animations: 'disabled'
      });
      
      // Hover state
      await loginButton.hover();
      await expect(loginButton).toHaveScreenshot('button-hover.png', {
        animations: 'disabled'
      });
      
      // Focus state
      await loginButton.focus();
      await expect(loginButton).toHaveScreenshot('button-focus.png', {
        animations: 'disabled'
      });
    });

    test('should match input field states screenshot', async ({ page }) => {
      await page.goto('/login');
      
      const emailInput = page.locator('input[name="email"]');
      
      // Normal state
      await expect(emailInput).toHaveScreenshot('input-normal.png', {
        animations: 'disabled'
      });
      
      // Focus state
      await emailInput.focus();
      await expect(emailInput).toHaveScreenshot('input-focus.png', {
        animations: 'disabled'
      });
      
      // Filled state
      await emailInput.fill('test@example.com');
      await expect(emailInput).toHaveScreenshot('input-filled.png', {
        animations: 'disabled'
      });
      
      // Error state
      await page.click('button[type="submit"]');
      await page.waitForSelector('.error, .validation-error');
      await expect(emailInput).toHaveScreenshot('input-error.png', {
        animations: 'disabled'
      });
    });
  });

  test.describe('Dark Mode Visual Tests', () => {
    test('should match dark mode dashboard screenshot', async ({ page, authUtils }) => {
      // Enable dark mode if available
      await page.emulateMedia({ colorScheme: 'dark' });
      
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('dark-mode-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match dark mode login page screenshot', async ({ page }) => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.goto('/login');
      
      await expect(page.locator('body')).toHaveScreenshot('dark-mode-login.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('High Contrast Visual Tests', () => {
    test('should match high contrast mode screenshot', async ({ page, authUtils }) => {
      // Enable high contrast mode
      await page.emulateMedia({ reducedMotion: 'reduce', forcedColors: 'active' });
      
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot('high-contrast-dashboard.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Loading States Visual Tests', () => {
    test('should match loading spinner screenshot', async ({ page }) => {
      await page.goto('/login');
      
      // Simulate loading state
      await page.evaluate(() => {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);';
        document.body.appendChild(spinner);
      });
      
      await expect(page.locator('.loading-spinner')).toHaveScreenshot('loading-spinner.png', {
        animations: 'disabled'
      });
    });

    test('should match skeleton loading screenshot', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.goto('/orders');
      
      // Wait for skeleton loaders if present
      await page.waitForTimeout(1000);
      
      const skeletonLoaders = page.locator('.skeleton, .skeleton-loader');
      if (await skeletonLoaders.count() > 0) {
        await expect(skeletonLoaders.first()).toHaveScreenshot('skeleton-loader.png', {
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Error States Visual Tests', () => {
    test('should match error page screenshot', async ({ page }) => {
      // Navigate to non-existent page
      await page.goto('/non-existent-page');
      
      await expect(page.locator('body')).toHaveScreenshot('error-page.png', {
        fullPage: true,
        animations: 'disabled'
      });
    });

    test('should match network error screenshot', async ({ page }) => {
      await page.goto('/login');
      
      // Simulate network error
      await page.context().setOffline(true);
      await page.click('button[type="submit"]');
      
      await expect(page.locator('body')).toHaveScreenshot('network-error.png', {
        fullPage: true,
        animations: 'disabled'
      });
      
      await page.context().setOffline(false);
    });
  });

  test.describe('Animation and Transition Visual Tests', () => {
    test('should match hover states screenshot', async ({ page }) => {
      await page.goto('/login');
      
      const loginButton = page.locator('button[type="submit"]');
      await loginButton.hover();
      
      await expect(loginButton).toHaveScreenshot('button-hover-state.png', {
        animations: 'disabled'
      });
    });

    test('should match focus states screenshot', async ({ page }) => {
      await page.goto('/login');
      
      const emailInput = page.locator('input[name="email"]');
      await emailInput.focus();
      
      await expect(emailInput).toHaveScreenshot('input-focus-state.png', {
        animations: 'disabled'
      });
    });
  });

  test.describe('Cross-Browser Visual Tests', () => {
    // These tests will run in different browsers based on the Playwright configuration
    test('should match visual appearance across browsers', async ({ page, authUtils, browserName }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      await expect(page.locator('body')).toHaveScreenshot(`${browserName}-dashboard.png`, {
        fullPage: true,
        animations: 'disabled'
      });
    });
  });

  test.describe('Font and Typography Visual Tests', () => {
    test('should match typography rendering', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      // Focus on text elements
      const headerText = page.locator('h1, h2');
      if (await headerText.count() > 0) {
        await expect(headerText.first()).toHaveScreenshot('header-typography.png', {
          animations: 'disabled'
        });
      }
      
      const bodyText = page.locator('p, .text-body');
      if (await bodyText.count() > 0) {
        await expect(bodyText.first()).toHaveScreenshot('body-typography.png', {
          animations: 'disabled'
        });
      }
    });
  });

  test.describe('Icon and Graphics Visual Tests', () => {
    test('should match icon rendering', async ({ page, authUtils }) => {
      await authUtils.login('admin');
      await page.waitForURL('**/dashboard');
      await page.waitForLoadState('networkidle');
      
      const icons = page.locator('svg, .icon, [data-testid="icon"]');
      if (await icons.count() > 0) {
        await expect(icons.first()).toHaveScreenshot('icon-rendering.png', {
          animations: 'disabled'
        });
      }
    });
  });
});
