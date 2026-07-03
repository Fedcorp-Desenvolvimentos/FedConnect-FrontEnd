import React from 'react';
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

const PessoaTable = ({ pessoas, selectedCodigo, onSelect, disabled }) => {
  return (
    <S.TableWrapper>
      <S.TableScroll>
        <S.Table>
          <thead>
            <tr>
              <th>Pessoa</th>
              <th>Nome</th>
              <th>CPF/CNPJ</th>
              <th>Endereço</th>
            </tr>
          </thead>
          <tbody>
            {pessoas.length === 0 && (
              <tr className="empty">
                <S.EmptyRow colSpan={4}>Nenhuma pessoa cadastrada</S.EmptyRow>
              </tr>
            )}
            {pessoas.map(pessoa => (
              <tr
                key={pessoa.codigo}
                className={pessoa.codigo === selectedCodigo ? 'selected' : ''}
                onClick={() => !disabled && onSelect(pessoa.codigo)}
              >
                <td>{pessoa.codigo}</td>
                <td>{pessoa.nome}</td>
                <td>{formatDocumento(pessoa.cpf_cnpj)}</td>
                <td>{pessoa.endereco}</td>
              </tr>
            ))}
          </tbody>
        </S.Table>
      </S.TableScroll>
    </S.TableWrapper>
  );
};

export default PessoaTable;