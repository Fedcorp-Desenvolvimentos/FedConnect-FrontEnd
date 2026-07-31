// src/pages/CadastroPessoas/components/BancoSelect.jsx

import React from 'react';
import { useBancos } from '../../../hooks/useBancos';
import Autocomplete from './Autocomplete';

const BancoSelect = ({ value, onChange, disabled, error }) => {
  const { bancos, loading, buscarBancosPorNome } = useBancos();

  const handleSearch = (term) => {
    buscarBancosPorNome(term);
  };

  return (
    <Autocomplete
      name="banco"
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      label="Banco"
      placeholder="Buscar banco por nome ou código..."
      items={bancos}
      loading={loading}
      onSearch={handleSearch}
      getItemId={(item) => item.codigo}
      getItemLabel={(item) => `${item.codigo} - ${item.nome}`}
      getItemSubLabel={(item) => item.digito ? `Dígito: ${item.digito}` : ''}
      getAvatarSeed={(item) => item.nome}
      minSearchLength={0}
      debounceTime={300}
    />
  );
};

export default BancoSelect;