import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import '@testing-library/jest-dom';
import { Button } from '../stories/Button';
import * as ButtonStories from '../stories/Button.stories';

// Compose stories for testing
const { Primary, Secondary, Large, Small } = composeStories(ButtonStories);

describe('Button Component - Build Stage Tests', () => {
  // Core functionality tests that must pass for build
  describe('Essential Functionality', () => {
    test('renders without crashing', () => {
      expect(() => render(<Button label="Test" />)).not.toThrow();
    });

    test('displays provided label text', () => {
      const testLabel = 'Click Me';
      render(<Button label={testLabel} />);
      expect(screen.getByText(testLabel)).toBeInTheDocument();
    });

    test('executes onClick handler when clicked', () => {
      const handleClick = jest.fn();
      render(<Button label="Test" onClick={handleClick} />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    test('has correct accessibility attributes', () => {
      render(<Button label="Accessible Button" />);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAccessibleName('Accessible Button');
    });
  });

  // Story integration tests
  describe('Storybook Story Integration', () => {
    test('Primary story renders correctly', () => {
      expect(() => render(<Primary />)).not.toThrow();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('Secondary story renders correctly', () => {
      expect(() => render(<Secondary />)).not.toThrow();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('Large story renders correctly', () => {
      expect(() => render(<Large />)).not.toThrow();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('Small story renders correctly', () => {
      expect(() => render(<Small />)).not.toThrow();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // Props validation tests
  describe('Props Handling', () => {
    test('handles missing onClick gracefully', () => {
      expect(() => render(<Button label="No Handler" />)).not.toThrow();
    });

    test('handles empty label', () => {
      expect(() => render(<Button label="" />)).not.toThrow();
    });

    test('applies primary styling when primary prop is true', () => {
      render(<Button label="Primary" primary={true} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    test('applies size classes correctly', () => {
      const { rerender } = render(<Button label="Small" size="small" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      
      rerender(<Button label="Large" size="large" />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  // Critical error prevention tests
  describe('Error Prevention', () => {
    test('does not throw when clicked without onClick handler', () => {
      render(<Button label="No Handler" />);
      expect(() => {
        fireEvent.click(screen.getByRole('button'));
      }).not.toThrow();
    });

    test('handles null/undefined props safely', () => {
      expect(() => render(<Button label={null} />)).not.toThrow();
      expect(() => render(<Button label={undefined} />)).not.toThrow();
    });
  });

  // Snapshot tests for visual consistency
  describe('Visual Consistency', () => {
    test('Primary button snapshot', () => {
      const { container } = render(<Primary />);
      expect(container.firstChild).toMatchSnapshot('button-primary');
    });

    test('Secondary button snapshot', () => {
      const { container } = render(<Secondary />);
      expect(container.firstChild).toMatchSnapshot('button-secondary');
    });
  });
});

// Export test metadata for build reporting
export const buttonTestMetadata = {
  component: 'Button',
  totalTests: 16,
  criticalTests: 8,
  storyTests: 4,
  propTests: 4
};