import { Page, BrowserContext } from '@playwright/test';

export interface TestUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'CUSTOMER' | 'DRIVER';
}

export const TEST_USERS: Record<string, TestUser> = {
  admin: {
    firstName: 'Test',
    lastName: 'Admin',
    email: 'testadmin@swiftpulse.com',
    password: 'testpass123',
    role: 'ADMIN'
  },
  customer: {
    firstName: 'Test',
    lastName: 'Customer',
    email: 'testcustomer@swiftpulse.com',
    password: 'testpass123',
    role: 'CUSTOMER'
  },
  driver: {
    firstName: 'Test',
    lastName: 'Driver',
    email: 'testdriver@swiftpulse.com',
    password: 'testpass123',
    role: 'DRIVER'
  }
};

export class AuthUtils {
  private page: Page;
  private context: BrowserContext;

  constructor(page: Page, context: BrowserContext) {
    this.page = page;
    this.context = context;
  }

  /**
   * Login with specific user type
   */
  async login(userType: keyof typeof TEST_USERS): Promise<void> {
    const user = TEST_USERS[userType];
    await this.page.goto('/login');
    
    // Fill login form
    await this.page.fill('input[name="email"], input[type="email"]', user.email);
    await this.page.fill('input[name="password"], input[type="password"]', user.password);
    
    // Submit form
    await this.page.click('button[type="submit"], button:has-text("Login")');
    
    // Wait for successful login
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Login with custom credentials
   */
  async loginWithCredentials(email: string, password: string): Promise<void> {
    await this.page.goto('/login');
    
    await this.page.fill('input[name="email"], input[type="email"]', email);
    await this.page.fill('input[name="password"], input[type="password"]', password);
    await this.page.click('button[type="submit"], button:has-text("Login")');
    
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Register a new user
   */
  async register(userData: Omit<TestUser, 'role'>): Promise<void> {
    await this.page.goto('/login');
    
    // Switch to registration
    await this.page.click('a:has-text("Register"), button:has-text("Sign Up")');
    
    // Fill registration form
    await this.page.fill('input[name="firstName"], input[name="first_name"]', userData.firstName);
    await this.page.fill('input[name="lastName"], input[name="last_name"]', userData.lastName);
    await this.page.fill('input[name="email"], input[type="email"]', userData.email);
    await this.page.fill('input[name="password"], input[type="password"]', userData.password);
    await this.page.fill('input[name="confirmPassword"], input[name="confirm_password"]', userData.password);
    
    // Submit form
    await this.page.click('button:has-text("Register"), button:has-text("Sign Up")');
    
    // Wait for successful registration
    await this.page.waitForURL('**/dashboard');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Logout from the application
   */
  async logout(): Promise<void> {
    // Click user menu/avatar
    await this.page.click('[data-testid="user-menu"], .user-avatar, .profile-menu');
    
    // Click logout
    await this.page.click('button:has-text("Logout"), a:has-text("Logout")');
    
    // Wait for redirect to login
    await this.page.waitForURL('**/login');
  }

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<{ name: string; email: string; role: string }> {
    const userName = await this.page.locator('[data-testid="user-name"], .user-name').textContent() || '';
    const userEmail = await this.page.locator('[data-testid="user-email"], .user-email').textContent() || '';
    const userRole = await this.page.locator('[data-testid="user-role"], .user-role').textContent() || '';
    
    return { name: userName, email: userEmail, role: userRole };
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="user-menu"], .user-avatar', { timeout: 3000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Store authentication token in context
   */
  async storeAuthToken(token: string): Promise<void> {
    await this.context.addCookies([
      {
        name: 'auth_token',
        value: token,
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax'
      }
    ]);
  }

  /**
   * Get authentication token from cookies
   */
  async getAuthToken(): Promise<string | null> {
    const cookies = await this.context.cookies();
    const authCookie = cookies.find(cookie => cookie.name === 'auth_token');
    return authCookie?.value || null;
  }

  /**
   * Clear authentication state
   */
  async clearAuth(): Promise<void> {
    await this.context.clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Test JWT token expiration
   */
  async testTokenExpiration(): Promise<void> {
    // Simulate expired token
    await this.context.addCookies([
      {
        name: 'auth_token',
        value: 'expired_token_12345',
        domain: 'localhost',
        path: '/',
        httpOnly: true,
        sameSite: 'Lax',
        expires: Math.floor(Date.now() / 1000) - 3600 // Expired 1 hour ago
      }
    ]);
    
    // Try to access protected page
    await this.page.goto('/dashboard');
    
    // Should be redirected to login
    await this.page.waitForURL('**/login');
  }

  /**
   * Test role-based access
   */
  async testRoleAccess(expectedAccessiblePages: string[], expectedForbiddenPages: string[]): Promise<void> {
    // Test accessible pages
    for (const pagePath of expectedAccessiblePages) {
      await this.page.goto(pagePath);
      await this.page.waitForLoadState('networkidle');
      
      // Should not be redirected to login
      const currentUrl = this.page.url();
      expect(currentUrl).not.toContain('/login');
    }
    
    // Test forbidden pages
    for (const pagePath of expectedForbiddenPages) {
      await this.page.goto(pagePath);
      await this.page.waitForLoadState('networkidle');
      
      // Should see access denied or be redirected
      const hasAccessDenied = await this.page.locator('text=Access Denied, .access-denied').isVisible();
      const isRedirected = this.page.url().includes('/login') || this.page.url().includes('/unauthorized');
      
      expect(hasAccessDenied || isRedirected).toBeTruthy();
    }
  }

  /**
   * Test session persistence
   */
  async testSessionPersistence(): Promise<void> {
    // Login
    await this.login('admin');
    
    // Store session info
    const initialUser = await this.getCurrentUser();
    
    // Close and reopen browser (simulate browser restart)
    await this.context.close();
    
    // Navigate back to dashboard
    await this.page.goto('/dashboard');
    
    // Should still be logged in
    const currentUser = await this.getCurrentUser();
    expect(currentUser.name).toBe(initialUser.name);
    expect(currentUser.email).toBe(initialUser.email);
  }

  /**
   * Test concurrent sessions
   */
  async testConcurrentSessions(): Promise<void> {
    // Create second context
    const secondContext = await this.page.context().browser()?.newContext();
    const secondPage = await secondContext?.newPage();
    
    if (secondPage) {
      // Login in first session
      await this.login('admin');
      
      // Login in second session with same user
      const secondAuthUtils = new AuthUtils(secondPage, secondContext);
      await secondAuthUtils.login('admin');
      
      // Both sessions should work
      expect(await this.isAuthenticated()).toBeTruthy();
      expect(await secondAuthUtils.isAuthenticated()).toBeTruthy();
      
      await secondContext.close();
    }
  }

  /**
   * Test password strength validation
   */
  async testPasswordStrength(): Promise<{ valid: boolean; errors: string[] }> {
    await this.page.goto('/login');
    await this.page.click('a:has-text("Register"), button:has-text("Sign Up")');
    
    // Fill form with weak password
    await this.page.fill('input[name="firstName"], input[name="first_name"]', 'Test');
    await this.page.fill('input[name="lastName"], input[name="last_name"]', 'User');
    await this.page.fill('input[name="email"], input[type="email"]', 'test@example.com');
    await this.page.fill('input[name="password"], input[type="password"]', '123');
    await this.page.fill('input[name="confirmPassword"], input[name="confirm_password"]', '123');
    
    // Try to submit
    await this.page.click('button:has-text("Register"), button:has-text("Sign Up")');
    
    // Check for validation errors
    const errorElements = await this.page.locator('.error, .validation-error, [data-testid="error"]').all();
    const errors = await Promise.all(errorElements.map(el => el.textContent()));
    
    return {
      valid: errorElements.length === 0,
      errors: errors.filter(Boolean) as string[]
    };
  }

  /**
   * Test account lockout after failed attempts
   */
  async testAccountLockout(): Promise<void> {
    const user = TEST_USERS.admin;
    
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await this.page.goto('/login');
      await this.page.fill('input[name="email"], input[type="email"]', user.email);
      await this.page.fill('input[name="password"], input[type="password"]', 'wrongpassword');
      await this.page.click('button[type="submit"], button:has-text("Login")');
      await this.page.waitForTimeout(1000);
    }
    
    // Try correct password - should be locked out
    await this.page.goto('/login');
    await this.page.fill('input[name="email"], input[type="email"]', user.email);
    await this.page.fill('input[name="password"], input[type="password"]', user.password);
    await this.page.click('button[type="submit"], button:has-text("Login")');
    
    // Should show account locked message
    const lockoutMessage = await this.page.locator('text=account locked, .account-locked').isVisible();
    expect(lockoutMessage).toBeTruthy();
  }

  /**
   * Generate test user data
   */
  static generateTestUser(role: TestUser['role'] = 'CUSTOMER'): TestUser {
    const timestamp = Date.now();
    return {
      firstName: `Test${timestamp}`,
      lastName: `User${timestamp}`,
      email: `test${timestamp}@example.com`,
      password: 'TestPassword123!',
      role
    };
  }

  /**
   * Clean up test user
   */
  async cleanupTestUser(email: string): Promise<void> {
    // This would make an API call to delete the test user
    // Implementation depends on backend API
    try {
      await this.page.request.delete(`http://localhost:8080/api/admin/users/${email}`);
    } catch (error) {
      console.log(`Failed to cleanup test user ${email}:`, error);
    }
  }
}
