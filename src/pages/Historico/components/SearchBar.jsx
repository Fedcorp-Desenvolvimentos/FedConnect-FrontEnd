import React from 'react';
import { FaSearch } from 'react-icons/fa';
import * as S from '../HistoricoStyles';

const SearchBar = ({ value, onChange }) => {
  return (
    <S.SearchBarWrapper>
      <FaSearch />
      <S.SearchInput
        type="text"
        placeholder="Buscar por tipo, parâmetro ou email..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </S.SearchBarWrapper>
  );
};

export default SearchBar;