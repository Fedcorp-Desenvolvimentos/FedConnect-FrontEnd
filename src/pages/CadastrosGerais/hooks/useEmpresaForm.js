// src/pages/CadastrosGerais/hooks/useEmpresaForm.js

import { useState, useCallback } from 'react';

const INITIAL_STATE = {
  // Dados da Empresa
  razao_social: '',
  nome_fantasia: '',
  cnpj: '',
  inscricao_estadual: '',
  tipo_empresa: '',
  atividade: '',
  data_fundacao: '',
  status: 'ativo',
  observacoes: '',

  // Endereço
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  estado: '',
  pais: 'Brasil',

  // Contato
  telefone: '',
  celular: '',
  email: '',
  site: '',
  responsavel: '',
  cargo_responsavel: '',
  ramo_atividade: '',
  porte_empresa: '',

  // Documentos
  alvara: '',
  alvara_data_emissao: '',
  licenca_ambiental: '',
  certidao_negativa: '',
  certidao_validade: '',
  inscricao_municipal: '',
  cnae: '',
  nire: '',
  documentos: null,
};

export const useEmpresaForm = () => {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = useCallback((step) => {
    const newErrors = {};
    let isValid = true;

    switch (step) {
      case 1: // Dados da Empresa
        if (!formData.razao_social?.trim()) {
          newErrors.razao_social = 'Razão social é obrigatória';
          isValid = false;
        }
        if (!formData.nome_fantasia?.trim()) {
          newErrors.nome_fantasia = 'Nome fantasia é obrigatório';
          isValid = false;
        }
        if (!formData.cnpj?.trim()) {
          newErrors.cnpj = 'CNPJ é obrigatório';
          isValid = false;
        }
        if (!formData.tipo_empresa) {
          newErrors.tipo_empresa = 'Tipo de empresa é obrigatório';
          isValid = false;
        }
        if (!formData.status) {
          newErrors.status = 'Status é obrigatório';
          isValid = false;
        }
        break;

      case 2: // Endereço
        if (!formData.cep?.trim()) {
          newErrors.cep = 'CEP é obrigatório';
          isValid = false;
        }
        if (!formData.logradouro?.trim()) {
          newErrors.logradouro = 'Logradouro é obrigatório';
          isValid = false;
        }
        if (!formData.numero?.trim()) {
          newErrors.numero = 'Número é obrigatório';
          isValid = false;
        }
        if (!formData.bairro?.trim()) {
          newErrors.bairro = 'Bairro é obrigatório';
          isValid = false;
        }
        if (!formData.cidade?.trim()) {
          newErrors.cidade = 'Cidade é obrigatória';
          isValid = false;
        }
        if (!formData.estado) {
          newErrors.estado = 'Estado é obrigatório';
          isValid = false;
        }
        if (!formData.pais?.trim()) {
          newErrors.pais = 'País é obrigatório';
          isValid = false;
        }
        break;

      case 3: // Contato
        if (!formData.telefone?.trim()) {
          newErrors.telefone = 'Telefone é obrigatório';
          isValid = false;
        }
        if (!formData.email?.trim()) {
          newErrors.email = 'E-mail é obrigatório';
          isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'E-mail inválido';
          isValid = false;
        }
        if (!formData.responsavel?.trim()) {
          newErrors.responsavel = 'Responsável é obrigatório';
          isValid = false;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  const updateField = useCallback((e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      setFormData(prev => ({
        ...prev,
        [name]: files
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Limpa erro do campo ao digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  }, [errors]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_STATE);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const setFormDataComplete = useCallback((data) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateStep,
    resetForm,
    setFormDataComplete
  };
};