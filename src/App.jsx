import React from 'react';
import PaginatedTable from './components/PaginatedTable'; // Adjust path if needed
import { Breadcrumb } from './components/Breadcrumb';
import { PaginationControl } from './components/PaginationControl';

function App() {
  const breadcrumbItems = [
    { key: 'home', label: 'Home', icon: '🏠' },
    { key: 'components', label: 'Components', icon: '⚛️' },
    { key: 'visual-testing', label: 'Visual Testing' },
    { key: 'poc', label: 'PoC' },
  ];

  const handleBreadcrumbClick = (item, index) => {
    console.log('Breadcrumb clicked:', item, 'at index:', index);
  };

  const handlePageChange = (page, rowsPerPage) => {
    console.log('Page changed:', page, 'Rows per page:', rowsPerPage);
  };

  const handleRowsPerPageChange = (rowsPerPage) => {
    console.log('Rows per page changed:', rowsPerPage);
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <Breadcrumb 
        items={breadcrumbItems} 
        onItemClick={handleBreadcrumbClick}
        separator=" / "
      />
      
      <h1>Visual Testing PoC</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2>Paginated Table Component</h2>
        <PaginatedTable />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2>Advanced Pagination Control</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          This component matches the design from your screenshot with complete navigation controls.
        </p>
        <PaginationControl 
          totalItems={100}
          rowsPerPageOptions={[10, 25, 50, 100]}
          initialRowsPerPage={10}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>

      <div style={{ background: '#333', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: 'white', marginBottom: '20px' }}>Dark Theme Example</h3>
        <PaginationControl 
          totalItems={100}
          rowsPerPageOptions={[10, 25, 50, 100]}
          initialRowsPerPage={10}
          theme="dark"
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </div>
    </div>
  );
}

export default App;
