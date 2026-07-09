// src/pages/CadastroPessoas/components/PessoaTable.jsx

import React, { useRef, useCallback, useEffect } from 'react';
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
  loadingMore = false,
  allLoaded = false,
  onLoadMore = null,
  total = 0
}) => {
  const tableRef = useRef(null);
  const observerRef = useRef(null);
  const lastRowRef = useRef(null);

  // Observer para scroll infinito
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && onLoadMore && !loadingMore && !allLoaded) {
      onLoadMore();
    }
  }, [onLoadMore, loadingMore, allLoaded]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(handleObserver, {
      root: tableRef.current,
      rootMargin: '0px 0px 50px 0px',
      threshold: 0.1,
    });

    if (lastRowRef.current) {
      observerRef.current.observe(lastRowRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver, pessoas.length]);

  const pessoasList = Array.isArray(pessoas) ? pessoas : [];

  if (pessoasList.length === 0) {
    return (
      <S.TableWrapper>
        <S.TableScroll ref={tableRef}>
          <S.Table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>CPF/CNPJ</th>
                <th>Endereço</th>
              </tr>
            </thead>
            <tbody>
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
            </tbody>
          </S.Table>
        </S.TableScroll>
      </S.TableWrapper>
    );
  }

  return (
    <S.TableWrapper>
      <S.TableScroll ref={tableRef}>
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
            {pessoasList.map((pessoa, index) => {
              const codigo = pessoa.codigo || pessoa.PESSOA || `temp-${index}`;
              const isSelected = codigo === selectedCodigo;
              const isLast = index === pessoasList.length - 1;

              return (
                <tr
                  key={codigo}
                  ref={isLast ? lastRowRef : null}
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
            
            {/* Loading row */}
            {loadingMore && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '15px', color: '#94a3b8' }}>
                  <span>⏳ Carregando mais registros...</span>
                </td>
              </tr>
            )}
            
            {/* All loaded row */}
            {allLoaded && pessoasList.length > 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '15px', color: '#94a3b8', fontSize: '0.85rem' }}>
                  {total > 0 ? `✅ Todos os ${total} registros carregados` : '✅ Todos os registros carregados'}
                </td>
              </tr>
            )}
          </tbody>
        </S.Table>
      </S.TableScroll>
    </S.TableWrapper>
  );
};

export default PessoaTable;