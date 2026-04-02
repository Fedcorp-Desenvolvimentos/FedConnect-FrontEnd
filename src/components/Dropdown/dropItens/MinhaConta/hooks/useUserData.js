// hooks/useUserData.js
import { useState, useEffect } from 'react';
import { UserService } from '../../../../../services/userService';

export const useUserData = () => {
  const [userData, setUserData] = useState({
    userId: null,
    nomeCompleto: '',
    cpf: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await UserService.getMe();
        setUserData({
          userId: data.id,
          nomeCompleto: data.nome_completo || '',
          email: data.email || '',
          cpf: data.cpf || ''
        });
      } catch (err) {
        setError('Erro ao carregar dados do usuário');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const updateUserData = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return { userData, updateUserData, loading, error };
};