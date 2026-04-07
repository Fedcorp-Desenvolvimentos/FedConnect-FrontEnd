// pages/Cadastro/components/NivelAcessoSelect.jsx
import { NIVEL_ACESSO_OPTIONS } from './constants/cadastroConstants';

const NivelAcessoSelect = ({ value, onChange, error, disabled }) => {
  return (
    <div className="form-group">
      <label htmlFor="nivelAcesso">
        Tipo de usuário <span className="required">*</span>
      </label>
      <select
        id="nivelAcesso"
        name="nivelAcesso"
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className={error ? 'error' : ''}
      >
        <option value="">Selecione o tipo de usuário</option>
        {NIVEL_ACESSO_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            <i className={option.icon}></i> {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default NivelAcessoSelect;