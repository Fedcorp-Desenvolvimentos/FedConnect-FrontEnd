import React from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import * as S from '../CadastroStyles';

const EmpresaSelect = ({ empresas, value, onChange, error, disabled, loading }) => {
  if (loading) {
    return (
      <S.FormGroup>
        <S.Label>
          Empresa <S.Required>*</S.Required>
        </S.Label>
        <S.LoadingSelect>
          <FaSpinner className="spinner" />
          <span>Carregando empresas...</span>
        </S.LoadingSelect>
      </S.FormGroup>
    );
  }

  return (
    <S.FormGroup>
      <S.Label>
        Empresa <S.Required>*</S.Required>
      </S.Label>
      <S.Select
        name="empresa"
        value={value}
        onChange={onChange}
        required
        disabled={disabled || empresas.length === 0}
        $error={error}
      >
        <option value="">Selecione uma empresa</option>
        {empresas.map((emp, index) => (
          <option key={`${emp.CNPJ}-${index}`} value={index}>
            {emp.CEDENTE} - {emp.CNPJ}
          </option>
        ))}
      </S.Select>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
      {empresas.length === 0 && !loading && (
        <S.WarningMessage>
          <FaExclamationTriangle />
          Nenhuma empresa encontrada. Cadastre uma empresa primeiro.
        </S.WarningMessage>
      )}
    </S.FormGroup>
  );
};

export default EmpresaSelect;