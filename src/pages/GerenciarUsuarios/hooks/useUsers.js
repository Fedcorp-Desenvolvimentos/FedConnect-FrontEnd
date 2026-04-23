import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../../../services/userService';

export const useUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await UserService.getAllUsers();
      const lista = response?.results || response || [];
      setUsuarios(Array.isArray(lista) ? lista : []);
      setError(null);
    } catch (error) {
      setError('Erro ao carregar usuários. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = useCallback(async (userData) => {
    try {
      const newUser = await UserService.createUser(userData);
      setUsuarios(prev => [newUser, ...prev]);
      return { success: true, data: newUser };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const updatedUser = await UserService.updateUser(userId, userData);
      setUsuarios(prev => prev.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      ));
      return { success: true, data: updatedUser };
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      return { success: false, error: errorMessage };
    }
  }, []);

  const deleteUser = useCallback(async (userId, userName) => {
    try {
      await UserService.deleteUser(userId);
      setUsuarios(prev => prev.filter(user => user.id !== userId));
      return { success: true, message: `Usuário ${userName} excluído com sucesso!` };
    } catch (error) {
      return { success: false, error: `Erro ao excluir usuário ${userName}.` };
    }
  }, []);

  const extractErrorMessage = (error) => {
    const errorData = error.response?.data;
    if (errorData) {
      if (errorData.email) return `Erro no E-mail: ${errorData.email.join(', ')}`;
      if (errorData.nome_completo) return `Erro no Nome: ${errorData.nome_completo.join(', ')}`;
      if (errorData.nivel_acesso) return `Erro na Função: ${errorData.nivel_acesso.join(', ')}`;
      if (errorData.detail) return errorData.detail;
    }
    return 'Erro ao processar solicitação. Verifique os dados.';
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    usuarios,
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};