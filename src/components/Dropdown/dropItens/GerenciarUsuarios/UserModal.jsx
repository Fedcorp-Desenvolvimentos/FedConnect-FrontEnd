// pages/GerenciarUsuarios/components/UserModal.jsx
import { NIVEL_ACESSO_OPTIONS } from './constants/userConstants';

const UserModal = ({ 
  isOpen, 
  type, 
  user, 
  formData, 
  onClose, 
  onConfirm, 
  onUpdateField 
}) => {
  if (!isOpen) return null;

  const isEditMode = type === 'edit';
  const isDeleteMode = type === 'delete';
  const isCreateMode = type === 'create';

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm();
  };

  if (isDeleteMode) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Confirmar Exclusão</h3>
          <p>
            Tem certeza que deseja excluir
            <strong> {user?.nome_completo}</strong>?
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirm}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{isEditMode ? 'Editar Usuário' : 'Novo Usuário'}</h3>
        <form onSubmit={handleSubmit}>
          <label>Nome completo:</label>
          <input
            type="text"
            value={formData.nome_completo}
            onChange={(e) => onUpdateField('nome_completo', e.target.value)}
            required
          />

          <label>E-mail:</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => onUpdateField('email', e.target.value)}
            required
          />

          <label>Função:</label>
          <select
            value={formData.nivel_acesso}
            onChange={(e) => onUpdateField('nivel_acesso', e.target.value)}
          >
            {NIVEL_ACESSO_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditMode ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;