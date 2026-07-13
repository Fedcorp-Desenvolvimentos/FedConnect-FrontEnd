// src/utils/regras_retencao.js

const ALIQUOTAS = {
  iss: 0.02,
  ir: 0.015,
  cofins: 0.03,
  csll: 0.01,
  pis: 0.0065,
  inss: 0.11,
};

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

/**
 * Calcula as retenções para UMA comissão individual
 * REGRAS:
 * 1. Optante Simples (OPTOU_SIMPLES = "S") → ISENTO
 * 2. Não optante (OPTOU_SIMPLES = "N") → RETÉM TUDO
 * 3. Não optante + COD_AGENC preenchido → SÓ IR
 */
export const calcularRetencoesFrontend = (comissao) => {
  const valorComissao = Number(comissao.VALOR || comissao.valor || 0);
  
  // CAMPOS DECISIVOS
  const optouSimples = comissao.OPTOU_SIMPLES === 'S';
  const temCodAgenc = comissao.COD_AGENC !== null && 
                       comissao.COD_AGENC !== undefined && 
                       comissao.COD_AGENC !== '';

  // REGRA 1: Optante pelo Simples Nacional → ISENTO
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

  // REGRA 2: Não optante com código de agenciamento → SÓ IR
  if (temCodAgenc) {
    const retencoes = {
      iss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.iss },
      ir: { 
        aplicavel: true, 
        valor: valorComissao * ALIQUOTAS.ir,
        aliquota: ALIQUOTAS.ir 
      },
      cofins: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.cofins },
      csll: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.csll },
      pis: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.pis },
      inss: { aplicavel: false, valor: 0, aliquota: ALIQUOTAS.inss }
    };
    
    const totalRetencoes = Object.values(retencoes).reduce((sum, r) => sum + (r.aplicavel ? r.valor : 0), 0);
    
    return {
      retencoes,
      total_retencoes: totalRetencoes,
      valor_liquido: valorComissao - totalRetencoes,
      motivo: 'Agenciador - apenas IR retido',
      isIsento: false,
      optouSimples: false,
      temCodAgenc: true,
    };
  }

  // REGRA 3: Não optante → RETÉM TODOS OS IMPOSTOS
  const retencoes = {
    iss: { aplicavel: true, valor: valorComissao * ALIQUOTAS.iss, aliquota: ALIQUOTAS.iss },
    ir: { aplicavel: true, valor: valorComissao * ALIQUOTAS.ir, aliquota: ALIQUOTAS.ir },
    cofins: { aplicavel: true, valor: valorComissao * ALIQUOTAS.cofins, aliquota: ALIQUOTAS.cofins },
    csll: { aplicavel: true, valor: valorComissao * ALIQUOTAS.csll, aliquota: ALIQUOTAS.csll },
    pis: { aplicavel: true, valor: valorComissao * ALIQUOTAS.pis, aliquota: ALIQUOTAS.pis },
    inss: { aplicavel: true, valor: valorComissao * ALIQUOTAS.inss, aliquota: ALIQUOTAS.inss }
  };
  
  const totalRetencoes = Object.values(retencoes).reduce((sum, r) => sum + (r.aplicavel ? r.valor : 0), 0);
  
  return {
    retencoes,
    total_retencoes: totalRetencoes,
    valor_liquido: valorComissao - totalRetencoes,
    motivo: 'Não optante - retenções completas aplicadas',
    isIsento: false,
    optouSimples: false,
    temCodAgenc: false,
  };
};

/**
 * Calcula retenções para um conjunto de comissões (CONSOLIDADO)
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
  const todosNaoOptantes = comissoesComDetalhes.every(c => !c.optouSimples && !c.isIsento);
  const temCodAgenc = comissoesComDetalhes.some(c => c.temCodAgenc);
  const todosIsentos = comissoesComDetalhes.every(c => c.isIsento);

  // DETERMINA QUAIS RETENÇÕES SÃO APLICÁVEIS PARA O GRUPO
  let retencoesAplicaveis = [];
  let motivo = '';
  let isIsento = false;
  
  if (todosOptantes || todosIsentos) {
    // Todos isentos/optantes → sem retenções
    retencoesAplicaveis = [];
    motivo = todosOptantes ? 'Todos são optantes pelo Simples Nacional' : 'Todos são isentos';
    isIsento = true;
  } else if (todosNaoOptantes && temCodAgenc) {
    // Todos não optantes com agenciamento → apenas IR
    retencoesAplicaveis = ['ir'];
    motivo = 'Agenciador - apenas IR retido';
    isIsento = false;
  } else if (todosNaoOptantes) {
    // Todos não optantes → todas as retenções
    retencoesAplicaveis = ['iss', 'ir', 'cofins', 'csll', 'pis', 'inss'];
    motivo = 'Não optante - retenções completas aplicadas';
    isIsento = false;
  } else {
    // Regime misto → união de todas as retenções aplicáveis
    const todasRetencoes = new Set();
    comissoesComDetalhes.forEach(c => {
      c.retencoes_aplicaveis.forEach(r => todasRetencoes.add(r.tipo));
    });
    retencoesAplicaveis = Array.from(todasRetencoes);
    motivo = 'Regime misto - retenções combinadas';
    isIsento = retencoesAplicaveis.length === 0;
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
      todosNaoOptantes,
      temCodAgenc,
      todosIsentos,
      isMisto: !todosOptantes && !todosNaoOptantes && !todosIsentos
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