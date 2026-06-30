// src/pages/Financeiro/voucher/components/ComissoesPanel.jsx

import React from 'react';
import { FaReceipt, FaSpinner } from 'react-icons/fa';
import { Card, CardHeader, ComissaoList, ComissaoItem, TotalsBar, EmptyState } from '../EmissaoRecibosVoucherStyles';

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

// 🔥 Gera chave única para comissão
const getComissaoKey = (comissao) => {
  const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '';
  const parcela = comissao.PARCELA || comissao.parcela || '1';
  return `${fatura}|${parcela}`;
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
}) => {
  // 🔥 Verifica se todas as comissões VISÍVEIS estão selecionadas
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
            <span style={{ color: '#2b6cb0', fontWeight: 600 }}>
              | {totalSelecionadas} selecionadas
            </span>
          )}
        </div>
        {comissoes.length > 0 && (
          <button type="button" className="link-button" onClick={onToggleAllComissoes}>
            {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
          </button>
        )}
      </CardHeader>

      {comissoes.length === 0 ? (
        <EmptyState>Nenhuma comissão encontrada.</EmptyState>
      ) : (
        <>
          <ComissaoList>
            {comissoes.map((comissao, index) => {
              // 🔥 Usa compound key (FATURA + PARCELA)
              const key = getComissaoKey(comissao);
              const isSelected = selectedComissoes.has(key);
              const valorComissao = comissao.VALOR || comissao.valor || comissao.VALOR_COMISSAO || comissao.valor_comissao || 0;
              const nomeFavorecido = comissao.NOME || comissao.nome || 'Favorecido';
              const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '-';

              return (
                <ComissaoItem key={`comissao-${key}-${index}`} checked={isSelected}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleComissao(comissao)}
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

          {/* 🔥 Botão de carregar mais */}
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
                  'Carregar mais comissões'
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