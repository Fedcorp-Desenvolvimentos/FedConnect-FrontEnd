// src/pages/Financeiro/voucher/components/ComissoesPanel.jsx

import React from 'react';
import { FaReceipt } from 'react-icons/fa';
import { Card, CardHeader, ComissaoList, ComissaoItem, TotalsBar, EmptyState } from '../EmissaoRecibosVoucherStyles';

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

export const ComissoesPanel = ({
  comissoes,
  selectedComissoes,
  onToggleComissao,
  onToggleAllComissoes,
  totals,
  loading,
}) => {
  const allSelected = comissoes.length > 0 && selectedComissoes.length === comissoes.length;

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
          <span>({comissoes.length} encontradas)</span>
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
            {comissoes.map((comissao) => {
              // 🔥 ID ÚNICO baseado na FATURA
              const id = String(comissao.FATURA || comissao.fatura || comissao.id || comissao.DOCUMENTO || '');
              const isSelected = selectedComissoes.includes(id);
              const valorComissao = comissao.VALOR || comissao.valor || comissao.VALOR_COMISSAO || comissao.valor_comissao || 0;
              const nomeFavorecido = comissao.NOME || comissao.nome || 'Favorecido';

              return (
                <ComissaoItem key={id} checked={isSelected}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleComissao(id)}
                  />
                  <div className="info">
                    <strong>{nomeFavorecido}</strong>
                    <span>
                      Fatura {id} | Parcela {comissao.PARCELA || comissao.parcela || 1}
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