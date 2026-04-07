// pages/GerenciarUsuarios/components/UserTable.jsx

const UserTable = ({ usuarios, onEdit, onDelete, currentUserId }) => {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Função</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.map((usuario) => (
          <tr key={usuario.id}>
            <td>{usuario.nome_completo}</td>
            <td>{usuario.email}</td>
            <td>
              <span className="badge">{usuario.nivel_acesso || 'Usuário'}</span>
            </td>
            <td style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn-icon"
                onClick={() => onEdit(usuario)}
                title="Editar usuário"
              >
                <i className="bi bi-pencil-square text-primary"></i>
              </button>

              {usuario.id !== currentUserId && (
                <button
                  className="btn-icon"
                  onClick={() => onDelete(usuario)}
                  title="Excluir usuário"
                >
                  <i className="bi bi-trash text-danger"></i>
                </button>
              )}
            </td>
          </tr>
        ))}

        {usuarios.length === 0 && (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center', padding: '16px' }}>
              Nenhum usuário encontrado.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default UserTable;