
import React, { useState } from 'react';

const PaginationControl = () => {
  const totalItems = 100;
  const rowsPerPageOptions = [10, 25, 50];
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems);

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'Arial' }}>
      <span>Rows per page:</span>
      <select value={rowsPerPage} onChange={(e) => {
        setRowsPerPage(Number(e.target.value));
        setCurrentPage(1); // Reset to first page when rows per page changes
      }}>
        {rowsPerPageOptions.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <span>{`${startItem}-${endItem} of ${totalItems}`}</span>
      <button onClick={goToFirstPage} disabled={currentPage === 1}>{'<<'}</button>
      <button onClick={goToPreviousPage} disabled={currentPage === 1}>{'<'}</button>
      <button onClick={goToNextPage} disabled={currentPage === totalPages}>{'>'}</button>
      <button onClick={goToLastPage} disabled={currentPage === totalPages}>{'>>'}</button>
    </div>
  );
};

export default PaginationControl;
