// src/pages/Financeiro/voucher/hooks/useEmissaoRecibos.js

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { 
  buscarComissoesPorDataCorte, 
  buscarPessoas, 
  buscarFaturamento
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
  
  const dataCorte = '2026-06-01';

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

  // 🔥 BUSCAR COMISSÕES - APENAS V2 (NUNCA usa /comissoes/faturas/)
  const buscarComissoes = useCallback(async (novosFiltros = {}) => {
    setLoading(true);
    try {
      const filtrosAtualizados = { ...filters, ...novosFiltros };
      
      const filtrosLimpos = {};
      Object.keys(filtrosAtualizados).forEach(key => {
        const val = filtrosAtualizados[key];
        if (val !== '' && val !== null && val !== undefined && val !== 'null') {
          filtrosLimpos[key] = val;
        }
      });

      console.log('🔍 Buscando comissões com filtros:', filtrosLimpos);

      // 🔥 FORÇA A V2 - ÚNICA ROTA DE COMISSÕES
      const response = await buscarComissoesPorDataCorte(dataCorte, filtrosLimpos);
      
      console.log('📦 Resposta do serviço:', response);

      if (response.sucesso) {
        const dados = response.dados;
        const lista = dados?.data || [];
        
        setComissoes(lista);
        setTotalRegistros(dados?.total_registros || dados?.total_retornados || lista.length);
        setHasMore(dados?.has_more || false);

        enqueueSnackbar(
          `${lista.length} comissões carregadas (Total: ${dados?.total_registros || lista.length})`,
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
  }, [filters, dataCorte, enqueueSnackbar]);

  // 🔥 BUSCAR FATURAS - APENAS USANDO FATURAMENTO (NUNCA /comissoes/faturas/)
  const buscarFaturasLista = useCallback(async (novosFiltros = {}) => {
    setLoadingFaturas(true);
    try {
      // Só busca faturas se tiver filtro específico (evita chamadas desnecessárias)
      const temFiltroEspecifico = filters.fatura || filters.vencimento_inicial || filters.vencimento_final;
      
      if (!temFiltroEspecifico && !novosFiltros?.fatura) {
        console.log('ℹ️ Nenhum filtro específico para faturas - pulando busca');
        setFaturas([]);
        setLoadingFaturas(false);
        return;
      }

      const filtrosBusca = { 
        page: 1, 
        page_size: 50,
        ...novosFiltros 
      };

      if (filters.fatura) {
        filtrosBusca.fatura = filters.fatura;
      }
      
      if (filters.vencimento_inicial) {
        filtrosBusca.data_ini = filters.vencimento_inicial;
      }
      if (filters.vencimento_final) {
        filtrosBusca.data_fim = filters.vencimento_final;
      }

      if (filters.status && filters.status !== 'todas') {
        if (filters.status === 'baixadas') {
          filtrosBusca.status = 'B';
        } else if (filters.status === 'pendentes') {
          filtrosBusca.status = 'A';
        }
      }

      // 🔥 USA FATURAMENTO (funciona) - NUNCA USA /comissoes/faturas/
      const response = await buscarFaturamento(filtrosBusca);
      
      console.log('📦 Resposta faturamento:', response);
      
      if (response.sucesso) {
        const dados = response.resultado?.data || response.data || [];
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
    
    // Depois busca faturas se tiver filtros
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

  // 🔥 EMITIR DOCUMENTO - COM CONSOLE.LOG PARA TESTE
  const emitirDocumento = useCallback(async () => {
    if (selectedComissoes.length === 0 && selectedFaturas.length === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão ou fatura', { variant: 'warning' });
      return;
    }

    setLoading(true);
    
    try {
      // Busca as comissões selecionadas com todos os dados
      const comissoesSelecionadas = comissoes.filter(c => 
        selectedComissoes.includes(c.FATURA || c.fatura || c.id)
      );
      
      // Busca detalhes das faturas selecionadas usando faturamento
      let faturasDetalhadas = [];
      for (const id of selectedFaturas) {
        try {
          const response = await buscarFaturamento({ fatura: id });
          if (response.sucesso && response.resultado?.data) {
            faturasDetalhadas.push(...response.resultado.data);
          }
        } catch (e) {
          console.warn(`Erro ao buscar detalhes da fatura ${id}:`, e);
        }
      }

      // 🔥 CONSTRUIR PAYLOAD PARA EMISSÃO
      const payload = {
        tipoDocumento: documentType,
        dataCorte,
        dataEmissao: new Date().toISOString(),
        totalComissoes: comissoesSelecionadas.length,
        totalFaturas: selectedFaturas.length,
        valorTotalBruto: comissoesSelecionadas.reduce(
          (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || c.VALOR || 0), 
          0
        ),
        comissoes: comissoesSelecionadas.map(c => ({
          fatura: c.FATURA || c.fatura,
          parcela: c.PARCELA || c.parcela,
          favorecido: c.FAVOR || c.favor,
          favorecidoNome: c.NOME || c.nome,
          favorecidoDocumento: c.DOC_FAVORECIDO || c.doc_favorecido,
          valorComissao: c.VALOR_COMISSAO || c.valor_comissao || c.VALOR,
          percentual: c.COMISSAO || c.comissao,
          imposto: c.IMPOSTO || c.imposto,
          voucher: c.VOUCHER || c.voucher,
          dataRepasse: c.DT_REPASSE || c.dt_repasse,
          produto: c.PRODUTO || c.produto,
          coEstipulante: c.CO_ESTIP || c.co_estip,
          bancoAgenciaConta: c.BC_AG_CC || c.bc_ag_cc,
          chavePix: c.CHAVE_PIX || c.chave_pix,
        })),
        faturas: faturasDetalhadas.map(f => ({
          fatura: f.FATURA || f.fatura,
          apolice: f.APOLICE || f.apolice,
          administradora: f.ADMINISTRADORA || f.administradora,
          seguradora: f.SEGURADORA || f.seguradora,
          dataFat: f.DATA_FAT || f.data_fat,
          vencimento: f.VENCIMENTO || f.vencimento,
          status: f.STATUS || f.status,
          premioBruto: f.PREMIO_BRUTO || f.premio_bruto,
          premioLiquido: f.PREMIO_LIQ || f.premio_liq,
          boletos: f.BOLETOS || [],
        })),
      };

      // 🔥 LOG PARA DEBUG - INFORMAÇÕES PARA GERAR A GUIA
      console.log('═══════════════════════════════════════════════════');
      console.log('📄 EMISSÃO DE DOCUMENTO');
      console.log('═══════════════════════════════════════════════════');
      console.log(`📌 Tipo: ${payload.tipoDocumento.toUpperCase()}`);
      console.log(`📅 Data de Corte: ${payload.dataCorte}`);
      console.log(`📅 Data Emissão: ${payload.dataEmissao}`);
      console.log(`📊 Total de Comissões: ${payload.totalComissoes}`);
      console.log(`📊 Total de Faturas: ${payload.totalFaturas}`);
      console.log(`💰 Valor Total Bruto: R$ ${payload.valorTotalBruto.toFixed(2)}`);
      console.log('───────────────────────────────────────────────────');
      
      console.log('📋 COMISSÕES SELECIONADAS:');
      payload.comissoes.forEach((c, i) => {
        console.log(`  ${i+1}. Fatura ${c.fatura} | ${c.favorecidoNome}`);
        console.log(`     Valor: R$ ${Number(c.valorComissao).toFixed(2)} | %: ${c.percentual}%`);
        console.log(`     Produto: ${c.produto || '-'}`);
        console.log(`     Voucher: ${c.voucher || 'Não emitido'}`);
        console.log(`     Banco: ${c.bancoAgenciaConta || '-'}`);
        if (c.chavePix) console.log(`     PIX: ${c.chavePix}`);
        console.log('───────────────────────────────────────────────────');
      });

      if (payload.faturas.length > 0) {
        console.log('📋 FATURAS DETALHADAS:');
        payload.faturas.forEach((f, i) => {
          console.log(`  ${i+1}. Fatura ${f.fatura} | ${f.administradora}`);
          console.log(`     Apólice: ${f.apolice} | Status: ${f.status}`);
          console.log(`     Prêmio Bruto: R$ ${Number(f.premioBruto).toFixed(2)}`);
          console.log(`     Vencimento: ${f.vencimento}`);
          if (f.boletos && f.boletos.length > 0) {
            console.log(`     Boletos: ${f.boletos.length} boletos`);
          }
          console.log('───────────────────────────────────────────────────');
        });
      }

      console.log('📝 PAYLOAD COMPLETO:');
      console.log(JSON.stringify(payload, null, 2));
      console.log('═══════════════════════════════════════════════════');

      // Simula emissão
      setLastEmission({
        numero: `RC-${String(Date.now()).slice(-6)}`,
        emitidoEm: new Date().toISOString(),
        tipo: documentType,
        total: payload.valorTotalBruto,
        quantidade: payload.totalComissoes,
      });

      enqueueSnackbar(
        `✅ ${documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido! ${payload.totalComissoes} comissões, R$ ${payload.valorTotalBruto.toFixed(2)}`,
        { variant: 'success' }
      );

      console.log('💡 Abra o console (F12) para ver todos os detalhes da emissão.');

    } catch (error) {
      console.error('❌ Erro ao emitir documento:', error);
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
      (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || c.VALOR || 0), 
      0
    );
    
    const count = comissoesSelecionadas.length;
    
    console.log('👁️ PRÉ-VISUALIZAÇÃO:');
    console.log(`  ${count} comissões selecionadas`);
    console.log(`  Total: R$ ${total.toFixed(2)}`);
    console.log(`  Faturas: ${selectedFaturas.length}`);
    console.log(`  Tipo: ${documentType}`);
    
    enqueueSnackbar(
      `Pré-visualização: ${count} comissões, R$ ${total.toFixed(2)} (ver console)`,
      { variant: 'info' }
    );
  }, [selectedComissoes, selectedFaturas, comissoes, documentType, enqueueSnackbar]);

  // Totais
  const totals = useMemo(() => {
    const comissoesSelecionadas = comissoes.filter(c => 
      selectedComissoes.includes(c.FATURA || c.fatura || c.id)
    );
    
    const grossTotal = comissoesSelecionadas.reduce(
      (sum, c) => sum + Number(c.VALOR_COMISSAO || c.valor_comissao || c.VALOR || 0), 
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