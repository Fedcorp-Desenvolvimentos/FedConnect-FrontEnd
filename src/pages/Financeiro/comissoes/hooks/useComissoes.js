import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useLoading } from '../../../../hooks/useLoading';
import {
  buscarComissoesPorDataCorte,
  buscarPessoas,
  buscarProdutosPorFavorecido,
  emitirVoucher,
  emitirRecibo
} from '../../../../services/comissoesService';
import { useAuth } from '../../../../context/AuthContext';

const INITIAL_FILTERS = {
  favorecido: '',
  fatura: '',
  vencimento_inicial: '',
  vencimento_final: '',
  status: 'baixadas',
  tipo: '',
  co_estipulante: '',
  apolice: '',
  recibo: '',
  produto: '',
};

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

// ⭐ REGRAS DE RETENÇÃO NO FRONTEND
const RETENTION_RULES = {
  MIN_VALUE_FOR_IR: 666.00,
};

const getComissaoKey = (c) => {
  const documento = c.DOCUMENTO ?? '';
  const favor = c.FAVOR ?? '';
  const tipo = c.TIPO ?? '';
  const parcela = c.PARCELA ?? '1';
  const valor = Number(c.VALOR ?? 0).toFixed(2);

  return [documento, favor, tipo, parcela, valor].join('|');
};

const getCurrentMonthDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
};

const formatDataCorte = (data) => {
  if (!data) return 'Mês atual';

  try {
    const partes = data.split('-');
    const meses = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return `${meses[parseInt(partes[1], 10) - 1]} de ${partes[0]}`;
  } catch {
    return data;
  }
};

const normalizeFilters = (filters) => {
  const next = { ...filters };

  if (next.status === 'todas') {
    delete next.status;
  }

  const cleaned = {};
  Object.keys(next).forEach((key) => {
    const value = next[key];
    if (value !== '' && value !== null && value !== undefined && value !== 'null') {
      cleaned[key] = value;
    }
  });

  return cleaned;
};

const hasMeaningfulFilters = (filters) => {
  return Boolean(
    filters.favorecido ||
      filters.fatura ||
      filters.vencimento_inicial ||
      filters.vencimento_final ||
      filters.tipo ||
      filters.co_estipulante ||
      filters.apolice ||
      filters.recibo ||
      (filters.status && filters.status !== 'baixadas')
  );
};

// ⭐ FUNÇÃO QUE CALCULA RETENÇÕES NO FRONTEND
const calcularRetencoesFrontend = (comissao) => {
  const valorComissao = Number(comissao.VALOR || comissao.valor || 0);
  const valorParcela = Number(comissao.VALOR_PARCELA || comissao.valor_parcela || valorComissao);
  const optanteSimples = comissao.OPTOU_SIMPLES === 'S';
  const codAgenc = comissao.COD_AGENC;

  const retencoes = {
    iss: { aplicavel: false, valor: 0, aliquota: 0.02 },
    ir: { aplicavel: false, valor: 0, aliquota: 0.015 },
    cofins: { aplicavel: false, valor: 0, aliquota: 0.03 },
    csll: { aplicavel: false, valor: 0, aliquota: 0.01 },
    pis: { aplicavel: false, valor: 0, aliquota: 0.0065 },
    inss: { aplicavel: false, valor: 0, aliquota: 0.11 },
  };

  let motivo = '';

  // REGRA 1: Optante pelo Simples Nacional - isento de retenções
  if (optanteSimples) {
    motivo = 'Optante pelo Simples Nacional - isento de retenções';
    return { retencoes, total_retencoes: 0, valor_liquido: valorComissao, motivo };
  }

  // REGRA 2: Não optante com código de serviço de agenciamento (tem COD_AGENC)
  if (codAgenc) {
    // Só retém IR (se valor da parcela >= 666,00)
    if (valorParcela >= RETENTION_RULES.MIN_VALUE_FOR_IR) {
      retencoes.ir.aplicavel = true;
      retencoes.ir.valor = valorComissao * 0.015;
    }
    
    const totalRetencoes = Object.values(retencoes).reduce((sum, r) => sum + (r.aplicavel ? r.valor : 0), 0);
    
    if (totalRetencoes < 10) {
      motivo = 'Soma dos impostos abaixo de R$ 10,00 - isento de retenção';
      return { retencoes, total_retencoes: 0, valor_liquido: valorComissao, motivo };
    }
    
    motivo = 'Agenciador - apenas IR retido';
    
    return {
      retencoes,
      total_retencoes: totalRetencoes,
      valor_liquido: valorComissao - totalRetencoes,
      motivo
    };
  }

  // REGRA 3: Não optante - retém todos os impostos
  // IR só se valor da parcela >= 666,00
  if (valorParcela >= RETENTION_RULES.MIN_VALUE_FOR_IR) {
    retencoes.ir.aplicavel = true;
    retencoes.ir.valor = valorComissao * 0.015;
  }

  // Demais impostos sempre aplicáveis para não optantes
  retencoes.iss.aplicavel = true;
  retencoes.iss.valor = valorComissao * 0.02;

  retencoes.cofins.aplicavel = true;
  retencoes.cofins.valor = valorComissao * 0.03;

  retencoes.csll.aplicavel = true;
  retencoes.csll.valor = valorComissao * 0.01;

  retencoes.pis.aplicavel = true;
  retencoes.pis.valor = valorComissao * 0.0065;

  const totalRetencoes = Object.values(retencoes).reduce((sum, r) => sum + (r.aplicavel ? r.valor : 0), 0);

  if (totalRetencoes < 10) {
    motivo = 'Soma dos impostos abaixo de R$ 10,00 - isento de retenção';
    return { retencoes, total_retencoes: 0, valor_liquido: valorComissao, motivo };
  }

  motivo = 'Não optante - retenções completas aplicadas';

  return {
    retencoes,
    total_retencoes: totalRetencoes,
    valor_liquido: valorComissao - totalRetencoes,
    motivo
  };
};

export const useEmissaoRecibos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { withLoading, loading, startLoading, stopLoading } = useLoading();

  const [loadingInitial, setLoadingInitial] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const [comissoes, setComissoes] = useState([]);
  const [isUsingFilteredData, setIsUsingFilteredData] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const [pessoas, setPessoas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedComissoes, setSelectedComissoes] = useState(new Set());
  const [selectedRetentions, setSelectedRetentions] = useState([]);
  const [documentType, setDocumentType] = useState('recibo');
  const [lastEmission, setLastEmission] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [retencoesVerificadas, setRetencoesVerificadas] = useState(null);

  const { user } = useAuth();

  const hasActiveFilters = useMemo(() => {
    return hasMeaningfulFilters(filters);
  }, [filters]);

  useEffect(() => {
    const loadPessoas = async () => {
      try {
        const response = await buscarPessoas({ status: 'A', limit: 7000 });
        let lista = [];

        if (response?.data) {
          if (Array.isArray(response.data)) {
            lista = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            lista = response.data.data;
          }
        }

        setPessoas(lista);
      } catch {
        enqueueSnackbar('Erro ao carregar lista de pessoas', { variant: 'error' });
      }
    };

    loadPessoas();
  }, [enqueueSnackbar]);

  useEffect(() => {
    if (filters.favorecido) {
      buscarProdutosPorFavorecido(filters.favorecido).then(setProdutos);
    } else {
      setProdutos([]);
    }
  }, [filters.favorecido]);

  const resetSelections = useCallback(() => {
    setSelectedComissoes(new Set());
    setSelectedRetentions([]);
    setRetencoesVerificadas(null);
  }, []);

  const buscarComissoes = useCallback(
    async (novosFiltros = {}) => {
      const filtrosAtualizados = { ...filters, ...novosFiltros };
      const usingFilteredMode = hasMeaningfulFilters(filtrosAtualizados);
      const filtrosLimpos = normalizeFilters(filtrosAtualizados);

      setLoadingInitial(true);

      try {
        const result = await withLoading(
          async () => buscarComissoesPorDataCorte(getCurrentMonthDate(), filtrosLimpos),
          'Buscando comissões...'
        );

        if (!result?.sucesso) {
          setComissoes([]);
          setTotalRegistros(0);
          setHasSearched(true);
          return;
        }

        const dados = result.dados || {};
        const lista = dados.data || [];
        const total = dados.total_registros || lista.length;

        setComissoes(lista);
        setTotalRegistros(total);
        setIsUsingFilteredData(usingFilteredMode);
        setHasSearched(true);

        if (!usingFilteredMode) {
          resetSelections();
        }

        if (lista.length === 0) {
          enqueueSnackbar(`Nenhuma comissão encontrada para ${formatDataCorte(getCurrentMonthDate())}`, {
            variant: 'info',
          });
        } else {
          enqueueSnackbar(`${lista.length} comissão(ões) encontrada(s)`, {
            variant: 'success',
          });
        }
      } catch {
        enqueueSnackbar('Erro ao buscar comissões', { variant: 'error' });
        setComissoes([]);
        setTotalRegistros(0);
        setHasSearched(true);
      } finally {
        setLoadingInitial(false);
      }
    },
    [filters, withLoading, enqueueSnackbar, resetSelections]
  );

  const buscarTudo = useCallback(async () => {
    await buscarComissoes();
  }, [buscarComissoes]);

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      ...INITIAL_FILTERS,
      status: 'baixadas',
    });

    setComissoes([]);
    setTotalRegistros(0);
    setIsUsingFilteredData(false);
    setHasSearched(false);
    resetSelections();

    enqueueSnackbar('Filtros limpos. Faça uma nova consulta.', {
      variant: 'info',
    });
  }, [enqueueSnackbar, resetSelections]);

  // Auto-calcula retenções quando comissões são selecionadas/desmarcadas
  useEffect(() => {
    if (selectedComissoes.size === 0) {
      setRetencoesVerificadas(null);
      setSelectedRetentions([]);
      return;
    }

    const comissoesSelecionadas = comissoes.filter((c) =>
      selectedComissoes.has(getComissaoKey(c))
    );

    if (comissoesSelecionadas.length === 0) return;

    const comissoesComRetencoes = comissoesSelecionadas.map(c => {
      const resultado = calcularRetencoesFrontend(c);
      return {
        ...c,
        retencoes_calculadas: {
          aplicaveis: Object.entries(resultado.retencoes)
            .filter(([_, v]) => v.aplicavel)
            .map(([key, v]) => ({
              tipo: key,
              valor: v.valor,
              aliquota: v.aliquota
            })),
          total_retencoes: resultado.total_retencoes,
          valor_liquido: resultado.valor_liquido,
          motivo: resultado.motivo
        }
      };
    });

    const totalBruto = comissoesComRetencoes.reduce((sum, c) => sum + Number(c.VALOR || 0), 0);
    const totalRetencoes = comissoesComRetencoes.reduce((sum, c) => sum + c.retencoes_calculadas.total_retencoes, 0);

    const response = {
      status: 'success',
      total_bruto: totalBruto,
      total_retencoes: totalRetencoes,
      total_liquido: totalBruto - totalRetencoes,
      quantidade: comissoesComRetencoes.length,
      comissoes: comissoesComRetencoes,
      timestamp: new Date().toISOString()
    };

    setRetencoesVerificadas(response);

    const retencoesAplicaveis = new Set();
    response.comissoes.forEach(c => {
      c.retencoes_calculadas?.aplicaveis?.forEach(r => {
        if (r.tipo !== 'iss') {
          retencoesAplicaveis.add(r.tipo);
        }
      });
    });

    setSelectedRetentions(Array.from(retencoesAplicaveis));
  }, [selectedComissoes, comissoes]);

  const toggleComissao = useCallback((comissao) => {
    const key = getComissaoKey(comissao);

    setSelectedComissoes((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const toggleAllComissoes = useCallback(() => {
    if (comissoes.length === 0) return;

    const allKeys = comissoes.map((c) => getComissaoKey(c));
    const allSelected = allKeys.every((key) => selectedComissoes.has(key));

    setSelectedComissoes((prev) => {
      const next = new Set(prev);

      if (allSelected) {
        allKeys.forEach((key) => next.delete(key));
      } else {
        allKeys.forEach((key) => next.add(key));
      }

      return next;
    });
  }, [comissoes, selectedComissoes]);

  const toggleRetention = useCallback((retentionId) => {
    setSelectedRetentions((prev) => {
      if (prev.includes(retentionId)) {
        return prev.filter((id) => id !== retentionId);
      }
      return [...prev, retentionId];
    });
  }, []);

  const retentionSummary = useMemo(() => {
    const selecionadas = comissoes.filter((c) => selectedComissoes.has(getComissaoKey(c)));

    const grossTotal = selecionadas.reduce((sum, c) => {
      return sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0);
    }, 0);

    const retentionRows = RETENTION_OPTIONS.filter((opt) =>
      selectedRetentions.includes(opt.id)
    ).map((opt) => ({
      ...opt,
      value: grossTotal * opt.rate,
    }));

    const retentionTotal = retentionRows.reduce((sum, item) => sum + item.value, 0);

    return {
      grossTotal,
      retentionRows,
      retentionTotal,
      netTotal: grossTotal - retentionTotal,
      count: selecionadas.length,
    };
  }, [comissoes, selectedComissoes, selectedRetentions]);

  const totals = useMemo(() => {
    return {
      grossTotal: retentionSummary.grossTotal,
      retentionTotal: retentionSummary.retentionTotal,
      netTotal: retentionSummary.netTotal,
      count: retentionSummary.count,
    };
  }, [retentionSummary]);

  // ⭐ FUNÇÃO QUE VERIFICA RETENÇÕES NO FRONTEND (SEM CHAMADA AO BACKEND)
  const verificarRetencoesComissoes = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    startLoading('Verificando retenções...');

    try {
      const comissoesSelecionadas = comissoes.filter((c) => 
        selectedComissoes.has(getComissaoKey(c))
      );

      // ⭐ CALCULA RETENÇÕES DIRETAMENTE NO FRONTEND
      const comissoesComRetencoes = comissoesSelecionadas.map(c => {
        const resultado = calcularRetencoesFrontend(c);
        return {
          ...c,
          retencoes_calculadas: {
            aplicaveis: Object.entries(resultado.retencoes)
              .filter(([_, v]) => v.aplicavel)
              .map(([key, v]) => ({
                tipo: key,
                valor: v.valor,
                aliquota: v.aliquota
              })),
            total_retencoes: resultado.total_retencoes,
            valor_liquido: resultado.valor_liquido,
            motivo: resultado.motivo
          }
        };
      });

      const totalBruto = comissoesComRetencoes.reduce((sum, c) => sum + Number(c.VALOR || 0), 0);
      const totalRetencoes = comissoesComRetencoes.reduce((sum, c) => sum + c.retencoes_calculadas.total_retencoes, 0);

      const response = {
        status: 'success',
        total_bruto: totalBruto,
        total_retencoes: totalRetencoes,
        total_liquido: totalBruto - totalRetencoes,
        quantidade: comissoesComRetencoes.length,
        comissoes: comissoesComRetencoes,
        timestamp: new Date().toISOString()
      };

      setRetencoesVerificadas(response);
      
      // Auto-seleciona retenções aplicáveis
      const retencoesAplicaveis = new Set();
      response.comissoes.forEach(c => {
        c.retencoes_calculadas?.aplicaveis?.forEach(r => {
          retencoesAplicaveis.add(r.tipo);
        });
      });
      
      setSelectedRetentions(Array.from(retencoesAplicaveis));
      
      enqueueSnackbar(`Retenções verificadas: ${response.comissoes.length} comissão(ões)`, {
        variant: 'success'
      });
      
    } catch (error) {
      console.error('Erro ao verificar retenções:', error);
      enqueueSnackbar('Erro ao verificar retenções', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [selectedComissoes, comissoes, enqueueSnackbar, startLoading, stopLoading]);

  const buildDocumentPayload = useCallback(() => {
    const comissoesSelecionadas = comissoes.filter((c) => 
      selectedComissoes.has(getComissaoKey(c))
    );

    return {
      tipoDocumento: documentType,
      dataEmissao: new Date().toISOString(),
      dataCorteFormatada: formatDataCorte(getCurrentMonthDate()),
      totalComissoes: comissoesSelecionadas.length,
      valorTotalBruto: retentionSummary.grossTotal,
      valorLiquido: retentionSummary.netTotal,
      retencoesAplicadas: retentionSummary.retentionRows.map((r) => ({
        tipo: r.label,
        aliquota: `${(r.rate * 100).toFixed(2)}%`,
        valor: r.value,
      })),
      
      comissoes: comissoesSelecionadas.map((c) => ({
        fatura: c.FATURA || c.fatura || '',
        parcela: c.PARCELA || c.parcela || '1',
        tipo_fat: c.TIPO_FAT || c.tipo_fat || 'A',
        documento: c.DOCUMENTO || c.documento || '',
        vencimento: c.VENCIMENTO || c.vencimento || null,
        data_fat: c.DATA_FAT || c.data_fat || null,
        nome_segurado: c.NOME_SEGURADO || c.nome_segurado || 'NÃO INFORMADO',
        doc_segurado: c.DOC_SEGURADO || c.doc_segurado || '',
        tp_segurado: c.TP_SEGURADO || c.tp_segurado || '',
        cod_segurado: c.COD_SEGURADO || c.cod_segurado || '',
        favorecido: c.FAVOR || c.favor || '',
        favorecido_nome: c.NOME || c.nome || '',
        favorecido_documento: c.DOC_FAVORECIDO || c.doc_favorecido || '',
        banco_agencia_conta: c.BC_AG_CC || c.bc_ag_cc || '',
        chave_pix: c.CHAVE_PIX || c.chave_pix || null,
        valor_comissao: Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0),
        percentual: Number(c.COMISSAO || c.comissao || 0),
        imposto: Number(c.IMPOSTO || c.imposto || 0),
        valor_liq: Number(c.VALOR_LIQ || c.valor_liq || 0),
        produto: c.PRODUTO || c.produto || '',
        produto_original: c.PRODUTO_ORI || c.produto_ori || '',
        co_estipulante: c.CO_ESTIP || c.co_estip || '',
        voucher: c.VOUCHER || c.voucher || null,
        data_repasse: c.DT_REPASSE || c.dt_repasse || null,
        status: c.STATUS || c.status || '',
        quitado: Number(c.QUITADO || c.quitado || 0),
        prc_quitado: Number(c.PRC_QUITADO || c.prc_quitado || 0),
        parcelas_fat: Number(c.PARCELAS || c.parcelas || 1),
        inclui_manual: c.INCLUI_MANUAL || c.inclui_manual || 'N',
        parc_manual: Number(c.PARC_MANUAL || c.parc_manual || 0),
        tipo: c.TIPO || c.tipo || 'BENEFICIO',
        iof: c.IOF || c.iof || 'N',
        perc_iof: Number(c.PERC_IOF || c.perc_iof || 0),
        cofins: c.COFINS || c.cofins || 'N',
        perc_cofins: Number(c.PERC_COFINS || c.perc_cofins || 0),
        csll: c.CSLL || c.csll || 'N',
        perc_csll: Number(c.PERC_CSLL || c.perc_csll || 0),
        pis: c.PIS || c.pis || 'N',
        perc_pis: Number(c.PERC_PIS || c.perc_pis || 0),
        apolice: c.APOLICE || c.apolice || '',
        premio_bruto: Number(c.PREMIO_BRUTO || c.premio_bruto || 0),
        premio_liquido: Number(c.PREMIO_LIQ || c.premio_liq || 0),
        conta_apolice: c.CONTA_APOLICE || c.conta_apolice || '',
        pri_cor: c.PRI_COR || c.pri_cor || '',
        sec_cor: c.SEC_COR || c.sec_cor || '',
        fat_col_posto: c.FAT_COL_POSTO || c.fat_col_posto || 'N',
        valor_assist: Number(c.VALOR_ASSIST || c.valor_assist || 0),
        assist: c.ASSIST || c.assist || 'N',
        qtd_vidas: Number(c.QTD_VIDAS || c.qtd_vidas || 0),
      })),
      
      filtrosAplicados: {
        favorecido: filters.favorecido,
        fatura: filters.fatura,
        status: filters.status,
        tipo: filters.tipo,
        co_estipulante: filters.co_estipulante,
        apolice: filters.apolice,
        recibo: filters.recibo,
      },
      
      resumoGeral: {
        totalComissoesSelecionadas: comissoesSelecionadas.length,
        valorTotalBruto: retentionSummary.grossTotal,
        totalRetencoes: retentionSummary.retentionTotal,
        valorLiquidoFinal: retentionSummary.netTotal,
      },
      
      registrosBrutos: comissoesSelecionadas,
    };
  }, [
    comissoes, 
    selectedComissoes, 
    documentType, 
    retentionSummary, 
    filters
  ]);

  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    startLoading('Preparando dados para emissão...');

    try {
      const comissoesSelecionadas = comissoes.filter((c) => 
        selectedComissoes.has(getComissaoKey(c))
      );

      const payload = {
        tipo_documento: documentType,
        data_emissao: new Date().toISOString().split('T')[0],
        usuario: user?.nome_completo || user?.email,
        comissoes: comissoesSelecionadas.map((c) => ({
          fatura: Number(c.FATURA || c.fatura),
          parcela: Number(c.PARCELA || c.parcela || 1),
          tipo_fat: c.TIPO_FAT || c.tipo_fat || 'A',
          documento: c.DOCUMENTO || c.documento || '',
          vencimento: c.VENCIMENTO || c.vencimento || null,
          data_fat: c.DATA_FAT || c.data_fat || null,
          nome_segurado: c.NOME_SEGURADO || c.nome_segurado || 'NÃO INFORMADO',
          doc_segurado: c.DOC_SEGURADO || c.doc_segurado || '',
          tp_segurado: c.TP_SEGURADO || c.tp_segurado || '',
          cod_segurado: c.COD_SEGURADO || c.cod_segurado || '',
          favorecido: c.FAVOR || c.favor || '',
          favorecido_nome: c.NOME || c.nome || '',
          favorecido_documento: c.DOC_FAVORECIDO || c.doc_favorecido || '',
          banco_agencia_conta: c.BC_AG_CC || c.bc_ag_cc || '',
          chave_pix: c.CHAVE_PIX || c.chave_pix || null,
          valor_comissao: Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0),
          percentual: Number(c.COMISSAO || c.comissao || 0),
          imposto: Number(c.IMPOSTO || c.imposto || 0),
          valor_liq: Number(c.VALOR_LIQ || c.valor_liq || 0),
          produto: c.PRODUTO || c.produto || '',
          produto_original: c.PRODUTO_ORI || c.produto_ori || '',
          co_estipulante: c.CO_ESTIP || c.co_estip || '',
          voucher: c.VOUCHER || c.voucher || null,
          data_repasse: c.DT_REPASSE || c.dt_repasse || null,
          status: c.STATUS || c.status || '',
          quitado: Number(c.QUITADO || c.quitado || 0),
          prc_quitado: Number(c.PRC_QUITADO || c.prc_quitado || 0),
          parcelas_fat: Number(c.PARCELAS || c.parcelas || 1),
          inclui_manual: c.INCLUI_MANUAL || c.inclui_manual || 'N',
          parc_manual: Number(c.PARC_MANUAL || c.parc_manual || 0),
          tipo: c.TIPO || c.tipo || 'BENEFICIO',
          iof: c.IOF || c.iof || 'N',
          perc_iof: Number(c.PERC_IOF || c.perc_iof || 0),
          cofins: c.COFINS || c.cofins || 'N',
          perc_cofins: Number(c.PERC_COFINS || c.perc_cofins || 0),
          csll: c.CSLL || c.csll || 'N',
          perc_csll: Number(c.PERC_CSLL || c.perc_csll || 0),
          pis: c.PIS || c.pis || 'N',
          perc_pis: Number(c.PERC_PIS || c.perc_pis || 0),
          apolice: c.APOLICE || c.apolice || '',
          premio_bruto: Number(c.PREMIO_BRUTO || c.premio_bruto || 0),
          premio_liquido: Number(c.PREMIO_LIQ || c.premio_liq || 0),
          conta_apolice: c.CONTA_APOLICE || c.conta_apolice || '',
          pri_cor: c.PRI_COR || c.pri_cor || '',
          sec_cor: c.SEC_COR || c.sec_cor || '',
          fat_col_posto: c.FAT_COL_POSTO || c.fat_col_posto || 'N',
          valor_assist: Number(c.VALOR_ASSIST || c.valor_assist || 0),
          assist: c.ASSIST || c.assist || 'N',
          qtd_vidas: Number(c.QTD_VIDAS || c.qtd_vidas || 0),
        })),
        retencoes: selectedRetentions.map((id) => {
          const opt = RETENTION_OPTIONS.find((o) => o.id === id);
          return {
            tipo: opt?.label || id,
            aliquota: opt?.rate || 0,
            valor: retentionSummary.grossTotal * (opt?.rate || 0),
          };
        }),
        resumo: {
          total_comissoes: comissoesSelecionadas.length,
          valor_total_bruto: retentionSummary.grossTotal,
          total_retencoes: retentionSummary.retentionTotal,
          valor_liquido_final: retentionSummary.netTotal,
        },
      };

      let response;

      if (documentType === 'voucher') {
        response = await emitirVoucher(payload);
      } else {
        response = await emitirRecibo(payload);
      }

      if (response?.sucesso) {
        if (response.pdf_base64) {
          const link = document.createElement('a');
          link.href = `data:application/pdf;base64,${response.pdf_base64}`;
          link.download = response.nome_arquivo || `recibo_${Date.now()}.pdf`;
          link.click();
        }

        setLastEmission({
          numero: response.numero_documento || `RC-${String(Date.now()).slice(-6)}`,
          emitidoEm: new Date().toISOString(),
          tipo: documentType,
          total: retentionSummary.netTotal,
          quantidade: payload.resumo.total_comissoes,
        });

        enqueueSnackbar(
          `${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido com sucesso!`,
          { variant: 'success' }
        );

        resetSelections();
      } else {
        throw new Error(response?.erro || 'Erro ao emitir documento');
      }
    } catch (error) {
      console.error('❌ Erro ao emitir documento:', error);
      enqueueSnackbar(error.message || 'Erro ao emitir documento', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [
    selectedComissoes,
    comissoes,
    documentType,
    retentionSummary,
    selectedRetentions,
    enqueueSnackbar,
    startLoading,
    stopLoading,
    resetSelections,
    user,
  ]);

  const previewDocument = useCallback(() => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    setPreviewData(buildDocumentPayload());
    setPreviewOpen(true);
  }, [selectedComissoes, enqueueSnackbar, buildDocumentPayload]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  return {
    loading,
    loadingInitial,
    filters,
    showAdvancedFilters,
    comissoes,
    pessoas,
    produtos,
    selectedComissoes,
    selectedRetentions,
    documentType,
    lastEmission,
    totalRegistros,
    totals,
    retentionSummary,
    isUsingFilteredData,
    hasActiveFilters,
    hasSearched,
    previewOpen,
    previewData,
    retencoesVerificadas,

    buscarTudo,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleRetention,
    setDocumentType,
    emitirDocumento,
    previewDocument,
    closePreview,
    verificarRetencoesComissoes,
  };
};