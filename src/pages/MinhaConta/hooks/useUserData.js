import { useState, useEffect, useCallback } from 'react';
import { UserService } from '../../../services/userService';
import { useLoading } from '../../../hooks/useLoading';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userId: null,
    username: '',
    administradora_nome: '',
    email: ''
  });

  const [error, setError] = useState(null);
  const { withLoading } = useLoading();

  const fetchUserData = useCallback(async () => {
    try {
      await withLoading(async () => {
        const data = await UserService.getMe();

        setUserData({
          userId: data.id,
          username: data.username || '',
          email: data.email || '',
          administradora_nome: data.administradora_nome || ''
        });
      }, 'Carregando dados do usuário...');

      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Erro ao carregar dados do usuário');
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    userData,
    error,
    refreshUserData: fetchUserData
  };
};