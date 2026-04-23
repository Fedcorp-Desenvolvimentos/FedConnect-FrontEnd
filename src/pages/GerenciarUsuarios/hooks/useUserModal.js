import { useState, useCallback } from 'react';

export const useUserModal = () => {
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nome_completo: '',
    email: '',
    nivel_acesso: 'usuario'
  });

  const openEditModal = useCallback((user) => {
    setSelectedUser(user);
    setFormData({
      nome_completo: user.nome_completo || '',
      email: user.email || '',
      nivel_acesso: user.nivel_acesso || 'usuario'
    });
    setModalType('edit');
  }, []);

  const openDeleteModal = useCallback((user) => {
    setSelectedUser(user);
    setModalType('delete');
  }, []);

  const openCreateModal = useCallback(() => {
    setFormData({
      nome_completo: '',
      email: '',
      nivel_acesso: 'usuario'
    });
    setSelectedUser(null);
    setModalType('create');
  }, []);

  const closeModal = useCallback(() => {
    setModalType(null);
    setSelectedUser(null);
  }, []);

  const updateFormField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return {
    modalType,
    selectedUser,
    formData,
    openEditModal,
    openDeleteModal,
    openCreateModal,
    closeModal,
    updateFormField
  };
};