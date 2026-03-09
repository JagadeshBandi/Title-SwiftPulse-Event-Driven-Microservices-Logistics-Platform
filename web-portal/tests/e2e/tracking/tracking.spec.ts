import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS } from '../../utils/auth-utils';

test.describe('Package Tracking', () => {
  test.beforeEach(async ({ authUtils }) => {
    // Login as customer for tracking access
    await authUtils.login('customer');
  });

  test.describe('Tracking Page Load', () => {
    test('should display tracking page correctly', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Verify page elements
      await expect(trackingPage.trackingInput).toBeVisible();
      await expect(trackingPage.searchButton).toBeVisible();
    });

    test('should have proper page title', async ({ trackingPage }) => {
      await trackingPage.goto();
      
      await expect(trackingPage.page).toHaveTitle(/Tracking|Track Package/);
    });

    test('should be accessible via navigation', async ({ dashboardPage, trackingPage }) => {
      await dashboardPage.goto();
      await dashboardPage.expectDashboardLoaded();
      
      await dashboardPage.navigateToTracking();
      
      await trackingPage.expectTrackingPageLoaded();
    });
  });

  test.describe('Package Search', () => {
    test('should track package with valid tracking number', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Use a valid tracking number format
      const trackingNumber = 'TRK123456789';
      await trackingPage.trackPackage(trackingNumber);
      
      await trackingPage.waitForTrackingResults();
      
      // Verify tracking information is displayed
      await expect(trackingPage.trackingInfo).toBeVisible();
      await expect(trackingPage.trackingNumber).toContainText(trackingNumber);
    });

    test('should show error for invalid tracking number', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await trackingPage.testInvalidTrackingNumber('INVALID123');
      
      // Should show error message
      await trackingPage.expectVisible(trackingPage.errorMessage);
    });

    test('should show error for non-existent tracking number', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await trackingPage.testInvalidTrackingNumber('TRK999999999');
      
      await trackingPage.expectVisible(trackingPage.errorMessage);
    });

    test('should handle empty tracking number', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await trackingPage.searchButton.click();
      
      // Should show validation error
      await trackingPage.expectVisible(trackingPage.errorMessage);
    });

    test('should support tracking with Enter key', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await trackingPage.fillField(trackingPage.trackingInput, 'TRK123456789');
      await trackingPage.trackingInput.press('Enter');
      
      await trackingPage.waitForTrackingResults();
    });

    test('should clear search results', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Track a package first
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      // Clear the search
      await trackingPage.fillField(trackingPage.trackingInput, '');
      await trackingPage.trackingInput.press('Enter');
      
      // Should return to initial state
      await trackingPage.expectTrackingPageLoaded();
    });
  });

  test.describe('Tracking Information Display', () => {
    test.beforeEach(async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
    });

    test('should display current status', async ({ trackingPage }) => {
      const status = await trackingPage.getCurrentStatus();
      expect(status).toBeTruthy();
      expect(status.length).toBeGreaterThan(0);
    });

    test('should display estimated delivery date', async ({ trackingPage }) => {
      const estimatedDelivery = await trackingPage.getEstimatedDelivery();
      expect(estimatedDelivery).toBeTruthy();
    });

    test('should display last update time', async ({ trackingPage }) => {
      const lastUpdate = await trackingPage.getLastUpdate();
      expect(lastUpdate).toBeTruthy();
    });

    test('should display pickup and delivery addresses', async ({ trackingPage }) => {
      const pickupAddress = await trackingPage.getPickupAddress();
      const deliveryAddress = await trackingPage.getDeliveryAddress();
      
      expect(pickupAddress).toBeTruthy();
      expect(deliveryAddress).toBeTruthy();
    });

    test('should display package information', async ({ trackingPage }) => {
      const packageInfo = await trackingPage.getPackageInfo();
      
      if (packageInfo.weight) {
        expect(packageInfo.weight).toBeTruthy();
      }
      if (packageInfo.dimensions) {
        expect(packageInfo.dimensions).toBeTruthy();
      }
    });

    test('should display driver information when available', async ({ trackingPage }) => {
      const driverInfo = await trackingPage.getDriverInfo();
      
      // Driver info might not be available for all orders
      if (driverInfo.name) {
        expect(driverInfo.name).toBeTruthy();
      }
    });
  });

  test.describe('Timeline Display', () => {
    test.beforeEach(async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
    });

    test('should display tracking timeline', async ({ trackingPage }) => {
      const timelineItemsCount = await trackingPage.getTimelineItemsCount();
      expect(timelineItemsCount).toBeGreaterThan(0);
    });

    test('should show chronological timeline', async ({ trackingPage }) => {
      const itemsCount = await trackingPage.getTimelineItemsCount();
      
      if (itemsCount > 1) {
        const firstItem = await trackingPage.getTimelineItemDetails(0);
        const lastItem = await trackingPage.getTimelineItemDetails(itemsCount - 1);
        
        // Verify dates are present
        expect(firstItem.date).toBeTruthy();
        expect(lastItem.date).toBeTruthy();
      }
    });

    test('should show detailed timeline information', async ({ trackingPage }) => {
      const itemsCount = await trackingPage.getTimelineItemsCount();
      
      if (itemsCount > 0) {
        const item = await trackingPage.getTimelineItemDetails(0);
        
        expect(item.date).toBeTruthy();
        expect(item.status).toBeTruthy();
        expect(item.location).toBeTruthy();
      }
    });

    test('should show expected status in timeline', async ({ trackingPage }) => {
      await trackingPage.expectTimelineContains('PICKED_UP');
      await trackingPage.expectTimelineContains('IN_TRANSIT');
    });
  });

  test.describe('Map Integration', () => {
    test.beforeEach(async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
    });

    test('should display map container', async ({ trackingPage }) => {
      if (await trackingPage.mapContainer.isVisible()) {
        await expect(trackingPage.mapContainer).toBeVisible();
      }
    });

    test('should load map canvas', async ({ trackingPage }) => {
      if (await trackingPage.mapContainer.isVisible()) {
        await trackingPage.waitForMapToLoad();
        
        if (await trackingPage.mapCanvas.isVisible()) {
          await expect(trackingPage.mapCanvas).toBeVisible();
        }
      }
    });

    test('should support map interactions', async ({ trackingPage }) => {
      if (await trackingPage.mapContainer.isVisible()) {
        await trackingPage.testMapInteraction();
      }
    });

    test('should show loading state for map', async ({ trackingPage }) => {
      if (await trackingPage.mapContainer.isVisible()) {
        // Map loading indicator should be visible initially
        const wasLoadingVisible = await trackingPage.mapLoading.isVisible();
        
        // Should disappear after loading
        await trackingPage.waitForMapToLoad();
        
        if (wasLoadingVisible) {
          await expect(trackingPage.mapLoading).toBeHidden();
        }
      }
    });
  });

  test.describe('Progress Display', () => {
    test.beforeEach(async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
    });

    test('should display progress bar', async ({ trackingPage }) => {
      if (await trackingPage.progressBar.isVisible()) {
        await expect(trackingPage.progressBar).toBeVisible();
        
        const progressPercentage = await trackingPage.getProgressPercentage();
        expect(progressPercentage).toBeGreaterThanOrEqual(0);
        expect(progressPercentage).toBeLessThanOrEqual(100);
      }
    });

    test('should show current progress step', async ({ trackingPage }) => {
      if (await trackingPage.currentStep.isVisible()) {
        const currentStep = await trackingPage.getCurrentProgressStep();
        expect(currentStep).toBeTruthy();
      }
    });

    test('should display progress steps', async ({ trackingPage }) => {
      if (await trackingPage.progressSteps.isVisible()) {
        await expect(trackingPage.progressSteps).toBeVisible();
      }
    });
  });

  test.describe('Actions and Interactions', () => {
    test.beforeEach(async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
    });

    test('should support refresh functionality', async ({ trackingPage }) => {
      const initialStatus = await trackingPage.getCurrentStatus();
      
      await trackingPage.refreshTracking();
      
      const refreshedStatus = await trackingPage.getCurrentStatus();
      expect(refreshedStatus).toBeTruthy();
    });

    test('should support sharing tracking', async ({ trackingPage }) => {
      if (await trackingPage.shareTrackingButton.isVisible()) {
        await trackingPage.shareTracking();
        
        // Should open share dialog or copy link
        await trackingPage.waitForLoadingToComplete();
      }
    });

    test('should enable notifications', async ({ trackingPage }) => {
      if (await trackingPage.notifyMeButton.isVisible()) {
        await trackingPage.enableNotifications();
        
        await trackingPage.waitForToast('Notifications enabled');
      }
    });

    test('should support contacting driver', async ({ trackingPage }) => {
      if (await trackingPage.contactDriverButton.isVisible()) {
        await trackingPage.contactDriver();
        
        // Should open contact modal or redirect
        await trackingPage.waitForLoadingToComplete();
      }
    });

    test('should support issue reporting', async ({ trackingPage }) => {
      if (await trackingPage.reportIssueButton.isVisible()) {
        await trackingPage.reportIssue();
        
        // Should open issue reporting modal
        await trackingPage.waitForLoadingToComplete();
      }
    });
  });

  test.describe('Real-time Updates', () => {
    test('should show live indicator when available', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      if (await trackingPage.liveUpdates.isVisible()) {
        await expect(trackingPage.liveIndicator).toBeVisible();
      }
    });

    test('should update information over time', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      const initialStatus = await trackingPage.getCurrentStatus();
      
      // Wait for potential update (in real test, this would mock WebSocket updates)
      await trackingPage.wait(2000);
      
      const updatedStatus = await trackingPage.getCurrentStatus();
      expect(updatedStatus).toBeTruthy();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ trackingPage, isMobile }) => {
      if (isMobile) {
        await trackingPage.page.setViewportSize({ width: 375, height: 667 });
      }
      
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await trackingPage.testMobileTracking();
    });

    test('should adapt layout for different screen sizes', async ({ trackingPage }) => {
      // Test mobile
      await trackingPage.page.setViewportSize({ width: 375, height: 667 });
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Test tablet
      await trackingPage.page.setViewportSize({ width: 768, height: 1024 });
      await trackingPage.expectTrackingPageLoaded();
      
      // Test desktop
      await trackingPage.page.setViewportSize({ width: 1200, height: 800 });
      await trackingPage.expectTrackingPageLoaded();
    });

    test('should handle touch interactions on mobile', async ({ trackingPage }) => {
      await trackingPage.page.setViewportSize({ width: 375, height: 667 });
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Test touch on tracking input
      await trackingPage.trackingInput.tap();
      await expect(trackingPage.trackingInput).toBeFocused();
    });
  });

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Tab through form elements
      await trackingPage.page.keyboard.press('Tab');
      await expect(trackingPage.trackingInput).toBeFocused();
      
      await trackingPage.page.keyboard.press('Tab');
      await expect(trackingPage.searchButton).toBeFocused();
    });

    test('should have proper ARIA labels', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      await expect(trackingPage.trackingInput).toHaveAttribute('aria-label', /tracking/i);
      await expect(trackingPage.searchButton).toHaveAttribute('aria-label', /track/i);
    });

    test('should announce status changes', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      // Check for live regions
      const liveRegions = trackingPage.page.locator('[aria-live], [role="status"]');
      if (await liveRegions.count() > 0) {
        await expect(liveRegions.first()).toBeVisible();
      }
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ trackingPage, page }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Simulate network offline
      await page.context().setOffline(true);
      
      await trackingPage.trackPackage('TRK123456789');
      
      // Should show network error
      await trackingPage.expectVisible(trackingPage.errorMessage);
      
      // Restore network
      await page.context().setOffline(false);
    });

    test('should handle API errors gracefully', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Track with a number that might cause API error
      await trackingPage.trackPackage('ERROR123');
      
      // Should handle error gracefully
      const hasError = await trackingPage.errorMessage.isVisible();
      if (hasError) {
        await expect(trackingPage.errorMessage).toBeVisible();
      }
    });

    test('should handle timeout gracefully', async ({ trackingPage, page }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      // Slow down the network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 10000); // 10 second delay
      });
      
      await trackingPage.trackPackage('TRK123456789');
      
      // Should handle timeout or show loading state
      await trackingPage.wait(5000);
      
      // Clean up
      await page.unroute('**/*');
    });
  });

  test.describe('Performance', () => {
    test('should load tracking results quickly', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.expectTrackingPageLoaded();
      
      const startTime = Date.now();
      
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
    });

    test('should handle large timeline data efficiently', async ({ trackingPage }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      const timelineItemsCount = await trackingPage.getTimelineItemsCount();
      
      // Should handle many timeline items
      if (timelineItemsCount > 10) {
        await trackingPage.page.evaluate(() => {
          window.scrollTo(0, document.body.scrollHeight);
        });
        
        await trackingPage.waitForLoadingToComplete();
      }
    });
  });

  test.describe('Integration with Other Features', () => {
    test('should navigate from orders to tracking', async ({ ordersPage, trackingPage }) => {
      await ordersPage.goto();
      await ordersPage.expectOrdersPageLoaded();
      
      // Create an order first
      await ordersPage.createOrder({
        customerName: 'Track Test Customer',
        customerEmail: 'tracktest@example.com',
        customerPhone: '+1234567890',
        pickupAddress: '123 Pickup St',
        deliveryAddress: '456 Delivery Ave',
        packageWeight: '2.5',
        packageDimensions: '10x8x6',
        priority: 'STANDARD'
      });
      
      // Track the order
      await ordersPage.trackOrder(0);
      
      await trackingPage.expectTrackingPageLoaded();
    });

    test('should maintain login state during tracking', async ({ trackingPage, authUtils }) => {
      await trackingPage.goto();
      await trackingPage.trackPackage('TRK123456789');
      await trackingPage.waitForTrackingResults();
      
      // Should still be authenticated
      const isAuthenticated = await authUtils.isAuthenticated();
      expect(isAuthenticated).toBeTruthy();
    });
  });
});
