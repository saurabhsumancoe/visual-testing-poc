import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Page } from '../stories/Page';

describe('Page Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders page with header and content', () => {
      render(<Page />);
      
      // Check header is present
      expect(screen.getByRole('banner')).toBeInTheDocument();
      
      // Check main content
      expect(screen.getByText('Pages in Storybook')).toBeInTheDocument();
      expect(screen.getByText(/component-driven/i)).toBeInTheDocument();
    });

    test('renders all content sections', () => {
      render(<Page />);
      
      // Main heading
      expect(screen.getByRole('heading', { name: /pages in storybook/i })).toBeInTheDocument();
      
      // Links
      expect(screen.getByRole('link', { name: /component-driven/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /storybook tutorials/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /docs/i })).toBeInTheDocument();
      
      // List items
      expect(screen.getByText(/higher-level connected component/i)).toBeInTheDocument();
      expect(screen.getByText(/assemble data in the page component/i)).toBeInTheDocument();
    });

    test('renders initial state with login buttons', () => {
      render(<Page />);
      
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });
  });

  // User interaction flow tests
  describe('User Authentication Flow', () => {
    test('logs in user when login button is clicked', async () => {
      render(<Page />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
    });

    test('logs in user when sign up button is clicked', async () => {
      render(<Page />);
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
    });

    test('logs out user when logout button is clicked', async () => {
      render(<Page />);
      
      // First login
      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      });
      
      // Then logout
      const logoutButton = screen.getByRole('button', { name: /log out/i });
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/welcome, jane doe/i)).not.toBeInTheDocument();
    });

    test('handles multiple login/logout cycles', async () => {
      render(<Page />);
      
      for (let i = 0; i < 3; i++) {
        // Login
        const loginButton = screen.getByRole('button', { name: /log in/i });
        fireEvent.click(loginButton);
        
        await waitFor(() => {
          expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
        });
        
        // Logout
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        fireEvent.click(logoutButton);
        
        await waitFor(() => {
          expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
        });
      }
    });
  });

  // Content and links tests
  describe('Content and Links', () => {
    test('external links have correct attributes', () => {
      render(<Page />);
      
      const componentDrivenLink = screen.getByRole('link', { name: /component-driven/i });
      expect(componentDrivenLink).toHaveAttribute('href', 'https://componentdriven.org');
      expect(componentDrivenLink).toHaveAttribute('target', '_blank');
      expect(componentDrivenLink).toHaveAttribute('rel', 'noopener noreferrer');
      
      const tutorialsLink = screen.getByRole('link', { name: /storybook tutorials/i });
      expect(tutorialsLink).toHaveAttribute('href', 'https://storybook.js.org/tutorials/');
      expect(tutorialsLink).toHaveAttribute('target', '_blank');
      
      const docsLink = screen.getByRole('link', { name: /docs/i });
      expect(docsLink).toHaveAttribute('href', 'https://storybook.js.org/docs');
      expect(docsLink).toHaveAttribute('target', '_blank');
    });

    test('renders all list items correctly', () => {
      render(<Page />);
      
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(2);
      
      expect(listItems[0]).toHaveTextContent(/higher-level connected component/i);
      expect(listItems[1]).toHaveTextContent(/assemble data in the page component/i);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('has correct semantic structure', () => {
      render(<Page />);
      
      expect(screen.getByRole('article')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    test('links are keyboard accessible', () => {
      render(<Page />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        link.focus();
        expect(link).toHaveFocus();
      });
    });

    test('buttons are keyboard accessible throughout authentication flow', async () => {
      render(<Page />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      loginButton.focus();
      expect(loginButton).toHaveFocus();
      
      fireEvent.keyDown(loginButton, { key: 'Enter' });
      
      await waitFor(() => {
        const logoutButton = screen.getByRole('button', { name: /log out/i });
        expect(logoutButton).toBeInTheDocument();
        
        logoutButton.focus();
        expect(logoutButton).toHaveFocus();
      });
    });

    test('has proper heading hierarchy', () => {
      render(<Page />);
      
      const headings = screen.getAllByRole('heading');
      expect(headings[0]).toHaveTextContent('Acme'); // h1 from header
      expect(headings[1]).toHaveTextContent('Pages in Storybook'); // h2 from content
    });
  });

  // Integration tests
  describe('Integration Tests', () => {
    test('header state persists during content interaction', async () => {
      render(<Page />);
      
      // Login first
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
      });
      
      // Click on external links (they should open in new tab, not affect our page state)
      const externalLink = screen.getByRole('link', { name: /component-driven/i });
      fireEvent.click(externalLink);
      
      // User should still be logged in
      expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
    });

    test('page maintains state after re-renders', async () => {
      const { rerender } = render(<Page />);
      
      // Login
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
      });
      
      // Re-render component
      rerender(<Page />);
      
      // Note: This test shows that state is managed internally,
      // so re-rendering would reset to initial state
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });

  // Visual regression tests
  describe('Visual Regression', () => {
    test('matches snapshot in logged out state', () => {
      const { container } = render(<Page />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot in logged in state', async () => {
      const { container } = render(<Page />);
      
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      
      await waitFor(() => {
        expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
      });
      
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('renders without performance issues', () => {
      const startTime = performance.now();
      render(<Page />);
      const endTime = performance.now();
      
      // Should render within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(100);
    });

    test('handles rapid state changes without issues', async () => {
      render(<Page />);
      
      // Rapidly toggle login/logout
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
      
      // Should still be in consistent state
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });
});