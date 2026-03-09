import { FullConfig } from '@playwright/test';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for SwiftPulse E2E tests...');
  
  // Clean up test data if needed
  // This could include deleting test users, orders, etc.
  
  console.log('✅ Global teardown completed successfully');
}

export default globalTeardown;
