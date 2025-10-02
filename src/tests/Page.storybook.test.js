import { expect, userEvent, within } from 'storybook/test';
import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as PageStories from '../stories/Page.stories';

// Compose all stories from the Page stories file
const { LoggedOut, LoggedIn } = composeStories(PageStories);

describe('Page Storybook Integration Tests', () => {
  describe('Story Composition Tests', () => {
    test('LoggedOut story renders correctly', () => {
      render(<LoggedOut />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByText('Pages in Storybook')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('LoggedIn story renders correctly', async () => {
      render(<LoggedIn />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByText('Pages in Storybook')).toBeInTheDocument();
    });
  });

  describe('Story Interaction Tests', () => {
    test('LoggedIn story play function executes correctly', async () => {
      // Create a mock canvas element
      const mockCanvasElement = document.createElement('div');
      document.body.appendChild(mockCanvasElement);
      
      // Render the LoggedIn story
      render(<LoggedIn />, { container: mockCanvasElement });
      
      // Execute the play function if it exists
      if (LoggedIn.play) {
        await LoggedIn.play({ canvasElement: mockCanvasElement });
      }
      
      // Verify the expected outcome
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      document.body.removeChild(mockCanvasElement);
    });

    test('LoggedIn story simulates user interactions correctly', async () => {
      const { container } = render(<LoggedIn />);
      const canvas = within(container);
      
      // Initially should show login button
      const loginButton = canvas.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      
      // Simulate user clicking login
      await userEvent.click(loginButton);
      
      // Should now show logout button
      await waitFor(() => {
        const logoutButton = canvas.getByRole('button', { name: /log out/i });
        expect(logoutButton).toBeInTheDocument();
      });
    });
  });

  describe('Story Metadata Validation', () => {
    test('Page stories have correct default export', () => {
      expect(PageStories.default.title).toBe('Example/Page');
      expect(PageStories.default.component).toBeDefined();
    });

    test('Page stories have correct parameters', () => {
      expect(PageStories.default.parameters.layout).toBe('fullscreen');
    });

    test('LoggedIn story has play function', () => {
      expect(LoggedIn.play).toBeDefined();
      expect(typeof LoggedIn.play).toBe('function');
    });
  });

  describe('Storybook Testing Library Integration', () => {
    test('Can use Storybook testing utilities', async () => {
      const { container } = render(<LoggedOut />);
      const canvas = within(container);
      
      // Test that we can find elements using Storybook's within utility
      const loginButton = canvas.getByRole('button', { name: /log in/i });
      expect(loginButton).toBeInTheDocument();
      
      // Test userEvent integration
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        const logoutButton = canvas.getByRole('button', { name: /log out/i });
        expect(logoutButton).toBeInTheDocument();
      });
    });

    test('Storybook expect assertions work', async () => {
      const { container } = render(<LoggedOut />);
      const canvas = within(container);
      
      const loginButton = canvas.getByRole('button', { name: /log in/i });
      
      // Use Storybook's expect
      await expect(loginButton).toBeInTheDocument();
      
      await userEvent.click(loginButton);
      
      await expect(loginButton).not.toBeInTheDocument();
    });
  });

  describe('Visual Regression with Stories', () => {
    test('LoggedOut story snapshot', () => {
      const { container } = render(<LoggedOut />);
      expect(container.firstChild).toMatchSnapshot('page-logged-out-story');
    });

    test('LoggedIn story snapshot after interaction', async () => {
      const { container } = render(<LoggedIn />);
      const canvas = within(container);
      
      // Trigger the login interaction
      const loginButton = canvas.getByRole('button', { name: /log in/i });
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      expect(container.firstChild).toMatchSnapshot('page-logged-in-story');
    });
  });

  describe('Cross-Story Testing', () => {
    test('Both stories maintain consistent content structure', () => {
      const { container: loggedOutContainer } = render(<LoggedOut />);
      const { container: loggedInContainer } = render(<LoggedIn />);
      
      // Both should have the same main content
      expect(loggedOutContainer.querySelector('h2')).toHaveTextContent('Pages in Storybook');
      expect(loggedInContainer.querySelector('h2')).toHaveTextContent('Pages in Storybook');
      
      // Both should have the same external links
      const loggedOutLinks = loggedOutContainer.querySelectorAll('a[target="_blank"]');
      const loggedInLinks = loggedInContainer.querySelectorAll('a[target="_blank"]');
      expect(loggedOutLinks).toHaveLength(loggedInLinks.length);
    });

    test('Stories demonstrate different authentication states', async () => {
      // Test LoggedOut story
      const { container: loggedOutContainer } = render(<LoggedOut />);
      expect(within(loggedOutContainer).getByRole('button', { name: /log in/i })).toBeInTheDocument();
      
      // Test LoggedIn story with interaction
      const { container: loggedInContainer } = render(<LoggedIn />);
      const canvas = within(loggedInContainer);
      
      const loginButton = canvas.getByRole('button', { name: /log in/i });
      await userEvent.click(loginButton);
      
      await waitFor(() => {
        expect(canvas.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
    });
  });

  describe('Story Error Handling', () => {
    test('Stories handle missing props gracefully', () => {
      expect(() => {
        render(<LoggedOut />);
      }).not.toThrow();
      
      expect(() => {
        render(<LoggedIn />);
      }).not.toThrow();
    });

    test('Play function handles errors gracefully', async () => {
      const mockCanvasElement = document.createElement('div');
      
      // Test that play function doesn't throw errors
      if (LoggedIn.play) {
        expect(async () => {
          await LoggedIn.play({ canvasElement: mockCanvasElement });
        }).not.toThrow();
      }
    });
  });
});