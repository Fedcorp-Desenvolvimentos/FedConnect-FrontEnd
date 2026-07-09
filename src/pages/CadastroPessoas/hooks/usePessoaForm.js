// src/pages/CadastroPessoas/hooks/usePessoaForm.js

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { buscarPessoas, criarPessoa, atualizarPessoa } from '../../../services/pessoaService';

export const CATEGORIAS_DISPONIVEIS = [
  'ADMINISTRADORA',
  'IMOBILIARIA',
  'CONDOMINIO',
  'CORRETOR(A)',
  'PRODUTOR (PF)',
  'TERCEIRIZADA',
  'PF FATURADO',
  'FORNECEDOR',
  'FUNCIONARIO'
];

const todayISO = () => new Date().toISOString().split('T')[0];

export const INITIAL_STATE = {
  codigo: '',
  nome: '',
  tipo: 'juridica',
  cpf_cnpj: '',
  sexo: 'masculino',
  data_cadastro: todayISO(),

  cep: '',
  uf: '',
  cidade: '',
  bairro: '',
  endereco: '',
  logradouro: '',
  complemento: '',

  banco: '',
  agencia: '',
  conta: '',
  favorecido: '',
  chave_pix: '',

  telefone1_ddd: '',
  telefone1_numero: '',
  telefone2_ddd: '',
  telefone2_numero: '',
  email: '',
  observacoes: '',
  contato: '',

  emite_nota_fiscal: false,
  melhor_dia_pagamento: '',
  cedente: '',
  comercial: '',
  possui_portal: false,
  portal: '',

  agenciador: false,
  percentual_agenciamento: '',
  impostos: '',
  optante_simples: false,
  prestador_servicos: false,
  credenciado: '',
  codigo_credenciado: '',

  comissao: '',
  produto: 'individual',
  categoria: ''
};

const normalizePessoa = (pessoa) => {
  if (!pessoa || typeof pessoa !== 'object') return pessoa;

  const fieldMap = {
    'PESSOA': 'codigo',
    'NOME': 'nome',
    'TIPO': 'tipo',
    'CPF_CNPJ': 'cpf_cnpj',
    'SEXO': 'sexo',
    'DATA_CADASTRO': 'data_cadastro',
    'CEP': 'cep',
    'UF': 'uf',
    'CIDADE': 'cidade',
    'BAIRRO': 'bairro',
    'ENDERECO': 'endereco',
    'LOGRADOURO': 'logradouro',
    'COMPLEMENTO': 'complemento',
    'BANCO': 'banco',
    'AGENCIA': 'agencia',
    'CONTA': 'conta',
    'FAVORECIDO': 'favorecido',
    'CHAVE_PIX': 'chave_pix',
    'TELEFONE1_DDD': 'telefone1_ddd',
    'TELEFONE1_NUMERO': 'telefone1_numero',
    'TELEFONE2_DDD': 'telefone2_ddd',
    'TELEFONE2_NUMERO': 'telefone2_numero',
    'EMAIL': 'email',
    'OBSERVACOES': 'observacoes',
    'CONTATO': 'contato',
    'EMITE_NOTA_FISCAL': 'emite_nota_fiscal',
    'MELHOR_DIA_PAGAMENTO': 'melhor_dia_pagamento',
    'CEDENTE': 'cedente',
    'COMERCIAL': 'comercial',
    'POSSUI_PORTAL': 'possui_portal',
    'PORTAL': 'portal',
    'AGENCIADOR': 'agenciador',
    'PERCENTUAL_AGENCIAMENTO': 'percentual_agenciamento',
    'IMPOSTOS': 'impostos',
    'OPTANTE_SIMPLES': 'optante_simples',
    'PRESTADOR_SERVICOS': 'prestador_servicos',
    'CREDENCIADO': 'credenciado',
    'CODIGO_CREDENCIADO': 'codigo_credenciado',
    'COMISSAO': 'comissao',
    'PRODUTO': 'produto',
    'CATEGORIA': 'categoria'
  };

  const normalized = {};
  Object.keys(pessoa).forEach(key => {
    const newKey = fieldMap[key] || key.toLowerCase();
    let value = pessoa[key];
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    normalized[newKey] = value;
  });

  return { ...INITIAL_STATE, ...normalized };
};

const generateCodigo = pessoas => {
  if (!pessoas || pessoas.length === 0) {
    return '0000000001';
  }
  const maxCodigo = pessoas.reduce((max, p) => {
    const num = parseInt(p.codigo, 10) || 0;
    return num > max ? num : max;
  }, 0);
  return String(maxCodigo + 1).padStart(10, '0');
};

export const usePessoaForm = (isNewMode = false) => {
  const [pessoas, setPessoas] = useState([]);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(isNewMode ? 'new' : 'view');
  const [selectedCodigo, setSelectedCodigo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // ✅ Estado de paginação
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 20,
    total: 0,
    hasMore: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);
  const [allLoaded, setAllLoaded] = useState(false);
  const isLoadingRef = useRef(false);

  const isReadOnly = mode === 'view';
  const isEditing = mode !== 'view';

  const canAlterar = mode === 'view' && !!selectedCodigo;
  const canCancelar = mode !== 'view';
  const canLimpar = mode !== 'view';

  // 🔥 Função para carregar a primeira página ou buscar com termo
  const fetchPessoas = useCallback(async (reset = true, search = '') => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      const page = reset ? 1 : pagination.currentPage + 1;
      const offset = (page - 1) * pagination.pageSize;
      
      const response = await buscarPessoas({
        limit: pagination.pageSize,
        offset: offset,
        search: search || searchTerm
      });
      
      // console.log("📦 Pessoas buscadas (paginado):", response);
      
      let pessoasList = [];
      let total = 0;
      
      if (response?.data && Array.isArray(response.data)) {
        pessoasList = response.data;
        total = response.total || response.total_registros || 0;
      } else if (Array.isArray(response)) {
        pessoasList = response;
        total = pessoasList.length;
      }
      
      // Normaliza os dados
      const normalizedPessoas = pessoasList.map(normalizePessoa);
      
      if (reset) {
        setPessoas(normalizedPessoas);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          total: total,
          hasMore: pessoasList.length === pagination.pageSize,
        }));
        setAllLoaded(pessoasList.length < pagination.pageSize);
      } else {
        setPessoas(prev => [...prev, ...normalizedPessoas]);
        setPagination(prev => ({
          ...prev,
          currentPage: page,
          total: total,
          hasMore: pessoasList.length === pagination.pageSize,
        }));
        setAllLoaded(pessoasList.length < pagination.pageSize);
      }
      
      // console.log(`✅ ${normalizedPessoas.length} pessoas carregadas (total: ${total})`);
      
    } catch (error) {
      console.error("❌ Erro ao buscar pessoas:", error);
      if (reset) {
        setPessoas([]);
        setPagination(prev => ({ ...prev, total: 0, hasMore: false }));
      }
    } finally {
      isLoadingRef.current = false;
      if (reset) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, [pagination.currentPage, pagination.pageSize, searchTerm]);

  // 🔥 Carrega mais (próxima página)
  const loadMore = useCallback(() => {
    if (!pagination.hasMore || loadingMore || allLoaded || isLoadingRef.current) {
      return;
    }
    fetchPessoas(false);
  }, [pagination.hasMore, loadingMore, allLoaded, fetchPessoas]);

  // 🔥 Busca por termo
  const searchPessoas = useCallback(async (term) => {
    setSearchTerm(term);
    if (term.length >= 2 || term.length === 0) {
      await fetchPessoas(true, term);
    }
  }, [fetchPessoas]);

  // 🔥 Carrega inicial
  useEffect(() => {
    fetchPessoas(true);
  }, []);

  // Atualiza o formData quando uma pessoa é selecionada
  useEffect(() => {
    if (selectedCodigo && mode === 'edit') {
      const pessoa = pessoas.find(p => p.codigo === selectedCodigo);
      if (pessoa) {
        setFormData({ ...INITIAL_STATE, ...pessoa });
      }
    }
  }, [selectedCodigo, pessoas, mode]);

  const updateField = useCallback(
    e => {
      const { name, value, type, checked, files } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : type === 'file' ? files?.[0] || null : value
      }));

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const preencherEndereco = useCallback(dadosCep => {
    setFormData(prev => ({
      ...prev,
      logradouro: dadosCep.logradouro ?? prev.logradouro,
      endereco: dadosCep.logradouro || prev.endereco,
      bairro: dadosCep.bairro || prev.bairro,
      cidade: dadosCep.localidade || prev.cidade,
      uf: dadosCep.uf || prev.uf
    }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.cpf_cnpj?.trim()) {
      newErrors.cpf_cnpj = formData.tipo === 'juridica' ? 'CNPJ é obrigatório' : 'CPF é obrigatório';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecione uma categoria';
    }

    if (!formData.comissao && formData.comissao !== 0) {
      newErrors.comissao = 'Comissão é obrigatória';
    } else if (formData.comissao && (isNaN(formData.comissao) || parseFloat(formData.comissao) < 0)) {
      newErrors.comissao = 'Comissão deve ser um número válido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const startNew = useCallback(() => {
    setFormData({
      ...INITIAL_STATE,
      codigo: generateCodigo(pessoas),
      data_cadastro: todayISO()
    });
    setErrors({});
    setSelectedCodigo(null);
    setMode('new');
  }, [pessoas]);

  const startEdit = useCallback(() => {
    if (!selectedCodigo) return;
    setMode('edit');
  }, [selectedCodigo]);

  const cancelAction = useCallback(() => {
    if (mode === 'edit' && selectedCodigo) {
      const original = pessoas.find(p => p.codigo === selectedCodigo);
      if (original) setFormData({ ...INITIAL_STATE, ...original });
    } else {
      setFormData(INITIAL_STATE);
      setSelectedCodigo(null);
    }
    setErrors({});
    setMode('view');
  }, [mode, pessoas, selectedCodigo]);

  const clearForm = useCallback(() => {
    setFormData(prev => ({
      ...INITIAL_STATE,
      codigo: prev.codigo,
      data_cadastro: prev.data_cadastro
    }));
    setErrors({});
  }, []);

  const selectPessoa = useCallback(
    codigo => {
      if (mode !== 'view') return;
      const pessoa = pessoas.find(p => p.codigo === codigo);
      if (!pessoa) {
        console.warn(`❌ Pessoa com código ${codigo} não encontrada`);
        return;
      }
      // console.log(`✅ Selecionando pessoa:`, pessoa);
      setFormData({ ...INITIAL_STATE, ...pessoa });
      setSelectedCodigo(codigo);
      setMode('edit');
    },
    [mode, pessoas]
  );

  const save = useCallback(async () => {
    if (!validate()) return { success: false };

    setIsSubmitting(true);
    try {
      const payload = { ...formData };
      
      const isUpdate = pessoas.some(p => p.codigo === payload.codigo);
      
      let response;
      if (isUpdate) {
        response = await atualizarPessoa(payload.codigo, payload);
      } else {
        response = await criarPessoa(payload);
      }

      // Atualiza a lista local
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

  const selectedPessoa = useMemo(
    () => pessoas.find(p => p.codigo === selectedCodigo) || null,
    [pessoas, selectedCodigo]
  );

  return {
    pessoas,
    formData,
    errors,
    mode,
    isReadOnly,
    isEditing,
    isSubmitting,
    loading,
    loadingMore,
    selectedCodigo,
    selectedPessoa,
    canAlterar,
    canCancelar,
    canLimpar,
    pagination,
    searchTerm,
    allLoaded,
    updateField,
    preencherEndereco,
    startNew,
    startEdit,
    cancelAction,
    clearForm,
    selectPessoa,
    save,
    setFormData,
    fetchPessoas,
    loadMore,
    searchPessoas,
  };
};