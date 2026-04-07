// components/MinhaConta/PasswordForm.jsx
import PasswordField from './PasswordField';

const PasswordForm = ({ 
  senhaAtual, 
  setSenhaAtual, 
  novaSenha, 
  setNovaSenha, 
  confirmarSenha, 
  setConfirmarSenha, 
  editandoSenha,
  onEditClick,
  onCancelClick,  // Nova prop para cancelar
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="password-form">
      <PasswordField
        id="senhaAtual"
        label="Senha Atual"
        value={senhaAtual}
        onChange={(e) => setSenhaAtual(e.target.value)}
        disabled={!editandoSenha}
        placeholder="Digite sua senha atual"
        required={editandoSenha}
      />

      <PasswordField
        id="novaSenha"
        label="Nova Senha"
        value={novaSenha}
        onChange={(e) => setNovaSenha(e.target.value)}
        disabled={!editandoSenha}
        placeholder="Digite sua nova senha"
        required={editandoSenha}
      />

      <PasswordField
        id="confirmarSenha"
        label="Confirmar Nova Senha"
        value={confirmarSenha}
        onChange={(e) => setConfirmarSenha(e.target.value)}
        disabled={!editandoSenha}
        placeholder="Confirme sua nova senha"
        required={editandoSenha}
      />

      <div className="form-actions">
        {!editandoSenha ? (
          <button 
            type="button" 
            className="custom-btn secondary"
            onClick={onEditClick}
          >
            <i className="bi bi-pencil"></i> Editar
          </button>
        ) : (
          <>
            <button 
              type="button" 
              className="custom-btn danger"
              onClick={onCancelClick}
            >
              <i className="bi bi-x-lg"></i> Cancelar
            </button>
            <button type="submit" className="custom-btn primary">
              <i className="bi bi-check-lg"></i> Alterar Senha
            </button>
          </>
        )}
      </div>
    </form>
  );
};

export default PasswordForm;