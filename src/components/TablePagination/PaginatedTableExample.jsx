import React, { useState, useMemo } from 'react';
import TablePagination from './TablePagination';
import './paginatedTableExample.css';

const PaginatedTableExample = () => {
  // Sample data generation
  const sampleData = useMemo(() => 
    Array.from({ length: 127 }, (_, i) => ({
      id: i + 1,
      name: `John Doe ${i + 1}`,
      email: `user${i + 1}@company.com`,
      department: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'][i % 5],
      role: ['Manager', 'Developer', 'Designer', 'Analyst', 'Coordinator'][i % 5],
      status: ['Active', 'Inactive', 'Pending'][i % 3],
      joinDate: new Date(2020 + (i % 4), (i % 12), (i % 28) + 1).toLocaleDateString(),
      salary: 50000 + (i * 1000) + (Math.random() * 20000)
    })), []
  );

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  // Filtering
  const filteredData = useMemo(() => {
    if (!searchTerm) return sampleData;
    
    return sampleData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sampleData, searchTerm]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    return [...filteredData].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  // Event handlers
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when changing rows per page
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <span className="sort-icon">↕</span>;
    }
    return sortConfig.direction === 'asc' 
      ? <span className="sort-icon active">↑</span>
      : <span className="sort-icon active">↓</span>;
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'Active': 'status-badge status-active',
      'Inactive': 'status-badge status-inactive',
      'Pending': 'status-badge status-pending'
    };
    
    return (
      <span className={statusClasses[status] || 'status-badge'}>
        {status}
      </span>
    );
  };

  return (
    <div className="paginated-table-example">
      <div className="table-header">
        <h2>Employee Directory</h2>
        <div className="table-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {getSortIcon('id')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {getSortIcon('name')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {getSortIcon('email')}
              </th>
              <th onClick={() => handleSort('department')} className="sortable">
                Department {getSortIcon('department')}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role {getSortIcon('role')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {getSortIcon('status')}
              </th>
              <th onClick={() => handleSort('joinDate')} className="sortable">
                Join Date {getSortIcon('joinDate')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((employee, index) => (
                <tr key={employee.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                  <td>{employee.id}</td>
                  <td className="name-cell">{employee.name}</td>
                  <td className="email-cell">{employee.email}</td>
                  <td>{employee.department}</td>
                  <td>{employee.role}</td>
                  <td>{getStatusBadge(employee.status)}</td>
                  <td>{employee.joinDate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">
                  No employees found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        totalItems={totalItems}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25, 50, 100]}
        showFirstLastButtons={true}
        showRowsPerPageSelector={true}
        className="employee-table-pagination"
      />

      {searchTerm && (
        <div className="search-results-info">
          Showing {totalItems} result{totalItems !== 1 ? 's' : ''} for "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default PaginatedTableExample;