// components/MinhaConta/ProfileForm.jsx
const ProfileForm = ({ 
  nomeCompleto, 
  setNomeCompleto, 
  cpf, 
  setCpf, 
  email, 
  setEmail, 
  editandoPerfil,
  onEditClick,  // Nova prop
  onSubmit 
}) => {
  return (
    <form onSubmit={onSubmit} className="profile-form">
      <div className="form-field">
        <label htmlFor="nomeCompleto">Nome Completo</label>
        <input
          id="nomeCompleto"
          type="text"
          value={nomeCompleto}
          onChange={(e) => setNomeCompleto(e.target.value)}
          disabled={!editandoPerfil}
          className={editandoPerfil ? "editing-mode" : ""}
          placeholder="Seu nome completo"
          required={editandoPerfil}
        />
      </div>

      <div className="form-field">
        <label htmlFor="cpf">CPF</label>
        <input
          id="cpf"
          type="text"
          value={cpf}
          onChange={(e) => setCpf(e.target.value)}
          disabled={!editandoPerfil}
          className={editandoPerfil ? "editing-mode" : ""}
          placeholder="000.000.000-00"
          required={editandoPerfil}
        />
      </div>

      <div className="form-field">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={!editandoPerfil}
          className={editandoPerfil ? "editing-mode" : ""}
          placeholder="seu@email.com"
          required={editandoPerfil}
        />
      </div>

      <div className="form-actions">
      <button 
        type="button" 
        className="custom-btn secondary"
        onClick={onEditClick}
      >
        <i className="bi bi-pencil"></i> Editar
      </button>

      {editandoPerfil && (
        <button type="submit" className="custom-btn primary">
          <i className="bi bi-check-lg"></i> Salvar Alterações
        </button>
      )}
    </div>
    </form>
  );
};

export default ProfileForm;