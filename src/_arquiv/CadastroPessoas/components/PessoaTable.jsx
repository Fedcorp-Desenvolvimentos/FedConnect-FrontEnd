// src/pages/CadastroPessoas/components/PessoaTable.jsx

import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as S from '../CadastroPessoasStyles';

const formatDocumento = doc => {
  if (!doc) return '-';
  const digits = doc.replace(/\D/g, '');
  if (digits.length === 14) {
    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
  if (digits.length === 11) {
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return doc;
};

const PessoaTable = ({ 
  pessoas, 
  selectedCodigo, 
  onSelect, 
  disabled,
  currentPage = 1,
  totalPages = 1,
  total = 0,
  onPageChange,
  loading = false,
}) => {
  const pessoasList = Array.isArray(pessoas) ? pessoas : [];

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      pages.push(
        <S.PaginationPage key={1} onClick={() => onPageChange(1)}>1</S.PaginationPage>
      );
      if (start > 2) {
        pages.push(<S.PaginationEllipsis key="start-ellipsis">...</S.PaginationEllipsis>);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <S.PaginationPage
          key={i}
          $active={i === currentPage}
          onClick={() => onPageChange(i)}
        >
          {i}
        </S.PaginationPage>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(<S.PaginationEllipsis key="end-ellipsis">...</S.PaginationEllipsis>);
      }
      pages.push(
        <S.PaginationPage key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </S.PaginationPage>
      );
    }

    return pages;
  };

  return (
    <S.TableWrapper>
      <S.TableScroll>
        <S.Table>
          <thead>
            <tr>
              <th style={{ width: '12%' }}>Código</th>
              <th style={{ width: '35%' }}>Nome</th>
              <th style={{ width: '18%' }}>CPF/CNPJ</th>
              <th style={{ width: '35%' }}>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>
                  <span>Carregando...</span>
                </td>
              </tr>
            )}

            {!loading && pessoasList.length === 0 && (
              <tr>
                <S.EmptyRow colSpan={4}>
                  <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Nenhuma pessoa cadastrada encontrada.</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '8px', color: '#94a3b8' }}>
                      Clique em "Novo Cadastro" para adicionar uma pessoa.
                    </p>
                  </div>
                </S.EmptyRow>
              </tr>
            )}

            {!loading && pessoasList.map((pessoa, index) => {
              const codigo = pessoa.codigo || pessoa.PESSOA || `temp-${index}`;
              const isSelected = codigo === selectedCodigo;

              return (
                <tr
                  key={codigo}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => {
                    if (!disabled && onSelect) {
                      onSelect(codigo);
                    }
                  }}
                  style={{
                    cursor: disabled ? 'default' : 'pointer',
                    backgroundColor: isSelected ? '#e8f4f8' : 'transparent'
                  }}
                >
                  <td><strong>{codigo}</strong></td>
                  <td>{pessoa.nome || pessoa.NOME || 'Sem nome'}</td>
                  <td>{formatDocumento(pessoa.cpf_cnpj || pessoa.CPF_CNPJ)}</td>
                  <td>{pessoa.endereco || pessoa.ENDERECO || pessoa.logradouro || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </S.Table>
      </S.TableScroll>

      {totalPages > 1 && (
        <S.Pagination>
          <S.PaginationButton
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <FaChevronLeft /> Anterior
          </S.PaginationButton>

          <S.PaginationPages>
            {renderPageNumbers()}
          </S.PaginationPages>

          <S.PaginationButton
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Próximo <FaChevronRight />
          </S.PaginationButton>
        </S.Pagination>
      )}

      {total > 0 && (
        <S.ResultInfo>
          Página {currentPage} de {totalPages} — {total} registro{total !== 1 ? 's' : ''}
        </S.ResultInfo>
      )}
    </S.TableWrapper>
  );
};

export default PessoaTable;
