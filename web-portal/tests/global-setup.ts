import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for SwiftPulse E2E tests...');
  
  // Set up test data
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // Wait for the application to be ready
    await page.goto('http://localhost:3000');
    await page.waitForSelector('body', { timeout: 30000 });
    
    // Create test users if they don't exist
    await createTestUsers(page);
    
    console.log('✅ Global setup completed successfully');
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function createTestUsers(page: any) {
  // Create test admin user if not exists
  try {
    const response = await page.request.post('http://localhost:8080/api/auth/register', {
      data: {
        firstName: 'Test',
        lastName: 'Admin',
        email: 'testadmin@swiftpulse.com',
        password: 'testpass123'
      }
    });
    
    if (response.status() === 200 || response.status() === 409) {
      console.log('✅ Test admin user ready');
    }
  } catch (error) {
    console.log('ℹ️ Test admin user might already exist');
  }
  
  // Create test customer user if not exists
  try {
    const response = await page.request.post('http://localhost:8080/api/auth/register', {
      data: {
        firstName: 'Test',
        lastName: 'Customer',
        email: 'testcustomer@swiftpulse.com',
        password: 'testpass123'
      }
    });
    
    if (response.status() === 200 || response.status() === 409) {
      console.log('✅ Test customer user ready');
    }
  } catch (error) {
    console.log('ℹ️ Test customer user might already exist');
  }
}

export default globalSetup;
