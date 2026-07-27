// src/pages/CadastroPessoas/constants/pessoaConstants.js

export const todayISO = () => new Date().toISOString().split('T')[0];

export const INITIAL_STATE = {
  // Identificação
  codigo: '',
  nome: '',
  tipo: 'juridica',        // 'fisica' ou 'juridica'
  cpf_cnpj: '',
  sexo: 'nao_informado',       // 'masculino', 'feminino', 'nao_informado'
  data_cadastro: todayISO(),

  // Endereço
  cep: '',
  uf: '',
  cidade: '',
  bairro: '',
  endereco: '',

  // Contato
  telefone1_ddd: '',
  telefone1_numero: '',
  telefone2_ddd: '',
  telefone2_numero: '',
  email: '',
  contato: '',
  observacoes: '',

  // Dados Bancários
  banco: '',
  agencia: '',
  conta: '',
  favorecido: '',
  chave_pix: '',

  // Configurações
  emite_nota_fiscal: false,
  melhor_dia_pagamento: '',
  cedente: '',
  optante_simples: false,
  possui_portal: false,
  portal: '',
  gerente_comercial: '',
};

export const MAPEAMENTO_CAMPOS = {
  'PESSOA': 'codigo',
  'NOME': 'nome',
  'TP_PESSOA': 'tipo',
  'CPF_CNPJ': 'cpf_cnpj',
  'SEXO': 'sexo',
  'DT_CADASTRO': 'data_cadastro',
  'CEP': 'cep',
  'ESTADO': 'uf',
  'CIDADE': 'cidade',
  'BAIRRO': 'bairro',
  'ENDERECO': 'endereco',
  'BANCO': 'banco',
  'AGENCIA': 'agencia',
  'CONTA': 'conta',
  'FAVOR_CONTA': 'favorecido',
  'CHAVE_PIX': 'chave_pix',
  'DDD1': 'telefone1_ddd',
  'TELEFONE1': 'telefone1_numero',
  'DDD2': 'telefone2_ddd',
  'TELEFONE2': 'telefone2_numero',
  'EMAIL': 'email',
  'OBS': 'observacoes',
  'CONTATO': 'contato',
  'EMITE_NF': 'emite_nota_fiscal',
  'DIA_VENCIMENTO': 'melhor_dia_pagamento',
  'CEDENTE': 'cedente',
  'OPTOU_SIMPLES': 'optante_simples',
  'POSSUI_PORTAL': 'possui_portal',
  'ENDER_PORTAL': 'portal',
  'COD_GERENTE_EXTRA': 'gerente_comercial',
};

export const TAB_SECTIONS = [
  { key: 'identificacao', label: 'Identificação', icon: null },
  { key: 'endereco', label: 'Endereço', icon: null },
  { key: 'bancario', label: 'Dados Bancários', icon: null },
  { key: 'contato', label: 'Contato', icon: null },
  { key: 'configuracoes', label: 'Configurações', icon: null },
];

export const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

export const BANCOS = [
  '001 - Banco do Brasil',
  '033 - Santander',
  '104 - Caixa Econômica Federal',
  '237 - Bradesco',
  '341 - Itaú',
  '077 - Inter',
  '260 - Nubank',
  'NU PAGAMENTOS',
  'SICOOB',
  'SICREDI',
];