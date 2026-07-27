// src/pages/CadastroPessoas/hooks/usePessoas.js

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { buscarPessoas, criarPessoa, atualizarPessoa, buscarGerentesComerciais } from '../../../services/pessoaService';
import { INITIAL_STATE, MAPEAMENTO_CAMPOS } from '../constants/pessoaConstants';

const todayISO = () => new Date().toISOString().split('T')[0];

const normalizePessoa = (pessoa) => {
  if (!pessoa || typeof pessoa !== 'object') return pessoa;

  const normalized = {};
  Object.keys(pessoa).forEach(key => {
    const newKey = MAPEAMENTO_CAMPOS[key] || key.toLowerCase();
    let value = pessoa[key];
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    normalized[newKey] = value;
  });

  return { ...INITIAL_STATE, ...normalized };
};

export const usePessoas = (isNewMode = false) => {
  const [pessoas, setPessoas] = useState([]);
  const [formData, setFormData] = useState({ ...INITIAL_STATE, data_cadastro: todayISO() });
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(isNewMode ? 'new' : 'view');
  const [selectedCodigo, setSelectedCodigo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    totalPages: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [gerentes, setGerentes] = useState([]);
  const isLoadingRef = useRef(false);

  const isReadOnly = mode === 'view';
  const canAlterar = mode === 'view' && !!selectedCodigo;
  const canCancelar = mode !== 'view';
  const canLimpar = mode !== 'view';

  // ===== BUSCAR PESSOAS =====
  const fetchPessoas = useCallback(async (page = 1, search = '') => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);

    try {
      const response = await buscarPessoas({
        limit: pagination.pageSize,
        offset: (page - 1) * pagination.pageSize,
        search: search || searchTerm
      });
      
      let pessoasList = [];
      let total = 0;
      
      if (response?.data && Array.isArray(response.data)) {
        pessoasList = response.data;
        total = response.total || 0;
      }
      
      const normalizedPessoas = pessoasList.map(normalizePessoa);
      const totalPages = Math.ceil(total / pagination.pageSize);
      
      setPessoas(normalizedPessoas);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        total: total,
        totalPages: totalPages,
      }));
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
      setPessoas([]);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [pagination.pageSize, searchTerm]);

  const searchPessoas = useCallback(async (term) => {
    setSearchTerm(term);
    if (term.length >= 2 || term.length === 0) {
      await fetchPessoas(1, term);
    }
  }, [fetchPessoas]);

  const goToPage = useCallback((page) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchPessoas(page, searchTerm);
  }, [fetchPessoas, pagination.totalPages, searchTerm]);

  // ===== BUSCAR GERENTES =====
  const fetchGerentes = useCallback(async () => {
    try {
      const response = await buscarGerentesComerciais();
      if (response?.gerentes) {
        setGerentes(response.gerentes);
      }
    } catch (error) {
      console.error("Erro ao buscar gerentes:", error);
      setGerentes([]);
    }
  }, []);

  // ===== FORMULÁRIO =====
  const updateField = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const preencherEndereco = useCallback((dadosCep) => {
    setFormData(prev => ({
      ...prev,
      endereco: dadosCep.logradouro || prev.endereco,
      bairro: dadosCep.bairro || prev.bairro,
      cidade: dadosCep.localidade || prev.cidade,
      uf: dadosCep.uf || prev.uf
    }));
  }, []);

  const clearForm = useCallback(() => {
    setFormData({ ...INITIAL_STATE, data_cadastro: todayISO() });
    setErrors({});
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf_cnpj?.trim()) {
      newErrors.cpf_cnpj = formData.tipo === 'juridica' ? 'CNPJ é obrigatório' : 'CPF é obrigatório';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // ===== SELEÇÃO E EDIÇÃO =====
  const selectPessoa = useCallback((codigo) => {
    if (mode !== 'view') return;
    const pessoa = pessoas.find(p => p.codigo === codigo);
    if (pessoa) {
      setFormData({ ...INITIAL_STATE, ...pessoa });
      setSelectedCodigo(codigo);
      setMode('edit');
    }
  }, [mode, pessoas]);

  const startEdit = useCallback(() => {
    if (selectedCodigo) setMode('edit');
  }, [selectedCodigo]);

  const cancelAction = useCallback(() => {
    if (mode === 'edit' && selectedCodigo) {
      const original = pessoas.find(p => p.codigo === selectedCodigo);
      if (original) setFormData({ ...INITIAL_STATE, ...original });
    } else {
      clearForm();
      setSelectedCodigo(null);
    }
    setMode('view');
    setErrors({});
  }, [mode, selectedCodigo, pessoas, clearForm]);

  // ===== SALVAR =====
  const save = useCallback(async () => {
    if (!validate()) return { success: false };

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      
      // Converte booleanos para 'S'/'N'
      const convertBoolean = (value) => {
        if (typeof value === 'boolean') return value ? 'S' : 'N';
        return value;
      };

      const finalPayload = {
        ...payload,
        emite_nota_fiscal: convertBoolean(payload.emite_nota_fiscal),
        optante_simples: convertBoolean(payload.optante_simples),
        possui_portal: convertBoolean(payload.possui_portal),
      };

      const isUpdate = pessoas.some(p => p.codigo === payload.codigo);
      const response = isUpdate 
        ? await atualizarPessoa(payload.codigo, finalPayload)
        : await criarPessoa(finalPayload);

      setPessoas(prev => {
        const exists = prev.some(p => p.codigo === payload.codigo);
        return exists
          ? prev.map(p => (p.codigo === payload.codigo ? payload : p))
          : [payload, ...prev];
      });

      setSelectedCodigo(payload.codigo);
      setMode('view');
      return { success: true, payload };
    } catch (error) {
      console.error("❌ Erro ao salvar pessoa:", error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, pessoas]);

  // ===== INIT =====
  useEffect(() => {
    fetchPessoas(1);
    fetchGerentes();
  }, []);

  return {
    pessoas,
    formData,
    errors,
    mode,
    isReadOnly,
    isSubmitting,
    loading,
    selectedCodigo,
    canAlterar,
    canCancelar,
    canLimpar,
    pagination,
    gerentes,
    updateField,
    preencherEndereco,
    clearForm,
    selectPessoa,
    startEdit,
    cancelAction,
    save,
    searchPessoas,
    goToPage,
  };
};