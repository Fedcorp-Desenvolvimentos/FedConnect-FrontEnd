// pages/Historico/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1 && totalItems <= 20) return null;

  return (
    <div className="pagination-bar">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination-btn"
      >
        <i className="bi bi-chevron-left"></i> Anterior
      </button>

      <span className="pagination-info">
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination-btn"
      >
        Próxima <i className="bi bi-chevron-right"></i>
      </button>

      <span className="total-registros">
        <i className="bi bi-database"></i> Total: {totalItems}
      </span>
    </div>
  );
};

export default Pagination;