import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly loadingSpinner: Locator;
  readonly toastNotification: Locator;
  readonly navigationBar: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loadingSpinner = page.locator('[data-testid="loading-spinner"], .loading, .spinner');
    this.toastNotification = page.locator('[data-testid="toast"], .toast, .notification');
    this.navigationBar = page.locator('[data-testid="navigation"], nav, .navbar');
    this.footer = page.locator('footer');
  }

  /**
   * Navigate to a specific URL
   */
  async goto(path: string = ''): Promise<void> {
    await this.page.goto(path);
    await this.waitForPageLoad();
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.waitForLoadingToComplete();
  }

  /**
   * Wait for any loading spinners to disappear
   */
  async waitForLoadingToComplete(): Promise<void> {
    try {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 10000 });
    } catch (error) {
      // Loading spinner might not be present, which is fine
    }
  }

  /**
   * Wait for and verify toast notification
   */
  async waitForToast(expectedMessage?: string): Promise<void> {
    await this.toastNotification.waitFor({ state: 'visible', timeout: 10000 });
    if (expectedMessage) {
      await expect(this.toastNotification).toContainText(expectedMessage);
    }
  }

  /**
   * Click element and wait for navigation/loading
   */
  async clickAndWait(selector: string | Locator, waitForNavigation = true): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    
    if (waitForNavigation) {
      await Promise.all([
        this.page.waitForLoadState('networkidle'),
        element.click()
      ]);
    } else {
      await element.click();
      await this.waitForLoadingToComplete();
    }
  }

  /**
   * Fill form field and trigger change event
   */
  async fillField(selector: string | Locator, value: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await element.fill(value);
    await element.dispatchEvent('change');
  }

  /**
   * Take screenshot with optional name
   */
  async takeScreenshot(name?: string): Promise<void> {
    const screenshotName = name || `screenshot-${Date.now()}`;
    await this.page.screenshot({ path: `test-results/screenshots/${screenshotName}.png`, fullPage: true });
  }

  /**
   * Verify element is visible
   */
  async expectVisible(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await expect(element).toBeVisible();
  }

  /**
   * Verify element is hidden
   */
  async expectHidden(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await expect(element).toBeHidden();
  }

  /**
   * Verify element contains text
   */
  async expectText(selector: string | Locator, text: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await expect(element).toContainText(text);
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Wait for specific URL
   */
  async waitForUrl(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }

  /**
   * Hover over element
   */
  async hover(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await element.hover();
  }

  /**
   * Select dropdown option
   */
  async selectOption(selector: string | Locator, value: string): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await element.selectOption(value);
  }

  /**
   * Check checkbox
   */
  async check(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await element.check();
  }

  /**
   * Uncheck checkbox
   */
  async uncheck(selector: string | Locator): Promise<void> {
    const element = typeof selector === 'string' ? this.page.locator(selector) : element;
    await element.uncheck();
  }

  /**
   * Press key on page
   */
  async press(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Wait for specific timeout
   */
  async wait(milliseconds: number): Promise<void> {
    await this.page.waitForTimeout(milliseconds);
  }
}
