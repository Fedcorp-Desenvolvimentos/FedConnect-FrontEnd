// src/pages/Financeiro/voucher/hooks/useEmissaoRecibos.js

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { 
  buscarComissoesPorDataCorte, 
  buscarPessoas, 
  buscarFaturas,
  buscarFaturaPorNumero 
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
  
  // Estados
  const [loading, setLoading] = useState(false);
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
  
  const dataCorte = '2026-06-01'; // TODO: Tornar dinâmico

  // Carregar pessoas ao montar
  useEffect(() => {
    const loadPessoas = async () => {
      try {
        const response = await buscarPessoas({ status: 'A', limit: 7000 });
        const lista = response?.data || response?.results || [];
        setPessoas(lista);
      } catch (error) {
        console.error('Erro ao carregar pessoas:', error);
        enqueueSnackbar('Erro ao carregar lista de pessoas', { variant: 'error' });
      }
    };
    loadPessoas();
  }, [enqueueSnackbar]);

  // Buscar comissões - Função principal
  const buscarComissoes = useCallback(async (novosFiltros = {}) => {
    setLoading(true);
    try {
      // Mescla filtros
      const filtrosAtualizados = { ...filters, ...novosFiltros };
      
      // Remove filtros vazios
      const filtrosLimpos = {};
      Object.keys(filtrosAtualizados).forEach(key => {
        const val = filtrosAtualizados[key];
        if (val !== '' && val !== null && val !== undefined && val !== 'null') {
          filtrosLimpos[key] = val;
        }
      });

      console.log('🔍 Buscando comissões com filtros:', filtrosLimpos);

      // Chama o serviço
      const response = await buscarComissoesPorDataCorte(dataCorte, filtrosLimpos);
      
      console.log('📦 Resposta do serviço:', response);

      if (response.sucesso) {
        const dados = response.dados;
        const lista = dados?.data || [];
        
        setComissoes(lista);
        setTotalRegistros(dados?.total_registros || 0);
        setHasMore(dados?.has_more || false);

        // Seleciona automaticamente as primeiras comissões se não houver seleção
        if (selectedComissoes.length === 0 && lista.length > 0) {
          // Opcional: selecionar todos ou nenhum
          // Aqui optamos por não selecionar automaticamente
        }

        enqueueSnackbar(
          `${lista.length} comissões carregadas (Total: ${dados?.total_registros || 0})`,
          { variant: 'success' }
        );
      } else {
        throw new Error(response.erro || 'Erro ao buscar comissões');
      }
    } catch (error) {
      console.error('❌ Erro ao buscar comissões:', error);
      enqueueSnackbar(error.message || 'Erro ao buscar comissões', { variant: 'error' });
      setComissoes([]);
      setTotalRegistros(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filters, dataCorte, enqueueSnackbar, selectedComissoes.length]);

  // Buscar faturas (para a tabela de faturas)
  const buscarFaturasLista = useCallback(async (novosFiltros = {}) => {
    setLoadingFaturas(true);
    try {
      const filtrosBusca = {
        page: 1,
        page_size: 50,
        ...novosFiltros,
      };

      // Se tiver filtro de fatura, adiciona
      if (filters.fatura) {
        filtrosBusca.fatura = filters.fatura;
      }
      
      // Se tiver filtro de vencimento
      if (filters.vencimento_inicial) {
        filtrosBusca.data_ini = filters.vencimento_inicial;
      }
      if (filters.vencimento_final) {
        filtrosBusca.data_fim = filters.vencimento_final;
      }

      // Filtro de status
      if (filters.status && filters.status !== 'todas') {
        if (filters.status === 'baixadas') {
          filtrosBusca.status = 'B'; // Baixadas
        } else if (filters.status === 'pendentes') {
          filtrosBusca.status = 'A'; // Ativas
        }
      }

      const response = await buscarFaturas(filtrosBusca);
      
      if (response.sucesso) {
        const dados = response.resultado || response.data || [];
        setFaturas(dados);
        enqueueSnackbar(
          `${dados.length || 0} faturas carregadas`,
          { variant: 'success' }
        );
      } else {
        throw new Error(response.erro || 'Erro ao buscar faturas');
      }
    } catch (error) {
      console.error('Erro ao buscar faturas:', error);
      enqueueSnackbar(error.message || 'Erro ao buscar faturas', { variant: 'error' });
      setFaturas([]);
    } finally {
      setLoadingFaturas(false);
    }
  }, [filters, enqueueSnackbar]);

  // Buscar tudo (comissões + faturas)
  const buscarTudo = useCallback(async () => {
    // Busca comissões primeiro (mais importante)
    await buscarComissoes();
    
    // Depois busca faturas
    await buscarFaturasLista();
  }, [buscarComissoes, buscarFaturasLista]);

  // Atualizar filtro
  const updateFilter = useCallback((field, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [field]: value };
      
      // Se mudou o campo de busca, reseta a seleção
      if (['favorecido', 'fatura', 'status'].includes(field)) {
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

  // Selecionar comissão
  const toggleComissao = useCallback((id) => {
    setSelectedComissoes(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Selecionar todas comissões
  const toggleAllComissoes = useCallback(() => {
    if (selectedComissoes.length === comissoes.length && comissoes.length > 0) {
      setSelectedComissoes([]);
    } else {
      setSelectedComissoes(comissoes.map(c => c.FATURA || c.fatura || c.id));
    }
  }, [comissoes, selectedComissoes]);

  // Selecionar fatura
  const toggleFatura = useCallback((id) => {
    setSelectedFaturas(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      return [...prev, id];
    });
  }, []);

  // Selecionar todas faturas
  const toggleAllFaturas = useCallback(() => {
    if (selectedFaturas.length === faturas.length && faturas.length > 0) {
      setSelectedFaturas([]);
    } else {
      setSelectedFaturas(faturas.map(f => f.FATURA || f.fatura || f.id));
    }
  }, [faturas, selectedFaturas]);

  // Emitir documento
  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.length === 0 && selectedFaturas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }

    setLoading(true);
    
    try {
      const comissoesSelecionadas = comissoes.filter(c => 
        selectedComissoes.includes(c.FATURA || c.fatura || c.id)
      );
      
      // Prepara payload para emissão
      const payload = {
        tipoDocumento: documentType,
        dataCorte,
        comissoes: comissoesSelecionadas,
        faturas: selectedFaturas,
        totalComissoes: comissoesSelecionadas.length,
        totalFaturas: selectedFaturas.length,
        valorTotal: comissoesSelecionadas.reduce(
          (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || 0), 
          0
        ),
        timestamp: new Date().toISOString(),
      };

      console.log('📄 EMITINDO DOCUMENTO:', payload);
      
      // TODO: Chamar API de emissão real
      // const response = await emitirVoucher(payload);
      
      // Simula emissão
      setLastEmission({
        numero: `RC-${String(Date.now()).slice(-6)}`,
        emitidoEm: new Date().toISOString(),
        tipo: documentType,
        total: payload.valorTotal,
        quantidade: payload.totalComissoes,
      });

      enqueueSnackbar(
        `${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido com sucesso! ${payload.totalComissoes} comissões, R$ ${payload.valorTotal.toFixed(2)}`,
        { variant: 'success' }
      );

      // Opcional: recarregar a lista após emissão
      // await buscarComissoes();

    } catch (error) {
      console.error('Erro ao emitir documento:', error);
      enqueueSnackbar('Erro ao emitir documento', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [documentType, selectedComissoes, selectedFaturas, comissoes, dataCorte, enqueueSnackbar]);

  // Pré-visualizar
  const previewDocument = useCallback(() => {
    if (selectedComissoes.length === 0 && selectedFaturas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }
    
    const comissoesSelecionadas = comissoes.filter(c => 
      selectedComissoes.includes(c.FATURA || c.fatura || c.id)
    );
    
    const total = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    enqueueSnackbar(
      `Pré-visualização: ${comissoesSelecionadas.length} comissões, R$ ${total.toFixed(2)}`,
      { variant: 'info' }
    );
  }, [selectedComissoes, selectedFaturas, comissoes, enqueueSnackbar]);

  // Totais
  const totals = useMemo(() => {
    const comissoesSelecionadas = comissoes.filter(c => 
      selectedComissoes.includes(c.FATURA || c.fatura || c.id)
    );
    
    const grossTotal = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || 0), 
      0
    );
    
    // Retenção de imposto (exemplo: 5%)
    const retentionTotal = grossTotal * 0.05;
    const netTotal = grossTotal - retentionTotal;

    return {
      grossTotal,
      retentionTotal,
      netTotal,
      count: comissoesSelecionadas.length,
    };
  }, [comissoes, selectedComissoes]);

  return {
    // Estados
    loading: loading || loadingFaturas,
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

    // Ações
    buscarComissoes,
    buscarFaturasLista,
    buscarTudo,
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