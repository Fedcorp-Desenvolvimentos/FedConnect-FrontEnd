// pages/Cadastro/components/EmpresaSelect.jsx
import React from 'react';

const EmpresaSelect = ({ empresas, value, onChange, error, disabled, loading }) => {
  if (loading) {
    return (
      <div className="form-group">
        <label htmlFor="empresa">Empresa</label>
        <div className="loading-select">
          <i className="bi bi-arrow-repeat spinner"></i>
          <span>Carregando empresas...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="form-group">
      <label htmlFor="empresa">
        Empresa <span className="required">*</span>
      </label>
      <select
        id="empresa"
        name="empresa"
        value={value}
        onChange={onChange}
        required
        disabled={disabled || empresas.length === 0}
        className={error ? 'error' : ''}
      >
        <option value="">Selecione uma empresa</option>
        {empresas.map((emp, index) => (
          <option key={emp.CNPJ || index} value={index}>
            {emp.CEDENTE} - {emp.CNPJ}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
      {empresas.length === 0 && !loading && (
        <div className="warning-message">
          <i className="bi bi-exclamation-triangle-fill"></i>
          Nenhuma empresa encontrada. Cadastre uma empresa primeiro.
        </div>
      )}
    </div>
  );
};

export default EmpresaSelect;