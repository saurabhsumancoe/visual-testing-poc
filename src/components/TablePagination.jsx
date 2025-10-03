          import React from 'react';
          import PropTypes from 'prop-types';
          import './TablePagination.css';

          const TablePagination = ({
            totalItems = 100,
            rowsPerPage = 10,
            currentPage = 3,
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
                        className="table-pagination-btn"
                        aria-label="Go to first page"
                        onClick={handleFirstPage}
                        disabled={isFirstPage}
                      >
                        <span style={{fontWeight: 'bold'}}>{'|<'}</span>
                      </button>
                    )}
                    <button
                      className="table-pagination-btn"
                      aria-label="Go to previous page"
                      onClick={handlePreviousPage}
                      disabled={isFirstPage}
                    >
                      <span style={{fontWeight: 'bold'}}>{'<'}</span>
                    </button>
                    <button
                      className="table-pagination-btn"
                      aria-label="Go to next page"
                      onClick={handleNextPage}
                      disabled={isLastPage}
                    >
                      <span style={{fontWeight: 'bold'}}>{'>'}</span>
                    </button>
                    {showFirstLastButtons && (
                      <button
                        className="table-pagination-btn"
                        aria-label="Go to last page"
                        onClick={handleLastPage}
                        disabled={isLastPage}
                      >
                        <span style={{fontWeight: 'bold'}}>{'>|'}</span>
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
            onPageChange: PropTypes.func,
            onRowsPerPageChange: PropTypes.func,
            showFirstLastButtons: PropTypes.bool,
            showRowsPerPageSelector: PropTypes.bool,
            className: PropTypes.string
          };

          export default TablePagination;