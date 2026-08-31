// src/pages/Financeiro/comissoes/hooks/useComissoes.js

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { useSnackbar } from 'notistack';
import { useLoading } from '../../../../hooks/useLoading';
import {
  buscarComissoesPorDataCorte,
  buscarPessoas,
  buscarProdutosPorFavorecido,
  buscarFaturaPorNumero,
  exportarComissoesParaExcel,
  emitirVoucher,
  emitirRecibo
} from '../../../../services/comissoesService';
import { getFaturaPorNumeroViaFaturamento } from '../../../../services/consultaFatura';
import { getEmpresaPorTipo, inferirEmpresaPorTipos } from '../constants/empresasPagadoras';
import { useAuth } from '../../../../context/AuthContext';

// ⭐ IMPORTA AS FUNÇÕES DO ARQUIVO DE REGRAS
import { 
  calcularRetencoesConsolidadas,
  calcularRetencoesFrontend,
  DEFAULT_SELECTED,
  RETENTION_OPTIONS,
} from '../../../../utils/regras_retencao';

const INITIAL_FILTERS = {
  empresa: '',
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

// Chave única de uma comissão na seleção. FONTE ÚNICA: os componentes
// (ComissoesPanel, RetencoesPanel) devem IMPORTAR esta função — cópias locais
// dessincronizadas já causaram checkbox/somatório quebrados (WORK_LOG 1.31).
export const getComissaoKey = (c) => {
  const fatura = c.FATURA ?? '';
  const documento = c.DOCUMENTO ?? '';
  const favor = c.FAVOR ?? '';
  const tipo = c.TIPO ?? '';
  const parcela = c.PARCELA ?? '';
  const valor = Number(c.VALOR ?? 0).toFixed(2);

  return [fatura, documento, favor, tipo, parcela, valor].join('|');
};

// Data fixa para busca sem período - o backend não usa data_corte na query
const DATA_BUSCA_DEFAULT = '2000-01-01';

const formatDataCorte = (data) => {
  if (!data) return 'Todas';
  return data;
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
  // Tipo escolhido no seletor "Empresa pagadora (Recebemos de)".
  // null = automático (inferida pelo TIPO das comissões selecionadas)
  const [empresaPagadoraTipo, setEmpresaPagadoraTipo] = useState(null);
  const [lastEmission, setLastEmission] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [retencoesVerificadas, setRetencoesVerificadas] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

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
    setComissoes([]);
    setTotalRegistros(0);
    setHasSearched(false);
    setPreviewOpen(false);
  }, []);

  // RESETA AS RETENÇÕES QUANDO A LISTA DE COMISSÕES MUDA
  useEffect(() => {
    setSelectedRetentions([]);
    setRetencoesVerificadas(null);
  }, [comissoes]);

  // RESETA RETENÇÕES QUANDO MUDA O TIPO DE DOCUMENTO
  useEffect(() => {
    if (documentType === 'recibo') {
      // Recibo: nenhum imposto pré-selecionado
      setSelectedRetentions([]);
      setRetencoesVerificadas(null);
    } else {
      // Voucher: pré-seleciona PIS, COFINS, CSLL
      const comissoesSelecionadas = comissoes.filter((c) =>
        selectedComissoes.has(getComissaoKey(c))
      );
      if (comissoesSelecionadas.length > 0) {
        const temIR = comissoesSelecionadas.some(c => {
          const valor = Number(c.VALOR || c.valor || 0);
          return valor > 666.00;
        });
        const preSelected = [...DEFAULT_SELECTED];
        if (temIR) {
          preSelected.push('ir');
        }
        setSelectedRetentions(preSelected);
      }
    }
  }, [documentType]);

  const cacheFaturasAdministradora = useRef({});

  const enrichComissoesWithAdministradora = async (comissoes) => {
    if (!comissoes || comissoes.length === 0) return [];

    const faturasUnicas = [...new Set(comissoes.map(c => c.FATURA || c.fatura).filter(Boolean))];
    const faturasParaBuscar = faturasUnicas.filter(f => !cacheFaturasAdministradora.current[f]);

    for (const fatura of faturasParaBuscar) {
      try {
        const result = await getFaturaPorNumeroViaFaturamento(fatura);
        console.log(`[DEBUG] Resposta para fatura ${fatura}:`, JSON.stringify(result, null, 2));
        if (result?.resultado?.data && result.resultado.data.length > 0) {
          const faturaData = result.resultado.data[0];
          console.log(`[DEBUG] Dados fatura ${fatura}:`, faturaData);
          cacheFaturasAdministradora.current[fatura] = {
            cedente_nome: faturaData.NOME_ADMINISTRADORA || faturaData.ADMINISTRADORA || '',
            cedente_cnpj: faturaData.CNPJ_ADMINISTRADORA || '',
          };
        } else {
          console.log(`[DEBUG] Nenhum dado encontrado para fatura ${fatura}`);
          cacheFaturasAdministradora.current[fatura] = { cedente_nome: '', cedente_cnpj: '' };
        }
      } catch (error) {
        console.error(`Erro ao buscar fatura ${fatura}:`, error);
        cacheFaturasAdministradora.current[fatura] = { cedente_nome: '', cedente_cnpj: '' };
      }
    }

    return comissoes.map(c => {
      const fatura = c.FATURA || c.fatura;
      const adminData = cacheFaturasAdministradora.current[fatura] || { cedente_nome: '', cedente_cnpj: '' };
      return {
        ...c,
        CEDENTE_NOME: adminData.cedente_nome || c.CEDENTE_NOME || c.cedente_nome || '',
        CEDENTE_CNPJ: adminData.cedente_cnpj || c.CEDENTE_CNPJ || c.cedente_cnpj || '',
      };
    });
  };

  const buscarComissoes = useCallback(
    async (novosFiltros = {}) => {
      const filtrosAtualizados = { ...filters, ...novosFiltros };
      const usingFilteredMode = hasMeaningfulFilters(filtrosAtualizados);
      const filtrosLimpos = normalizeFilters(filtrosAtualizados);

      setLoadingInitial(true);

      try {
        const result = await withLoading(
          async () => buscarComissoesPorDataCorte(DATA_BUSCA_DEFAULT, filtrosLimpos),
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

        // RESETA SELEÇÕES E RETENÇÕES
        setSelectedComissoes(new Set());
        setSelectedRetentions([]);
        setRetencoesVerificadas(null);

        if (lista.length === 0) {
          enqueueSnackbar('Nenhuma comissão encontrada', {
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
    [filters, withLoading, enqueueSnackbar]
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
    setSelectedComissoes(new Set());
    setSelectedRetentions([]);
    setRetencoesVerificadas(null);

    enqueueSnackbar('Filtros limpos. Faça uma nova consulta.', {
      variant: 'info',
    });
  }, [enqueueSnackbar]);

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

    // PRÉ-SELEÇÃO:
    // VOUCHER: PIS, COFINS, CSLL vêm marcados (+ IR se valor > 666)
    // RECIBO: nenhum imposto pré-selecionado (usuário marca manualmente se quiser)
    if (documentType === 'recibo') {
      setSelectedRetentions([]);
    } else {
      const temIR = comissoesComRetencoes.some(c => {
        const valor = Number(c.VALOR || c.valor || 0);
        return valor > 666.00;
      });
      const preSelected = [...DEFAULT_SELECTED];
      if (temIR) {
        preSelected.push('ir');
      }
      setSelectedRetentions(preSelected);
    }
  }, [selectedComissoes, comissoes, documentType]);

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

    // RESETA RETENÇÕES VERIFICADAS QUANDO MUDA SELEÇÃO
    setRetencoesVerificadas(null);
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

    // RESETA RETENÇÕES VERIFICADAS
    setRetencoesVerificadas(null);
  }, [comissoes, selectedComissoes]);

  const toggleRetention = useCallback((retentionId) => {
    setSelectedRetentions((prev) => {
      if (prev.includes(retentionId)) {
        return prev.filter((id) => id !== retentionId);
      }
      return [...prev, retentionId];
    });
  }, []);

  const totalBrutoSelecionado = useMemo(() => {
    const selecionadas = comissoes.filter((c) => 
      selectedComissoes.has(getComissaoKey(c))
    );
    
    return selecionadas.reduce((sum, c) => {
      return sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0);
    }, 0);
  }, [comissoes, selectedComissoes]);

  const retentionSummary = useMemo(() => {
    const selecionadas = comissoes.filter((c) => 
      selectedComissoes.has(getComissaoKey(c))
    );

    const grossTotal = totalBrutoSelecionado;

    // USA selectedRetentions (estado real dos checkboxes) como fonte primária
    const retencoesAtivas = selectedRetentions;

    const retentionRows = RETENTION_OPTIONS.filter((opt) =>
      retencoesAtivas.includes(opt.id)
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
  }, [comissoes, selectedComissoes, selectedRetentions, totalBrutoSelecionado]);

  const totals = useMemo(() => {
    return {
      grossTotal: retentionSummary.grossTotal,
      retentionTotal: retentionSummary.retentionTotal,
      netTotal: retentionSummary.netTotal,
      count: retentionSummary.count,
    };
  }, [retentionSummary]);

  // ================================================================
  // EMPRESA PAGADORA (Recebemos de) — spec voucher-recebemos-de-empresa
  // Inferida pelo TIPO das comissões selecionadas; o seletor sobrescreve.
  // TIPOs mistos → inferência retorna null e a escolha vira obrigatória.
  // ================================================================
  const empresaInferida = useMemo(() => {
    const selecionadas = comissoes.filter((c) => selectedComissoes.has(getComissaoKey(c)));
    return inferirEmpresaPorTipos(selecionadas);
  }, [comissoes, selectedComissoes]);

  const tiposMistos = useMemo(() => {
    const selecionadas = comissoes.filter((c) => selectedComissoes.has(getComissaoKey(c)));
    if (selecionadas.length === 0) return false;
    const tipos = new Set(
      selecionadas.map((c) => String(c.TIPO ?? c.tipo ?? 'BENEFICIO').trim().toUpperCase())
    );
    return tipos.size > 1;
  }, [comissoes, selectedComissoes]);

  const empresaPagadora = empresaPagadoraTipo
    ? getEmpresaPorTipo(empresaPagadoraTipo)
    : empresaInferida;

  const buildDocumentPayload = useCallback((comissoesEnriquecidas = null) => {
    const comissoesSelecionadas = comissoesEnriquecidas || comissoes.filter((c) =>
      selectedComissoes.has(getComissaoKey(c))
    );

    // USA OS DADOS JÁ VERIFICADOS OU CALCULA NOVAMENTE
    let resultado;
    if (retencoesVerificadas?.comissoes?.length > 0) {
      resultado = {
        totalBruto: retencoesVerificadas.total_bruto,
        totalRetencoes: retencoesVerificadas.total_retencoes,
        valorLiquido: retencoesVerificadas.total_liquido,
        retencoesAplicaveis: retencoesVerificadas.retencoesAplicaveis,
        detalhesRetencoes: retencoesVerificadas.detalhesRetencoes || {},
      };
    } else {
      const calculado = calcularRetencoesConsolidadas(
        comissoesSelecionadas,
        totalBrutoSelecionado
      );
      resultado = {
        totalBruto: calculado.totalBruto,
        totalRetencoes: calculado.totalRetencoes,
        valorLiquido: calculado.valorLiquido,
        retencoesAplicaveis: calculado.retencoesAplicaveis,
        detalhesRetencoes: calculado.retencoes,
      };
    }

    // CONSTRÓI AS RETENÇÕES PARA O PAYLOAD
    // RECIBO: NENHUM imposto no PDF | VOUCHER: usa selectedRetentions
    const retencoesAplicadas = [];
    if (documentType !== 'recibo') {
      RETENTION_OPTIONS.forEach(opt => {
        if (selectedRetentions.includes(opt.id)) {
          retencoesAplicadas.push({
            tipo: opt.label,
            aliquota: `${(opt.rate * 100).toFixed(2)}%`,
            valor: resultado.totalBruto * opt.rate,
          });
        }
      });
    }

    // Calcula valor líquido: recibo = bruto (sem impostos), voucher = bruto - retenções
    const totalRetencoesCalc = documentType === 'recibo' ? 0 : retencoesAplicadas.reduce((sum, r) => sum + r.valor, 0);
    const valorLiquidoFinal = resultado.totalBruto - totalRetencoesCalc;

    return {
      tipoDocumento: documentType,
      dataEmissao: new Date().toISOString(),
      dataCorteFormatada: 'Todas',
      totalComissoes: comissoesSelecionadas.length,
      valorTotalBruto: resultado.totalBruto,
      valorLiquido: valorLiquidoFinal,
      retencoesAplicadas: retencoesAplicadas,
      empresaPagadora: empresaPagadora || null,
      
      comissoes: comissoesSelecionadas.map((c) => ({
        fatura: c.FATURA || c.fatura || '',
        // parcela = PAR.parcela (exibição); parcela_comissao = COM.parcela
        // (chave de gravação no banco) — nunca cair em '1' fixo
        parcela: String(c.PARCELA ?? c.parcela ?? ''),
        parcela_comissao: String(c.PARCELA_2 ?? c.PARCELA ?? c.parcela ?? ''),
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
        administradora: c.ADMINISTRADORA || c.administradora || c.CEDENTE_NOME || c.cedente_nome || '',
        cedente_cnpj: c.CEDENTE_CNPJ || c.cedente_cnpj || '',
        dt_ini_vig: c.DT_INI_VIG || c.dt_ini_vig || '',
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
        valorTotalBruto: resultado.totalBruto,
        totalRetencoes: resultado.totalRetencoes,
        valorLiquidoFinal: resultado.valorLiquido,
      },
      
      registrosBrutos: comissoesSelecionadas,
    };
  }, [
    comissoes,
    selectedComissoes,
    selectedRetentions,
    documentType,
    filters,
    retencoesVerificadas,
    totalBrutoSelecionado,
    empresaPagadora
  ]);

  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    if (loadingPreview) {
      enqueueSnackbar('Aguarde o carregamento do preview', { variant: 'warning' });
      return;
    }

    // Voucher exige empresa pagadora definida (Recebemos de): com TIPOs
    // mistos a inferência é impossível e a escolha no seletor é obrigatória
    if (documentType === 'voucher' && !empresaPagadora) {
      enqueueSnackbar(
        tiposMistos
          ? 'As comissões selecionadas são de empresas diferentes — selecione a Empresa pagadora (Recebemos de) antes de emitir.'
          : 'Selecione a Empresa pagadora (Recebemos de) antes de emitir.',
        { variant: 'warning' }
      );
      return;
    }

    startLoading('Preparando dados para emissão...');

    try {
      const comissoesSelecionadas = comissoes.filter((c) =>
        selectedComissoes.has(getComissaoKey(c))
      );

      const comissoesEnriquecidas = await enrichComissoesWithAdministradora(comissoesSelecionadas);

      console.log('[DEBUG] Dados enriquecidos:', JSON.stringify(comissoesEnriquecidas.map(c => ({
        FATURA: c.FATURA,
        CEDENTE_NOME: c.CEDENTE_NOME,
        cedente_nome: c.cedente_nome,
        administradora: c.administradora,
        ADMINISTRADORA: c.ADMINISTRADORA
      })), null, 2));

      // USA OS DADOS VERIFICADOS OU CALCULA
      let resultado;
      if (retencoesVerificadas?.comissoes?.length > 0) {
        resultado = {
          totalBruto: retencoesVerificadas.total_bruto,
          totalRetencoes: retencoesVerificadas.total_retencoes,
          valorLiquido: retencoesVerificadas.total_liquido,
          detalhesRetencoes: retencoesVerificadas.detalhesRetencoes || {},
        };
      } else {
        const calculado = calcularRetencoesConsolidadas(
          comissoesSelecionadas,
          totalBrutoSelecionado
        );
        resultado = {
          totalBruto: calculado.totalBruto,
          totalRetencoes: calculado.totalRetencoes,
          valorLiquido: calculado.valorLiquido,
          detalhesRetencoes: calculado.retencoes,
        };
      }

      // CONSTRÓI RETENÇÕES PARA O PAYLOAD
      // RECIBO: SEMPRE envia array vazio (nenhum imposto no PDF)
      // VOUCHER: usa selectedRetentions (estado dos checkboxes)
      const retencoesPayload = [];
      if (documentType !== 'recibo') {
        RETENTION_OPTIONS.forEach(opt => {
          if (selectedRetentions.includes(opt.id)) {
            retencoesPayload.push({
              tipo: opt.label,
              aliquota: opt.rate,
              valor: resultado.totalBruto * opt.rate,
            });
          }
        });
      }
      // Para recibo, retencoesPayload fica vazio = []

      // CALCULA TOTAIS DAS RETENÇÕES SELECIONADAS
      const totalRetencoesCalculado = retencoesPayload.reduce((sum, r) => sum + r.valor, 0);

      const payload = {
        tipo_documento: documentType,
        data_emissao: new Date().toISOString().split('T')[0],
        usuario: user?.nome_completo || user?.email,
        empresa_pagadora_nome: empresaPagadora?.nome || null,
        empresa_pagadora_cnpj: empresaPagadora?.cnpj || null,
comissoes: comissoesEnriquecidas.map((c) => ({
          fatura: String(c.FATURA || c.fatura || ''),
          // parcela = PAR.parcela (exibição no PDF); parcela_comissao =
          // COM.parcela (chave do UPDATE no banco) — nunca cair em '1' fixo
          parcela: String(c.PARCELA ?? c.parcela ?? ''),
          parcela_comissao: String(c.PARCELA_2 ?? c.PARCELA ?? c.parcela ?? ''),
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
          administradora: c.ADMINISTRADORA || c.administradora || c.CEDENTE_NOME || c.cedente_nome || '',
          cedente_cnpj: c.CEDENTE_CNPJ || c.cedente_cnpj || '',
          dt_ini_vig: c.DT_INI_VIG || c.dt_ini_vig || '',
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
        retencoes: retencoesPayload,
        resumo: {
          total_comissoes: comissoesEnriquecidas.length,
          valor_total_bruto: resultado.totalBruto,
          total_retencoes: documentType === 'recibo' ? 0 : totalRetencoesCalculado,
          valor_liquido_final: documentType === 'recibo' ? resultado.totalBruto : resultado.totalBruto - totalRetencoesCalculado,
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
          total: resultado.valorLiquido,
          quantidade: payload.resumo.total_comissoes,
        });

        enqueueSnackbar(
          `${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido com sucesso!`,
          { variant: 'success' }
        );

        // Rede de segurança: o backend informa quantas linhas de COMISSAO
        // foram carimbadas com o voucher; deve bater com a seleção
        const registrosAtualizados = response?.registros_atualizados;
        if (
          registrosAtualizados != null &&
          Number(registrosAtualizados) !== comissoesEnriquecidas.length
        ) {
          enqueueSnackbar(
            `Atenção: ${registrosAtualizados} registro(s) atualizados no banco para ${comissoesEnriquecidas.length} comissão(ões) selecionada(s). Verifique o voucher na consulta.`,
            { variant: 'warning', autoHideDuration: 10000 }
          );
        }

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
    selectedRetentions,
    comissoes,
    documentType,
    enqueueSnackbar,
    startLoading,
    stopLoading,
    resetSelections,
    retencoesVerificadas,
    user,
    totalBrutoSelecionado,
    loadingPreview,
    empresaPagadora,
    tiposMistos,
  ]);

  const previewDocument = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão', { variant: 'warning' });
      return;
    }

    setLoadingPreview(true);

    try {
      const comissoesSelecionadas = comissoes.filter((c) =>
        selectedComissoes.has(getComissaoKey(c))
      );

      const comissoesEnriquecidas = await enrichComissoesWithAdministradora(comissoesSelecionadas);
      setPreviewData(buildDocumentPayload(comissoesEnriquecidas));
      setPreviewOpen(true);
    } finally {
      setLoadingPreview(false);
    }
  }, [selectedComissoes, comissoes, enqueueSnackbar, buildDocumentPayload]);

  const closePreview = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const handleExportExcel = useCallback(async () => {
    if (selectedComissoes.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão para exportar', { variant: 'warning' });
      return;
    }

    const comissoesSelecionadas = comissoes.filter((c) =>
      selectedComissoes.has(getComissaoKey(c))
    );

    if (comissoesSelecionadas.length === 0) {
      enqueueSnackbar('Nenhuma comissão selecionada para exportar', { variant: 'warning' });
      return;
    }

    try {
      // Mesmo enriquecimento do Preview/emissão (cache por fatura em useRef):
      // sem ele, Administradora/CNPJ saíam vazias quando o usuário exportava
      // antes de gerar o preview
      startLoading('Buscando administradoras para o Excel...');
      const comissoesEnriquecidas = await enrichComissoesWithAdministradora(comissoesSelecionadas);
      const fileName = await exportarComissoesParaExcel(comissoesEnriquecidas, totals, documentType);
      enqueueSnackbar(`Arquivo ${fileName} baixado com sucesso!`, { variant: 'success' });
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      enqueueSnackbar('Erro ao exportar para Excel', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [comissoes, selectedComissoes, totals, documentType, enqueueSnackbar, startLoading, stopLoading]);

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
    loadingPreview,
    empresaPagadora,
    empresaInferida,
    empresaPagadoraTipo,
    tiposMistos,

    buscarTudo,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleRetention,
    setDocumentType,
    setEmpresaPagadoraTipo,
    emitirDocumento,
    previewDocument,
    closePreview,
    handleExportExcel,
  };
};
