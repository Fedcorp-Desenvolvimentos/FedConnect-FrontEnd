// pages/Cadastro/components/CadastroForm.jsx
import React from 'react';
import EmpresaSelect from './EmpresaSelect';
import NivelAcessoSelect from './NivelAcessoSelect';
import MessageAlert from './MessageAlert';
import { FORM_FIELDS } from './constants/cadastroConstants';

const CadastroForm = ({
  formData,
  empresas,
  loadingEmpresas,
  loadingSubmit,
  success,
  error,
  errors,
  onSubmit,
  onChange,
  getFieldError
}) => {
  return (
    <form className="cadastro-form" onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor={FORM_FIELDS.NOME_COMPLETO}>
          Nome Completo <span className="required">*</span>
        </label>
        <input
          type="text"
          id={FORM_FIELDS.NOME_COMPLETO}
          name={FORM_FIELDS.NOME_COMPLETO}
          value={formData[FORM_FIELDS.NOME_COMPLETO]}
          onChange={onChange}
          disabled={loadingSubmit}
          required
          className={getFieldError(FORM_FIELDS.NOME_COMPLETO) ? 'error' : ''}
          placeholder="Digite o nome completo"
        />
        {getFieldError(FORM_FIELDS.NOME_COMPLETO) && (
          <span className="error-message">{getFieldError(FORM_FIELDS.NOME_COMPLETO)}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={FORM_FIELDS.EMAIL}>
          E-mail <span className="required">*</span>
        </label>
        <input
          type="email"
          id={FORM_FIELDS.EMAIL}
          name={FORM_FIELDS.EMAIL}
          value={formData[FORM_FIELDS.EMAIL]}
          onChange={onChange}
          disabled={loadingSubmit}
          required
          className={getFieldError(FORM_FIELDS.EMAIL) ? 'error' : ''}
          placeholder="exemplo@empresa.com"
        />
        {getFieldError(FORM_FIELDS.EMAIL) && (
          <span className="error-message">{getFieldError(FORM_FIELDS.EMAIL)}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor={FORM_FIELDS.SENHA}>
          Senha <span className="required">*</span>
        </label>
        <input
          type="password"
          id={FORM_FIELDS.SENHA}
          name={FORM_FIELDS.SENHA}
          value={formData[FORM_FIELDS.SENHA]}
          onChange={onChange}
          disabled={loadingSubmit}
          required
          className={getFieldError(FORM_FIELDS.SENHA) ? 'error' : ''}
          placeholder="Mínimo 6 caracteres"
        />
        {getFieldError(FORM_FIELDS.SENHA) && (
          <span className="error-message">{getFieldError(FORM_FIELDS.SENHA)}</span>
        )}
      </div>

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

      <MessageAlert type="error" message={error} />
      <MessageAlert type="success" message={success} />

      <button 
        type="submit" 
        className="btn-submit"
        disabled={loadingSubmit || loadingEmpresas || empresas.length === 0}
      >
        {loadingSubmit ? (
          <>
            <i className="bi bi-arrow-repeat spinner"></i>
            Cadastrando...
          </>
        ) : (
          <>
            <i className="bi bi-save-fill"></i>
            Salvar
          </>
        )}
      </button>
    </form>
  );
};

export default CadastroForm;