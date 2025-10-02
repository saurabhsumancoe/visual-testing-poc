import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import { Header } from '../stories/Header';
import * as HeaderStories from '../stories/Header.stories';

// Compose stories for testing
const { LoggedIn, LoggedOut } = composeStories(HeaderStories);

describe('Header Component - Build Stage Tests', () => {
  // Core functionality tests that must pass for build
  describe('Essential Functionality', () => {
    test('renders without crashing', () => {
      expect(() => render(<Header />)).not.toThrow();
    });

    test('displays brand logo and title', () => {
      render(<Header />);
      expect(screen.getByText('Acme')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('shows login buttons when user is not logged in', () => {
      const mockLogin = jest.fn();
      const mockSignUp = jest.fn();
      
      render(<Header onLogin={mockLogin} onCreateAccount={mockSignUp} />);
      
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('shows logout button and welcome message when user is logged in', () => {
      const mockLogout = jest.fn();
      const user = { name: 'Test User' };
      
      render(<Header user={user} onLogout={mockLogout} />);
      
      expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
    });

    test('executes callback functions when buttons are clicked', () => {
      const mockLogin = jest.fn();
      const mockSignUp = jest.fn();
      const mockLogout = jest.fn();
      
      // Test logged out state
      const { rerender } = render(<Header onLogin={mockLogin} onCreateAccount={mockSignUp} />);
      
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
      expect(mockLogin).toHaveBeenCalledTimes(1);
      
      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
      expect(mockSignUp).toHaveBeenCalledTimes(1);
      
      // Test logged in state
      rerender(<Header user={{ name: 'Test' }} onLogout={mockLogout} />);
      
      fireEvent.click(screen.getByRole('button', { name: /log out/i }));
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });

  // Story integration tests
  describe('Storybook Story Integration', () => {
    test('LoggedIn story renders correctly', () => {
      expect(() => render(<LoggedIn />)).not.toThrow();
      expect(screen.getByText(/welcome, jane doe/i)).toBeInTheDocument();
    });

    test('LoggedOut story renders correctly', () => {
      expect(() => render(<LoggedOut />)).not.toThrow();
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
    });
  });

  // Props validation tests
  describe('Props Handling', () => {
    test('handles missing callback functions gracefully', () => {
      expect(() => render(<Header />)).not.toThrow();
    });

    test('handles user object variations', () => {
      expect(() => render(<Header user={{ name: '' }} />)).not.toThrow();
      expect(() => render(<Header user={{ name: 'Very Long User Name That Might Cause Issues' }} />)).not.toThrow();
      expect(() => render(<Header user={null} />)).not.toThrow();
    });

    test('maintains proper semantic structure', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header.tagName).toBe('HEADER');
      expect(header.querySelector('h1')).toHaveTextContent('Acme');
    });
  });

  // Accessibility tests
  describe('Accessibility Compliance', () => {
    test('has proper ARIA structure', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    test('supports keyboard navigation', () => {
      render(<Header onLogin={jest.fn()} onCreateAccount={jest.fn()} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      loginButton.focus();
      expect(loginButton).toHaveFocus();
    });
  });

  // Critical error prevention tests
  describe('Error Prevention', () => {
    test('does not crash when callbacks are missing and buttons are clicked', () => {
      render(<Header />);
      
      expect(() => {
        const buttons = screen.getAllByRole('button');
        buttons.forEach(button => fireEvent.click(button));
      }).not.toThrow();
    });

    test('handles malformed user object', () => {
      expect(() => render(<Header user={{}} />)).not.toThrow();
      expect(() => render(<Header user={{ invalidProp: 'test' }} />)).not.toThrow();
    });
  });

  // Visual consistency tests
  describe('Visual Consistency', () => {
    test('LoggedOut header snapshot', () => {
      const { container } = render(<LoggedOut />);
      expect(container.firstChild).toMatchSnapshot('header-logged-out');
    });

    test('LoggedIn header snapshot', () => {
      const { container } = render(<LoggedIn />);
      expect(container.firstChild).toMatchSnapshot('header-logged-in');
    });
  });
});

// Export test metadata for build reporting
export const headerTestMetadata = {
  component: 'Header',
  totalTests: 16,
  criticalTests: 6,
  storyTests: 2,
  propTests: 4,
  accessibilityTests: 2,
  errorTests: 2
};