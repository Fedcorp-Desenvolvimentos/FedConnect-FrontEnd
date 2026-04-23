import { useState, useCallback } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'E-mail é obrigatório';
    if (!emailRegex.test(email)) return 'E-mail inválido';
    return null;
  };

  const validateSenha = (senha) => {
    if (!senha) return 'Senha é obrigatória';
    if (senha.length < 6) return 'Senha deve ter no mínimo 6 caracteres';
    return null;
  };

  const validateNomeCompleto = (nome) => {
    if (!nome) return 'Nome completo é obrigatório';
    if (nome.trim().length < 3) return 'Nome deve ter no mínimo 3 caracteres';
    return null;
  };

  const validateNivelAcesso = (nivel) => {
    if (!nivel) return 'Tipo de usuário é obrigatório';
    return null;
  };

  const validateEmpresa = (empresa, empresas) => {
    if (empresa === undefined || empresa === null || empresa === '') {
      return 'Empresa é obrigatória';
    }
    if (empresas.length === 0) return 'Nenhuma empresa disponível para seleção';
    return null;
  };

  const validateForm = useCallback((formData, empresas) => {
    const newErrors = {};

    newErrors.nome_completo = validateNomeCompleto(formData.nome_completo);
    newErrors.email = validateEmail(formData.email);
    newErrors.senha = validateSenha(formData.senha);
    newErrors.nivelAcesso = validateNivelAcesso(formData.nivelAcesso);
    newErrors.empresa = validateEmpresa(formData.empresa, empresas);

    Object.keys(newErrors).forEach(key => {
      if (newErrors[key] === null) delete newErrors[key];
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const getFieldError = useCallback((fieldName) => {
    return errors[fieldName];
  }, [errors]);

  return {
    errors,
    validateForm,
    clearErrors,
    getFieldError,
    validateEmail,
    validateSenha,
    validateNomeCompleto
  };
};