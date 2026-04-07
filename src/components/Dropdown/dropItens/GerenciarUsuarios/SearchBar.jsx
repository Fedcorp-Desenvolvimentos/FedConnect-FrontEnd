// pages/GerenciarUsuarios/components/SearchBar.jsx
import React from 'react';

const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div className="search-bar">
      <i className="bi bi-search"></i>
      <input
        type="text"
        placeholder={placeholder || "Buscar por nome, e-mail ou função"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;