import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from '../stories/Header';

describe('Header Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders header with logo and title', () => {
      render(<Header />);
      
      expect(screen.getByText('Acme')).toBeInTheDocument();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    test('renders login buttons when user is not logged in', () => {
      const mockOnLogin = jest.fn();
      const mockOnCreateAccount = jest.fn();
      
      render(
        <Header 
          onLogin={mockOnLogin} 
          onCreateAccount={mockOnCreateAccount} 
        />
      );
      
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('renders logout button and welcome message when user is logged in', () => {
      const mockOnLogout = jest.fn();
      const user = { name: 'John Doe' };
      
      render(
        <Header 
          user={user} 
          onLogout={mockOnLogout} 
        />
      );
      
      expect(screen.getByText(/welcome, john doe/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /sign up/i })).not.toBeInTheDocument();
    });

    test('renders SVG logo correctly', () => {
      render(<Header />);
      const svg = screen.getByRole('banner').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('width', '32');
      expect(svg).toHaveAttribute('height', '32');
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    test('calls onLogin when login button is clicked', () => {
      const mockOnLogin = jest.fn();
      const mockOnCreateAccount = jest.fn();
      
      render(
        <Header 
          onLogin={mockOnLogin} 
          onCreateAccount={mockOnCreateAccount} 
        />
      );
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      fireEvent.click(loginButton);
      
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('calls onCreateAccount when sign up button is clicked', () => {
      const mockOnLogin = jest.fn();
      const mockOnCreateAccount = jest.fn();
      
      render(
        <Header 
          onLogin={mockOnLogin} 
          onCreateAccount={mockOnCreateAccount} 
        />
      );
      
      const signUpButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(signUpButton);
      
      expect(mockOnCreateAccount).toHaveBeenCalledTimes(1);
    });

    test('calls onLogout when logout button is clicked', () => {
      const mockOnLogout = jest.fn();
      const user = { name: 'Jane Doe' };
      
      render(
        <Header 
          user={user} 
          onLogout={mockOnLogout} 
        />
      );
      
      const logoutButton = screen.getByRole('button', { name: /log out/i });
      fireEvent.click(logoutButton);
      
      expect(mockOnLogout).toHaveBeenCalledTimes(1);
    });
  });

  // State management tests
  describe('State Management', () => {
    test('displays different content based on authentication state', () => {
      const { rerender } = render(<Header />);
      
      // Initial state - logged out
      expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
      
      // After login
      const user = { name: 'Test User' };
      rerender(<Header user={user} onLogout={jest.fn()} />);
      
      expect(screen.getByText(/welcome, test user/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /log out/i })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument();
    });

    test('handles user name changes correctly', () => {
      const { rerender } = render(
        <Header user={{ name: 'First User' }} onLogout={jest.fn()} />
      );
      
      expect(screen.getByText(/welcome, first user/i)).toBeInTheDocument();
      
      rerender(<Header user={{ name: 'Second User' }} onLogout={jest.fn()} />);
      
      expect(screen.getByText(/welcome, second user/i)).toBeInTheDocument();
      expect(screen.queryByText(/welcome, first user/i)).not.toBeInTheDocument();
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('has correct semantic structure', () => {
      render(<Header />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      expect(header.tagName).toBe('HEADER');
    });

    test('buttons are keyboard accessible', () => {
      const mockOnLogin = jest.fn();
      render(<Header onLogin={mockOnLogin} />);
      
      const loginButton = screen.getByRole('button', { name: /log in/i });
      loginButton.focus();
      expect(loginButton).toHaveFocus();
      
      fireEvent.keyDown(loginButton, { key: 'Enter' });
      expect(mockOnLogin).toHaveBeenCalledTimes(1);
    });

    test('has proper ARIA labels and roles', () => {
      const user = { name: 'Test User' };
      render(<Header user={user} onLogout={jest.fn()} />);
      
      const logoutButton = screen.getByRole('button', { name: /log out/i });
      expect(logoutButton).toHaveAccessibleName();
    });
  });

  // Visual regression tests
  describe('Visual Regression', () => {
    test('matches snapshot when logged out', () => {
      const { container } = render(
        <Header onLogin={jest.fn()} onCreateAccount={jest.fn()} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot when logged in', () => {
      const { container } = render(
        <Header user={{ name: 'John Doe' }} onLogout={jest.fn()} />
      );
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('handles user with empty name', () => {
      render(<Header user={{ name: '' }} onLogout={jest.fn()} />);
      expect(screen.getByText(/welcome,/i)).toBeInTheDocument();
    });

    test('handles user with very long name', () => {
      const longName = 'This is a very long user name that might cause layout issues';
      render(<Header user={{ name: longName }} onLogout={jest.fn()} />);
      expect(screen.getByText(new RegExp(`welcome, ${longName}`, 'i'))).toBeInTheDocument();
    });

    test('handles missing callback functions gracefully', () => {
      expect(() => {
        render(<Header />);
      }).not.toThrow();
    });

    test('handles user with special characters in name', () => {
      const specialName = 'User@#$%^&*()';
      render(<Header user={{ name: specialName }} onLogout={jest.fn()} />);
      expect(screen.getByText(new RegExp(`welcome, ${specialName}`, 'i'))).toBeInTheDocument();
    });
  });
});