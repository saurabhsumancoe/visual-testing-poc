import React, { useState } from 'react';
import TablePagination from './TablePagination';

export default {
  title: 'Components/TablePagination',
  component: TablePagination,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive table pagination component that supports customizable rows per page, navigation controls, and accessibility features.'
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
    <div style={{ width: '100%', minHeight: '100px', display: 'flex', alignItems: 'end' }}>
      <TablePagination
        {...args}
        currentPage={currentPage}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
};

// Default story
export const Default = Template.bind({});
Default.args = {
  totalItems: 100,
  rowsPerPage: 10,
  currentPage: 3,
  rowsPerPageOptions: [5, 10, 25, 50, 100],
  showFirstLastButtons: true,
  showRowsPerPageSelector: true
};
Default.parameters = {
  docs: {
    description: {
      story: 'Default pagination showing 21-30 of 100 items, matching the design from the screenshot.'
    }
  }
};

// First page
export const FirstPage = Template.bind({});
FirstPage.args = {
  ...Default.args,
  currentPage: 1
};
FirstPage.parameters = {
  docs: {
    description: {
      story: 'Pagination on the first page with disabled previous/first buttons.'
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
      story: 'Pagination on the last page with disabled next/last buttons.'
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
      story: 'Pagination with a large dataset of 5000 items.'
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
      story: 'Pagination with a small dataset showing second page.'
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

// With table context
export const WithTableContext = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const sampleData = Array.from({ length: 87 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: ['Admin', 'User', 'Editor'][i % 3],
    status: ['Active', 'Inactive'][i % 2]
  }));

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = sampleData.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: '#f5f5f5' }}>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item, index) => (
            <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9' }}>
              <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{item.id}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{item.name}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{item.email}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>{item.role}</td>
              <td style={{ padding: '12px', borderBottom: '1px solid #e0e0e0' }}>
                <span style={{ 
                  padding: '4px 8px', 
                  borderRadius: '4px', 
                  fontSize: '12px',
                  backgroundColor: item.status === 'Active' ? '#e8f5e8' : '#f5f5f5',
                  color: item.status === 'Active' ? '#2e7d32' : '#666'
                }}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalItems={sampleData.length}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
        rowsPerPageOptions={[5, 10, 25, 50]}
        showFirstLastButtons={true}
        showRowsPerPageSelector={true}
      />
    </div>
  );
};
WithTableContext.parameters = {
  docs: {
    description: {
      story: 'Complete example showing the pagination component integrated with a data table.'
    }
  }
};