// src/pages/CadastroPessoas/constants/pessoaConstants.js (NOVO)

export const INITIAL_STATE = {
  // Identificação
  codigo: '',
  nome: '',
  tipo: 'juridica',        // 'fisica' ou 'juridica'
  cpf_cnpj: '',
  sexo: 'masculino',       // 'masculino', 'feminino', 'nao_informado'
  data_cadastro: new Date().toISOString().split('T')[0],

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