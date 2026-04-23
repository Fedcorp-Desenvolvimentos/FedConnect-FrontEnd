import React from 'react';
import { FaSave, FaSpinner } from 'react-icons/fa';
import * as S from '../CadastroStyles';
import EmpresaSelect from './EmpresaSelect';
import NivelAcessoSelect from './NivelAcessoSelect';
import MessageAlert from './MessageAlert';
import { FORM_FIELDS } from '../constants/cadastroConstants';

const CadastroForm = ({
  formData,
  empresas,
  loadingEmpresas,
  loadingSubmit,
  errors,
  onSubmit,
  onChange,
  getFieldError
}) => {
  return (
    <S.Form onSubmit={onSubmit}>
      <S.FormGroup>
        <S.Label>
          Nome Completo <S.Required>*</S.Required>
        </S.Label>
        <S.Input
          type="text"
          name={FORM_FIELDS.NOME_COMPLETO}
          value={formData[FORM_FIELDS.NOME_COMPLETO]}
          onChange={onChange}
          disabled={loadingSubmit}
          $error={getFieldError(FORM_FIELDS.NOME_COMPLETO)}
          placeholder="Digite o nome completo"
        />
        {getFieldError(FORM_FIELDS.NOME_COMPLETO) && (
          <S.ErrorMessage>{getFieldError(FORM_FIELDS.NOME_COMPLETO)}</S.ErrorMessage>
        )}
      </S.FormGroup>

      <S.FormGroup>
        <S.Label>
          E-mail <S.Required>*</S.Required>
        </S.Label>
        <S.Input
          type="email"
          name={FORM_FIELDS.EMAIL}
          value={formData[FORM_FIELDS.EMAIL]}
          onChange={onChange}
          disabled={loadingSubmit}
          $error={getFieldError(FORM_FIELDS.EMAIL)}
          placeholder="exemplo@empresa.com"
        />
        {getFieldError(FORM_FIELDS.EMAIL) && (
          <S.ErrorMessage>{getFieldError(FORM_FIELDS.EMAIL)}</S.ErrorMessage>
        )}
      </S.FormGroup>

      <S.FormGroup>
        <S.Label>
          Senha <S.Required>*</S.Required>
        </S.Label>
        <S.Input
          type="password"
          name={FORM_FIELDS.SENHA}
          value={formData[FORM_FIELDS.SENHA]}
          onChange={onChange}
          disabled={loadingSubmit}
          $error={getFieldError(FORM_FIELDS.SENHA)}
          placeholder="Mínimo 6 caracteres"
        />
        {getFieldError(FORM_FIELDS.SENHA) && (
          <S.ErrorMessage>{getFieldError(FORM_FIELDS.SENHA)}</S.ErrorMessage>
        )}
      </S.FormGroup>

      <NivelAcessoSelect
        value={formData[FORM_FIELDS.NIVEL_ACESSO]}
        onChange={onChange}
        error={getFieldError(FORM_FIELDS.NIVEL_ACESSO)}
        disabled={loadingSubmit}
      />

      <EmpresaSelect
        empresas={empresas}
        value={formData[FORM_FIELDS.EMPRESA]}
        onChange={onChange}
        error={getFieldError(FORM_FIELDS.EMPRESA)}
        disabled={loadingSubmit}
        loading={loadingEmpresas}
      />

      <S.SubmitButton type="submit" disabled={loadingSubmit || loadingEmpresas}>
        {loadingSubmit ? (
          <>
            <FaSpinner className="spinner" /> Cadastrando...
          </>
        ) : (
          <>
            <FaSave /> Salvar
          </>
        )}
      </S.SubmitButton>
    </S.Form>
  );
};

export default CadastroForm;