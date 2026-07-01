// hooks/useEmissaoRecibos.js - VERSÃO REFATORADA SEM PAGINAÇÃO

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useLoading } from '../../../../hooks/useLoading';
import {
  buscarComissoesPorDataCorte,
  buscarPessoas,
} from '../../../../services/comissoesService';

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
  com_voucher: null,
  data_corte: '',
};

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

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
      filters.com_voucher !== null ||
      (filters.status && filters.status !== 'baixadas') ||
      filters.data_corte
  );
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
  const [selectedComissoes, setSelectedComissoes] = useState(new Set());
  const [selectedRetentions, setSelectedRetentions] = useState([]);
  const [documentType, setDocumentType] = useState('recibo');
  const [lastEmission, setLastEmission] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const dataCorte = useMemo(() => {
    return filters.data_corte || getCurrentMonthDate();
  }, [filters.data_corte]);

  const dataCorteFormatada = useMemo(() => {
    return formatDataCorte(dataCorte);
  }, [dataCorte]);

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

  const resetSelections = useCallback(() => {
    setSelectedComissoes(new Set());
    setSelectedRetentions([]);
  }, []);

  const buscarComissoes = useCallback(
    async (novosFiltros = {}) => {
      const filtrosAtualizados = { ...filters, ...novosFiltros };
      const usingFilteredMode = hasMeaningfulFilters(filtrosAtualizados);
      const filtrosLimpos = normalizeFilters(filtrosAtualizados);
      const dataParaBusca = filtrosAtualizados.data_corte || getCurrentMonthDate();

      setLoadingInitial(true);

      try {
        const result = await withLoading(
          async () => buscarComissoesPorDataCorte(dataParaBusca, filtrosLimpos),
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
          enqueueSnackbar(`Nenhuma comissão encontrada para ${formatDataCorte(dataParaBusca)}`, {
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
      data_corte: '',
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

  // Monta o payload completo (documento + comissões + retenções) reaproveitado
  // tanto pela emissão real quanto pela pré-visualização.
  const buildDocumentPayload = useCallback(() => {
    const comissoesSelecionadas = comissoes.filter((c) => selectedComissoes.has(getComissaoKey(c)));

    return {
      tipoDocumento: documentType,
      dataCorte,
      dataCorteFormatada,
      dataEmissao: new Date().toISOString(),
      totalComissoes: comissoesSelecionadas.length,
      valorTotalBruto: retentionSummary.grossTotal,
      valorLiquido: retentionSummary.netTotal,
      retencoesAplicadas: retentionSummary.retentionRows.map((r) => ({
        tipo: r.label,
        aliquota: `${(r.rate * 100).toFixed(2)}%`,
        valor: r.value,
      })),
      comissoes: comissoesSelecionadas.map((c) => ({
        fatura: c.FATURA || c.fatura || c.DOCUMENTO || '',
        parcela: c.PARCELA || c.parcela || '1',
        favorecido: c.FAVOR || c.favor || '',
        favorecidoNome: c.NOME || c.nome || '',
        favorecidoDocumento: c.DOC_FAVORECIDO || c.doc_favorecido || '',
        valorComissao: Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0),
        percentual: c.COMISSAO || c.comissao || 0,
        imposto: c.IMPOSTO || c.imposto || 0,
        voucher: c.VOUCHER || c.voucher || null,
        dataRepasse: c.DT_REPASSE || c.dt_repasse || null,
        produto: c.PRODUTO || c.produto || '',
        coEstipulante: c.CO_ESTIP || c.co_estip || '',
        bancoAgenciaConta: c.BC_AG_CC || c.bc_ag_cc || '',
        chavePix: c.CHAVE_PIX || c.chave_pix || null,
        vencimento: c.VENCIMENTO || c.vencimento || null,
        dataFat: c.DATA_FAT || c.data_fat || null,
        tipoFatura: c.TIPO_FAT || c.tipo_fat || '',
        premioBruto: Number(c.PREMIO_BRUTO || c.premio_bruto || 0),
        premioLiquido: Number(c.PREMIO_LIQ || c.premio_liq || 0),
        quitado: c.QUITADO || c.quitado || 0,
        status: c.STATUS || c.status || '',
        documento: c.DOCUMENTO || c.documento || '',
        produtoOriginal: c.PRODUTO_ORI || c.produto_ori || '',
      })),
      filtrosAplicados: {
        dataCorte,
        favorecido: filters.favorecido,
        fatura: filters.fatura,
        status: filters.status,
        tipo: filters.tipo,
        co_estipulante: filters.co_estipulante,
        apolice: filters.apolice,
        recibo: filters.recibo,
        com_voucher: filters.com_voucher,
      },
      resumoGeral: {
        totalComissoesSelecionadas: comissoesSelecionadas.length,
        valorTotalBruto: retentionSummary.grossTotal,
        totalRetencoes: retentionSummary.retentionTotal,
        valorLiquidoFinal: retentionSummary.netTotal,
      },
      // Amostra dos registros crus recebidos da API (Resposta V2), útil para
      // conferência rápida dos dados de origem dentro da pré-visualização.
      registrosBrutos: comissoesSelecionadas,
    };
  }, [comissoes, selectedComissoes, documentType, dataCorte, dataCorteFormatada, retentionSummary, filters]);

  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    startLoading('Preparando dados para emissão...');

    try {
      const payload = buildDocumentPayload();

      console.info('Payload de emissão preparado:', payload);

      setLastEmission({
        numero: `RC-${String(Date.now()).slice(-6)}`,
        emitidoEm: new Date().toISOString(),
        tipo: documentType,
        total: retentionSummary.netTotal,
        quantidade: payload.totalComissoes,
      });

      enqueueSnackbar(
        `${documentType === 'voucher' ? 'Voucher' : 'Recibo'} preparado com ${
          payload.totalComissoes
        } comissão(ões). Dados disponíveis no console.`,
        { variant: 'success' }
      );

      resetSelections();
      setPreviewOpen(false);
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao preparar dados', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [
    selectedComissoes,
    enqueueSnackbar,
    startLoading,
    stopLoading,
    buildDocumentPayload,
    documentType,
    retentionSummary,
    resetSelections,
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
    selectedComissoes,
    selectedRetentions,
    documentType,
    lastEmission,
    totalRegistros,
    dataCorte,
    dataCorteFormatada,
    totals,
    retentionSummary,
    isUsingFilteredData,
    hasActiveFilters,
    hasSearched,
    previewOpen,
    previewData,

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
  };
};