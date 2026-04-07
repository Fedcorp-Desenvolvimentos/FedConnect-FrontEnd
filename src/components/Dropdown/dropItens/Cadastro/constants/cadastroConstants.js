// pages/Cadastro/constants/cadastroConstants.js
export const NIVEL_ACESSO_OPTIONS = [
  { value: 'admin', label: 'Administrador', icon: 'bi-shield-lock' },
  { value: 'usuario', label: 'Usuário', icon: 'bi-person' },
  { value: 'comercial', label: 'Comercial', icon: 'bi-graph-up' },
  { value: 'moderador', label: 'Moderador', icon: 'bi-shield-check' },
  { value: 'faturamento', label: 'Faturamento', icon: 'bi-calculator' },
  { value: 'ti', label: 'TI', icon: 'bi-cpu' }
];

export const FORM_FIELDS = {
  NOME_COMPLETO: 'nome_completo',
  EMAIL: 'email',
  SENHA: 'senha',
  NIVEL_ACESSO: 'nivelAcesso',
  EMPRESA: 'empresa'
};

export const MESSAGES = {
  SUCCESS: 'Usuário cadastrado com sucesso!',
  ERROR_DEFAULT: 'Erro ao cadastrar usuário. Verifique os dados e tente novamente.',
  LOADING_EMPRESAS: 'Carregando lista de empresas...',
  EMPRESAS_EMPTY: 'Nenhuma empresa encontrada. Cadastre uma empresa primeiro.'
};