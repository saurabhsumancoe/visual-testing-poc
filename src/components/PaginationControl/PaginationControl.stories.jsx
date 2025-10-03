import React from 'react';
import { PaginationControl } from './PaginationControl';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
export default {
  title: 'Components/PaginationControl',
  component: PaginationControl,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: 'padded',
  },
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    totalItems: {
      control: 'number',
      description: 'Total number of items to paginate',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: 'Theme variant',
    },
    rowsPerPageOptions: {
      control: 'object',
      description: 'Array of options for rows per page',
    },
  },
  // Use simple console.log functions for callbacks
  args: { 
    onPageChange: () => console.log('Page changed'),
    onRowsPerPageChange: () => console.log('Rows per page changed'),
  },
};

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {
    totalItems: 100,
    rowsPerPageOptions: [10, 25, 50, 100],
    initialRowsPerPage: 10,
  },
};

export const ScreenshotExample = {
  name: 'Screenshot Match (21-30 of 100)',
  args: {
    totalItems: 100,
    rowsPerPageOptions: [10, 25, 50, 100],
    initialRowsPerPage: 10,
  },
};

export const LargeDataset = {
  args: {
    totalItems: 1000,
    rowsPerPageOptions: [10, 25, 50, 100],
    initialRowsPerPage: 25,
  },
};

export const SmallDataset = {
  args: {
    totalItems: 30,
    rowsPerPageOptions: [5, 10, 15, 30],
    initialRowsPerPage: 10,
  },
};

export const CustomRowsOptions = {
  args: {
    totalItems: 500,
    rowsPerPageOptions: [20, 40, 60, 80, 100],
    initialRowsPerPage: 20,
  },
};

export const DarkTheme = {
  args: {
    totalItems: 100,
    rowsPerPageOptions: [10, 25, 50, 100],
    initialRowsPerPage: 10,
    theme: 'dark',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const SinglePage = {
  args: {
    totalItems: 5,
    rowsPerPageOptions: [10, 25, 50],
    initialRowsPerPage: 10,
  },
};

export const ExactPages = {
  args: {
    totalItems: 100,
    rowsPerPageOptions: [10, 25, 50],
    initialRowsPerPage: 25,
  },
};

export const ManyOptions = {
  args: {
    totalItems: 2000,
    rowsPerPageOptions: [10, 25, 50, 100, 200, 500],
    initialRowsPerPage: 50,
  },
};

export const MinimalOptions = {
  args: {
    totalItems: 50,
    rowsPerPageOptions: [5, 10],
    initialRowsPerPage: 5,
  },
};