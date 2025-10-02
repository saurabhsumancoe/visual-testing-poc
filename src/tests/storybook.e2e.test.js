import { test, expect } from '@playwright/test';

// Base URL for Storybook (adjust port if needed)
const STORYBOOK_URL = 'http://localhost:6006';

test.describe('Storybook E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Storybook
    await page.goto(STORYBOOK_URL);
    
    // Wait for Storybook to load
    await page.waitForSelector('[data-testid="sidebar-container"]', { timeout: 10000 });
  });

  test.describe('Button Component Stories', () => {
    test('Primary Button story renders correctly', async ({ page }) => {
      // Navigate to Primary Button story
      await page.click('text=Button');
      await page.click('text=Primary');
      
      // Wait for the story to load
      await page.waitForSelector('#storybook-preview-iframe');
      
      // Switch to iframe
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Verify button is present and has correct text
      await expect(iframe.getByRole('button', { name: 'Button' })).toBeVisible();
      
      // Test button interaction
      await iframe.getByRole('button', { name: 'Button' }).click();
      
      // Verify button styling (adjust selectors based on actual CSS classes)
      const button = iframe.getByRole('button', { name: 'Button' });
      await expect(button).toHaveClass(/chromatic-button/);
    });

    test('Secondary Button story renders correctly', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Secondary');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await expect(iframe.getByRole('button', { name: 'Button' })).toBeVisible();
      
      // Test interaction
      await iframe.getByRole('button', { name: 'Button' }).click();
    });

    test('Large Button story renders correctly', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Large');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      const button = iframe.getByRole('button', { name: 'Button' });
      
      await expect(button).toBeVisible();
      await button.click();
    });

    test('Small Button story renders correctly', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Small');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      const button = iframe.getByRole('button', { name: 'Button' });
      
      await expect(button).toBeVisible();
      await button.click();
    });
  });

  test.describe('Header Component Stories', () => {
    test('Header LoggedIn story renders correctly', async ({ page }) => {
      await page.click('text=Header');
      await page.click('text=Logged In');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Verify header elements
      await expect(iframe.getByText('Acme')).toBeVisible();
      await expect(iframe.getByText('Welcome, Jane Doe!')).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Log out' })).toBeVisible();
      
      // Test logout button interaction
      await iframe.getByRole('button', { name: 'Log out' }).click();
    });

    test('Header LoggedOut story renders correctly', async ({ page }) => {
      await page.click('text=Header');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Verify header elements for logged out state
      await expect(iframe.getByText('Acme')).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Log in' })).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Sign up' })).toBeVisible();
      
      // Test login button interaction
      await iframe.getByRole('button', { name: 'Log in' }).click();
    });
  });

  test.describe('Page Component Stories', () => {
    test('Page LoggedOut story renders correctly', async ({ page }) => {
      await page.click('text=Page');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Verify page content
      await expect(iframe.getByText('Pages in Storybook')).toBeVisible();
      await expect(iframe.getByText('Acme')).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Log in' })).toBeVisible();
      
      // Verify external links
      await expect(iframe.getByRole('link', { name: 'component-driven' })).toBeVisible();
      await expect(iframe.getByRole('link', { name: 'Storybook tutorials' })).toBeVisible();
      
      // Test login functionality
      await iframe.getByRole('button', { name: 'Log in' }).click();
      await expect(iframe.getByText('Welcome, Jane Doe!')).toBeVisible();
    });

    test('Page LoggedIn story with interaction test', async ({ page }) => {
      await page.click('text=Page');
      await page.click('text=Logged In');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Wait for the interaction test to complete
      // The story has a play function that automatically clicks login
      await expect(iframe.getByText('Welcome, Jane Doe!')).toBeVisible();
      await expect(iframe.getByRole('button', { name: 'Log out' })).toBeVisible();
      
      // Test logout functionality
      await iframe.getByRole('button', { name: 'Log out' }).click();
      await expect(iframe.getByRole('button', { name: 'Log in' })).toBeVisible();
    });
  });

  test.describe('Storybook UI Functionality', () => {
    test('Storybook controls panel works', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Primary');
      
      // Open controls panel
      await page.click('[title="Controls"]');
      
      // Verify controls are visible
      await expect(page.getByText('label')).toBeVisible();
      
      // Change a control value
      await page.fill('input[name="label"]', 'Custom Button Text');
      
      // Verify the change is reflected in the story
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await expect(iframe.getByRole('button', { name: 'Custom Button Text' })).toBeVisible();
    });

    test('Storybook docs panel works', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Primary');
      
      // Open docs panel
      await page.click('[title="Docs"]');
      
      // Verify docs content is visible
      await expect(page.getByText('Button')).toBeVisible();
    });

    test('Storybook actions panel captures events', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Primary');
      
      // Open actions panel
      await page.click('[title="Actions"]');
      
      // Click the button in the story
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await iframe.getByRole('button', { name: 'Button' }).click();
      
      // Verify action was captured (adjust selector based on actual UI)
      await expect(page.getByText('onClick')).toBeVisible();
    });
  });

  test.describe('Visual Regression Tests', () => {
    test('Button Primary story visual regression', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Primary');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await iframe.getByRole('button', { name: 'Button' }).waitFor();
      
      // Take screenshot of the iframe content
      await expect(iframe.locator('body')).toHaveScreenshot('button-primary.png');
    });

    test('Header LoggedIn story visual regression', async ({ page }) => {
      await page.click('text=Header');
      await page.click('text=Logged In');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await iframe.getByText('Acme').waitFor();
      
      await expect(iframe.locator('body')).toHaveScreenshot('header-logged-in.png');
    });

    test('Page LoggedOut story visual regression', async ({ page }) => {
      await page.click('text=Page');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await iframe.getByText('Pages in Storybook').waitFor();
      
      await expect(iframe.locator('body')).toHaveScreenshot('page-logged-out.png');
    });
  });

  test.describe('Accessibility Tests', () => {
    test('Button stories are accessible', async ({ page }) => {
      await page.click('text=Button');
      await page.click('text=Primary');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      const button = iframe.getByRole('button', { name: 'Button' });
      
      // Test keyboard navigation
      await button.focus();
      await expect(button).toBeFocused();
      
      // Test keyboard activation
      await button.press('Enter');
      
      // Verify ARIA attributes
      await expect(button).toHaveAttribute('type', 'button');
    });

    test('Header stories are accessible', async ({ page }) => {
      await page.click('text=Header');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Test that header has proper semantic structure
      await expect(iframe.locator('header')).toBeVisible();
      
      // Test keyboard navigation through buttons
      await iframe.getByRole('button', { name: 'Log in' }).focus();
      await iframe.getByRole('button', { name: 'Log in' }).press('Tab');
      await expect(iframe.getByRole('button', { name: 'Sign up' })).toBeFocused();
    });

    test('Page stories are accessible', async ({ page }) => {
      await page.click('text=Page');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      
      // Test semantic structure
      await expect(iframe.locator('article')).toBeVisible();
      await expect(iframe.locator('header')).toBeVisible();
      
      // Test heading hierarchy
      const h1 = iframe.locator('h1');
      const h2 = iframe.locator('h2');
      await expect(h1).toBeVisible();
      await expect(h2).toBeVisible();
      
      // Test link accessibility
      const links = iframe.locator('a[target="_blank"]');
      const linkCount = await links.count();
      
      for (let i = 0; i < linkCount; i++) {
        const link = links.nth(i);
        await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });

  test.describe('Cross-Browser Compatibility', () => {
    test('Stories work consistently across viewport sizes', async ({ page }) => {
      // Test mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      await page.click('text=Page');
      await page.click('text=Logged Out');
      
      const iframe = page.frameLocator('#storybook-preview-iframe');
      await expect(iframe.getByText('Pages in Storybook')).toBeVisible();
      
      // Test desktop viewport
      await page.setViewportSize({ width: 1920, height: 1080 });
      await expect(iframe.getByText('Pages in Storybook')).toBeVisible();
      
      // Test tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      await expect(iframe.getByText('Pages in Storybook')).toBeVisible();
    });
  });
});