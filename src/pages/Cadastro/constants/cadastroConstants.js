export const NIVEL_ACESSO_OPTIONS = [
  { value: 'admin', label: 'Administrador' },
  { value: 'usuario', label: 'Usuário' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'moderador', label: 'Moderador' },
  { value: 'faturamento', label: 'Faturamento' },
  { value: 'ti', label: 'TI' },
  { value: 'financeiro', label: 'Financeiro' }
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