// hooks/usePasswordChange.js
import { useState } from 'react';
import { UserService } from '../../../../../services/userService';

export const usePasswordChange = (userId) => {
  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updatePasswordField = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const changePassword = async () => {
    if (passwordData.novaSenha !== passwordData.confirmarSenha) {
      setError('As senhas não coincidem');
      return false;
    }

    if (passwordData.novaSenha.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return false;
    }

    try {
      setLoading(true);
      await UserService.changePassword({
        old_password: passwordData.senhaAtual,
        new_password: passwordData.novaSenha
      });
      
      // Reset form
      setPasswordData({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao alterar senha');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    passwordData,
    updatePasswordField,
    changePassword,
    loading,
    error,
    setError
  };
};