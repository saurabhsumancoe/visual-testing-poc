import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './PaginationControl.css';

/**
 * Advanced Pagination Control component based on the provided screenshot
 * Features rows per page selection and complete navigation controls
 */
export const PaginationControl = ({
  totalItems = 100,
  rowsPerPageOptions = [10, 25, 50, 100],
  initialRowsPerPage = 10,
  onPageChange,
  onRowsPerPageChange,
  className = '',
  theme = 'light',
  ...props
}) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const handleRowsPerPageChange = (newRowsPerPage) => {
    const newValue = parseInt(newRowsPerPage, 10);
    setRowsPerPage(newValue);
    setCurrentPage(1); // Reset to first page
    
    if (onRowsPerPageChange) {
      onRowsPerPageChange(newValue);
    }
    if (onPageChange) {
      onPageChange(1, newValue);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage, rowsPerPage);
      }
    }
  };

  const goToFirstPage = () => handlePageChange(1);
  const goToPreviousPage = () => handlePageChange(currentPage - 1);
  const goToNextPage = () => handlePageChange(currentPage + 1);
  const goToLastPage = () => handlePageChange(totalPages);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div 
      className={`pagination-control ${theme === 'dark' ? 'pagination-control--dark' : ''} ${className}`}
      {...props}
    >
      {/* Rows per page selector */}
      <div className="pagination-control__rows-selector">
        <label htmlFor="rows-per-page" className="pagination-control__label">
          Rows per page:
        </label>
        <div className="pagination-control__select-wrapper">
          <select
            id="rows-per-page"
            className="pagination-control__select"
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(e.target.value)}
            aria-label="Select number of rows per page"
          >
            {rowsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="pagination-control__select-arrow">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path 
                d="M1 1L6 6L11 1" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {/* Items range display */}
      <div className="pagination-control__info">
        <span className="pagination-control__range">
          {startItem}–{endItem} of {totalItems}
        </span>
      </div>

      {/* Navigation controls */}
      <div className="pagination-control__nav">
        {/* First page button */}
        <button
          className="pagination-control__nav-btn pagination-control__nav-btn--first"
          onClick={goToFirstPage}
          disabled={isFirstPage}
          aria-label="Go to first page"
          title="First page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M3 4V12M7 8L11 4V12L7 8Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Previous page button */}
        <button
          className="pagination-control__nav-btn pagination-control__nav-btn--prev"
          onClick={goToPreviousPage}
          disabled={isFirstPage}
          aria-label="Go to previous page"
          title="Previous page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M10 12L6 8L10 4" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
        
        {/* Next page button */}
        <button
          className="pagination-control__nav-btn pagination-control__nav-btn--next"
          onClick={goToNextPage}
          disabled={isLastPage}
          aria-label="Go to next page"
          title="Next page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M6 4L10 8L6 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Last page button */}
        <button
          className="pagination-control__nav-btn pagination-control__nav-btn--last"
          onClick={goToLastPage}
          disabled={isLastPage}
          aria-label="Go to last page"
          title="Last page"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path 
              d="M13 4V12M9 8L5 12V4L9 8Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

PaginationControl.propTypes = {
  /** Total number of items */
  totalItems: PropTypes.number,
  /** Array of options for rows per page */
  rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number),
  /** Initial rows per page value */
  initialRowsPerPage: PropTypes.number,
  /** Callback when page changes */
  onPageChange: PropTypes.func,
  /** Callback when rows per page changes */
  onRowsPerPageChange: PropTypes.func,
  /** Additional CSS class names */
  className: PropTypes.string,
  /** Theme variant */
  theme: PropTypes.oneOf(['light', 'dark']),
};

export default PaginationControl;