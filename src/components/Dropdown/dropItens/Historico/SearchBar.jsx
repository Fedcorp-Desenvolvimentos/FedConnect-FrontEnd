// pages/Historico/SearchBar.jsx
import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="historico-search-bar">
      <i className="bi bi-search"></i>
      <input
        type="text"
        placeholder={placeholder || "Buscar por tipo, parâmetro ou email..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-pesquisa"
      />
    </div>
  );
};

export default SearchBar;