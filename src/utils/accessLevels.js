export const ACCESS_LEVELS = {
  ADMIN: "admin",
  USUARIO: "usuario",
  COMERCIAL: "comercial",
  MODERADOR: "moderador",
  RECEPCIONISTA: "recepcionista",
  TI: "ti",
  FATURAMENTO: "faturamento"
};

export const ACCESS_LEVEL_LABELS = {
  [ACCESS_LEVELS.ADMIN]: "Administrador",
  [ACCESS_LEVELS.USUARIO]: "Usuário Comum",
  [ACCESS_LEVELS.COMERCIAL]: "Comercial",
  [ACCESS_LEVELS.MODERADOR]: "Moderador",
  [ACCESS_LEVELS.RECEPCIONISTA]: "Recepcionista",
  [ACCESS_LEVELS.TI]: "TI",
  [ACCESS_LEVELS.FATURAMENTO]: "Faturista"
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
    [ACCESS_LEVELS.USUARIO]: "#64748b" // cinza
  };
  return colors[level] || "#64748b";
};