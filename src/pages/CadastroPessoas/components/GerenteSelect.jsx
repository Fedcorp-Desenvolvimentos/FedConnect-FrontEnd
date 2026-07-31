// src/pages/CadastroPessoas/components/GerenteSelect.jsx

import React, { useState } from 'react';
import Autocomplete from './Autocomplete';

const GerenteSelect = ({ value, onChange, disabled, error, gerentes }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGerentes = React.useMemo(() => {
    if (!searchTerm.trim()) return gerentes || [];
    const term = searchTerm.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return (gerentes || []).filter(g => {
      const nome = (g.nome || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return nome.includes(term);
    });
  }, [gerentes, searchTerm]);

  return (
    <Autocomplete
      name="gerente_comercial"
      value={value}
      onChange={onChange}
      disabled={disabled}
      error={error}
      label="Gerente Comercial"
      placeholder="Buscar gerente..."
      items={filteredGerentes}
      loading={false}
      onSearch={setSearchTerm}
      getItemId={(item) => item.codigo}
      getItemLabel={(item) => item.nome || 'Sem nome'}
      minSearchLength={0}
      debounceTime={200}
    />
  );
};

export default GerenteSelect;