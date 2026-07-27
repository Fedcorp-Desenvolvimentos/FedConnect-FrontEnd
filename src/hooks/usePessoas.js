// src/pages/CadastroPessoas/hooks/usePessoas.js

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { buscarPessoas, criarPessoa, atualizarPessoa, buscarGerentesComerciais } from '../services/pessoaService';
import { INITIAL_STATE, MAPEAMENTO_CAMPOS, todayISO } from '../pages/CadastroPessoas/constants/pessoaConstants';

const normalizePessoa = (pessoa) => {
  if (!pessoa || typeof pessoa !== 'object') return pessoa;

  const normalized = { ...INITIAL_STATE };
  
  Object.keys(pessoa).forEach((key) => {
    const lowerKey = key.toLowerCase();
    let value = pessoa[key];
    
    if (value === 'true') value = true;
    if (value === 'false') value = false;
    
    switch (lowerKey) {
      case 'pessoa':
        normalized.codigo = value;
        break;
      case 'nome':
        normalized.nome = value;
        break;
      case 'tp_pessoa':
        normalized.tipo = value === 'J' ? 'juridica' : 'fisica';
        break;
      case 'cpf_cnpj':
        normalized.cpf_cnpj = value;
        break;
      case 'sexo':
        if (value === 'J') normalized.sexo = 'juridica';
        else if (value === 'M') normalized.sexo = 'masculino';
        else if (value === 'F') normalized.sexo = 'feminino';
        else normalized.sexo = 'nao_informado';
        break;
      case 'dt_cadastro':
        normalized.data_cadastro = value;
        break;
      case 'cep':
        normalized.cep = value;
        break;
      case 'estado':
        normalized.uf = value;
        break;
      case 'cidade':
        normalized.cidade = value;
        break;
      case 'bairro':
        normalized.bairro = value;
        break;
      case 'endereco':
        normalized.endereco = value;
        break;
      case 'banco':
        normalized.banco = value;
        break;
      case 'agencia':
        normalized.agencia = value;
        break;
      case 'conta':
        normalized.conta = value;
        break;
      case 'favor_conta':
        normalized.favorecido = value;
        break;
      case 'chave_pix':
        normalized.chave_pix = value;
        break;
      case 'ddd1':
        normalized.telefone1_ddd = value;
        break;
      case 'telefone1':
        normalized.telefone1_numero = value;
        break;
      case 'ddd2':
        normalized.telefone2_ddd = value;
        break;
      case 'telefone2':
        normalized.telefone2_numero = value;
        break;
      case 'email':
        normalized.email = value;
        break;
      case 'obs':
        normalized.observacoes = value;
        break;
      case 'contato':
        normalized.contato = value;
        break;
      case 'emite_nf':
        normalized.emite_nota_fiscal = value === 'S';
        break;
      case 'dia_vencimento':
        normalized.melhor_dia_pagamento = value;
        break;
      case 'cedente':
        normalized.cedente = value;
        break;
      case 'optou_simples':
        normalized.optante_simples = value === 'S';
        break;
      case 'possui_portal':
        normalized.possui_portal = value === 'S';
        break;
      case 'ender_portal':
        normalized.portal = value;
        break;
      case 'cod_gerente_extra':
        normalized.gerente_comercial = value;
        break;
      case 'status':
        normalized.status = value;
        break;
      case 'abrev':
        normalized.abrev = value;
        break;
      default:
        if (!normalized.hasOwnProperty(lowerKey)) {
          normalized[lowerKey] = value;
        }
        break;
    }
  });

  return normalized;
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
  const fetchPessoas = useCallback(
    async (page = 1, search = '') => {
      if (isLoadingRef.current) return;
      isLoadingRef.current = true;
      setLoading(true);

      try {
        const response = await buscarPessoas({
          limit: pagination.pageSize,
          offset: (page - 1) * pagination.pageSize,
          search: search || searchTerm,
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
        setPagination((prev) => ({
          ...prev,
          currentPage: page,
          total: total,
          totalPages: totalPages,
        }));
      } catch (error) {
        console.error('Erro ao buscar pessoas:', error);
        setPessoas([]);
      } finally {
        isLoadingRef.current = false;
        setLoading(false);
      }
    },
    [pagination.pageSize, searchTerm]
  );

  const searchPessoas = useCallback(
    async (term) => {
      setSearchTerm(term);
      if (term.length >= 2 || term.length === 0) {
        await fetchPessoas(1, term);
      }
    },
    [fetchPessoas]
  );

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > pagination.totalPages) return;
      fetchPessoas(page, searchTerm);
    },
    [fetchPessoas, pagination.totalPages, searchTerm]
  );

  // ===== BUSCAR GERENTES =====
  const fetchGerentes = useCallback(async () => {
    try {
      const response = await buscarGerentesComerciais();
      if (response?.gerentes) {
        setGerentes(response.gerentes);
      }
    } catch (error) {
      console.error('Erro ao buscar gerentes:', error);
      setGerentes([]);
    }
  }, []);

  // ===== FORMULÁRIO =====
  const updateField = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      
      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: type === 'checkbox' ? checked : value,
        };
        
        // ✅ AUTOPREENCHER FAVORECIDO QUANDO O NOME FOR PREENCHIDO
        // Se o campo alterado for 'nome' e o 'favorecido' estiver vazio, copiar o nome
        if (name === 'nome' && value && !prev.favorecido) {
          newData.favorecido = value;
        }
        
        return newData;
      });
      
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const preencherEndereco = useCallback((dadosCep) => {
    setFormData((prev) => ({
      ...prev,
      endereco: dadosCep.logradouro || prev.endereco,
      bairro: dadosCep.bairro || prev.bairro,
      cidade: dadosCep.localidade || prev.cidade,
      uf: dadosCep.uf || prev.uf,
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
  const selectPessoa = useCallback(
    (codigo) => {
      if (mode !== 'view') return;
      const pessoa = pessoas.find((p) => p.codigo === codigo);
      if (pessoa) {
        setFormData({ ...INITIAL_STATE, ...pessoa });
        setSelectedCodigo(codigo);
        setMode('edit');
      }
    },
    [mode, pessoas]
  );

  const startEdit = useCallback(() => {
    if (selectedCodigo) setMode('edit');
  }, [selectedCodigo]);

  const cancelAction = useCallback(() => {
    if (mode === 'edit' && selectedCodigo) {
      const original = pessoas.find((p) => p.codigo === selectedCodigo);
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

      const convertBoolean = (value) => {
        if (typeof value === 'boolean') return value ? 'S' : 'N';
        return value;
      };

      // ✅ Mapeia os valores do frontend para o formato do banco
      const mapearValorBanco = (campo, valor) => {
        switch (campo) {
          case 'tipo':
            return valor === 'juridica' ? 'J' : 'F';
          case 'sexo':
            if (valor === 'masculino') return 'M';
            if (valor === 'feminino') return 'F';
            if (valor === 'nao_informado') return 'N';
            return 'J'; // padrão para jurídica
          default:
            return valor;
        }
      };

      const finalPayload = {
        ...payload,
        tipo: mapearValorBanco('tipo', payload.tipo),
        sexo: mapearValorBanco('sexo', payload.sexo),
        emite_nota_fiscal: convertBoolean(payload.emite_nota_fiscal),
        optante_simples: convertBoolean(payload.optante_simples),
        possui_portal: convertBoolean(payload.possui_portal),
      };

      const isUpdate = mode === 'edit' || (mode === 'view' && selectedCodigo);
      
      let response;
      if (isUpdate) {
        response = await atualizarPessoa(payload.codigo, finalPayload);
      } else {
        response = await criarPessoa(finalPayload);
      }

      setPessoas((prev) => {
        const exists = prev.some((p) => p.codigo === payload.codigo);
        return exists
          ? prev.map((p) => (p.codigo === payload.codigo ? payload : p))
          : [payload, ...prev];
      });

      setSelectedCodigo(payload.codigo);
      setMode('view');
      return { success: true, payload };
    } catch (error) {
      console.error('❌ Erro ao salvar pessoa:', error);
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate, pessoas, mode, selectedCodigo]);

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