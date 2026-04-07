// pages/GerenciarUsuarios/components/Pagination.jsx

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1 && totalItems <= 15) return null;

  return (
    <div className="pagination-bar">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </button>

      <span>
        Página {currentPage} de {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </button>

      <span className="total-registros">Total: {totalItems}</span>
    </div>
  );
};

export default Pagination;