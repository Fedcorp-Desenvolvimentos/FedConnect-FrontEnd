import { useState, useEffect } from 'react';
import { UserService } from '../../../services/userService';
import { useLoading } from '../../../hooks/useLoading';

export const useUsers = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  const { withLoading } = useLoading();

  const fetchUsers = async () => {
    try {
      await withLoading(async () => {
        const response = await UserService.getAllUsers();
        const lista = response?.results || response || [];
        setUsuarios(Array.isArray(lista) ? lista : []);
      }, 'Carregando usuários...');

      setError(null);
    } catch (error) {
      setError('Erro ao carregar usuários. Tente novamente.');
    }
  };

  const createUser = async (userData) => {
    try {
      const newUser = await withLoading(
        () => UserService.createUser(userData),
        'Criando usuário...'
      );

      setUsuarios(prev => [newUser, ...prev]);
      return { success: true, data: newUser };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const updateUser = async (userId, userData) => {
    try {
      const updatedUser = await withLoading(
        () => UserService.updateUser(userId, userData),
        'Atualizando usuário...'
      );

      setUsuarios(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, ...updatedUser } : user
        )
      );

      return { success: true, data: updatedUser };
    } catch (error) {
      return { success: false, error: extractErrorMessage(error) };
    }
  };

  const deleteUser = async (userId, userName) => {
    try {
      await withLoading(
        () => UserService.deleteUser(userId),
        'Excluindo usuário...'
      );

      setUsuarios(prev => prev.filter(user => user.id !== userId));

      return {
        success: true,
        message: `Usuário ${userName} excluído com sucesso!`
      };
    } catch (error) {
      return {
        success: false,
        error: `Erro ao excluir usuário ${userName}.`
      };
    }
  };

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
  }, []);

  return {
    usuarios,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  };
};