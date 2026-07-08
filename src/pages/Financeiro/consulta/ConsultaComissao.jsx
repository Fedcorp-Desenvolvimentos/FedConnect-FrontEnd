import React from 'react';
import { FaArrowLeft, FaSearch, FaEraser, FaSpinner, FaTrashAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PessoaSelect } from '../comissoes/components/PessoaSelect';
import { useConsultaComissao } from './hooks/useConsultaComissao';
import * as S from './ConsultaComissaoStyles';

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
};

const ConsultaComissao = () => {
  const navigate = useNavigate();
  const {
    loading,
    filters,
    comissoes,
    pessoas,
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

  const getComissaoKey = (c) => {
    const documento = c.DOCUMENTO ?? '';
    const favor = c.FAVOR ?? '';
    const tipo = c.TIPO ?? '';
    const parcela = c.PARCELA ?? '1';
    const valor = Number(c.VALOR ?? 0).toFixed(2);
    return [documento, favor, tipo, parcela, valor].join('|');
  };

  const handlePessoaChange = (value) => {
    updateFilter('favorecido', value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    buscar();
  };

  const allKeys = comissoes.map(getComissaoKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedKeys.has(k));

  const totalValue = comissoes
    .filter((c) => selectedKeys.has(getComissaoKey(c)))
    .reduce((sum, c) => sum + Number(c.VALOR || c.valor || 0), 0);

  return (
    <S.Container>
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

      {loading && (
        <S.LoadingContainer>
          <FaSpinner />
          <span>Carregando...</span>
        </S.LoadingContainer>
      )}

      {!loading && hasSearched && comissoes.length === 0 && (
        <S.EmptyState>
          <p>Nenhuma comissão encontrada com os filtros informados.</p>
        </S.EmptyState>
      )}

      {!loading && comissoes.length > 0 && (
        <S.Card>
          <S.CardHeader>
            <div>
              <FaFileInvoiceDollar />
              <h2>Comissões encontradas</h2>
              <span>{totalRegistros} registro(s)</span>
            </div>
          </S.CardHeader>

          <S.ResultsBar>
            <span>
              {selectedKeys.size > 0
                ? `${selectedKeys.size} de ${comissoes.length} selecionada(s)`
                : `${comissoes.length} comissão(ões)`}
            </span>
          </S.ResultsBar>

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
              <span>Voucher</span>
              <span>Status</span>
            </S.TableHead>

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
              const temVoucher = Boolean(voucher);

              return (
                <S.TableRow
                  key={key}
                  $checked={checked}
                  onClick={() => toggleSelect(key)}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSelect(key)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <S.FavorecidoCell>
                    <strong>{nome}</strong>
                    <span>{documento} · {produto}</span>
                  </S.FavorecidoCell>
                  <div><S.CellLabel>Fatura </S.CellLabel>{fatura}</div>
                  <div><S.CellLabel>Parcela </S.CellLabel>{parcela}</div>
                  <div><S.CellLabel>Valor </S.CellLabel><S.MoneyCell>{formatMoney(valor)}</S.MoneyCell></div>
                  <div><S.CellLabel>Vencimento </S.CellLabel>{formatDate(vencimento)}</div>
                  <div>
                    <S.CellLabel>Voucher </S.CellLabel>
                    {temVoucher ? (
                      <S.VoucherBadge $emitido>{voucher}</S.VoucherBadge>
                    ) : (
                      <S.VoucherBadge $emitido={false}>—</S.VoucherBadge>
                    )}
                  </div>
                  <div>
                    <S.CellLabel>Status </S.CellLabel>
                    <S.StatusBadge $status={status}>{status || '—'}</S.StatusBadge>
                  </div>
                </S.TableRow>
              );
            })}
          </S.Table>

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
