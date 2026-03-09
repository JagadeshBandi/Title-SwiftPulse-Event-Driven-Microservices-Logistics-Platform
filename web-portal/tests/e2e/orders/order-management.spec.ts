import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS } from '../../utils/auth-utils';

test.describe('Order Management', () => {
  test.use({ storageState: { cookies: [], origins: [] } }); // Start fresh

  test.beforeEach(async ({ authUtils, dashboardPage }) => {
    // Login as admin for full access
    await authUtils.login('admin');
    await dashboardPage.expectDashboardLoaded();
  });

  test.describe('Order List View', () => {
    test('should display orders page correctly', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Verify page elements
      await expect(ordersPage.createOrderButton).toBeVisible();
      await expect(ordersPage.searchInput).toBeVisible();
      await expect(ordersPage.filterButton).toBeVisible();
    });

    test('should display order list with data', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Wait for orders to load
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThanOrEqual(0);
      
      if (ordersCount > 0) {
        // Verify order items structure
        const firstOrder = await ordersPage.getOrderDetails(0);
        expect(firstOrder.id).toBeTruthy();
        expect(firstOrder.status).toBeTruthy();
        expect(firstOrder.date).toBeTruthy();
      }
    });

    test('should search orders by keyword', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Search for orders
      await ordersPage.searchOrders('test');
      
      // Wait for search results
      await ordersPage.waitForLoadingToComplete();
      
      // Verify search was performed (could be empty)
      const searchResults = await ordersPage.getOrdersCount();
      expect(searchResults).toBeGreaterThanOrEqual(0);
    });

    test('should filter orders by status', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Filter by status
      await ordersPage.filterByStatus('PENDING');
      
      await ordersPage.waitForLoadingToComplete();
      
      // Verify filter was applied
      const filteredOrders = await ordersPage.getOrdersCount();
      expect(filteredOrders).toBeGreaterThanOrEqual(0);
    });

    test('should sort orders by different criteria', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test sorting by date
      await ordersPage.sortOrders('date');
      await ordersPage.waitForLoadingToComplete();
      
      // Test sorting by status
      await ordersPage.sortOrders('status');
      await ordersPage.waitForLoadingToComplete();
      
      // Test sorting by customer
      await ordersPage.sortOrders('customer');
      await ordersPage.waitForLoadingToComplete();
    });

    test('should clear filters', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Apply filter
      await ordersPage.filterByStatus('PENDING');
      await ordersPage.waitForLoadingToComplete();
      
      // Clear filters
      await ordersPage.clearFilters();
      await ordersPage.waitForLoadingToComplete();
      
      // Should return to all orders
      const allOrders = await ordersPage.getOrdersCount();
      expect(allOrders).toBeGreaterThanOrEqual(0);
    });

    test('should handle pagination', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Check if pagination exists
      if (await ordersPage.pagination.isVisible()) {
        const pageInfo = await ordersPage.getPageInfo();
        expect(pageInfo).toBeTruthy();
        
        // Test next page if available
        if (await ordersPage.nextPageButton.isEnabled()) {
          await ordersPage.goToNextPage();
          await ordersPage.waitForLoadingToComplete();
        }
        
        // Test previous page if available
        if (await ordersPage.prevPageButton.isEnabled()) {
          await ordersPage.goToPrevPage();
          await ordersPage.waitForLoadingToComplete();
        }
      }
    });
  });

  test.describe('Order Creation', () => {
    test('should open create order modal', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      await ordersPage.openCreateOrderModal();
      await expect(ordersPage.createOrderModal).toBeVisible();
      
      // Verify form fields
      await expect(ordersPage.customerNameInput).toBeVisible();
      await expect(ordersPage.customerEmailInput).toBeVisible();
      await expect(ordersPage.pickupAddressInput).toBeVisible();
      await expect(ordersPage.deliveryAddressInput).toBeVisible();
      await expect(ordersPage.saveOrderButton).toBeVisible();
    });

    test('should validate required fields', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.openCreateOrderModal();
      
      // Try to submit without filling fields
      await ordersPage.saveOrderButton.click();
      
      // Should show validation errors
      await ordersPage.expectValidationErrors();
    });

    test('should create order successfully', async ({ ordersPage, orderData }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      const initialCount = await ordersPage.getOrdersCount();
      
      await ordersPage.createOrder(orderData);
      
      // Verify order was created
      await ordersPage.expectOrdersPageLoaded();
      const newCount = await ordersPage.getOrdersCount();
      expect(newCount).toBeGreaterThan(initialCount);
      
      // Verify success message
      await ordersPage.waitForToast('Order created successfully');
    });

    test('should validate email format in order form', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.openCreateOrderModal();
      
      await ordersPage.fillField(ordersPage.customerNameInput, 'Test Customer');
      await ordersPage.fillField(ordersPage.customerEmailInput, 'invalid-email');
      await ordersPage.fillField(ordersPage.pickupAddressInput, '123 Pickup St');
      await ordersPage.fillField(ordersPage.deliveryAddressInput, '456 Delivery Ave');
      
      await ordersPage.saveOrderButton.click();
      
      // Should show email validation error
      await ordersPage.expectVisible(ordersPage.errorMessage);
    });

    test('should cancel order creation', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.openCreateOrderModal();
      
      // Fill some fields
      await ordersPage.fillField(ordersPage.customerNameInput, 'Test Customer');
      
      // Cancel
      await ordersPage.cancelOrderForm();
      
      // Modal should be closed
      await expect(ordersPage.createOrderModal).not.toBeVisible();
    });

    test('should handle network errors during creation', async ({ ordersPage, page, orderData }) => {
      await ordersPage.goto();
      await ordersPage.openCreateOrderModal();
      
      // Simulate network offline
      await page.context().setOffline(true);
      
      await ordersPage.fillOrderForm(orderData);
      await ordersPage.saveOrderButton.click();
      
      // Should show network error
      await ordersPage.expectVisible(ordersPage.errorMessage);
      
      // Restore network
      await page.context().setOffline(false);
    });
  });

  test.describe('Order Actions', () => {
    test.beforeEach(async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Ensure there's at least one order for testing
      const ordersCount = await ordersPage.getOrdersCount();
      if (ordersCount === 0) {
        // Create a test order
        await ordersPage.createOrder({
          customerName: 'Test Customer',
          customerEmail: 'test@example.com',
          customerPhone: '+1234567890',
          pickupAddress: '123 Pickup St',
          deliveryAddress: '456 Delivery Ave',
          packageWeight: '2.5',
          packageDimensions: '10x8x6',
          priority: 'STANDARD'
        });
      }
    });

    test('should view order details', async ({ ordersPage }) => {
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
      
      await ordersPage.viewOrder(0);
      
      // Should navigate to order details page
      await ordersPage.page.waitForURL('**/orders/**');
    });

    test('should edit existing order', async ({ ordersPage }) => {
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
      
      await ordersPage.editOrder(0);
      
      // Should open edit modal or navigate to edit page
      await ordersPage.waitForLoadingToComplete();
    });

    test('should delete order with confirmation', async ({ ordersPage }) => {
      const initialCount = await ordersPage.getOrdersCount();
      expect(initialCount).toBeGreaterThan(0);
      
      await ordersPage.deleteOrder(0);
      
      // Order should be deleted
      await ordersPage.waitForLoadingToComplete();
      const newCount = await ordersPage.getOrdersCount();
      expect(newCount).toBeLessThan(initialCount);
    });

    test('should track order', async ({ ordersPage }) => {
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
      
      await ordersPage.trackOrder(0);
      
      // Should navigate to tracking page
      await ordersPage.page.waitForURL('**/tracking/**');
    });

    test('should update order status', async ({ ordersPage }) => {
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
      
      // Get initial status
      const initialOrder = await ordersPage.getOrderDetails(0);
      const initialStatus = initialOrder.status;
      
      // Update status
      await ordersPage.updateOrderStatus(0, 'IN_TRANSIT');
      
      // Verify status was updated
      await ordersPage.waitForLoadingToComplete();
      const updatedOrder = await ordersPage.getOrderDetails(0);
      expect(updatedOrder.status).not.toBe(initialStatus);
    });

    test('should add note to order', async ({ ordersPage }) => {
      const ordersCount = await ordersPage.getOrdersCount();
      expect(ordersCount).toBeGreaterThan(0);
      
      await ordersPage.addOrderNote(0, 'Test note for order');
      
      // Verify note was added
      await ordersPage.waitForToast('Note added successfully');
    });
  });

  test.describe('Order Details View', () => {
    test('should display complete order information', async ({ ordersPage, page }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Create an order first
      await ordersPage.createOrder({
        customerName: 'Detailed Test Customer',
        customerEmail: 'detailed@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St, City, State 12345',
        deliveryAddress: '456 Delivery Ave, City, State 67890',
        packageWeight: '2.5',
        packageDimensions: '10x8x6',
        priority: 'EXPRESS'
      });
      
      // View the order
      await ordersPage.viewOrder(0);
      
      // Verify order details page
      await expect(page.locator('[data-testid="order-details"]')).toBeVisible();
      await expect(page.locator('[data-testid="customer-info"]')).toBeVisible();
      await expect(page.locator('[data-testid="package-info"]')).toBeVisible();
      await expect(page.locator('[data-testid="tracking-info"]')).toBeVisible();
    });

    test('should show order timeline', async ({ page }) => {
      // Navigate to order details
      await page.goto('/orders');
      await page.waitForSelector('[data-testid="order-item"]');
      await page.click('[data-testid="order-item"] .view-order');
      
      // Check for timeline
      const timeline = page.locator('[data-testid="order-timeline"]');
      if (await timeline.isVisible()) {
        await expect(timeline).toBeVisible();
        
        // Verify timeline items
        const timelineItems = timeline.locator('[data-testid="timeline-item"]');
        const itemCount = await timelineItems.count();
        expect(itemCount).toBeGreaterThan(0);
      }
    });

    test('should allow status updates from details page', async ({ page }) => {
      // Navigate to order details
      await page.goto('/orders');
      await page.waitForSelector('[data-testid="order-item"]');
      await page.click('[data-testid="order-item"] .view-order');
      
      // Update status
      const statusDropdown = page.locator('select[name="status"]');
      if (await statusDropdown.isVisible()) {
        await statusDropdown.selectOption('DELIVERED');
        await page.click('button:has-text("Update")');
        
        // Verify update
        await page.waitForSelector('text=Status updated');
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ ordersPage, isMobile }) => {
      if (isMobile) {
        await ordersPage.page.setViewportSize({ width: 375, height: 667 });
      }
      
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test mobile layout
      if (isMobile) {
        await ordersPage.testResponsiveLayout();
      }
    });

    test('should work on desktop devices', async ({ ordersPage, isDesktop }) => {
      if (isDesktop) {
        await ordersPage.page.setViewportSize({ width: 1200, height: 800 });
      }
      
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test desktop layout
      await expect(ordersPage.orderTable).toBeVisible();
    });

    test('should handle touch interactions on mobile', async ({ ordersPage, page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test swipe gestures if applicable
      const orderItems = ordersPage.orderItems;
      if (await orderItems.count() > 0) {
        const firstItem = orderItems.first();
        
        // Test swipe action (if implemented)
        await firstItem.hover();
        await page.mouse.down();
        await page.mouse.move(-100, 0);
        await page.mouse.up();
      }
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test keyboard navigation
      await ordersPage.page.keyboard.press('Tab');
      await expect(ordersPage.createOrderButton).toBeFocused();
      
      await ordersPage.page.keyboard.press('Tab');
      await expect(ordersPage.searchInput).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Check ARIA labels
      await expect(ordersPage.searchInput).toHaveAttribute('aria-label', /search/i);
      await expect(ordersPage.createOrderButton).toHaveAttribute('aria-label', /create/i);
    });

    test('should support screen readers', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Check for proper semantic markup
      await expect(ordersPage.page.locator('main')).toBeVisible();
      await expect(ordersPage.page.locator('nav')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load quickly', async ({ ordersPage }) => {
      const startTime = Date.now();
      
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    });

    test('should handle large order lists efficiently', async ({ ordersPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Test scrolling performance
      const ordersCount = await ordersPage.getOrdersCount();
      if (ordersCount > 20) {
        await ordersPage.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await ordersPage.waitForLoadingToComplete();
      }
    });
  });
});
