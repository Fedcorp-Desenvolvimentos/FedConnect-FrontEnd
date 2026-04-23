import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../../../services/userService';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userId: null,
    nomeCompleto: '',
    cpf: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await UserService.getMe();
      setUserData({
        userId: data.id,
        nomeCompleto: data.nome_completo || '',
        email: data.email || '',
        cpf: data.cpf || ''
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refreshUserData = useCallback(async () => {
    await fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    loading,
    error,
    refreshUserData
  };
};