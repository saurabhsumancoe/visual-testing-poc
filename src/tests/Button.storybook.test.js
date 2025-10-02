import { expect } from 'storybook/test';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import * as ButtonStories from '../stories/Button.stories';

// Compose all stories from the Button stories file
const { Primary, Secondary, Large, Small } = composeStories(ButtonStories);

describe('Button Storybook Integration Tests', () => {
  describe('Story Composition Tests', () => {
    test('Primary story renders correctly', () => {
      render(<Primary />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });

    test('Secondary story renders correctly', () => {
      render(<Secondary />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });

    test('Large story renders correctly', () => {
      render(<Large />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });

    test('Small story renders correctly', () => {
      render(<Small />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Button');
    });
  });

  describe('Story Args Validation', () => {
    test('Primary story has correct args', () => {
      expect(Primary.args).toEqual({
        primary: true,
        label: 'Button',
      });
    });

    test('Secondary story has correct args', () => {
      expect(Secondary.args).toEqual({
        label: 'Button',
      });
    });

    test('Large story has correct args', () => {
      expect(Large.args).toEqual({
        size: 'large',
        label: 'Button',
      });
    });

    test('Small story has correct args', () => {
      expect(Small.args).toEqual({
        size: 'small',
        label: 'Button',
      });
    });
  });

  describe('Story Metadata Validation', () => {
    test('Button stories have correct default export', () => {
      expect(ButtonStories.default.title).toBe('Example/Button');
      expect(ButtonStories.default.component).toBeDefined();
      expect(ButtonStories.default.tags).toContain('autodocs');
    });

    test('Button stories have correct parameters', () => {
      expect(ButtonStories.default.parameters.layout).toBe('centered');
    });

    test('Button stories have correct argTypes', () => {
      expect(ButtonStories.default.argTypes.backgroundColor).toEqual({ control: 'color' });
    });
  });

  describe('Visual Regression with Stories', () => {
    test('Primary button story snapshot', () => {
      const { container } = render(<Primary />);
      expect(container.firstChild).toMatchSnapshot('primary-button-story');
    });

    test('Secondary button story snapshot', () => {
      const { container } = render(<Secondary />);
      expect(container.firstChild).toMatchSnapshot('secondary-button-story');
    });

    test('Large button story snapshot', () => {
      const { container } = render(<Large />);
      expect(container.firstChild).toMatchSnapshot('large-button-story');
    });

    test('Small button story snapshot', () => {
      const { container } = render(<Small />);
      expect(container.firstChild).toMatchSnapshot('small-button-story');
    });
  });

  describe('Storybook Controls Integration', () => {
    test('Can override story args', () => {
      const customArgs = { label: 'Custom Label', primary: false };
      render(<Primary {...customArgs} />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Custom Label');
    });

    test('Stories maintain their default behavior', () => {
      // Test that stories work with their default args
      render(<Primary />);
      expect(screen.getByRole('button')).toHaveTextContent('Button');
      
      render(<Large />);
      expect(screen.getByRole('button')).toHaveTextContent('Button');
    });
  });

  describe('Actions Integration', () => {
    test('Stories include onClick action', () => {
      // Note: In a real test environment, you would test that the onClick
      // function from the story args is properly called
      expect(ButtonStories.default.args.onClick).toBeDefined();
      expect(typeof ButtonStories.default.args.onClick).toBe('function');
    });
  });
});