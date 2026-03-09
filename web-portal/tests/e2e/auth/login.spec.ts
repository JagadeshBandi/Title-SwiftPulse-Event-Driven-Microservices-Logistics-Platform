import { test, expect } from '../../fixtures/test-fixtures';
import { TEST_USERS, AuthUtils } from '../../utils/auth-utils';

test.describe('Authentication - Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page elements correctly', async ({ loginPage }) => {
    await loginPage.expectLoginPageLoaded();
    
    // Verify page title
    await expect(loginPage.page).toHaveTitle(/Login|Sign In/);
    
    // Verify form elements are present
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
    
    // Verify placeholders and labels
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('should show validation errors for empty fields', async ({ loginPage }) => {
    // Try to login with empty fields
    await loginPage.loginButton.click();
    
    // Check for validation errors
    await loginPage.expectValidationErrors();
    await expect(loginPage.emailInput).toBeFocused();
  });

  test('should show error for invalid email format', async ({ loginPage }) => {
    await loginPage.fillField(loginPage.emailInput, 'invalid-email');
    await loginPage.fillField(loginPage.passwordInput, 'password123');
    await loginPage.loginButton.click();
    
    // Should show email validation error
    await loginPage.expectLoginError('email');
  });

  test('should show error for incorrect credentials', async ({ loginPage }) => {
    await loginPage.login('wrong@email.com', 'wrongpassword');
    
    await loginPage.expectLoginError();
    await expect(loginPage.page).toHaveURL(/login/);
  });

  test('should login successfully with valid admin credentials', async ({ loginPage, dashboardPage }) => {
    const adminUser = TEST_USERS.admin;
    
    await loginPage.login(adminUser.email, adminUser.password);
    await loginPage.expectLoginSuccessful();
    
    // Verify dashboard is loaded
    await dashboardPage.expectDashboardLoaded();
    
    // Verify user info is displayed
    await dashboardPage.expectUserInfoDisplayed(adminUser.firstName, adminUser.email);
  });

  test('should login successfully with valid customer credentials', async ({ loginPage, dashboardPage }) => {
    const customerUser = TEST_USERS.customer;
    
    await loginPage.login(customerUser.email, customerUser.password);
    await loginPage.expectLoginSuccessful();
    
    await dashboardPage.expectDashboardLoaded();
    await dashboardPage.expectUserInfoDisplayed(customerUser.firstName, customerUser.email);
  });

  test('should toggle password visibility', async ({ loginPage }) => {
    await loginPage.fillField(loginPage.passwordInput, 'password123');
    
    // Initially password should be hidden
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
    
    // Test visibility toggle if available
    await loginPage.testPasswordVisibility();
  });

  test('should support login with Enter key', async ({ loginPage }) => {
    await loginPage.fillField(loginPage.emailInput, TEST_USERS.admin.email);
    await loginPage.fillField(loginPage.passwordInput, TEST_USERS.admin.password);
    
    // Press Enter in password field
    await loginPage.testEnterKeySubmission();
    
    // Should redirect to dashboard
    await loginPage.page.waitForURL('**/dashboard');
  });

  test('should remember login state across page refresh', async ({ loginPage, dashboardPage }) => {
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await dashboardPage.expectDashboardLoaded();
    
    // Refresh page
    await loginPage.page.reload();
    
    // Should still be logged in
    await dashboardPage.expectDashboardLoaded();
    await dashboardPage.expectUserInfoDisplayed();
  });

  test('should redirect to dashboard if already logged in', async ({ authUtils, dashboardPage }) => {
    // Login first
    await authUtils.login('admin');
    
    // Try to access login page
    await loginPage.page.goto('/login');
    
    // Should redirect to dashboard
    await loginPage.page.waitForURL('**/dashboard');
    await dashboardPage.expectDashboardLoaded();
  });

  test('should handle session timeout gracefully', async ({ loginPage, authUtils }) => {
    // Login first
    await authUtils.login('admin');
    
    // Clear auth cookies to simulate session timeout
    await authUtils.clearAuth();
    
    // Try to access protected page
    await loginPage.page.goto('/dashboard');
    
    // Should redirect to login
    await loginPage.page.waitForURL('**/login');
    await loginPage.expectLoginPageLoaded();
  });

  test('should show forgot password link', async ({ loginPage }) => {
    if (await loginPage.forgotPasswordLink.isVisible()) {
      await expect(loginPage.forgotPasswordLink).toBeVisible();
      await expect(loginPage.forgotPasswordLink).toHaveAttribute('href', /forgot|reset/);
    }
  });

  test('should be accessible via keyboard navigation', async ({ loginPage }) => {
    // Tab through form elements
    await loginPage.page.keyboard.press('Tab');
    await expect(loginPage.emailInput).toBeFocused();
    
    await loginPage.page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();
    
    await loginPage.page.keyboard.press('Tab');
    await expect(loginPage.loginButton).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ loginPage }) => {
    // Check for proper ARIA attributes
    await expect(loginPage.emailInput).toHaveAttribute('aria-label', /email/i);
    await expect(loginPage.passwordInput).toHaveAttribute('aria-label', /password/i);
  });

  test('should work on mobile devices', async ({ loginPage, isMobile }) => {
    if (isMobile) {
      await loginPage.page.setViewportSize({ width: 375, height: 667 });
    }
    
    await loginPage.expectLoginPageLoaded();
    
    // Test mobile-specific behavior
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    await loginPage.expectLoginSuccessful();
  });

  test('should handle network errors gracefully', async ({ loginPage, page }) => {
    // Simulate network offline
    await page.context().setOffline(true);
    
    await loginPage.login(TEST_USERS.admin.email, TEST_USERS.admin.password);
    
    // Should show network error message
    await loginPage.expectLoginError('network');
    
    // Restore network
    await page.context().setOffline(false);
  });
});

test.describe('Authentication - Registration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should switch to registration form', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    await expect(loginPage.firstNameInput).toBeVisible();
    await expect(loginPage.lastNameInput).toBeVisible();
    await expect(loginPage.confirmPasswordInput).toBeVisible();
    await expect(loginPage.registerButton).toBeVisible();
  });

  test('should show validation errors for empty registration fields', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    await loginPage.registerButton.click();
    
    await loginPage.expectValidationErrors();
  });

  test('should validate email format in registration', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    await loginPage.fillField(loginPage.firstNameInput, 'Test');
    await loginPage.fillField(loginPage.lastNameInput, 'User');
    await loginPage.fillField(loginPage.emailInput, 'invalid-email');
    await loginPage.fillField(loginPage.passwordInput, 'password123');
    await loginPage.fillField(loginPage.confirmPasswordInput, 'password123');
    
    await loginPage.registerButton.click();
    
    await loginPage.expectRegistrationError('email');
  });

  test('should validate password confirmation', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    await loginPage.fillField(loginPage.firstNameInput, 'Test');
    await loginPage.fillField(loginPage.lastNameInput, 'User');
    await loginPage.fillField(loginPage.emailInput, 'test@example.com');
    await loginPage.fillField(loginPage.passwordInput, 'password123');
    await loginPage.fillField(loginPage.confirmPasswordInput, 'differentpassword');
    
    await loginPage.registerButton.click();
    
    await loginPage.expectRegistrationError('password');
  });

  test('should register new user successfully', async ({ loginPage, dashboardPage }) => {
    const newUser = AuthUtils.generateTestUser();
    
    await loginPage.register(
      newUser.firstName,
      newUser.lastName,
      newUser.email,
      newUser.password,
      newUser.password
    );
    
    await loginPage.expectRegistrationSuccessful();
    await dashboardPage.expectDashboardLoaded();
    
    // Verify user info
    await dashboardPage.expectUserInfoDisplayed(newUser.firstName, newUser.email);
    
    // Cleanup
    await loginPage.authUtils.cleanupTestUser(newUser.email);
  });

  test('should handle duplicate email registration', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    // Try to register with existing admin email
    await loginPage.register(
      'Test',
      'User',
      TEST_USERS.admin.email,
      'password123',
      'password123'
    );
    
    await loginPage.expectRegistrationError('exists');
  });

  test('should validate password strength', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    await loginPage.fillField(loginPage.firstNameInput, 'Test');
    await loginPage.fillField(loginPage.lastNameInput, 'User');
    await loginPage.fillField(loginPage.emailInput, 'test@example.com');
    await loginPage.fillField(loginPage.passwordInput, '123'); // Weak password
    await loginPage.fillField(loginPage.confirmPasswordInput, '123');
    
    await loginPage.registerButton.click();
    
    await loginPage.expectRegistrationError('password');
  });

  test('should switch back to login form', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    await loginPage.switchToLogin();
    
    await expect(loginPage.firstNameInput).not.toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should show password strength indicator', async ({ loginPage }) => {
    await loginPage.switchToRegister();
    
    await loginPage.fillField(loginPage.passwordInput, 'weak');
    
    // Check for password strength indicator if present
    const strengthIndicator = loginPage.page.locator('.password-strength, .strength-meter');
    if (await strengthIndicator.isVisible()) {
      await expect(strengthIndicator).toBeVisible();
    }
  });
});

test.describe('Authentication - Session Management', () => {
  test('should maintain session across browser restart', async ({ context, page }) => {
    const authUtils = new AuthUtils(page, context);
    
    // Login
    await authUtils.login('admin');
    
    // Store session
    const cookies = await context.cookies();
    
    // Close and reopen browser
    await context.close();
    
    // Navigate to dashboard
    await page.goto('/dashboard');
    
    // Should still be logged in
    await expect(page).toHaveURL('**/dashboard');
  });

  test('should logout successfully', async ({ authUtils, loginPage }) => {
    // Login first
    await authUtils.login('admin');
    
    // Logout
    await authUtils.logout();
    
    // Should be redirected to login
    await expect(loginPage.page).toHaveURL('**/login');
    await loginPage.expectLoginPageLoaded();
  });

  test('should clear session on logout', async ({ authUtils, loginPage, page }) => {
    // Login first
    await authUtils.login('admin');
    
    // Logout
    await authUtils.logout();
    
    // Try to access protected page
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('**/login');
  });

  test('should handle concurrent sessions', async ({ browser }) => {
    // Create two contexts
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    
    const authUtils1 = new AuthUtils(page1, context1);
    const authUtils2 = new AuthUtils(page2, context2);
    
    // Login in both sessions
    await authUtils1.login('admin');
    await authUtils2.login('customer');
    
    // Both should work independently
    await expect(page1).toHaveURL('**/dashboard');
    await expect(page2).toHaveURL('**/dashboard');
    
    // Cleanup
    await context1.close();
    await context2.close();
  });
});
