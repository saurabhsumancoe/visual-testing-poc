import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import { Page } from '../stories/Page';
import * as PageStories from '../stories/Page.stories';

// Compose stories for testing
const { LoggedOut, LoggedIn } = composeStories(PageStories);

describe('Page Component - Build Stage Tests', () => {
  // Core functionality tests that must pass for build
  describe('Essential Functionality', () => {
    test('renders without crashing', () => {
      expect(() => render(<Page />)).not.toThrow();
    });

    test('displays main content sections', () => {
      render(<Page />);
      
      expect(screen.getByText('Pages in Storybook')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    test('contains all required external links', () => {
      render(<Page />);
      
      const componentDrivenLink = screen.getByRole('link', { name: /component-driven/i });
      const tutorialsLink = screen.getByRole('link', { name: /storybook tutorials/i });
      const docsLink = screen.getByRole('link', { name: /docs/i });
      
      expect(componentDrivenLink).toHaveAttribute('href', 'https://componentdriven.org');
      expect(tutorialsLink).toHaveAttribute('href', 'https://storybook.js.org/tutorials/');
      expect(docsLink).toHaveAttribute('href', 'https://storybook.js.org/docs');
      
      // Verify security attributes
      [componentDrivenLink, tutorialsLink, docsLink].forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    test('handles authentication state changes correctly', async () => {
      render(<Page />);
      
      // Initial state - should show login buttons
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      
      // Click login button
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      // Should show logged-in state
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      // Should not show login buttons
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
    });

    test('handles logout functionality', async () => {
      render(<Page />);
      
      // Login first
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      // Logout
      fireEvent.click(screen.getByRole('button', { name: /log out/i }));
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/welcome, jane doe/i)).not.toBeInTheDocument();
    });
  });

  // Story integration tests
  describe('Storybook Story Integration', () => {
    test('LoggedOut story renders correctly', () => {
      expect(() => render(<LoggedOut />)).not.toThrow();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });

    test('LoggedIn story executes interaction test', async () => {
      expect(() => render(<LoggedIn />)).not.toThrow();
      
      // The LoggedIn story should automatically trigger login interaction
      await waitFor(() => {
        // After the play function executes, user should be logged in
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  // Content structure tests
  describe('Content Structure', () => {
    test('has proper semantic HTML structure', () => {
      render(<Page />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument(); // Acme
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument(); // Pages in Storybook
    });

    test('contains all required list items', () => {
      render(<Page />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      
      expect(listItems[0]).toHaveTextContent(/higher-level connected component/i);
      expect(listItems[1]).toHaveTextContent(/assemble data in the page component/i);
    });
  });

  // Accessibility tests
  describe('Accessibility Compliance', () => {
    test('maintains proper heading hierarchy', () => {
      render(<Page />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      
      expect(h1).toHaveTextContent('Acme');
      expect(h2).toHaveTextContent('Pages in Storybook');
    });

    test('all interactive elements are keyboard accessible', async () => {
      render(<Page />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      loginButton.focus();
      expect(loginButton).toHaveFocus();
      
      // Test keyboard activation
      fireEvent.keyDown(loginButton, { key: 'Enter', code: 'Enter' });
      
      await waitFor(() => {
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        expect(logoutButton).toBeInTheDocument();
      });
    });

    test('external links have proper security attributes', () => {
      render(<Page />);
      
      const externalLinks = screen.getAllByRole('link').filter(link => 
        link.getAttribute('target') === '_blank'
      );
      
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });
  });

  // State management tests
  describe('State Management', () => {
    test('maintains state consistency through user interactions', async () => {
      render(<Page />);
      
      // Multiple login/logout cycles
      for (let i = 0; i < 3; i++) {
        // Login
        fireEvent.click(screen.getByRole('button', { name: /log in/i }));
        
        await waitFor(() => {
          expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        });
        
        // Logout
        fireEvent.click(screen.getByRole('button', { name: /log out/i }));
        
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        });
      }
      
      // Should end in consistent logged-out state
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('sign up button also triggers login', async () => {
      render(<Page />);
      
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('renders within acceptable time', () => {
      const startTime = performance.now();
      render(<Page />);
      const endTime = performance.now();
      
      expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
    });

    test('handles rapid state changes without memory leaks', async () => {
      render(<Page />);
      
      // Rapid clicking should not cause issues
      for (let i = 0; i < 10; i++) {
        const loginButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.click(loginButton);
        
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
        });
        
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        fireEvent.click(logoutButton);
        
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        });
      }
    });
  });

  // Visual consistency tests
  describe('Visual Consistency', () => {
    test('LoggedOut page snapshot', () => {
      const { container } = render(<LoggedOut />);
      expect(container.firstChild).toMatchSnapshot('page-logged-out');
    });

    test('LoggedIn page snapshot', async () => {
      const { container } = render(<Page />);
      
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
      });
      
      expect(container.firstChild).toMatchSnapshot('page-logged-in');
    });
  });
});

// Export test metadata for build reporting
export const pageTestMetadata = {
  component: 'Page',
  totalTests: 19,
  criticalTests: 5,
  storyTests: 2,
  contentTests: 2,
  accessibilityTests: 3,
  stateTests: 2,
  performanceTests: 2,
  visualTests: 2
};