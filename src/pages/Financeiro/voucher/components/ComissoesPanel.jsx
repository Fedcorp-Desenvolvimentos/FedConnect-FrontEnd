// components/ComissoesPanel.jsx - REMOVER BOTÃO DE CARREGAR MAIS

import React from 'react';
import { FaReceipt, FaSpinner, FaCalendar } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  ComissaoList,
  ComissaoItem,
  TotalsBar,
  EmptyState,
  LoadingContainer,
} from '../EmissaoRecibosVoucherStyles';
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

const getComissaoKey = (c) => {
  const documento = c.DOCUMENTO ?? '';
  const favor = c.FAVOR ?? '';
  const tipo = c.TIPO ?? '';
  const parcela = c.PARCELA ?? '1';
  const valor = Number(c.VALOR ?? 0).toFixed(2);

  return [documento, favor, tipo, parcela, valor].join('|');
};

export const ComissoesPanel = ({
  comissoes,
  selectedComissoes,
  onToggleComissao,
  onToggleAllComissoes,
  totals,
  loading,
  totalRegistros = 0,
  dataCorteFormatada,
  isUsingFilteredData,
  hasSearched,
}) => {
  const allSelected =
    comissoes.length > 0 &&
    comissoes.every((c) => {
      const key = getComissaoKey(c);
      return selectedComissoes.has(key);
    });

  const totalSelecionadas = selectedComissoes.size;

  if (loading && comissoes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div>
            <FaReceipt />
            <h2>2. Comissões</h2>
            <span>Carregando...</span>
          </div>
        </CardHeader>
        <LoadingContainer>
          <FaSpinner className="spin" />
          <span>Carregando comissões...</span>
        </LoadingContainer>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <FaReceipt />
          <h2>2. Comissões</h2>
          <span>
            ({comissoes.length} {totalRegistros > comissoes.length ? `de ${totalRegistros}` : ''} encontradas)
          </span>

          {totalSelecionadas > 0 && (
            <span className="badge">
              {totalSelecionadas} selecionadas
            </span>
          )}

          <PeriodInfo>
            <FaCalendar />
            {dataCorteFormatada || 'Último mês'}
          </PeriodInfo>

          <span className="badge" style={{ background: isUsingFilteredData ? '#fffbeb' : '#ebf8ff', color: isUsingFilteredData ? '#92400e' : '#2b6cb0' }}>
            {isUsingFilteredData ? 'Filtradas' : 'Padrão'}
          </span>
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
            {hasSearched
              ? 'Nenhuma comissão encontrada para os filtros selecionados'
              : 'Faça uma consulta para exibir as comissões'}
          </p>
          <p style={{ fontSize: 13, color: '#a0aec0' }}>
            {hasSearched
              ? 'Tente ajustar os filtros ou alterar a data de corte'
              : 'Utilize o formulário de consulta acima'}
          </p>
        </EmptyState>
      ) : (
        <>
          <ComissaoList>
            {comissoes.map((comissao, index) => {
              const key = getComissaoKey(comissao);
              const isSelected = selectedComissoes.has(key);
              const valorComissao = Number(
                comissao.VALOR || comissao.valor || comissao.VALOR_COMISSAO || comissao.valor_comissao || 0
              );
              const nomeFavorecido = comissao.NOME || comissao.nome || 'Favorecido';
              const fatura = comissao.FATURA || comissao.fatura || comissao.DOCUMENTO || '-';
              const produto = comissao.PRODUTO || comissao.produto || '-';
              const tipo = comissao.TIPO || comissao.tipo || '-';

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
                      Fatura {fatura} | Parcela {comissao.PARCELA || comissao.parcela || 1} | Tipo {tipo}
                    </span>
                    <span>
                      Vencimento: {formatDate(comissao.VENCIMENTO || comissao.vencimento)}
                      {comissao.VOUCHER ? ` | Voucher: ${comissao.VOUCHER}` : ' | Sem voucher'}
                    </span>
                    <span style={{ fontSize: 12, color: '#a0aec0' }}>
                      {produto}
                    </span>
                  </div>

                  <span className="value">{formatMoney(valorComissao)}</span>
                </ComissaoItem>
              );
            })}
          </ComissaoList>

          <TotalsBar>
            <span>
              Total bruto: <strong>{formatMoney(totals.grossTotal)}</strong>
            </span>
            <span>
              Retenções: <strong>{formatMoney(totals.retentionTotal)}</strong>
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