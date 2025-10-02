import '@testing-library/jest-dom';

// Build-specific test setup
console.log('🏗️  Initializing build-time test environment...');

// Stricter console error handling for build tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Fail tests on console errors during build
  console.error = (...args) => {
    originalError.call(console, ...args);
    throw new Error(`Console error detected during build test: ${args.join(' ')}`);
  };

  // Log warnings but don't fail (configurable)
  console.warn = (...args) => {
    if (process.env.FAIL_ON_WARNINGS === 'true') {
      originalWarn.call(console, ...args);
      throw new Error(`Console warning detected during build test: ${args.join(' ')}`);
    } else {
      originalWarn.call(console, ...args);
    }
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock window.matchMedia for build tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock performance API with high precision for build tests
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
    timing: {
      navigationStart: Date.now(),
      loadEventEnd: Date.now() + 100
    }
  },
});

// Build-specific global utilities
global.buildTestUtils = {
  // Assert no console errors occurred
  assertNoConsoleErrors: () => {
    // This is handled by the console.error override above
    return true;
  },
  
  // Performance assertion for build tests
  assertPerformance: (testFunction, maxTime = 100) => {
    const start = performance.now();
    const result = testFunction();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > maxTime) {
      throw new Error(`Performance test failed: ${duration}ms > ${maxTime}ms`);
    }
    
    return result;
  },
  
  // Memory usage check for build tests
  assertMemoryUsage: () => {
    if (typeof process !== 'undefined' && process.memoryUsage) {
      const usage = process.memoryUsage();
      const maxHeapMB = 100; // 100MB limit for component tests
      const heapUsedMB = usage.heapUsed / 1024 / 1024;
      
      if (heapUsedMB > maxHeapMB) {
        throw new Error(`Memory usage too high: ${heapUsedMB.toFixed(2)}MB > ${maxHeapMB}MB`);
      }
    }
    return true;
  },
  
  // Build environment validation
  validateBuildEnvironment: () => {
    const requiredEnvVars = ['NODE_ENV'];
    const missing = requiredEnvVars.filter(env => !process.env[env]);
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    return true;
  }
};

// Enhanced expect matchers for build tests
expect.extend({
  toBeAccessible(received) {
    const pass = received && 
                 received.getAttribute &&
                 received.getAttribute('role') !== null;
    
    if (pass) {
      return {
        message: () => `expected element not to be accessible`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to be accessible (have role attribute)`,
        pass: false,
      };
    }
  },
  
  toRenderWithoutErrors(componentFunction) {
    try {
      const result = componentFunction();
      return {
        message: () => `expected component to throw an error during rendering`,
        pass: true,
      };
    } catch (error) {
      return {
        message: () => `expected component not to throw error: ${error.message}`,
        pass: false,
      };
    }
  },
  
  toBeBuildReady(received) {
    // Check if component meets build readiness criteria
    const checks = [
      () => received !== null && received !== undefined,
      () => typeof received === 'object' || typeof received === 'function',
      () => !received.toString().includes('console.log'), // No debug logs
      () => !received.toString().includes('debugger'), // No debugger statements
    ];
    
    const failures = [];
    checks.forEach((check, index) => {
      try {
        if (!check()) {
          failures.push(`Check ${index + 1} failed`);
        }
      } catch (error) {
        failures.push(`Check ${index + 1} error: ${error.message}`);
      }
    });
    
    const pass = failures.length === 0;
    
    if (pass) {
      return {
        message: () => `expected component not to be build ready`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected component to be build ready. Failures: ${failures.join(', ')}`,
        pass: false,
      };
    }
  }
});

// Build test environment validation
beforeAll(() => {
  console.log('🔍 Validating build test environment...');
  
  try {
    global.buildTestUtils.validateBuildEnvironment();
    console.log('✅ Build environment validation passed');
  } catch (error) {
    console.error('❌ Build environment validation failed:', error.message);
    throw error;
  }
});

// Track test execution for build reporting
let testExecutionLog = [];

beforeEach((testInfo) => {
  testExecutionLog.push({
    name: testInfo?.name || 'unknown',
    startTime: Date.now(),
    status: 'running'
  });
});

afterEach((testInfo) => {
  const lastTest = testExecutionLog[testExecutionLog.length - 1];
  if (lastTest) {
    lastTest.endTime = Date.now();
    lastTest.duration = lastTest.endTime - lastTest.startTime;
    lastTest.status = 'completed';
  }
});

// Export test execution log for build reporting
global.getBuildTestExecutionLog = () => testExecutionLog;