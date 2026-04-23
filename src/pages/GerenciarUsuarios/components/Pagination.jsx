import React from 'react';
import * as S from '../GerenciarUsuariosStyles';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1 && totalItems <= 15) return null;

  return (
    <S.PaginationBar>
      <S.PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Anterior
      </S.PaginationButton>

      <S.PaginationInfo>
        Página {currentPage} de {totalPages}
      </S.PaginationInfo>

      <S.PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima
      </S.PaginationButton>

      <S.TotalRegistros>Total: {totalItems} usuários</S.TotalRegistros>
    </S.PaginationBar>
  );
};

export default Pagination;