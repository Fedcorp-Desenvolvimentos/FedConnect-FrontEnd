import React from 'react';
import * as S from '../CadastroStyles';
import { NIVEL_ACESSO_OPTIONS } from '../constants/cadastroConstants';

const NivelAcessoSelect = ({ value, onChange, error, disabled }) => {
  return (
    <S.FormGroup>
      <S.Label>
        Tipo de usuário <S.Required>*</S.Required>
      </S.Label>
      <S.Select
        name="nivelAcesso"
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        $error={error}
      >
        <option value="">Selecione o tipo de usuário</option>
        {NIVEL_ACESSO_OPTIONS.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </S.Select>
      {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
    </S.FormGroup>
  );
};

export default NivelAcessoSelect;