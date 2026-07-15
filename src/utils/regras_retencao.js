// src/utils/regras_retencao.js

const ALIQUOTAS = {
  iss: 0.02,
  ir: 0.015,
  cofins: 0.03,
  csll: 0.01,
  pis: 0.0065,
  inss: 0.11,
};

// Limite mínimo para gerar impostos (somatório dos impostos > 10 reais)
const VALOR_MINIMO_IMPOSTOS = 10.00;

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

// Impostos que vêm PRÉ-SELECIONADOS por padrão
const DEFAULT_SELECTED = ['pis', 'cofins', 'csll'];

/**
 * Calcula as retenções para UMA comissão individual
 * REGRAS:
 * 1. Optante Simples (OPTOU_SIMPLES = "S") → ISENTO (nenhum imposto)
 * 2. Somatório de TODOS os impostos > R$ 10,00 → gera impostos normalmente
 * 3. Somatório de TODOS os impostos < R$ 10,00 → NÃO gera impostos
 * 4. Valor da comissão > R$ 666,00 → adiciona IR
 * 5. Pré-seleção: PIS, COFINS, CSLL vêm marcados; ISS, IR, INSS não vêm marcados
 */
export const calcularRetencoesFrontend = (comissao) => {
  const valorComissao = Number(comissao.VALOR || comissao.valor || 0);
  
  // CAMPOS DECISIVOS
  const optouSimples = comissao.OPTOU_SIMPLES === 'S';

  // REGRA 1: Optante pelo Simples Nacional → ISENTO (nenhum imposto)
  if (optouSimples) {
    return {
      retencoes: {
        iss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.iss },
        ir: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.ir },
        cofins: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.cofins },
        csll: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.csll },
        pis: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.pis },
        inss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.inss }
      },
      total_retencoes: 0,
      valor_liquido: valorComissao,
      motivo: 'Optante pelo Simples Nacional - Isento de retenções',
      isIsento: true,
      optouSimples: true,
      temCodAgenc: false,
    };
  }

  // Calcula todos os impostos potenciais
  const impostosPotenciais = {
    pis: valorComissao * ALIQUOTAS.pis,
    cofins: valorComissao * ALIQUOTAS.cofins,
    csll: valorComissao * ALIQUOTAS.csll,
    iss: valorComissao * ALIQUOTAS.iss,
    ir: valorComissao * ALIQUOTAS.ir,
    inss: valorComissao * ALIQUOTAS.inss,
  };

  // Soma de TODOS os impostos potenciais (PIS, COFINS, CSLL, IR, ISS, INSS)
  const somaImpostosBase = impostosPotenciais.pis + impostosPotenciais.cofins + impostosPotenciais.csll + impostosPotenciais.iss + impostosPotenciais.ir + impostosPotenciais.inss;
  
  // REGRA 3: Somatório de TODOS os impostos < R$ 10,00 → NÃO gera impostos
  if (somaImpostosBase < VALOR_MINIMO_IMPOSTOS) {
    return {
      retencoes: {
        iss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.iss },
        ir: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.ir },
        cofins: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.cofins },
        csll: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.csll },
        pis: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.pis },
        inss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.inss }
      },
      total_retencoes: 0,
      valor_liquido: valorComissao,
      motivo: `Somatório dos impostos (R$ ${somaImpostosBase.toFixed(2)}) abaixo de R$ ${VALOR_MINIMO_IMPOSTOS.toFixed(2)} - Isento`,
      isIsento: true,
      optouSimples: false,
      temCodAgenc: false,
    };
  }

  // REGRA 2: Valor da comissão > R$ 666,00 → adiciona IR
  const temIR = valorComissao > 666.00;

  // Monta retenções com base nas regras
  const retencoes = {
    iss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.iss },
    ir: { 
      aplicavel: temIR, 
      valor: temIR ? impostosPotenciais.ir : 0, 
      aliquota: ALIQUOTAS.ir 
    },
    cofins: { aplicavel: true, valor: impostosPotenciais.cofins, aliquota: ALIQUOTAS.cofins },
    csll: { aplicavel: true, valor: impostosPotenciais.csll, aliquota: ALIQUOTAS.csll },
    pis: { aplicavel: true, valor: impostosPotenciais.pis, aliquota: ALIQUOTAS.pis },
    inss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.inss }
  };
  
  const totalRetencoes = Object.values(retencoes).reduce((sum, r) => sum + (r.aplicavel ? r.valor : 0), 0);
  
  return {
    retencoes,
    total_retencoes: totalRetencoes,
    valor_liquido: valorComissao - totalRetencoes,
    motivo: temIR 
      ? 'Retenções aplicadas (PIS, COFINS, CSLL, IR)' 
      : 'Retenções aplicadas (PIS, COFINS, CSLL)',
    isIsento: false,
    optouSimples: false,
    temCodAgenc: false,
    temIR,
  };
};

/**
 * Calcula retenções para um conjunto de comissões (CONSOLIDADO)
 * 
 * REGRAS DE PRÉ-SELEÇÃO:
 * - PIS, COFINS, CSLL vêm PRÉ-SELECIONADOS por padrão
 * - ISS, IR, INSS NÃO vêm pré-selecionados (usuário seleciona se necessário)
 * 
 * REGRAS DE BLOQUEIO:
 * - Simples Nacional → nenhum imposto (bloqueado)
 * - Somatório impostos < R$ 10 → nenhum imposto (bloqueado)
 * - Valor comissão > R$ 666 → IR é desbloqueado para seleção
 */
export const calcularRetencoesConsolidadas = (comissoes, totalBruto = null) => {
  if (!comissoes || comissoes.length === 0) {
    return {
      totalBruto: 0,
      retencoes: {},
      retencoesAplicaveis: [],
      totalRetencoes: 0,
      valorLiquido: 0,
      isIsento: true,
      motivo: 'Nenhuma comissão selecionada',
      comissoesComDetalhes: [],
      regimeInfo: null,
    };
  }

  const grossTotal = totalBruto || comissoes.reduce((sum, c) => sum + Number(c.VALOR || c.valor || 0), 0);
  
  // CALCULA RETENÇÕES PARA CADA COMISSÃO INDIVIDUALMENTE
  const comissoesComDetalhes = comissoes.map(c => {
    const result = calcularRetencoesFrontend(c);
    return {
      ...c,
      ...result,
      retencoes_aplicaveis: Object.entries(result.retencoes)
        .filter(([_, v]) => v.aplicavel)
        .map(([key, v]) => ({
          tipo: key,
          valor: v.valor,
          aliquota: v.aliquota
        }))
    };
  });

  // VERIFICA O REGIME DOMINANTE
  const todosOptantes = comissoesComDetalhes.every(c => c.optouSimples);
  const todosIsentos = comissoesComDetalhes.every(c => c.isIsento);
  const temIR = comissoesComDetalhes.some(c => c.temIR);

  // DETERMINA QUAIS RETENÇÕES SÃO APLICÁVEIS PARA O GRUPO
  let retencoesAplicaveis = [];
  let motivo = '';
  let isIsento = false;
  
  if (todosOptantes || todosIsentos) {
    // Todos isentos/optantes → sem retenções
    retencoesAplicaveis = [];
    motivo = todosOptantes ? 'Todos são optantes pelo Simples Nacional' : 'Todos são isentos (abaixo do mínimo)';
    isIsento = true;
  } else {
    // Regra padrão: PIS, COFINS, CSLL são sempre aplicáveis quando não isento
    retencoesAplicaveis = ['pis', 'cofins', 'csll'];
    
    // IR só é aplicável se valor comissão > R$ 666
    if (temIR) {
      retencoesAplicaveis.push('ir');
    }
    
    motivo = temIR 
      ? 'Retenções aplicadas (PIS, COFINS, CSLL, IR)' 
      : 'Retenções aplicadas (PIS, COFINS, CSLL)';
    isIsento = false;
  }

  // CALCULA OS VALORES COM BASE NO TOTAL BRUTO
  let totalRetencoes = 0;
  const detalhesRetencoes = {};
  
  RETENTION_OPTIONS.forEach(opt => {
    const aplicavel = retencoesAplicaveis.includes(opt.id);
    const valor = aplicavel ? grossTotal * opt.rate : 0;
    detalhesRetencoes[opt.id] = {
      ...opt,
      aplicavel,
      valor,
    };
    if (aplicavel) totalRetencoes += valor;
  });

  return {
    totalBruto: grossTotal,
    retencoes: detalhesRetencoes,
    retencoesAplicaveis,
    totalRetencoes,
    valorLiquido: grossTotal - totalRetencoes,
    isIsento,
    motivo,
    comissoesComDetalhes,
    regimeInfo: {
      todosOptantes,
      todosIsentos,
      temIR,
      isMisto: !todosOptantes && !todosIsentos
    }
  };
};

export const isIsentoRetencoes = (comissao) => {
  const resultado = calcularRetencoesFrontend(comissao);
  return resultado.isIsento;
};

export const getMotivoIsencao = (comissao) => {
  const resultado = calcularRetencoesFrontend(comissao);
  return resultado.motivo;
};

export const getRetencoesAplicaveis = (comissao) => {
  const resultado = calcularRetencoesFrontend(comissao);
  return Object.entries(resultado.retencoes)
    .filter(([_, v]) => v.aplicavel)
    .map(([key, v]) => ({
      tipo: key,
      valor: v.valor,
      aliquota: v.aliquota
    }));
};

// Exporta as constantes para uso em outros arquivos
export { ALIQUOTAS, RETENTION_OPTIONS, DEFAULT_SELECTED, VALOR_MINIMO_IMPOSTOS };