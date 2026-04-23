export const NIVEL_ACESSO = {
  ADMIN: 'admin',
  USUARIO: 'usuario',
  COMERCIAL: 'comercial',
  MODERADOR: 'moderador',
  TI: 'ti',
  FATURAMENTO: 'faturamento'
};

export const NIVEL_ACESSO_OPTIONS = [
  { value: NIVEL_ACESSO.ADMIN, label: 'Admin' },
  { value: NIVEL_ACESSO.USUARIO, label: 'Usuário' },
  { value: NIVEL_ACESSO.COMERCIAL, label: 'Comercial' },
  { value: NIVEL_ACESSO.MODERADOR, label: 'Moderador' },
  { value: NIVEL_ACESSO.TI, label: 'TI' },
  { value: NIVEL_ACESSO.FATURAMENTO, label: 'Faturamento' }
];

export const ITEMS_PER_PAGE = 15;