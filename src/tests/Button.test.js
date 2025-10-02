import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../stories/Button';

describe('Button Component', () => {
  // Basic rendering tests
  describe('Rendering', () => {
    test('renders button with default props', () => {
      render(<Button label="Test Button" />);
      const button = screen.getByRole('button', { name: /test button/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('chromatic-button');
    });

    test('renders button with custom label', () => {
      const customLabel = 'Custom Button Text';
      render(<Button label={customLabel} />);
      expect(screen.getByText(customLabel)).toBeInTheDocument();
    });

    test('renders button with primary variant', () => {
      render(<Button label="Primary Button" primary={true} />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    test('renders button with different sizes', () => {
      const { rerender } = render(<Button label="Small Button" size="small" />);
      let button = screen.getByRole('button');
      expect(button).toBeInTheDocument();

      rerender(<Button label="Large Button" size="large" />);
      button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  // Interaction tests
  describe('Interactions', () => {
    test('calls onClick handler when clicked', () => {
      const mockOnClick = jest.fn();
      render(<Button label="Clickable Button" onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    test('does not call onClick when button is disabled', () => {
      const mockOnClick = jest.fn();
      render(<Button label="Disabled Button" onClick={mockOnClick} disabled={true} />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });

    test('handles keyboard events', () => {
      const mockOnClick = jest.fn();
      render(<Button label="Keyboard Button" onClick={mockOnClick} />);
      
      const button = screen.getByRole('button');
      button.focus();
      fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  // Accessibility tests
  describe('Accessibility', () => {
    test('has correct ARIA attributes', () => {
      render(<Button label="ARIA Button" />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'button');
    });

    test('is focusable', () => {
      render(<Button label="Focusable Button" />);
      const button = screen.getByRole('button');
      
      button.focus();
      expect(button).toHaveFocus();
    });

    test('supports screen readers', () => {
      render(<Button label="Screen Reader Button" />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAccessibleName('Screen Reader Button');
    });
  });

  // Visual regression tests (Storybook integration)
  describe('Visual Regression', () => {
    test('matches snapshot for primary button', () => {
      const { container } = render(<Button label="Primary" primary={true} />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot for secondary button', () => {
      const { container } = render(<Button label="Secondary" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot for small button', () => {
      const { container } = render(<Button label="Small" size="small" />);
      expect(container.firstChild).toMatchSnapshot();
    });

    test('matches snapshot for large button', () => {
      const { container } = render(<Button label="Large" size="large" />);
      expect(container.firstChild).toMatchSnapshot();
    });
  });

  // Edge cases
  describe('Edge Cases', () => {
    test('handles empty label gracefully', () => {
      render(<Button label="" />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('');
    });

    test('handles very long label', () => {
      const longLabel = 'This is a very long button label that might cause layout issues';
      render(<Button label={longLabel} />);
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(longLabel);
    });

    test('handles special characters in label', () => {
      const specialLabel = 'Button with @#$%^&*() characters';
      render(<Button label={specialLabel} />);
      expect(screen.getByText(specialLabel)).toBeInTheDocument();
    });
  });
});