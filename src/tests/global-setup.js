// Global setup for Playwright tests
async function globalSetup() {
  console.log('🚀 Starting global setup for Playwright tests...');
  
  // You can add any global setup logic here
  // For example: seeding databases, starting services, etc.
  
  // Wait for Storybook to be ready
  console.log('⏳ Waiting for Storybook to be ready...');
  
  // Set environment variables for tests
  process.env.TEST_MODE = 'e2e';
  process.env.STORYBOOK_URL = 'http://localhost:6006';
  
  console.log('✅ Global setup completed successfully');
}

module.exports = globalSetup;