import { useState, useCallback, useMemo } from 'react';
import { criarPessoa } from '../../../services/pessoaService';

const todayISO = () => new Date().toISOString().split('T')[0];

const INITIAL_STATE = {
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

  // Dados Bancários
  banco: '',
  agencia: '',
  conta: '',
  favorecido: '',
  chave_pix: '',

  // Contato
  telefone1_ddd: '',
  telefone1_numero: '',
  telefone2_ddd: '',
  telefone2_numero: '',
  email: '',
  observacoes: '',
  contato: '',

  // Configurações
  emite_nota_fiscal: false,
  melhor_dia_pagamento: '',
  cedente: '',
  comercial: '',
  possui_portal: false,
  portal: '',

  // Agenciamento
  agenciador: false,
  percentual_agenciamento: '',
  impostos: '',
  optante_simples: false,
  prestador_servicos: false,
  credenciado: '',
  codigo_credenciado: '',

  comissao: '',
  produto: 'individual',

  // ✅ Categoria agora é string (select)
  categoria: ''
};

// Mock inicial
const MOCK_PESSOAS = [
  {
    codigo: '0000000001',
    nome: '2L ASSESSORIA ADM E FINANCEIRA LTDA',
    tipo: 'juridica',
    cpf_cnpj: '39914151000190',
    endereco: 'RUA BARAO DO FLAMENGO, 22 SALA 501',
    banco: 'NU PAGAMENTOS',
    agencia: '0001',
    conta: '70586169-7',
    favorecido: '2L ASSESSORIA ADM E FINANCEIRA L',
    chave_pix: '39914151000190',
    comissao: '5.00',
    produto: 'individual',
    categoria: 'PRODUTOR (PF)'
  },
  {
    codigo: '0000000002',
    nome: 'AMBIENTE ADMINISTRACAO DE BENS LTDA.',
    tipo: 'juridica',
    cpf_cnpj: '68613678000183',
    endereco: 'RUA DA ASSEMBLEIA, 58 / 13 ANDAR',
    banco: '341 - Itaú',
    agencia: '1234',
    conta: '56789-0',
    favorecido: 'AMBIENTE ADMINISTRACAO',
    chave_pix: '68613678000183',
    comissao: '3.50',
    produto: 'coletivo',
    categoria: 'ADMINISTRADORA'
  },
  {
    codigo: '0000000003',
    nome: 'CCY CONSULTORIA DE ENGENHARIA LTDA',
    tipo: 'juridica',
    cpf_cnpj: '40314403000120',
    endereco: 'AV. FRANKLIN ROOSEVELT, 39/SL. 1505',
    banco: '237 - Bradesco',
    agencia: '5678',
    conta: '12345-6',
    favorecido: 'CCY CONSULTORIA',
    chave_pix: '40314403000120',
    comissao: '4.00',
    produto: 'individual',
    categoria: 'TERCEIRIZADA'
  },
  {
    codigo: '0000000004',
    nome: 'SECAL SOC. EMP. DE CONST. ALGARVIA LTDA',
    tipo: 'juridica',
    cpf_cnpj: '33519497000108',
    endereco: 'AV. DAS AMERICAS, 500/BL.16-SL.223/2',
    banco: '104 - Caixa Econômica Federal',
    agencia: '9012',
    conta: '34567-8',
    favorecido: 'SECAL ALGARVIA',
    chave_pix: '33519497000108',
    comissao: '2.75',
    produto: 'coletivo',
    categoria: 'CONDOMINIO'
  },
  {
    codigo: '0000000005',
    nome: 'CONCORDE ASSESS. CONTABIL E EMPR. LTDA',
    tipo: 'juridica',
    cpf_cnpj: '30314330000112',
    endereco: 'R. CAMBAUBA, 803/GR. 201',
    banco: '001 - Banco do Brasil',
    agencia: '3456',
    conta: '78901-2',
    favorecido: 'CONCORDE ASSESSORIA',
    chave_pix: '30314330000112',
    comissao: '6.00',
    produto: 'individual',
    categoria: 'FORNECEDOR'
  }
].map(p => ({ ...INITIAL_STATE, ...p }));


const generateCodigo = pessoas => {
  const maxCodigo = pessoas.reduce((max, p) => {
    const num = parseInt(p.codigo, 10) || 0;
    return num > max ? num : max;
  }, 0);
  return String(maxCodigo + 1).padStart(10, '0');
};

export const usePessoaForm = (isNewMode = false) => {
  const [pessoas, setPessoas] = useState(MOCK_PESSOAS);
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [mode, setMode] = useState(isNewMode ? 'new' : 'view');
  const [selectedCodigo, setSelectedCodigo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isReadOnly = mode === 'view';
  const isEditing = mode !== 'view';

  const canAlterar = mode === 'view' && !!selectedCodigo;
  const canNovo = mode === 'view';
  const canCancelar = mode !== 'view';
  const canLimpar = mode !== 'view';

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

  // ✅ REMOVIDO: toggleCategoria e applyCategorias (não são mais necessários com select)

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

    // ✅ Categoria obrigatória (agora é string)
    if (!formData.categoria) {
      newErrors.categoria = 'Selecione uma categoria';
    }

    // Comissão obrigatória
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
      if (!pessoa) return;
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

      try {
        await criarPessoa(payload);
      } catch (error) {
        console.error("Erro ao criar pessoa:", error);
        return { success: false, error };
      }

      setPessoas(prev => {
        const exists = prev.some(p => p.codigo === payload.codigo);
        return exists
          ? prev.map(p => (p.codigo === payload.codigo ? payload : p))
          : [...prev, payload];
      });

      setSelectedCodigo(payload.codigo);
      setMode('view');
      return { success: true, payload };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validate]);

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
    selectedCodigo,
    selectedPessoa,
    canAlterar,
    canNovo,
    canCancelar,
    canLimpar,
    updateField,
    preencherEndereco,
    startNew,
    startEdit,
    cancelAction,
    clearForm,
    selectPessoa,
    save,
    setFormData,
  };
};