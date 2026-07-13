import React, { useMemo } from 'react';
import { 
  FaArrowLeft, FaSearch, FaEraser, FaSpinner, 
  FaTrashAlt, FaFileInvoiceDollar, FaCalendarAlt,
  FaInfoCircle 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PessoaSelect } from '../comissoes/components/PessoaSelect';
import { useConsultaComissao } from './hooks/useConsultaComissao';
import * as S from './ConsultaComissaoStyles';
import { getStatusInfo } from '../../../utils/status_comissao_helper';

// ================================================================
// HELPERS
// ================================================================

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toLocaleString('pt-BR', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
};

// ================================================================
// COMPONENTES INTERNOS
// ================================================================

const StatusBadge = ({ status }) => {
  const statusInfo = getStatusInfo(status);
  
  return (
    <S.StatusBadge 
      $bgColor={statusInfo.bg}
      $color={statusInfo.color}
      $borderColor={`${statusInfo.color}33`}
    >
      {statusInfo.label}
    </S.StatusBadge>
  );
};

const VoucherBadge = ({ voucher }) => {
  const hasVoucher = Boolean(voucher);
  return (
    <S.VoucherBadge $hasVoucher={hasVoucher}>
      {hasVoucher ? voucher : '—'}
    </S.VoucherBadge>
  );
};

// ================================================================
// COMPONENTE PRINCIPAL
// ================================================================

const ConsultaComissao = () => {
  const navigate = useNavigate();
  const {
    loading,
    filters,
    comissoes,
    pessoas,
    produtos,
    selectedKeys,
    hasSearched,
    totalRegistros,
    updateFilter,
    buscar,
    clearFilters,
    toggleSelect,
    toggleSelectAll,
    handleCancel,
  } = useConsultaComissao();

  // ================================================================
  // MEMOIZAÇÃO PARA PERFORMANCE
  // ================================================================

  const getComissaoKey = useMemo(() => (c) => {
    const documento = c.DOCUMENTO ?? '';
    const favor = c.FAVOR ?? '';
    const tipo = c.TIPO ?? '';
    const parcela = c.PARCELA ?? '1';
    const valor = Number(c.VALOR ?? 0).toFixed(2);
    return [documento, favor, tipo, parcela, valor].join('|');
  }, []);

  const allKeys = useMemo(() => comissoes.map(getComissaoKey), [comissoes, getComissaoKey]);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));

  const totalValue = useMemo(() => 
    comissoes
      .filter((c) => selectedKeys.has(getComissaoKey(c)))
      .reduce((sum, c) => sum + Number(c.VALOR || c.valor || 0), 0),
    [comissoes, selectedKeys, getComissaoKey]
  );

  // ================================================================
  // HANDLERS
  // ================================================================

  const handlePessoaChange = (value) => {
    updateFilter('favorecido', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscar();
  };

  // ================================================================
  // RENDER
  // ================================================================

  return (
    <S.Container>
      {/* HEADER */}
      <S.Header>
        <S.BackButton onClick={() => navigate('/financeiro')}>
          <FaArrowLeft />
          Voltar
        </S.BackButton>
        <S.Title>
          <h1>Consulta / Cancelamento de Comissão</h1>
          <p>Consulte comissões emitidas e realize cancelamentos quando necessário</p>
        </S.Title>
      </S.Header>

      {/* FILTROS */}
      <S.Card as="form" onSubmit={handleSubmit}>
        <S.CardHeader>
          <div>
            <FaSearch />
            <h2>Filtros de busca</h2>
          </div>
        </S.CardHeader>

        <S.FormGrid>
          <S.FormGroup $span={2}>
            <span>Favorecido</span>
            <PessoaSelect
              pessoas={pessoas}
              value={filters.favorecido}
              onChange={handlePessoaChange}
              placeholder="Nome, código ou documento"
            />
          </S.FormGroup>

          <S.FormGroup>
            <span>Fatura</span>
            <input
              type="text"
              value={filters.fatura || ''}
              onChange={(e) => updateFilter('fatura', e.target.value)}
              placeholder="Número da fatura"
            />
          </S.FormGroup>

          <S.FormGroup>
            <span>Voucher</span>
            <input
              type="text"
              value={filters.voucher || ''}
              onChange={(e) => updateFilter('voucher', e.target.value)}
              placeholder="Número do voucher"
            />
          </S.FormGroup>

          <S.FormGroup>
            <span>Produto</span>
            <select
              value={filters.produto || ''}
              onChange={(e) => updateFilter('produto', e.target.value)}
              disabled={!filters.favorecido || produtos.length === 0}
            >
              <option value="">Todos os produtos</option>
              {produtos.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </S.FormGroup>

          <S.FormGroup>
            <span><FaCalendarAlt /> Vigência início</span>
            <input
              type="date"
              value={filters.vigencia_inicial || ''}
              onChange={(e) => updateFilter('vigencia_inicial', e.target.value)}
            />
          </S.FormGroup>

          <S.FormGroup>
            <span><FaCalendarAlt /> Vigência fim</span>
            <input
              type="date"
              value={filters.vigencia_final || ''}
              onChange={(e) => updateFilter('vigencia_final', e.target.value)}
            />
          </S.FormGroup>
        </S.FormGrid>

        <S.Actions>
          <S.Button type="submit" className="primary" disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : <FaSearch />}
            {loading ? 'Buscando...' : 'Buscar'}
          </S.Button>

          <S.Button type="button" className="ghost" onClick={clearFilters}>
            <FaEraser />
            Limpar filtros
          </S.Button>
        </S.Actions>
      </S.Card>

      {/* LOADING */}
      {loading && (
        <S.LoadingContainer>
          <FaSpinner />
          <span>Carregando comissões...</span>
        </S.LoadingContainer>
      )}

      {/* EMPTY STATE */}
      {!loading && hasSearched && comissoes.length === 0 && (
        <S.EmptyState>
          <FaInfoCircle />
          <p>Nenhuma comissão encontrada com os filtros informados.</p>
        </S.EmptyState>
      )}

      {/* RESULTS */}
      {!loading && comissoes.length > 0 && (
        <S.Card>
          <S.CardHeader>
            <div>
              <FaFileInvoiceDollar />
              <h2>Comissões encontradas</h2>
              <S.Badge>{totalRegistros} registro(s)</S.Badge>
            </div>
          </S.CardHeader>

          <S.ResultsBar>
            <span>
              {selectedKeys.size > 0
                ? `${selectedKeys.size} de ${comissoes.length} selecionada(s)`
                : `${comissoes.length} comissão(ões)`}
            </span>
            {selectedKeys.size > 0 && (
              <S.TotalSelected>
                Total: {formatMoney(totalValue)}
              </S.TotalSelected>
            )}
          </S.ResultsBar>

          {/* TABLE */}
          <S.TableContainer>
            <S.Table>
              <S.TableHead>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                />
                <span>Favorecido</span>
                <span>Fatura</span>
                <span>Parcela</span>
                <span>Valor</span>
                <span>Vencimento</span>
                <span>Vigência</span>
                <span>Voucher</span>
                <span>Status</span>
              </S.TableHead>

              <S.TableBody>
                {comissoes.map((c) => {
                  const key = getComissaoKey(c);
                  const checked = selectedKeys.has(key);
                  const nome = c.NOME || c.nome || '—';
                  const documento = c.DOCUMENTO || c.documento || '';
                  const fatura = c.FATURA || c.fatura || '—';
                  const parcela = c.PARCELA || c.parcela || '1';
                  const valor = Number(c.VALOR || c.valor || 0);
                  const vencimento = c.VENCIMENTO || c.vencimento || '';
                  const voucher = c.VOUCHER || c.voucher || '';
                  const status = c.STATUS || c.status || '';
                  const produto = c.PRODUTO || c.produto || '';
                  const dtIniVig = c.DT_INI_VIG || c.dt_ini_vig || '';

                  return (
                    <S.TableRow
                      key={key}
                      $checked={checked}
                      onClick={() => toggleSelect(key)}
                    >
                      <S.CheckboxCell>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleSelect(key)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </S.CheckboxCell>

                      <S.FavorecidoCell>
                        <strong>{nome}</strong>
                        <span>{documento} · {produto}</span>
                      </S.FavorecidoCell>

                      <S.Cell>
                        <S.CellLabel>Fatura</S.CellLabel>
                        {fatura}
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Parcela</S.CellLabel>
                        {parcela}
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Valor</S.CellLabel>
                        <S.MoneyCell>{formatMoney(valor)}</S.MoneyCell>
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Vencimento</S.CellLabel>
                        {formatDate(vencimento)}
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Vigência</S.CellLabel>
                        {formatDate(dtIniVig)}
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Voucher</S.CellLabel>
                        <VoucherBadge voucher={voucher} />
                      </S.Cell>

                      <S.Cell>
                        <S.CellLabel>Status</S.CellLabel>
                        <StatusBadge status={status} />
                      </S.Cell>
                    </S.TableRow>
                  );
                })}
              </S.TableBody>
            </S.Table>
          </S.TableContainer>

          {/* BOTTOM BAR */}
          <S.BottomBar>
            <span>
              {selectedKeys.size > 0
                ? `${selectedKeys.size} selecionada(s) · Total: ${formatMoney(totalValue)}`
                : 'Nenhuma comissão selecionada'}
            </span>

            <S.Button
              className="danger"
              disabled={selectedKeys.size === 0 || loading}
              onClick={handleCancel}
            >
              <FaTrashAlt />
              Cancelar Selecionadas
            </S.Button>
          </S.BottomBar>
        </S.Card>
      )}
    </S.Container>
  );
};

export default ConsultaComissao;