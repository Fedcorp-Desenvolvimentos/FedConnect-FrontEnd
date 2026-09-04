export const ACCESS_LEVELS = {
  ADMIN: "admin",
  USUARIO: "usuario",
  COMERCIAL: "comercial",
  MODERADOR: "moderador",
  RECEPCIONISTA: "recepcionista",
  TI: "ti",
  FATURAMENTO: "faturamento",
  FINANCEIRO: "financeiro",
  VISTORIA: "vistoria",
  CONDOMED: "condomed"
};

export const ACCESS_LEVEL_LABELS = {
  [ACCESS_LEVELS.ADMIN]: "Administrador",
  [ACCESS_LEVELS.USUARIO]: "Usuário",
  [ACCESS_LEVELS.COMERCIAL]: "Comercial",
  [ACCESS_LEVELS.MODERADOR]: "Moderador",
  [ACCESS_LEVELS.RECEPCIONISTA]: "Recepcionista",
  [ACCESS_LEVELS.TI]: "TI",
  [ACCESS_LEVELS.FATURAMENTO]: "Faturista",
  [ACCESS_LEVELS.FINANCEIRO]: "Financeiro",
  [ACCESS_LEVELS.VISTORIA]: "Vistoria",
  [ACCESS_LEVELS.CONDOMED]: "Condomed"
};

// Função para obter o label do nível de acesso
export const getAccessLevelLabel = (level) => {
  if (!level) return "Sem acesso";
  return ACCESS_LEVEL_LABELS[level] || level.charAt(0).toUpperCase() + level.slice(1);
};

// Função para verificar se o usuário tem um nível específico
export const hasAccessLevel = (userLevel, requiredLevel) => {
  return userLevel === requiredLevel;
};

// Função para verificar se o usuário tem um dos níveis permitidos
export const hasAnyAccessLevel = (userLevel, allowedLevels) => {
  return allowedLevels.includes(userLevel);
};

// Função para obter a cor do badge baseada no nível (opcional)
export const getAccessLevelColor = (level) => {
  const colors = {
    [ACCESS_LEVELS.ADMIN]: "#dc2626", // vermelho
    [ACCESS_LEVELS.TI]: "#0284c7",     // azul
    [ACCESS_LEVELS.COMERCIAL]: "#16a34a", // verde
    [ACCESS_LEVELS.FATURAMENTO]: "#d97706", // laranja
    [ACCESS_LEVELS.MODERADOR]: "#7c3aed", // roxo
    [ACCESS_LEVELS.RECEPCIONISTA]: "#0891b2", // ciano
    [ACCESS_LEVELS.FINANCEIRO]: "#0d9488", // teal
    [ACCESS_LEVELS.VISTORIA]: "#059669", // verde escuro
    [ACCESS_LEVELS.CONDOMED]: "#be185d", // rosa escuro
    [ACCESS_LEVELS.USUARIO]: "#64748b" // cinza
  };
  return colors[level] || "#64748b";
};

// Ordem igual à de `users.Usuario.NIVEL_ACESSO_CHOICES` no backend: quem
// adicionar um nível lá acrescenta aqui, e os formulários acompanham sozinhos.
export const ACCESS_LEVEL_ORDER = [
  ACCESS_LEVELS.ADMIN,
  ACCESS_LEVELS.USUARIO,
  ACCESS_LEVELS.COMERCIAL,
  ACCESS_LEVELS.MODERADOR,
  ACCESS_LEVELS.RECEPCIONISTA,
  ACCESS_LEVELS.TI,
  ACCESS_LEVELS.FATURAMENTO,
  ACCESS_LEVELS.FINANCEIRO,
  ACCESS_LEVELS.VISTORIA,
  ACCESS_LEVELS.CONDOMED
];

/** Opções `{ value, label }` para os selects de nível de acesso. */
export const ACCESS_LEVEL_OPTIONS = ACCESS_LEVEL_ORDER.map((value) => ({
  value,
  label: ACCESS_LEVEL_LABELS[value]
}));
