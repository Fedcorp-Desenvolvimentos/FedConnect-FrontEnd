// ================================================================
// HELPERS DE STATUS PARA COMISSÕES
// ================================================================

const STATUS_MAP = {
  'A': { label: 'Ativo', color: '#2E7D32', bg: '#E8F5E9' },
  'C': { label: 'Cancelado', color: '#C62828', bg: '#FFEBEE' },
  'B': { label: 'Baixado', color: '#1565C0', bg: '#E3F2FD' },
  'P': { label: 'Pendente', color: '#E65100', bg: '#FFF3E0' },
  'I': { label: 'Inativo', color: '#616161', bg: '#F5F5F5' },
  'R': { label: 'Repassado', color: '#00695C', bg: '#E0F2F1' },
  'S': { label: 'Suspenso', color: '#F57F17', bg: '#FFF8E1' },
  'X': { label: 'Bloqueado', color: '#880E4F', bg: '#FCE4EC' },
};

export const getStatusInfo = (statusCode) => {
  if (!statusCode) {
    return { label: '—', color: '#9E9E9E', bg: '#F5F5F5' };
  }
  
  const upperStatus = statusCode.toUpperCase().trim();
  return STATUS_MAP[upperStatus] || { 
    label: statusCode, 
    color: '#757575', 
    bg: '#FAFAFA' 
  };
};