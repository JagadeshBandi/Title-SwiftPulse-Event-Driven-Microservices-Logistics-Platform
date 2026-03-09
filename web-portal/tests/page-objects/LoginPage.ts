import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  readonly page: Page;
  
  // Login form elements
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly registerLink: Locator;
  readonly forgotPasswordLink: Locator;
  
  // Registration form elements
  readonly registerTab: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly registerButton: Locator;
  readonly loginTab: Locator;
  
  // Error messages
  readonly errorMessage: Locator;
  readonly successMessage: Locator;
  
  // Page title and headers
  readonly pageTitle: Locator;
  readonly loginHeader: Locator;
  readonly registerHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.page = page;
    
    // Login form
    this.emailInput = page.locator('input[name="email"], input[id="email"], input[type="email"]');
    this.passwordInput = page.locator('input[name="password"], input[id="password"], input[type="password"]');
    this.loginButton = page.locator('button[type="submit"], button:has-text("Login"), button:has-text("Sign In")');
    this.registerLink = page.locator('a:has-text("Register"), a:has-text("Sign Up"), button:has-text("Create Account")');
    this.forgotPasswordLink = page.locator('a:has-text("Forgot Password")');
    
    // Registration form
    this.registerTab = page.locator('button:has-text("Register"), button:has-text("Sign Up")');
    this.firstNameInput = page.locator('input[name="firstName"], input[name="first_name"], input[id="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"], input[name="last_name"], input[id="lastName"]');
    this.confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm_password"]');
    this.registerButton = page.locator('button:has-text("Register"), button:has-text("Sign Up"), button:has-text("Create Account")');
    this.loginTab = page.locator('button:has-text("Login"), button:has-text("Sign In")');
    
    // Messages
    this.errorMessage = page.locator('[data-testid="error"], .error, .alert-error, .text-red-600');
    this.successMessage = page.locator('[data-testid="success"], .success, .alert-success, .text-green-600');
    
    // Headers
    this.pageTitle = page.locator('h1, .page-title');
    this.loginHeader = page.locator('h2:has-text("Login"), h2:has-text("Sign In")');
    this.registerHeader = page.locator('h2:has-text("Register"), h2:has-text("Sign Up")');
  }

  /**
   * Navigate to login page
   */
  async goto(): Promise<void> {
    await this.goto('/login');
  }

  /**
   * Verify login page is loaded
   */
  async expectLoginPageLoaded(): Promise<void> {
    await this.expectVisible(this.emailInput);
    await this.expectVisible(this.passwordInput);
    await this.expectVisible(this.loginButton);
    await this.expectVisible(this.registerLink);
  }

  /**
   * Login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.clickAndWait(this.loginButton);
  }

  /**
   * Switch to registration form
   */
  async switchToRegister(): Promise<void> {
    await this.clickAndWait(this.registerLink);
    await this.expectVisible(this.firstNameInput);
    await this.expectVisible(this.lastNameInput);
    await this.expectVisible(this.confirmPasswordInput);
  }

  /**
   * Register a new user
   */
  async register(firstName: string, lastName: string, email: string, password: string, confirmPassword: string): Promise<void> {
    await this.switchToRegister();
    await this.fillField(this.firstNameInput, firstName);
    await this.fillField(this.lastNameInput, lastName);
    await this.fillField(this.emailInput, email);
    await this.fillField(this.passwordInput, password);
    await this.fillField(this.confirmPasswordInput, confirmPassword);
    await this.clickAndWait(this.registerButton);
  }

  /**
   * Switch back to login form
   */
  async switchToLogin(): Promise<void> {
    if (await this.loginTab.isVisible()) {
      await this.clickAndWait(this.loginTab);
    }
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.errorMessage.textContent() || '';
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    await this.successMessage.waitFor({ state: 'visible', timeout: 5000 });
    return await this.successMessage.textContent() || '';
  }

  /**
   * Verify login was successful (redirected away from login page)
   */
  async expectLoginSuccessful(): Promise<void> {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }

  /**
   * Verify registration was successful
   */
  async expectRegistrationSuccessful(): Promise<void> {
    await this.waitForToast('Registration successful');
    await this.expectLoginSuccessful();
  }

  /**
   * Verify login error
   */
  async expectLoginError(expectedMessage?: string): Promise<void> {
    await this.expectVisible(this.errorMessage);
    if (expectedMessage) {
      await this.expectText(this.errorMessage, expectedMessage);
    }
  }

  /**
   * Verify registration error
   */
  async expectRegistrationError(expectedMessage?: string): Promise<void> {
    await this.expectVisible(this.errorMessage);
    if (expectedMessage) {
      await this.expectText(this.errorMessage, expectedMessage);
    }
  }

  /**
   * Verify form validation errors
   */
  async expectValidationErrors(): Promise<void> {
    const validationErrors = this.page.locator('.field-error, .error-message, [data-testid="validation-error"]');
    await expect(validationErrors.first()).toBeVisible();
  }

  /**
   * Check if login button is disabled
   */
  async expectLoginButtonDisabled(): Promise<void> {
    await expect(this.loginButton).toBeDisabled();
  }

  /**
   * Check if login button is enabled
   */
  async expectLoginButtonEnabled(): Promise<void> {
    await expect(this.loginButton).toBeEnabled();
  }

  /**
   * Clear all form fields
   */
  async clearForm(): Promise<void> {
    await this.emailInput.clear();
    await this.passwordInput.clear();
    await this.firstNameInput.clear();
    await this.lastNameInput.clear();
    await this.confirmPasswordInput.clear();
  }

  /**
   * Test password visibility toggle
   */
  async testPasswordVisibility(): Promise<void> {
    const passwordToggle = this.page.locator('button[aria-label*="password"], .password-toggle, .show-password');
    if (await passwordToggle.isVisible()) {
      await passwordToggle.click();
      await expect(this.passwordInput).toHaveAttribute('type', 'text');
      await passwordToggle.click();
      await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }
  }

  /**
   * Test form submission with Enter key
   */
  async testEnterKeySubmission(): Promise<void> {
    await this.fillField(this.emailInput, 'test@example.com');
    await this.fillField(this.passwordInput, 'password');
    await this.passwordInput.press('Enter');
    await this.waitForLoadingToComplete();
  }
}
