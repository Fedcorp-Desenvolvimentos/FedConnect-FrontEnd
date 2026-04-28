import React from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import * as S from './GerenciarUsuariosStyles';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import UserTable from './components/UserTable';
import UserModal from './components/UserModal';
import SearchBar from './components/SearchBar';
import Pagination from './components/Pagination';
import { useUsers } from './hooks/useUsers';
import { useUserModal } from './hooks/useUserModal';
import { usePagination } from './hooks/usePagination';
import { ITEMS_PER_PAGE } from './constants/userConstants';

const GerenciarUsuarios = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { 
    usuarios, 
    error: usersError,
    updateUser,
    deleteUser,
    createUser
  } = useUsers();

  const {
    modalType,
    selectedUser,
    formData,
    openEditModal,
    openDeleteModal,
    openCreateModal,
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

  const handleEditConfirm = async () => {
    const result = await updateUser(selectedUser.id, formData);
    if (result.success) {
      enqueueSnackbar(`Usuário ${formData.nome_completo} atualizado com sucesso!`, { variant: 'success' });
      closeModal();
    } else {
      enqueueSnackbar(result.error, { variant: 'error' });
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteUser(selectedUser.id, selectedUser.nome_completo);
    if (result.success) {
      enqueueSnackbar(result.message, { variant: 'success' });
      closeModal();
    } else {
      enqueueSnackbar(result.error, { variant: 'error' });
    }
  };

  const handleCreateConfirm = async () => {
    const result = await createUser(formData);
    if (result.success) {
      enqueueSnackbar(`Usuário ${formData.nome_completo} criado com sucesso!`, { variant: 'success' });
      closeModal();
    } else {
      enqueueSnackbar(result.error, { variant: 'error' });
    }
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
    <PageLayout
      title="Gerenciar Usuários"
      subtitle="Gerencie os usuários do sistema, editando ou excluindo suas informações"
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <i className="bi bi-people"></i> Gerenciar Usuários
            </S.Title>
            {/* <S.HeaderActions>
              <S.PrimaryButton onClick={openCreateModal}>
                <FaPlus /> Novo Usuário
              </S.PrimaryButton>
            </S.HeaderActions> */}
          </S.CardHeader>

          {usersError && <S.ErrorAlert>{usersError}</S.ErrorAlert>}

          <SearchBar 
            value={searchTerm}
            onChange={handleSearch}
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
        </S.Card>

        <UserModal
          isOpen={modalType !== null}
          onClose={closeModal}
          onUpdateField={updateFormField}
          {...getModalProps()}
        />
      </S.Container>
    </PageLayout>
  );
};

export default GerenciarUsuarios;