import React from 'react';
import { FiChevronLeft, FiChevronRight, FiDatabase } from 'react-icons/fi';
import * as S from '../HistoricoStyles';

const Pagination = ({ currentPage, totalPages, totalItems, onPageChange }) => {
  if (totalPages <= 1 && totalItems <= 20) return null;

  return (
    <S.PaginationBar>
      <S.PaginationButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <FiChevronLeft /> Anterior
      </S.PaginationButton>

      <S.PaginationInfo>
        Página {currentPage} de {totalPages}
      </S.PaginationInfo>

      <S.PaginationButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Próxima <FiChevronRight />
      </S.PaginationButton>

      <S.TotalRegistros>
        <FiDatabase /> Total: {totalItems}
      </S.TotalRegistros>
    </S.PaginationBar>
  );
};

export default Pagination;