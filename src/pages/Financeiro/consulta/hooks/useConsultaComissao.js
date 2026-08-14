import { useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useLoading } from '../../../../hooks/useLoading';
import {
  consultarComissoes,
  buscarPessoas,
  buscarProdutosPorFavorecido,
  cancelarComissaoApi,
} from '../../../../services/comissoesService';

const INITIAL_FILTERS = {
  favorecido: '',
  fatura: '',
  voucher: '',
  produto: '',
  vigencia_inicial: '',
  vigencia_final: '',
};

const getComissaoKey = (c) => {
  const fatura = c.FATURA ?? '';
  const voucher = c.VOUCHER ?? '';
  const documento = c.DOCUMENTO ?? '';
  const favor = c.FAVOR ?? '';
  const tipo = c.TIPO ?? '';
  const parcela = c.PARCELA ?? '1';
  const valor = Number(c.VALOR ?? 0).toFixed(2);
  return [fatura, voucher, documento, favor, tipo, parcela, valor].join('|');
};

const normalizeFilters = (filters) => {
  const cleaned = {};
  Object.keys(filters).forEach((key) => {
    const value = filters[key];
    if (value !== '' && value !== null && value !== undefined && value !== 'null') {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const useConsultaComissao = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { withLoading, loading, startLoading, stopLoading } = useLoading();

  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [comissoes, setComissoes] = useState([]);
  const [pessoas, setPessoas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [hasSearched, setHasSearched] = useState(false);
  const [totalRegistros, setTotalRegistros] = useState(0);

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

  const buscar = useCallback(async () => {
    const filtrosLimpos = normalizeFilters(filters);
    setHasSearched(true);

    try {
      const result = await withLoading(
        async () => consultarComissoes(filtrosLimpos),
        'Buscando comissões...'
      );

      if (!result?.sucesso) {
        setComissoes([]);
        setTotalRegistros(0);
        return;
      }

      const dados = result.dados || {};
      const lista = dados.data || [];
      setComissoes(lista);
      setTotalRegistros(dados.total_registros || lista.length);
      setSelectedKeys(new Set());

      if (lista.length === 0) {
        enqueueSnackbar('Nenhuma comissão encontrada', { variant: 'info' });
      } else {
        enqueueSnackbar(`${lista.length} comissão(ões) encontrada(s)`, { variant: 'success' });
      }
    } catch {
      enqueueSnackbar('Erro ao buscar comissões', { variant: 'error' });
      setComissoes([]);
      setTotalRegistros(0);
    }
  }, [filters, withLoading, enqueueSnackbar]);

  const updateFilter = useCallback((field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS });
    setComissoes([]);
    setTotalRegistros(0);
    setHasSearched(false);
    setSelectedKeys(new Set());
    enqueueSnackbar('Filtros limpos', { variant: 'info' });
  }, [enqueueSnackbar]);

  const toggleSelect = useCallback((key) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (comissoes.length === 0) return;
    const allKeys = comissoes.map(getComissaoKey);
    const allSelected = allKeys.every((k) => selectedKeys.has(k));
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allSelected) allKeys.forEach((k) => next.delete(k));
      else allKeys.forEach((k) => next.add(k));
      return next;
    });
  }, [comissoes, selectedKeys]);

  const handleCancel = useCallback(async () => {
    if (selectedKeys.size === 0) {
      enqueueSnackbar('Selecione pelo menos uma comissão para cancelar', { variant: 'warning' });
      return;
    }

    startLoading('Cancelando comissões...');
    
    try {

      const selected = comissoes.filter((c) => selectedKeys.has(getComissaoKey(c)));

      // console.log('Comissões selecionadas para cancelamento:', selected);

      const payload = {
        comissoes: selected.map((c) => ({
          fatura: String(c.FATURA || c.fatura || ''),
          parcela: String(c.PARCELA || c.parcela || '1'),
          documento: c.DOCUMENTO || c.documento || '',
          favorecido: c.FAVOR || c.favor || '',
          voucher: c.VOUCHER || c.voucher || '',
          tipo: c.TIPO || c.tipo || 'BENEFICIO',
        })),
      };

      console.log('Payload para cancelamento:', payload);
      

      const response = await cancelarComissaoApi(payload);

      if (!response?.sucesso) {
        throw new Error(response?.erro || 'Erro ao cancelar');
      }

      // total_canceladas = linhas realmente afetadas no banco (cancelamento é
      // por voucher inteiro, pode ser maior que o nº de linhas selecionadas)
      const totalCanceladas = response?.total_canceladas ?? selectedKeys.size;
      const vouchersCancelados = Object.keys(response?.vouchers_cancelados || {});
      enqueueSnackbar(
        vouchersCancelados.length > 0
          ? `${totalCanceladas} comissão(ões) cancelada(s) — voucher(s) ${vouchersCancelados.join(', ')} cancelado(s) por inteiro.`
          : `${totalCanceladas} comissão(ões) cancelada(s) com sucesso!`,
        { variant: 'success' }
      );

      setSelectedKeys(new Set());
      setComissoes([]);
      setTotalRegistros(0);
      setHasSearched(false);
    } catch (error) {
      enqueueSnackbar(error.message || 'Erro ao cancelar comissões', { variant: 'error' });
    } finally {
      stopLoading();
    }
  }, [selectedKeys, comissoes, enqueueSnackbar, startLoading, stopLoading]);

  // Vouchers únicos entre as comissões selecionadas — usado no modal para
  // avisar que o cancelamento remove o voucher INTEIRO (todas as linhas dele)
  const selectedVouchers = [...new Set(
    comissoes
      .filter((c) => selectedKeys.has(getComissaoKey(c)))
      .map((c) => String(c.VOUCHER ?? c.voucher ?? '').trim())
      .filter(Boolean)
  )];

  return {
    loading,
    filters,
    comissoes,
    pessoas,
    produtos,
    selectedKeys,
    selectedVouchers,
    hasSearched,
    totalRegistros,
    updateFilter,
    buscar,
    clearFilters,
    toggleSelect,
    toggleSelectAll,
    handleCancel,
  };
};
