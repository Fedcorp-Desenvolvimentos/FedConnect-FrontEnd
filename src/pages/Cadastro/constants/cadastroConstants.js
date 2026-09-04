import { ACCESS_LEVEL_OPTIONS } from '../../../utils/accessLevels';

// Uma lista só, em utils/accessLevels.js, espelhando os choices do backend.
export const NIVEL_ACESSO_OPTIONS = ACCESS_LEVEL_OPTIONS;

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