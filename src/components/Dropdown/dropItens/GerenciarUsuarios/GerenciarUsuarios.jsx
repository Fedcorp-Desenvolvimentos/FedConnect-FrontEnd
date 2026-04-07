// pages/GerenciarUsuarios/GerenciarUsuarios.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useUsers } from './hooks/useUsers';
import { useUserModal } from './hooks/useUserModal';
import { usePagination } from './hooks/usePagination';
import UserTable from './UserTable';
import UserModal from './UserModal';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { ITEMS_PER_PAGE } from './constants/userConstants';
import './styles/GerenciarUsuarios.css';
import PageTemplate from '../../../PageTemplate/PageTemplate';

const GerenciarUsuarios = () => {
  const { 
    usuarios, 
    error: usersError,
    updateUser,
    deleteUser,
  } = useUsers();

  const {
    modalType,
    selectedUser,
    formData,
    openEditModal,
    openDeleteModal,
    closeModal,
    updateFormField
  } = useUserModal();

  const {
    currentPage,
    totalPages,
    totalItems,
    currentItems,
    searchTerm,
    goToPage,
    handleSearch
  } = usePagination(usuarios, ITEMS_PER_PAGE);

  const [message, setMessage] = React.useState({ type: '', text: '' });

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleEditConfirm = async () => {
    const result = await updateUser(selectedUser.id, formData);
    if (result.success) {
      showMessage('success', `Usuário ${formData.nome_completo} atualizado com sucesso!`);
      closeModal();
    } else {
      showMessage('error', result.error);
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteUser(selectedUser.id, selectedUser.nome_completo);
    if (result.success) {
      showMessage('success', result.message);
      closeModal();
    } else {
      showMessage('error', result.error);
    }
  };

  const handleCreateConfirm = async () => {
    // Implementar criação de usuário se necessário
    console.log('Criar usuário:', formData);
  };

  const getModalProps = () => {
    switch (modalType) {
      case 'edit':
        return {
          type: 'edit',
          user: selectedUser,
          formData,
          onConfirm: handleEditConfirm
        };
      case 'delete':
        return {
          type: 'delete',
          user: selectedUser,
          onConfirm: handleDeleteConfirm
        };
      case 'create':
        return {
          type: 'create',
          formData,
          onConfirm: handleCreateConfirm
        };
      default:
        return null;
    }
  };

  return (
    <PageTemplate
      title="Gerenciar Usuários"
      subtitle="Gerencie os usuários do sistema, editando ou excluindo suas informações."
    >
      <div className="conta-container">
        <main className="conta-content">
          <div className="config-card-user">
            <div className="card-header">
              <h2>
                <i className="bi bi-people"></i> Gerenciar Usuários
              </h2>
              <div className="header-actions">
                <Link to="/cadastro" className="btn btn-primary">
                  <i className="bi bi-person-plus-fill"></i> Novo Usuário
                </Link>
              </div>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type === 'success' ? 'sucesso' : 'erro'}`}>
                {message.text}
              </div>
            )}

            {usersError && <div className="alert alert-erro">{usersError}</div>}

            <SearchBar 
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Buscar por nome, e-mail ou função"
            />

            <UserTable 
              usuarios={currentItems}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              currentUserId={usuarios[0]?.id}
            />

            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              onPageChange={goToPage}
            />
          </div>

          <UserModal
            isOpen={modalType !== null}
            onClose={closeModal}
            onUpdateField={updateFormField}
            {...getModalProps()}
          />
        </main>
      </div>
    </PageTemplate>
  );
};

export default GerenciarUsuarios;