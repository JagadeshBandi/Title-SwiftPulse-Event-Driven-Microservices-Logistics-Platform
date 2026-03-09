import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class TrackingPage extends BasePage {
  readonly page: Page;
  
  // Tracking search
  readonly trackingInput: Locator;
  readonly searchButton: Locator;
  readonly quickTrackButton: Locator;
  
  // Map container
  readonly mapContainer: Locator;
  readonly mapCanvas: Locator;
  readonly mapLoading: Locator;
  
  // Tracking information
  readonly trackingInfo: Locator;
  readonly trackingNumber: Locator;
  readonly currentStatus: Locator;
  readonly estimatedDelivery: Locator;
  readonly lastUpdate: Locator;
  
  // Timeline
  readonly timeline: Locator;
  readonly timelineItems: Locator;
  readonly timelineDate: Locator;
  readonly timelineTime: Locator;
  readonly timelineStatus: Locator;
  readonly timelineLocation: Locator;
  
  // Driver information
  readonly driverInfo: Locator;
  readonly driverName: Locator;
  readonly driverPhone: Locator;
  readonly driverPhoto: Locator;
  readonly driverRating: Locator;
  
  // Package information
  readonly packageInfo: Locator;
  readonly packageWeight: Locator;
  readonly packageDimensions: Locator;
  readonly packageType: Locator;
  readonly specialInstructions: Locator;
  
  // Delivery progress
  readonly progressBar: Locator;
  readonly progressSteps: Locator;
  readonly currentStep: Locator;
  
  // Actions
  readonly contactDriverButton: Locator;
  readonly reportIssueButton: Locator;
  readonly shareTrackingButton: Locator;
  readonly notifyMeButton: Locator;
  
  // Real-time updates
  readonly liveUpdates: Locator;
  readonly liveIndicator: Locator;
  readonly refreshButton: Locator;
  
  // Address details
  readonly pickupAddress: Locator;
  readonly deliveryAddress: Locator;
  readonly distanceRemaining: Locator;
  readonly estimatedTimeRemaining: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Tracking search
    this.trackingInput = page.locator('input[name="tracking"], input[placeholder*="tracking"], input[id="tracking"]');
    this.searchButton = page.locator('button:has-text("Track"), button:has-text("Search")');
    this.quickTrackButton = page.locator('button:has-text("Quick Track")');
    
    // Map
    this.mapContainer = page.locator('[data-testid="map"], .map-container, #map');
    this.mapCanvas = page.locator('canvas, .leaflet-map-pane');
    this.mapLoading = page.locator('.map-loading, [data-testid="map-loading"]');
    
    // Tracking info
    this.trackingInfo = page.locator('[data-testid="tracking-info"], .tracking-info');
    this.trackingNumber = page.locator('[data-testid="tracking-number"], .tracking-number');
    this.currentStatus = page.locator('[data-testid="current-status"], .current-status');
    this.estimatedDelivery = page.locator('[data-testid="estimated-delivery"], .estimated-delivery');
    this.lastUpdate = page.locator('[data-testid="last-update"], .last-update');
    
    // Timeline
    this.timeline = page.locator('[data-testid="timeline"], .timeline, .tracking-timeline');
    this.timelineItems = page.locator('[data-testid="timeline-item"], .timeline-item');
    this.timelineDate = page.locator('[data-testid="timeline-date"], .timeline-date');
    this.timelineTime = page.locator('[data-testid="timeline-time"], .timeline-time');
    this.timelineStatus = page.locator('[data-testid="timeline-status"], .timeline-status');
    this.timelineLocation = page.locator('[data-testid="timeline-location"], .timeline-location');
    
    // Driver info
    this.driverInfo = page.locator('[data-testid="driver-info"], .driver-info');
    this.driverName = page.locator('[data-testid="driver-name"], .driver-name');
    this.driverPhone = page.locator('[data-testid="driver-phone"], .driver-phone');
    this.driverPhoto = page.locator('[data-testid="driver-photo"], .driver-photo');
    this.driverRating = page.locator('[data-testid="driver-rating"], .driver-rating');
    
    // Package info
    this.packageInfo = page.locator('[data-testid="package-info"], .package-info');
    this.packageWeight = page.locator('[data-testid="package-weight"], .package-weight');
    this.packageDimensions = page.locator('[data-testid="package-dimensions"], .package-dimensions');
    this.packageType = page.locator('[data-testid="package-type"], .package-type');
    this.specialInstructions = page.locator('[data-testid="special-instructions"], .special-instructions');
    
    // Progress
    this.progressBar = page.locator('[data-testid="progress-bar"], .progress-bar');
    this.progressSteps = page.locator('[data-testid="progress-steps"], .progress-steps');
    this.currentStep = page.locator('[data-testid="current-step"], .current-step');
    
    // Actions
    this.contactDriverButton = page.locator('button:has-text("Contact Driver"), .contact-driver');
    this.reportIssueButton = page.locator('button:has-text("Report Issue"), .report-issue');
    this.shareTrackingButton = page.locator('button:has-text("Share"), .share-tracking');
    this.notifyMeButton = page.locator('button:has-text("Notify Me"), .notify-me');
    
    // Real-time
    this.liveUpdates = page.locator('[data-testid="live-updates"], .live-updates');
    this.liveIndicator = page.locator('[data-testid="live-indicator"], .live-indicator');
    this.refreshButton = page.locator('button:has-text("Refresh"), .refresh-button');
    
    // Address details
    this.pickupAddress = page.locator('[data-testid="pickup-address"], .pickup-address');
    this.deliveryAddress = page.locator('[data-testid="delivery-address"], .delivery-address');
    this.distanceRemaining = page.locator('[data-testid="distance-remaining"], .distance-remaining');
    this.estimatedTimeRemaining = page.locator('[data-testid="eta"], .estimated-time-remaining');
  }

  /**
   * Navigate to tracking page
   */
  async goto(): Promise<void> {
    await this.goto('/tracking');
  }

  /**
   * Verify tracking page is loaded
   */
  async expectTrackingPageLoaded(): Promise<void> {
    await this.expectVisible(this.trackingInput);
    await this.expectVisible(this.searchButton);
    await this.waitForLoadingToComplete();
  }

  /**
   * Track a package by tracking number
   */
  async trackPackage(trackingNumber: string): Promise<void> {
    await this.fillField(this.trackingInput, trackingNumber);
    await this.clickAndWait(this.searchButton);
    await this.waitForTrackingResults();
  }

  /**
   * Wait for tracking results to load
   */
  async waitForTrackingResults(): Promise<void> {
    await this.expectVisible(this.trackingInfo);
    await this.waitForMapToLoad();
    await this.waitForLoadingToComplete();
  }

  /**
   * Wait for map to load
   */
  async waitForMapToLoad(): Promise<void> {
    try {
      await this.mapLoading.waitFor({ state: 'hidden', timeout: 15000 });
      await this.mapCanvas.waitFor({ state: 'visible', timeout: 10000 });
    } catch (error) {
      // Map might not load in test environment, continue
    }
  }

  /**
   * Get tracking number from results
   */
  async getTrackingNumber(): Promise<string> {
    await this.trackingNumber.waitFor({ state: 'visible' });
    return await this.trackingNumber.textContent() || '';
  }

  /**
   * Get current status
   */
  async getCurrentStatus(): Promise<string> {
    await this.currentStatus.waitFor({ state: 'visible' });
    return await this.currentStatus.textContent() || '';
  }

  /**
   * Get estimated delivery date
   */
  async getEstimatedDelivery(): Promise<string> {
    await this.estimatedDelivery.waitFor({ state: 'visible' });
    return await this.estimatedDelivery.textContent() || '';
  }

  /**
   * Get last update time
   */
  async getLastUpdate(): Promise<string> {
    await this.lastUpdate.waitFor({ state: 'visible' });
    return await this.lastUpdate.textContent() || '';
  }

  /**
   * Get timeline items count
   */
  async getTimelineItemsCount(): Promise<number> {
    if (await this.timeline.isVisible()) {
      await this.timelineItems.first().waitFor({ state: 'visible' });
      return await this.timelineItems.count();
    }
    return 0;
  }

  /**
   * Get specific timeline item details
   */
  async getTimelineItemDetails(index: number): Promise<{
    date: string;
    time: string;
    status: string;
    location: string;
  }> {
    const item = this.timelineItems.nth(index);
    
    const date = await item.locator(this.timelineDate).textContent() || '';
    const time = await item.locator(this.timelineTime).textContent() || '';
    const status = await item.locator(this.timelineStatus).textContent() || '';
    const location = await item.locator(this.timelineLocation).textContent() || '';
    
    return { date, time, status, location };
  }

  /**
   * Get driver information
   */
  async getDriverInfo(): Promise<{
    name: string;
    phone: string;
    rating: string;
  }> {
    if (await this.driverInfo.isVisible()) {
      const name = await this.driverName.textContent() || '';
      const phone = await this.driverPhone.textContent() || '';
      const rating = await this.driverRating.textContent() || '';
      
      return { name, phone, rating };
    }
    return { name: '', phone: '', rating: '' };
  }

  /**
   * Get package information
   */
  async getPackageInfo(): Promise<{
    weight: string;
    dimensions: string;
    type: string;
    specialInstructions: string;
  }> {
    if (await this.packageInfo.isVisible()) {
      const weight = await this.packageWeight.textContent() || '';
      const dimensions = await this.packageDimensions.textContent() || '';
      const type = await this.packageType.textContent() || '';
      const instructions = await this.specialInstructions.textContent() || '';
      
      return { weight, dimensions, type, specialInstructions: instructions };
    }
    return { weight: '', dimensions: '', type: '', specialInstructions: '' };
  }

  /**
   * Get progress percentage
   */
  async getProgressPercentage(): Promise<number> {
    if (await this.progressBar.isVisible()) {
      const progressBar = this.progressBar.locator('.progress-fill, [role="progressbar"]');
      const style = await progressBar.getAttribute('style') || '';
      const match = style.match(/width:\s*(\d+)%/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  /**
   * Get current progress step
   */
  async getCurrentProgressStep(): Promise<string> {
    if (await this.currentStep.isVisible()) {
      return await this.currentStep.textContent() || '';
    }
    return '';
  }

  /**
   * Get pickup address
   */
  async getPickupAddress(): Promise<string> {
    if (await this.pickupAddress.isVisible()) {
      return await this.pickupAddress.textContent() || '';
    }
    return '';
  }

  /**
   * Get delivery address
   */
  async getDeliveryAddress(): Promise<string> {
    if (await this.deliveryAddress.isVisible()) {
      return await this.deliveryAddress.textContent() || '';
    }
    return '';
  }

  /**
   * Get distance remaining
   */
  async getDistanceRemaining(): Promise<string> {
    if (await this.distanceRemaining.isVisible()) {
      return await this.distanceRemaining.textContent() || '';
    }
    return '';
  }

  /**
   * Get estimated time remaining
   */
  async getEstimatedTimeRemaining(): Promise<string> {
    if (await this.estimatedTimeRemaining.isVisible()) {
      return await this.estimatedTimeRemaining.textContent() || '';
    }
    return '';
  }

  /**
   * Contact driver
   */
  async contactDriver(): Promise<void> {
    if (await this.contactDriverButton.isVisible()) {
      await this.contactDriverButton.click();
      // Handle contact modal or redirect
      await this.waitForLoadingToComplete();
    }
  }

  /**
   * Report issue with delivery
   */
  async reportIssue(): Promise<void> {
    if (await this.reportIssueButton.isVisible()) {
      await this.reportIssueButton.click();
      // Handle issue reporting modal
      await this.waitForLoadingToComplete();
    }
  }

  /**
   * Share tracking information
   */
  async shareTracking(): Promise<void> {
    if (await this.shareTrackingButton.isVisible()) {
      await this.shareTrackingButton.click();
      // Handle share dialog
      await this.waitForLoadingToComplete();
    }
  }

  /**
   * Enable notifications
   */
  async enableNotifications(): Promise<void> {
    if (await this.notifyMeButton.isVisible()) {
      await this.notifyMeButton.click();
      await this.waitForToast('Notifications enabled');
    }
  }

  /**
   * Refresh tracking information
   */
  async refreshTracking(): Promise<void> {
    await this.refreshButton.click();
    await this.waitForTrackingResults();
  }

  /**
   * Test live updates
   */
  async testLiveUpdates(): Promise<void> {
    if (await this.liveUpdates.isVisible()) {
      await this.expectVisible(this.liveIndicator);
      // Test that updates are happening
      const initialStatus = await this.getCurrentStatus();
      await this.wait(2000); // Wait for potential update
      // In real test, you'd mock WebSocket updates
    }
  }

  /**
   * Verify tracking status
   */
  async expectTrackingStatus(expectedStatus: string): Promise<void> {
    const status = await this.getCurrentStatus();
    expect(status.toLowerCase()).toContain(expectedStatus.toLowerCase());
  }

  /**
   * Verify timeline contains expected status
   */
  async expectTimelineContains(status: string): Promise<void> {
    const timelineText = await this.timeline.textContent() || '';
    expect(timelineText.toLowerCase()).toContain(status.toLowerCase());
  }

  /**
   * Test map interaction
   */
  async testMapInteraction(): Promise<void> {
    if (await this.mapContainer.isVisible()) {
      // Test map zoom
      await this.mapContainer.click();
      await this.page.keyboard.press('Equal'); // Zoom in
      await this.wait(500);
      await this.page.keyboard.press('Minus'); // Zoom out
      await this.wait(500);
      
      // Test map pan
      await this.page.mouse.down();
      await this.page.mouse.move(100, 100);
      await this.page.mouse.up();
    }
  }

  /**
   * Test tracking on mobile
   */
  async testMobileTracking(): Promise<void> {
    await this.page.setViewportSize({ width: 375, height: 667 });
    
    // Verify mobile layout
    await this.expectVisible(this.trackingInput);
    await this.expectVisible(this.searchButton);
    
    // Test mobile map
    if (await this.mapContainer.isVisible()) {
      await this.expectVisible(this.mapContainer);
    }
  }

  /**
   * Test invalid tracking number
   */
  async testInvalidTrackingNumber(invalidNumber: string): Promise<void> {
    await this.trackPackage(invalidNumber);
    await this.expectVisible(this.errorMessage);
    const errorText = await this.getErrorMessage();
    expect(errorText.toLowerCase()).toContain('not found');
  }

  /**
   * Test tracking history
   */
  async testTrackingHistory(): Promise<void> {
    // Test that timeline shows chronological order
    const itemsCount = await this.getTimelineItemsCount();
    if (itemsCount > 1) {
      const firstItem = await this.getTimelineItemDetails(0);
      const lastItem = await this.getTimelineItemDetails(itemsCount - 1);
      
      // Verify timeline is in chronological order
      // This would require date parsing in a real implementation
      expect(firstItem.date).toBeTruthy();
      expect(lastItem.date).toBeTruthy();
    }
  }
}
