import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly page: Page;
  
  // Navigation elements
  readonly navigationMenu: Locator;
  readonly ordersLink: Locator;
  readonly trackingLink: Locator;
  readonly profileLink: Locator;
  readonly logoutButton: Locator;
  
  // Dashboard content
  readonly welcomeMessage: Locator;
  readonly statsCards: Locator;
  readonly recentOrders: Locator;
  readonly chartsContainer: Locator;
  readonly quickActions: Locator;
  
  // Order management
  readonly createOrderButton: Locator;
  readonly viewAllOrdersButton: Locator;
  readonly orderSearchInput: Locator;
  
  // User info
  readonly userInfo: Locator;
  readonly userName: Locator;
  readonly userEmail: Locator;
  readonly userRole: Locator;
  
  // Notifications
  readonly notificationsButton: Locator;
  readonly notificationsDropdown: Locator;
  readonly notificationItems: Locator;
  
  // Mobile menu
  readonly mobileMenuToggle: Locator;
  readonly mobileMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Navigation
    this.navigationMenu = page.locator('[data-testid="navigation"], nav, .navbar');
    this.ordersLink = page.locator('a:has-text("Orders"), a[href*="orders"]');
    this.trackingLink = page.locator('a:has-text("Tracking"), a[href*="tracking"]');
    this.profileLink = page.locator('a:has-text("Profile"), a[href*="profile"]');
    this.logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
    
    // Dashboard content
    this.welcomeMessage = page.locator('[data-testid="welcome"], .welcome, h1:has-text("Welcome")');
    this.statsCards = page.locator('[data-testid="stats"], .stats-card, .metric-card');
    this.recentOrders = page.locator('[data-testid="recent-orders"], .recent-orders');
    this.chartsContainer = page.locator('[data-testid="charts"], .charts, .dashboard-charts');
    this.quickActions = page.locator('[data-testid="quick-actions"], .quick-actions');
    
    // Order management
    this.createOrderButton = page.locator('button:has-text("Create Order"), a:has-text("Create Order")');
    this.viewAllOrdersButton = page.locator('button:has-text("View All"), a:has-text("View All Orders")');
    this.orderSearchInput = page.locator('input[placeholder*="search"], input[name="search"]');
    
    // User info
    this.userInfo = page.locator('[data-testid="user-info"], .user-info, .profile-info');
    this.userName = page.locator('[data-testid="user-name"], .user-name');
    this.userEmail = page.locator('[data-testid="user-email"], .user-email');
    this.userRole = page.locator('[data-testid="user-role"], .user-role');
    
    // Notifications
    this.notificationsButton = page.locator('button[aria-label*="notification"], .notification-bell');
    this.notificationsDropdown = page.locator('.notifications-dropdown, .notification-menu');
    this.notificationItems = page.locator('.notification-item');
    
    // Mobile
    this.mobileMenuToggle = page.locator('button[aria-label*="menu"], .hamburger, .mobile-menu-toggle');
    this.mobileMenu = page.locator('.mobile-menu, .sidebar');
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.goto('/dashboard');
  }

  /**
   * Verify dashboard is loaded
   */
  async expectDashboardLoaded(): Promise<void> {
    await this.expectVisible(this.welcomeMessage);
    await this.expectVisible(this.statsCards);
    await this.waitForLoadingToComplete();
  }

  /**
   * Get welcome message text
   */
  async getWelcomeMessage(): Promise<string> {
    await this.welcomeMessage.waitFor({ state: 'visible' });
    return await this.welcomeMessage.textContent() || '';
  }

  /**
   * Get user name from dashboard
   */
  async getUserName(): Promise<string> {
    await this.userName.waitFor({ state: 'visible' });
    return await this.userName.textContent() || '';
  }

  /**
   * Get user email from dashboard
   */
  async getUserEmail(): Promise<string> {
    await this.userEmail.waitFor({ state: 'visible' });
    return await this.userEmail.textContent() || '';
  }

  /**
   * Get user role from dashboard
   */
  async getUserRole(): Promise<string> {
    await this.userRole.waitFor({ state: 'visible' });
    return await this.userRole.textContent() || '';
  }

  /**
   * Navigate to orders page
   */
  async navigateToOrders(): Promise<void> {
    await this.clickAndWait(this.ordersLink);
  }

  /**
   * Navigate to tracking page
   */
  async navigateToTracking(): Promise<void> {
    await this.clickAndWait(this.trackingLink);
  }

  /**
   * Navigate to profile page
   */
  async navigateToProfile(): Promise<void> {
    await this.clickAndWait(this.profileLink);
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    await this.clickAndWait(this.logoutButton);
    // Verify redirected to login page
    await this.page.waitForURL('**/login');
  }

  /**
   * Click create order button
   */
  async clickCreateOrder(): Promise<void> {
    await this.clickAndWait(this.createOrderButton);
  }

  /**
   * Click view all orders button
   */
  async clickViewAllOrders(): Promise<void> {
    await this.clickAndWait(this.viewAllOrdersButton);
  }

  /**
   * Search orders
   */
  async searchOrders(searchTerm: string): Promise<void> {
    await this.fillField(this.orderSearchInput, searchTerm);
    await this.wait(1000); // Wait for search results
  }

  /**
   * Get stats cards count
   */
  async getStatsCardsCount(): Promise<number> {
    await this.statsCards.first().waitFor({ state: 'visible' });
    return await this.statsCards.count();
  }

  /**
   * Get specific stat card value
   */
  async getStatCardValue(cardTitle: string): Promise<string> {
    const card = this.page.locator(`.stats-card:has-text("${cardTitle}")`);
    await card.waitFor({ state: 'visible' });
    const valueElement = card.locator('.stat-value, .value, .number');
    return await valueElement.textContent() || '';
  }

  /**
   * Get recent orders count
   */
  async getRecentOrdersCount(): Promise<number> {
    if (await this.recentOrders.isVisible()) {
      const orderItems = this.recentOrders.locator('.order-item, tr');
      return await orderItems.count();
    }
    return 0;
  }

  /**
   * Open notifications dropdown
   */
  async openNotifications(): Promise<void> {
    await this.notificationsButton.click();
    await this.notificationsDropdown.waitFor({ state: 'visible' });
  }

  /**
   * Get notifications count
   */
  async getNotificationsCount(): Promise<number> {
    const badge = this.notificationsButton.locator('.badge, .notification-count');
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      return parseInt(text || '0');
    }
    return 0;
  }

  /**
   * Get notification items count
   */
  async getNotificationItemsCount(): Promise<number> {
    await this.openNotifications();
    return await this.notificationItems.count();
  }

  /**
   * Toggle mobile menu
   */
  async toggleMobileMenu(): Promise<void> {
    if (await this.mobileMenuToggle.isVisible()) {
      await this.mobileMenuToggle.click();
      await this.mobileMenu.waitFor({ state: 'visible' });
    }
  }

  /**
   * Verify dashboard charts are loaded
   */
  async expectChartsLoaded(): Promise<void> {
    if (await this.chartsContainer.isVisible()) {
      await this.expectVisible(this.chartsContainer);
      // Wait for charts to render (check for canvas or svg elements)
      await this.page.waitForSelector('canvas, svg', { timeout: 10000 });
    }
  }

  /**
   * Verify user information is displayed correctly
   */
  async expectUserInfoDisplayed(expectedName?: string, expectedEmail?: string): Promise<void> {
    await this.expectVisible(this.userInfo);
    if (expectedName) {
      await this.expectText(this.userName, expectedName);
    }
    if (expectedEmail) {
      await this.expectText(this.userEmail, expectedEmail);
    }
  }

  /**
   * Verify dashboard is responsive
   */
  async expectResponsiveLayout(): Promise<void> {
    // Test mobile view
    await this.page.setViewportSize({ width: 375, height: 667 });
    await this.expectVisible(this.mobileMenuToggle);
    await this.expectHidden(this.navigationMenu);
    
    // Test desktop view
    await this.page.setViewportSize({ width: 1200, height: 800 });
    await this.expectVisible(this.navigationMenu);
    await this.expectHidden(this.mobileMenuToggle);
  }

  /**
   * Test dashboard refresh
   */
  async refreshDashboard(): Promise<void> {
    await this.page.reload();
    await this.expectDashboardLoaded();
  }

  /**
   * Test dashboard accessibility
   */
  async testAccessibility(): Promise<void> {
    // Check for proper ARIA labels
    await expect(this.navigationMenu).toHaveAttribute('role', 'navigation');
    await expect(this.notificationsButton).toHaveAttribute('aria-label');
    
    // Check keyboard navigation
    await this.page.keyboard.press('Tab');
    await expect(this.ordersLink).toBeFocused();
  }
}
