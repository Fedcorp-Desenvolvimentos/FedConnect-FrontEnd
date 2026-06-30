// src/pages/Financeiro/voucher/components/ComissoesPanel.jsx

import React from 'react';
import { FaReceipt, FaSpinner, FaCalendar } from 'react-icons/fa';
import { Card, CardHeader, ComissaoList, ComissaoItem, TotalsBar, EmptyState } from '../EmissaoRecibosVoucherStyles';
import styled from 'styled-components';

const PeriodInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #718096;
  margin-left: 8px;

  svg {
    font-size: 14px;
  }
`;

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('pt-BR');
  } catch {
    return '-';
  }
};

const getComissaoKey = (comissao) => {
  const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '';
  const parcela = comissao.PARCELA || comissao.parcela || '1';
  return `${fatura}|${parcela}`;
};

const formatPeriodo = (dataCorte) => {
  if (!dataCorte) return 'Último mês';
  try {
    const partes = dataCorte.split('-');
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${meses[parseInt(partes[1]) - 1]} de ${partes[0]}`;
  } catch {
    return dataCorte;
  }
};

export const ComissoesPanel = ({
  comissoes,
  selectedComissoes,
  onToggleComissao,
  onToggleAllComissoes,
  totals,
  loading,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  totalRegistros = 0,
  dataCorte,
}) => {
  const allSelected = comissoes.length > 0 && comissoes.every(c => {
    const key = getComissaoKey(c);
    return selectedComissoes.has(key);
  });

  const totalSelecionadas = selectedComissoes.size;

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div>
            <FaReceipt />
            <h2>3. Comissões</h2>
            <span>Carregando...</span>
          </div>
        </CardHeader>
        <EmptyState>Carregando comissões...</EmptyState>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <FaReceipt />
          <h2>3. Comissões</h2>
          <span>
            ({comissoes.length} de {totalRegistros || comissoes.length} encontradas)
          </span>
          {totalSelecionadas > 0 && (
            <span className="badge">
              {totalSelecionadas} selecionadas
            </span>
          )}
          <PeriodInfo>
            <FaCalendar />
            {formatPeriodo(dataCorte)}
          </PeriodInfo>
        </div>
        {comissoes.length > 0 && (
          <button type="button" className="link-button" onClick={onToggleAllComissoes}>
            {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
          </button>
        )}
      </CardHeader>

      {comissoes.length === 0 ? (
        <EmptyState>
          <p style={{ fontSize: 16, color: '#718096', marginBottom: 8 }}>
            Nenhuma comissão encontrada para {formatPeriodo(dataCorte)}
          </p>
          <p style={{ fontSize: 13, color: '#a0aec0' }}>
            Tente ajustar os filtros ou alterar a data de corte
          </p>
        </EmptyState>
      ) : (
        <>
          <ComissaoList>
            {comissoes.map((comissao, index) => {
              const key = getComissaoKey(comissao);
              const isSelected = selectedComissoes.has(key);
              const valorComissao = Number(comissao.VALOR || comissao.valor || comissao.VALOR_COMISSAO || comissao.valor_comissao || 0);
              const nomeFavorecido = comissao.NOME || comissao.nome || 'Favorecido';
              const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '-';

              return (
                <ComissaoItem 
                  key={`comissao-${key}-${index}`} 
                  checked={isSelected}
                  onClick={() => onToggleComissao(comissao)}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleComissao(comissao)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="info">
                    <strong>{nomeFavorecido}</strong>
                    <span>
                      Fatura {fatura} | Parcela {comissao.PARCELA || comissao.parcela || 1}
                    </span>
                    <span>
                      Vencimento: {formatDate(comissao.VENCIMENTO || comissao.vencimento)}
                      {comissao.VOUCHER && ` | Voucher: ${comissao.VOUCHER}`}
                    </span>
                    <span style={{ fontSize: 12, color: '#a0aec0' }}>
                      {comissao.PRODUTO || comissao.produto || '-'}
                    </span>
                  </div>
                  <span className="value">{formatMoney(valorComissao)}</span>
                </ComissaoItem>
              );
            })}
          </ComissaoList>

          {hasMore && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <button
                className="link-button"
                onClick={onLoadMore}
                disabled={loadingMore}
                style={{
                  padding: '8px 24px',
                  background: '#edf2f7',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: loadingMore ? 'default' : 'pointer',
                  fontSize: '14px',
                  color: '#2d3748',
                }}
              >
                {loadingMore ? (
                  <>
                    <FaSpinner style={{ marginRight: 8, animation: 'spin 1s linear infinite' }} />
                    Carregando mais...
                  </>
                ) : (
                  `Carregar mais (${comissoes.length}/${totalRegistros})`
                )}
              </button>
            </div>
          )}

          <TotalsBar>
            <span>
              Total: <strong>{formatMoney(totals.grossTotal)}</strong>
            </span>
            <span>
              Retenções (5%): <strong>{formatMoney(totals.retentionTotal)}</strong>
            </span>
            <span className="net">
              Líquido: <strong>{formatMoney(totals.netTotal)}</strong>
            </span>
            <span>
              Selecionadas: <strong>{totals.count}</strong>
            </span>
          </TotalsBar>
        </>
      )}
    </Card>
  );
};