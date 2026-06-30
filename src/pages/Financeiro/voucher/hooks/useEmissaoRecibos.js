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
  limit: 100,
  offset: 0
};

export const useEmissaoRecibos = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { withLoading, loading } = useLoading();
  
  const [loadingFaturas, setLoadingFaturas] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [comissoes, setComissoes] = useState([]);
  const [faturas, setFaturas] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [selectedComissoes, setSelectedComissoes] = useState([]);
  const [selectedFaturas, setSelectedFaturas] = useState([]);
  const [documentType, setDocumentType] = useState('recibo');
  const [lastEmission, setLastEmission] = useState(null);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  
  const dataCorte = '2026-06-01';

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

  // Buscar comissões - V2
  const buscarComissoes = useCallback(async (novosFiltros = {}) => {
    const filtrosAtualizados = { ...filters, ...novosFiltros };
    
    const filtrosLimpos = {};
    Object.keys(filtrosAtualizados).forEach(key => {
      const val = filtrosAtualizados[key];
      if (val !== '' && val !== null && val !== undefined && val !== 'null') {
        filtrosLimpos[key] = val;
      }
    });

    const result = await withLoading(
      async () => {
        const response = await buscarComissoesPorDataCorte(dataCorte, filtrosLimpos);
        return response;
      },
      'Buscando comissões...'
    );

    if (result?.sucesso) {
      const dados = result.dados;
      const lista = dados?.data || [];
      setComissoes(lista);
      setTotalRegistros(dados?.total_registros || lista.length);
      setHasMore(dados?.has_more || false);

      if (lista.length === 0) {
        enqueueSnackbar('Nenhuma comissão encontrada com os filtros informados', { variant: 'info' });
      }
      return lista;
    }
    return [];
  }, [filters, dataCorte, withLoading, enqueueSnackbar]);

  // Buscar faturas - via faturamento
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
    await buscarComissoes();
    
    if (filters.fatura) {
      await buscarFaturas();
    } else {
      setFaturas([]);
    }
  }, [buscarComissoes, buscarFaturas, filters.fatura]);

  // Buscar por favorecido
  const buscarPorFavorecido = useCallback(async (codigoFavorecido) => {
    if (!codigoFavorecido) {
      await buscarComissoes({ favorecido: '' });
      return;
    }
    await buscarComissoes({ favorecido: codigoFavorecido });
  }, [buscarComissoes]);

  // Atualizar filtro
  const updateFilter = useCallback((field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      if (['favorecido', 'fatura', 'status', 'tipo'].includes(field)) {
        setSelectedComissoes([]);
        setSelectedFaturas([]);
      }
      return newFilters;
    });
  }, []);

  // Limpar filtros
  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setComissoes([]);
    setFaturas([]);
    setSelectedComissoes([]);
    setSelectedFaturas([]);
    setTotalRegistros(0);
    setHasMore(false);
    enqueueSnackbar('Filtros limpos', { variant: 'info' });
  }, [enqueueSnackbar]);

  // Selecionar comissão - CORRIGIDO: usa FATURA como ID único
  const toggleComissao = useCallback((id) => {
    setSelectedComissoes(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Selecionar todas comissões
  const toggleAllComissoes = useCallback(() => {
    if (comissoes.length === 0) return;
    
    const allIds = comissoes.map(c => c.FATURA || c.fatura || c.id || c.DOCUMENTO);
    const allSelected = selectedComissoes.length === allIds.length;
    
    setSelectedComissoes(allSelected ? [] : allIds);
  }, [comissoes, selectedComissoes]);

  // Selecionar fatura
  const toggleFatura = useCallback((id) => {
    setSelectedFaturas(prev => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Selecionar todas faturas
  const toggleAllFaturas = useCallback(() => {
    if (faturas.length === 0) return;
    
    const allIds = faturas.map(f => f.FATURA || f.fatura || f.id);
    const allSelected = selectedFaturas.length === allIds.length;
    
    setSelectedFaturas(allSelected ? [] : allIds);
  }, [faturas, selectedFaturas]);

  // Emitir documento - envia JSON para o backend
  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.length === 0 && selectedFaturas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }

    try {
      const comissoesSelecionadas = comissoes.filter(c => {
        const id = c.FATURA || c.fatura || c.id || c.DOCUMENTO;
        return selectedComissoes.includes(id);
      });
      
      // Buscar detalhes das faturas selecionadas
      let faturasDetalhadas = [];
      for (const id of selectedFaturas) {
        try {
          const response = await buscarFaturamento({ fatura: id });
          if (response.sucesso && response.resultado?.data) {
            faturasDetalhadas.push(...response.resultado.data);
          }
        } catch (e) {
          // Silencia erro
        }
      }

      const valorTotal = comissoesSelecionadas.reduce(
        (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
        0
      );

      // 🔥 Payload para o backend
      const payload = {
        tipoDocumento: documentType,
        dataCorte,
        dataEmissao: new Date().toISOString(),
        totalComissoes: comissoesSelecionadas.length,
        totalFaturas: selectedFaturas.length,
        valorTotalBruto: valorTotal,
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
      };

      // 🔥 Envia para o backend
      const response = await emitirDocumentoApi(payload);
      
      if (response.sucesso) {
        setLastEmission({
          numero: response.data?.numero || `RC-${String(Date.now()).slice(-6)}`,
          emitidoEm: response.data?.emitidoEm || new Date().toISOString(),
          tipo: documentType,
          total: valorTotal,
          quantidade: comissoesSelecionadas.length,
        });

        enqueueSnackbar(
          `✅ ${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido! ${comissoesSelecionadas.length} comissões, R$ ${valorTotal.toFixed(2)}`,
          { variant: 'success' }
        );
      } else {
        throw new Error(response.erro || 'Erro ao emitir documento');
      }
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao emitir documento', { variant: 'error' });
    }
  }, [documentType, selectedComissoes, selectedFaturas, comissoes, dataCorte, enqueueSnackbar]);

  // Pré-visualizar
  const previewDocument = useCallback(() => {
    if (selectedComissoes.length === 0 && selectedFaturas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }
    
    const comissoesSelecionadas = comissoes.filter(c => {
      const id = c.FATURA || c.fatura || c.id || c.DOCUMENTO;
      return selectedComissoes.includes(id);
    });
    
    const total = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    enqueueSnackbar(
      `Pré-visualização: ${comissoesSelecionadas.length} comissões, R$ ${total.toFixed(2)}`,
      { variant: 'info' }
    );
  }, [selectedComissoes, selectedFaturas, comissoes, enqueueSnackbar]);

  // Totais
  const totals = useMemo(() => {
    const comissoesSelecionadas = comissoes.filter(c => {
      const id = c.FATURA || c.fatura || c.id || c.DOCUMENTO;
      return selectedComissoes.includes(id);
    });
    
    const grossTotal = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR || c.valor || c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    const retentionTotal = grossTotal * 0.05;
    const netTotal = grossTotal - retentionTotal;

    return { grossTotal, retentionTotal, netTotal, count: comissoesSelecionadas.length };
  }, [comissoes, selectedComissoes]);

  return {
    loading,
    loadingFaturas,
    filters,
    showAdvancedFilters,
    comissoes,
    faturas,
    pessoas,
    selectedComissoes,
    selectedFaturas,
    documentType,
    lastEmission,
    totalRegistros,
    hasMore,
    dataCorte,
    totals,

    buscarComissoes,
    buscarFaturas,
    buscarTudo,
    buscarPorFavorecido,
    updateFilter,
    clearFilters,
    setShowAdvancedFilters,
    toggleComissao,
    toggleAllComissoes,
    toggleFatura,
    toggleAllFaturas,
    setDocumentType,
    emitirDocumento,
    previewDocument,
  };
};