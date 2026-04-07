// pages/Cadastro/hooks/useCadastro.js
import { useState, useCallback } from 'react';
import { FORM_FIELDS, MESSAGES } from '../constants/cadastroConstants';
import { UserService } from '../../../../../services/userService';

export const useCadastro = (empresas) => {
  const [formData, setFormData] = useState({
    [FORM_FIELDS.NOME_COMPLETO]: '',
    [FORM_FIELDS.EMAIL]: '',
    [FORM_FIELDS.SENHA]: '',
    [FORM_FIELDS.NIVEL_ACESSO]: '',
    [FORM_FIELDS.EMPRESA]: ''
  });
  
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    if (name === FORM_FIELDS.EMPRESA) {
      const empresa = empresas[value];
      setEmpresaSelecionada(empresa);
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError('');
  }, [empresas, error]);

  const resetForm = useCallback(() => {
    setFormData({
      [FORM_FIELDS.NOME_COMPLETO]: '',
      [FORM_FIELDS.EMAIL]: '',
      [FORM_FIELDS.SENHA]: '',
      [FORM_FIELDS.NIVEL_ACESSO]: '',
      [FORM_FIELDS.EMPRESA]: empresas.length > 0 ? 0 : ''
    });
    setEmpresaSelecionada(empresas[0] || null);
    setSuccess('');
    setError('');
  }, [empresas]);

  const extractErrorMessage = useCallback((error) => {
    const errorData = error.response?.data;
    
    if (!errorData) return MESSAGES.ERROR_DEFAULT;
    
    if (errorData.email) {
      return `Erro no E-mail: ${Array.isArray(errorData.email) ? errorData.email.join(', ') : errorData.email}`;
    }
    
    if (errorData.password) {
      return `Erro na Senha: ${Array.isArray(errorData.password) ? errorData.password.join(', ') : errorData.password}`;
    }
    
    if (errorData.empresa) {
      return `Erro na Empresa: ${Array.isArray(errorData.empresa) ? errorData.empresa.join(', ') : errorData.empresa}`;
    }
    
    if (errorData.nome_completo) {
      return `Erro no Nome: ${Array.isArray(errorData.nome_completo) ? errorData.nome_completo.join(', ') : errorData.nome_completo}`;
    }
    
    if (errorData.detail) return `Erro: ${errorData.detail}`;
    
    if (typeof errorData === 'object') return `Erro: ${JSON.stringify(errorData)}`;
    
    return errorData || MESSAGES.ERROR_DEFAULT;
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!empresaSelecionada) {
        throw new Error('Por favor, selecione uma empresa válida');
      }

      const payload = {
        nome_completo: formData[FORM_FIELDS.NOME_COMPLETO],
        email: formData[FORM_FIELDS.EMAIL],
        nivel_acesso: formData[FORM_FIELDS.NIVEL_ACESSO],
        password: formData[FORM_FIELDS.SENHA],
        empresa_nome: empresaSelecionada.CEDENTE,
        empresa_cnpj: empresaSelecionada.CNPJ,
        is_fed: true
      };

      const response = await UserService.registerUser(payload);
      
      setSuccess(
        `Usuário "${response.nome_completo || response.email}" cadastrado com sucesso!`
      );
      
      resetForm();
      
      // Auto-clear success message after 5 seconds
      setTimeout(() => setSuccess(''), 5000);
      
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      const errorMessage = extractErrorMessage(error);
      setError(errorMessage);
      
      // Auto-clear error message after 7 seconds
      setTimeout(() => setError(''), 7000);
    } finally {
      setLoading(false);
    }
  }, [formData, empresaSelecionada, resetForm, extractErrorMessage]);

  return {
    formData,
    empresaSelecionada,
    loading,
    success,
    error,
    handleChange,
    handleSubmit,
    resetForm
  };
};