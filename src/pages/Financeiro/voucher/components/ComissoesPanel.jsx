// src/pages/Financeiro/voucher/components/ComissoesPanel.jsx

import React from 'react';
import { FaReceipt } from 'react-icons/fa';
import { Card, CardHeader, ComissaoList, ComissaoItem, TotalsBar, EmptyState } from '../EmissaoRecibosVoucherStyles';

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

export const ComissoesPanel = ({
  comissoes,
  selectedComissoes,
  onToggleComissao,
  onToggleAllComissoes,
  totals,
}) => {
  const allSelected = comissoes.length > 0 && selectedComissoes.length === comissoes.length;

  return (
    <Card>
      <CardHeader>
        <div>
          <FaReceipt />
          <h2>3. Comissões</h2>
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
              const id = comissao.FATURA || comissao.id;
              const isSelected = selectedComissoes.includes(id);

              return (
                <ComissaoItem key={id} checked={isSelected}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleComissao(id)}
                  />
                  <div className="info">
                    <strong>{comissao.NOME || comissao.favorecido || 'Favorecido'}</strong>
                    <span>
                      Fatura {id} | {comissao.PRODUTO || comissao.produto || '-'}
                    </span>
                    <span>
                      Vencimento: {comissao.VENCIMENTO || comissao.vencimento || '-'}
                    </span>
                  </div>
                  <span className="value">
                    {formatMoney(comissao.VALOR_COMISSAO || comissao.valor || 0)}
                  </span>
                </ComissaoItem>
              );
            })}
          </ComissaoList>

          <TotalsBar>
            <span>
              Total: <strong>{formatMoney(totals.grossTotal)}</strong>
            </span>
            <span>
              Retenções: <strong>{formatMoney(totals.retentionTotal)}</strong>
            </span>
            <span className="net">
              Líquido: <strong>{formatMoney(totals.netTotal)}</strong>
            </span>
          </TotalsBar>
        </>
      )}
    </Card>
  );
};