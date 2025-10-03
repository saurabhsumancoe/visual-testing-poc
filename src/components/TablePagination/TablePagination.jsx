import React from 'react';
import PropTypes from 'prop-types';
import './tablePagination.css';

const TablePagination = ({
  totalItems = 100,
  rowsPerPage = 10,
  currentPage = 1,
  rowsPerPageOptions = [5, 10, 25, 50, 100],
  onRowsPerPageChange = () => {},
  onPageChange = () => {},
  showFirstLastButtons = true,
  showRowsPerPageSelector = true,
  className = ''
}) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const handleRowsPerPageChange = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    onRowsPerPageChange(newRowsPerPage);
    // Reset to first page when rows per page changes
    onPageChange(1);
  };

  const handleFirstPage = () => {
    if (currentPage !== 1) {
      onPageChange(1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLastPage = () => {
    if (currentPage !== totalPages) {
      onPageChange(totalPages);
    }
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages || totalItems === 0;

  return (
    <div className={`table-pagination ${className}`} role="navigation" aria-label="Table pagination">
      <div className="pagination-content">
        {showRowsPerPageSelector && (
          <div className="rows-per-page">
            <label htmlFor="rows-per-page-select" className="rows-per-page-label">
              Rows per page:
            </label>
            <select
              id="rows-per-page-select"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="rows-per-page-select"
              aria-label="Select number of rows per page"
            >
              {rowsPerPageOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="pagination-info">
          <span className="pagination-text">
            {totalItems === 0 ? '0-0 of 0' : `${startItem}-${endItem} of ${totalItems}`}
          </span>
        </div>

        <div className="pagination-controls">
          {showFirstLastButtons && (
            <button
              onClick={handleFirstPage}
              disabled={isFirstPage}
              className="pagination-button first-page"
              aria-label="Go to first page"
              title="First page"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M3 2v12h1V2H3zm2.5 5.5L11 2v12l-5.5-5.5z"/>
              </svg>
            </button>
          )}

          <button
            onClick={handlePreviousPage}
            disabled={isFirstPage}
            className="pagination-button previous-page"
            aria-label="Go to previous page"
            title="Previous page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 2L5.5 7.5L11 13V2z"/>
            </svg>
          </button>

          <button
            onClick={handleNextPage}
            disabled={isLastPage}
            className="pagination-button next-page"
            aria-label="Go to next page"
            title="Next page"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 2v11l5.5-5.5L5 2z"/>
            </svg>
          </button>

          {showFirstLastButtons && (
            <button
              onClick={handleLastPage}
              disabled={isLastPage}
              className="pagination-button last-page"
              aria-label="Go to last page"
              title="Last page"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M12 14V2h1v12h-1zM10.5 8.5L5 14V2l5.5 6.5z"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

TablePagination.propTypes = {
  totalItems: PropTypes.number,
  rowsPerPage: PropTypes.number,
  currentPage: PropTypes.number,
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  onRowsPerPageChange: PropTypes.func,
  onPageChange: PropTypes.func,
  showFirstLastButtons: PropTypes.bool,
  showRowsPerPageSelector: PropTypes.bool,
  className: PropTypes.string
};

export default TablePagination;