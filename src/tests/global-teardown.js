// Global teardown for Playwright tests
async function globalTeardown() {
  console.log('🧹 Starting global teardown for Playwright tests...');
  
  // You can add any cleanup logic here
  // For example: cleaning up test data, stopping services, etc.
  
  // Clean up environment variables
  delete process.env.TEST_MODE;
  delete process.env.STORYBOOK_URL;
  
  console.log('✅ Global teardown completed successfully');
}

module.exports = globalTeardown;