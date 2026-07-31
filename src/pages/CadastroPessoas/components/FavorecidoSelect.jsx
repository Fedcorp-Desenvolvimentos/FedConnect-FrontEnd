// src/pages/CadastroPessoas/components/FavorecidoSelect.jsx

import React from 'react';
import { usePessoasSearch } from '../../../hooks/usePessoasSearch';
import Autocomplete from './Autocomplete';

const FavorecidoSelect = ({ value, onChange, disabled, error }) => {
  const { resultados, loading, buscarPessoasPorNome, limparResultados } = usePessoasSearch();

  const handleSearch = (term) => {
    buscarPessoasPorNome(term);
  };

  const formatDocumento = (doc) => {
    if (!doc) return '';
    const digits = doc.replace(/\D/g, '');
    if (digits.length === 14) {
      return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return doc;
  };

  return (
    <Autocomplete
      name="favorecido"
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      label="Favorecido"
      placeholder="Buscar pessoa por nome ou CPF/CNPJ..."
      items={resultados}
      loading={loading}
      onSearch={handleSearch}
      getItemId={(item) => item.pessoa || item.PESSOA || item.codigo}
      getItemLabel={(item) => item.nome || item.NOME || 'Sem nome'}
      getItemSubLabel={(item) => {
        const doc = item.cpf_cnpj || item.CPF_CNPJ || '';
        return doc ? formatDocumento(doc) : '';
      }}
      getAvatarSeed={(item) => item.nome || item.NOME}
      minSearchLength={0}
      debounceTime={300}
    />
  );
};

export default FavorecidoSelect;