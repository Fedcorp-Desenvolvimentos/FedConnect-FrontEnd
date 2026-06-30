// src/pages/Financeiro/voucher/hooks/useEmissaoRecibos.js

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useLoading } from '../../../../hooks/useLoading';
import { 
  buscarComissoesPorDataCorte,
  buscarPessoas, 
  buscarFaturamento,
  emitirDocumento as emitirDocumentoApi
} from '../../../../services/comissoesService';

const INITIAL_FILTERS = {
  favorecido: '',
  fatura: '',
  vencimento_inicial: '',
  vencimento_final: '',
  status: 'pendentes',
  tipo: '',
  co_estipulante: '',
  apolice: '',
  recibo: '',
  com_voucher: null,
  data_corte: '',
  limit: 100,
  offset: 0
};

// Opções de retenção
const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

// Gera chave única para comissão (FATURA + PARCELA)
const getComissaoKey = (comissao) => {
  const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '';
  const parcela = comissao.PARCELA || comissao.parcela || '1';
  return `${fatura}|${parcela}`;
};

// Gera chave única para fatura
const getFaturaKey = (fatura) => {
  return String(fatura.FATURA || fatura.fatura || fatura.id || '');
};

// Função para obter a data do mês atual
const getCurrentMonthDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
};

export const useEmissaoRecibos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { withLoading, loading, startLoading, stopLoading } = useLoading();
  
  const [loadingFaturas, setLoadingFaturas] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [comissoes, setComissoes] = useState([]);
  const [faturas, setFaturas] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [selectedComissoes, setSelectedComissoes] = useState(new Set());
  const [selectedFaturas, setSelectedFaturas] = useState(new Set());
  const [selectedRetentions, setSelectedRetentions] = useState([]);
  const [documentType, setDocumentType] = useState('recibo');
  const [lastEmission, setLastEmission] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  
  // Data de corte - usa do filtro ou mês atual como fallback
  const dataCorte = useMemo(() => {
    return filters.data_corte || getCurrentMonthDate();
  }, [filters.data_corte]);

  // Carregar pessoas ao montar
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
      } catch (error) {
        enqueueSnackbar('Erro ao carregar lista de pessoas', { variant: 'error' });
      }
    };
    loadPessoas();
  }, [enqueueSnackbar]);

  // Buscar comissões com paginação
  const buscarComissoes = useCallback(async (novosFiltros = {}, append = false) => {
    const filtrosAtualizados = { ...filters, ...novosFiltros };
    
    if (filtrosAtualizados.status === 'todas') {
      delete filtrosAtualizados.status;
    }
    
    const offset = append ? currentOffset + filters.limit : 0;
    filtrosAtualizados.offset = offset;
    
    const filtrosLimpos = {};
    Object.keys(filtrosAtualizados).forEach(key => {
      const val = filtrosAtualizados[key];
      if (val !== '' && val !== null && val !== undefined && val !== 'null') {
        filtrosLimpos[key] = val;
      }
    });

    const dataParaBusca = dataCorte;

    try {
      const result = await withLoading(
        async () => {
          const response = await buscarComissoesPorDataCorte(dataParaBusca, filtrosLimpos);
          return response;
        },
        append ? 'Carregando mais comissões...' : 'Buscando comissões...'
      );

      if (result?.sucesso) {
        const dados = result.dados;
        const lista = dados?.data || [];
        const total = dados?.total_registros || lista.length;
        
        setComissoes(prev => append ? [...prev, ...lista] : lista);
        setTotalRegistros(total);
        setHasMore(lista.length === filters.limit && (offset + lista.length) < total);
        setCurrentOffset(offset);
        
        if (!append) {
          setSelectedComissoes(new Set());
          setSelectedFaturas(new Set());
          setSelectedRetentions([]);
        }

        if (lista.length === 0 && !append) {
          enqueueSnackbar(`Nenhuma comissão encontrada para ${dataParaBusca}`, { variant: 'info' });
        } else if (lista.length > 0 && !append) {
          enqueueSnackbar(`${lista.length} comissões encontradas para ${dataParaBusca}`, { variant: 'success' });
        }
        return lista;
      }
      return [];
    } catch (error) {
      enqueueSnackbar('Erro ao buscar comissões', { variant: 'error' });
      return [];
    }
  }, [filters, dataCorte, currentOffset, withLoading, enqueueSnackbar]);

  // Carregar mais comissões
  const carregarMais = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await buscarComissoes({}, true);
    } finally {
      setLoadingMore(false);
    }
  }, [buscarComissoes, hasMore, loadingMore]);

  // Buscar faturas
  const buscarFaturas = useCallback(async (novosFiltros = {}) => {
    const temFiltro = filters.fatura || filters.vencimento_inicial || filters.vencimento_final || novosFiltros?.fatura;
    
    if (!temFiltro) {
      setFaturas([]);
      return [];
    }

    setLoadingFaturas(true);
    try {
      const filtrosBusca = { 
        page: 1, 
        page_size: 50,
        ...novosFiltros 
      };

      if (filters.fatura) filtrosBusca.fatura = filters.fatura;
      if (filters.vencimento_inicial) filtrosBusca.data_ini = filters.vencimento_inicial;
      if (filters.vencimento_final) filtrosBusca.data_fim = filters.vencimento_final;

      if (filters.status && filters.status !== 'todas') {
        filtrosBusca.status = filters.status === 'baixadas' ? 'B' : 'A';
      }

      const response = await buscarFaturamento(filtrosBusca);
      
      if (response.sucesso) {
        const dados = response.resultado?.data || response.data || [];
        setFaturas(dados);
        setSelectedFaturas(new Set());
        return dados;
      }
      return [];
    } catch (error) {
      setFaturas([]);
      return [];
    } finally {
      setLoadingFaturas(false);
    }
  }, [filters]);

  // Buscar tudo
  const buscarTudo = useCallback(async () => {
    setCurrentOffset(0);
    await buscarComissoes({}, false);
    
    // Se tiver filtro de fatura, buscar faturas
    if (filters.fatura) {
      await buscarFaturas();
    } else {
      setFaturas([]);
    }
  }, [buscarComissoes, buscarFaturas, filters.fatura]);

  // Atualizar filtro
  const updateFilter = useCallback((field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      // Resetar seleções quando mudar filtros principais
      if (['favorecido', 'fatura', 'status', 'tipo', 'data_corte'].includes(field)) {
        setSelectedComissoes(new Set());
        setSelectedFaturas(new Set());
        setSelectedRetentions([]);
      }
      setCurrentOffset(0);
      return newFilters;
    });
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      ...INITIAL_FILTERS,
      data_corte: '',
    });
    setComissoes([]);
    setFaturas([]);
    setSelectedComissoes(new Set());
    setSelectedFaturas(new Set());
    setSelectedRetentions([]);
    setTotalRegistros(0);
    setHasMore(false);
    setCurrentOffset(0);
    enqueueSnackbar('Filtros limpos', { variant: 'info' });
  }, [enqueueSnackbar]);

  // Selecionar comissão
  const toggleComissao = useCallback((comissao) => {
    const key = getComissaoKey(comissao);
    setSelectedComissoes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  // Selecionar todas comissões
  const toggleAllComissoes = useCallback(() => {
    if (comissoes.length === 0) return;
    
    const allKeys = comissoes.map(c => getComissaoKey(c));
    const allSelected = allKeys.every(key => selectedComissoes.has(key));
    
    setSelectedComissoes(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        allKeys.forEach(key => newSet.delete(key));
      } else {
        allKeys.forEach(key => newSet.add(key));
      }
      return newSet;
    });
  }, [comissoes, selectedComissoes]);

  // Selecionar fatura
  const toggleFatura = useCallback((fatura) => {
    const key = getFaturaKey(fatura);
    setSelectedFaturas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }, []);

  // Selecionar todas faturas
  const toggleAllFaturas = useCallback(() => {
    if (faturas.length === 0) return;
    
    const allKeys = faturas.map(f => getFaturaKey(f));
    const allSelected = allKeys.every(key => selectedFaturas.has(key));
    
    setSelectedFaturas(prev => {
      const newSet = new Set(prev);
      if (allSelected) {
        allKeys.forEach(key => newSet.delete(key));
      } else {
        allKeys.forEach(key => newSet.add(key));
      }
      return newSet;
    });
  }, [faturas, selectedFaturas]);

  // Toggle retenção
  const toggleRetention = useCallback((retentionId) => {
    setSelectedRetentions(prev => {
      if (prev.includes(retentionId)) {
        return prev.filter(id => id !== retentionId);
      }
      return [...prev, retentionId];
    });
  }, []);

  // Calcular resumo com retenções - USA AS COMISSOES SELECIONADAS
  const retentionSummary = useMemo(() => {
    // Pega as comissões que estão selecionadas
    const comissoesSelecionadas = comissoes.filter(c => {
      const key = getComissaoKey(c);
      return selectedComissoes.has(key);
    });
    
    // Soma os valores das comissões selecionadas
    const grossTotal = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );

    // Aplica as retenções selecionadas sobre o total bruto
    const retentionRows = RETENTION_OPTIONS
      .filter(opt => selectedRetentions.includes(opt.id))
      .map(opt => ({
        ...opt,
        value: grossTotal * opt.rate,
      }));

    const retentionTotal = retentionRows.reduce((sum, item) => sum + item.value, 0);

    return {
      grossTotal,
      retentionRows,
      retentionTotal,
      netTotal: grossTotal - retentionTotal,
      count: comissoesSelecionadas.length,
    };
  }, [comissoes, selectedComissoes, selectedRetentions]);

  // Totais para os cards - USA AS COMISSOES SELECIONADAS
  const totals = useMemo(() => {
    const comissoesSelecionadas = comissoes.filter(c => {
      const key = getComissaoKey(c);
      return selectedComissoes.has(key);
    });
    
    const grossTotal = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    // Retenção padrão de 5% para os cards
    const retentionTotal = grossTotal * 0.05;
    const netTotal = grossTotal - retentionTotal;

    return { 
      grossTotal, 
      retentionTotal, 
      netTotal, 
      count: comissoesSelecionadas.length,
      selectedFaturasCount: selectedFaturas.size
    };
  }, [comissoes, selectedComissoes, selectedFaturas]);

  // Emitir documento
  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.size === 0 && selectedFaturas.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }

    // Iniciar loading
    startLoading('Emitindo documento...');

    try {
      // Pega as comissões selecionadas
      const comissoesSelecionadas = comissoes.filter(c => {
        const key = getComissaoKey(c);
        return selectedComissoes.has(key);
      });
      
      // Busca detalhes das faturas selecionadas
      let faturasDetalhadas = [];
      for (const faturaKey of selectedFaturas) {
        try {
          const response = await buscarFaturamento({ fatura: faturaKey });
          if (response.sucesso && response.resultado?.data) {
            faturasDetalhadas.push(...response.resultado.data);
          }
        } catch (e) {
          console.error(`Erro ao buscar fatura ${faturaKey}:`, e);
        }
      }

      // Monta payload
      const payload = {
        tipoDocumento: documentType,
        dataCorte,
        dataEmissao: new Date().toISOString(),
        totalComissoes: comissoesSelecionadas.length,
        totalFaturas: selectedFaturas.size,
        valorTotalBruto: retentionSummary.grossTotal,
        valorLiquido: retentionSummary.netTotal,
        retencoes: retentionSummary.retentionRows,
        comissoes: comissoesSelecionadas.map(c => ({
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
        })),
        faturas: faturasDetalhadas.map(f => ({
          fatura: f.FATURA || f.fatura || '',
          apolice: f.APOLICE || f.apolice || '',
          administradora: f.ADMINISTRADORA || f.administradora || '',
          seguradora: f.SEGURADORA || f.seguradora || '',
          dataFat: f.DATA_FAT || f.data_fat || '',
          vencimento: f.VENCIMENTO || f.vencimento || '',
          status: f.STATUS || f.status || '',
          premioBruto: Number(f.PREMIO_BRUTO || f.premio_bruto || 0),
          premioLiquido: Number(f.PREMIO_LIQ || f.premio_liq || 0),
          boletos: f.BOLETOS || [],
          parcelas: f.PARCELAS || [],
          baixas: f.BAIXAS || [],
        })),
        // Adiciona filtros aplicados para contexto
        filtrosAplicados: {
          dataCorte,
          favorecido: filters.favorecido,
          fatura: filters.fatura,
          status: filters.status,
          tipo: filters.tipo,
        }
      };

      const response = await emitirDocumentoApi(payload);
      
      if (response.sucesso) {
        setLastEmission({
          numero: response.data?.numero || `RC-${String(Date.now()).slice(-6)}`,
          emitidoEm: response.data?.emitidoEm || new Date().toISOString(),
          tipo: documentType,
          total: retentionSummary.grossTotal,
          quantidade: comissoesSelecionadas.length,
        });

        enqueueSnackbar(
          `✅ ${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido! ${comissoesSelecionadas.length} comissões, R$ ${retentionSummary.grossTotal.toFixed(2)}`,
          { variant: 'success' }
        );
        
        // Limpa seleções após emissão
        setSelectedComissoes(new Set());
        setSelectedFaturas(new Set());
        setSelectedRetentions([]);
      } else {
        throw new Error(response.erro || 'Erro ao emitir documento');
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao emitir documento', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [documentType, selectedComissoes, selectedFaturas, comissoes, dataCorte, filters, retentionSummary, enqueueSnackbar, startLoading, stopLoading]);

  // Pré-visualizar
  const previewDocument = useCallback(() => {
    if (selectedComissoes.size === 0 && selectedFaturas.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }
    
    const comissoesSelecionadas = comissoes.filter(c => {
      const key = getComissaoKey(c);
      return selectedComissoes.has(key);
    });
    
    const total = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    enqueueSnackbar(
      `📄 Pré-visualização: ${comissoesSelecionadas.length} comissões, R$ ${total.toFixed(2)}`,
      { variant: 'info' }
    );
  }, [selectedComissoes, selectedFaturas, comissoes, enqueueSnackbar]);

  return {
    loading,
    loadingFaturas,
    loadingMore,
    filters,
    showAdvancedFilters,
    comissoes,
    faturas,
    pessoas,
    selectedComissoes,
    selectedFaturas,
    selectedRetentions,
    documentType,
    lastEmission,
    totalRegistros,
    hasMore,
    currentOffset,
    dataCorte,
    totals,
    retentionSummary,

    buscarComissoes,
    buscarFaturas,
    buscarTudo,
    carregarMais,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleFatura,
    toggleAllFaturas,
    toggleRetention,
    setDocumentType,
    emitirDocumento,
    previewDocument,
  };
};