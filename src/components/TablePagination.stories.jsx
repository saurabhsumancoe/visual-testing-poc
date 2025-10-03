import React, { useState } from 'react';
import TablePagination from './TablePagination';

export default {
  title: 'Components/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive table pagination component that supports customizable rows per page, navigation controls, and accessibility features. Matches the design shown in the provided screenshot with "Rows per page: 10" and "21-30 of 100" display.'
      }
    }
  },
  argTypes: {
    totalItems: {
      control: { type: 'number', min: 0, max: 10000, step: 1 },
      description: 'Total number of items in the dataset'
    },
    rowsPerPage: {
      control: { type: 'select' },
      options: [5, 10, 25, 50, 100],
      description: 'Number of rows displayed per page'
    },
    currentPage: {
      control: { type: 'number', min: 1, step: 1 },
      description: 'Current active page number'
    },
    rowsPerPageOptions: {
      control: { type: 'object' },
      description: 'Available options for rows per page selection'
    },
    showFirstLastButtons: {
      control: { type: 'boolean' },
      description: 'Show first and last page navigation buttons'
    },
    showRowsPerPageSelector: {
      control: { type: 'boolean' },
      description: 'Show rows per page dropdown selector'
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class name for styling'
    }
  }
};

// Interactive template with state management
const Template = (args) => {
  const [currentPage, setCurrentPage] = useState(args.currentPage || 1);
  const [rowsPerPage, setRowsPerPage] = useState(args.rowsPerPage || 10);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    console.log('Page changed to:', page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page
    console.log('Rows per page changed to:', rows);
  };

  return (
    <div style={{ width: '100%', minHeight: '100px', display: 'flex', alignItems: 'end', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
      <div style={{ width: '100%' }}>
        {/* Mock table for context */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>ID</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(rowsPerPage, 5) }, (_, i) => {
                const itemIndex = (currentPage - 1) * rowsPerPage + i + 1;
                return (
                  <tr key={i}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>{itemIndex}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>Item {itemIndex}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}>Active</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination
          {...args}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
};

// Default story matching the screenshot (21-30 of 100)
export const Default = Template.bind({});
Default.args = {
  totalItems: 100,
  rowsPerPage: 10,
  currentPage: 3, // This shows 21-30 of 100
  rowsPerPageOptions: [5, 10, 25, 50, 100],
  showFirstLastButtons: true,
  showRowsPerPageSelector: true
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default pagination showing 21-30 of 100 items, exactly matching the provided screenshot design.'
    }
  }
};

// First page (1-10 of 100)
export const FirstPage = Template.bind({});
FirstPage.args = {
  ...Default.args,
  currentPage: 1
};
FirstPage.parameters = {
  docs: {
    description: {
      story: 'Pagination on the first page (1-10 of 100) with disabled previous/first buttons.'
    }
  }
};

// Last page
export const LastPage = Template.bind({});
LastPage.args = {
  ...Default.args,
  currentPage: 10,
  totalItems: 100,
  rowsPerPage: 10
};
LastPage.parameters = {
  docs: {
    description: {
      story: 'Pagination on the last page (91-100 of 100) with disabled next/last buttons.'
    }
  }
};

// Large dataset
export const LargeDataset = Template.bind({});
LargeDataset.args = {
  ...Default.args,
  totalItems: 5000,
  currentPage: 25,
  rowsPerPage: 50
};
LargeDataset.parameters = {
  docs: {
    description: {
      story: 'Pagination with a large dataset of 5000 items, showing 1201-1250 of 5000.'
    }
  }
};

// Small dataset
export const SmallDataset = Template.bind({});
SmallDataset.args = {
  ...Default.args,
  totalItems: 15,
  currentPage: 2,
  rowsPerPage: 10
};
SmallDataset.parameters = {
  docs: {
    description: {
      story: 'Pagination with a small dataset showing second page (11-15 of 15).'
    }
  }
};

// Empty dataset
export const EmptyDataset = Template.bind({});
EmptyDataset.args = {
  ...Default.args,
  totalItems: 0,
  currentPage: 1
};
EmptyDataset.parameters = {
  docs: {
    description: {
      story: 'Pagination with no data showing 0-0 of 0 items.'
    }
  }
};

// Without first/last buttons
export const WithoutFirstLastButtons = Template.bind({});
WithoutFirstLastButtons.args = {
  ...Default.args,
  showFirstLastButtons: false
};
WithoutFirstLastButtons.parameters = {
  docs: {
    description: {
      story: 'Pagination without first and last page buttons, showing only previous and next.'
    }
  }
};

// Without rows per page selector
export const WithoutRowsPerPageSelector = Template.bind({});
WithoutRowsPerPageSelector.args = {
  ...Default.args,
  showRowsPerPageSelector: false
};
WithoutRowsPerPageSelector.parameters = {
  docs: {
    description: {
      story: 'Pagination without the rows per page dropdown selector.'
    }
  }
};

// Minimal pagination
export const Minimal = Template.bind({});
Minimal.args = {
  ...Default.args,
  showFirstLastButtons: false,
  showRowsPerPageSelector: false
};
Minimal.parameters = {
  docs: {
    description: {
      story: 'Minimal pagination with only previous/next buttons and item count.'
    }
  }
};

// Custom rows per page options
export const CustomRowsPerPageOptions = Template.bind({});
CustomRowsPerPageOptions.args = {
  ...Default.args,
  rowsPerPageOptions: [3, 7, 15, 30],
  rowsPerPage: 7,
  totalItems: 50
};
CustomRowsPerPageOptions.parameters = {
  docs: {
    description: {
      story: 'Pagination with custom rows per page options (3, 7, 15, 30).'
    }
  }
};

// Responsive test - mobile view
export const MobileView = Template.bind({});
MobileView.args = {
  ...Default.args
};
MobileView.parameters = {
  viewport: {
    defaultViewport: 'mobile1'
  },
  docs: {
    description: {
      story: 'Pagination component optimized for mobile viewport with responsive design.'
    }
  }
};