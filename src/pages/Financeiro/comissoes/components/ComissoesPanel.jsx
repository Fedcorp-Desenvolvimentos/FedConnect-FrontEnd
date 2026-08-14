// components/ComissoesPanel.jsx

import React from 'react';
import { FaReceipt, FaSpinner, FaFileExcel } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  ComissaoList,
  ComissaoItem,
  TotalsBar,
  EmptyState,
  LoadingContainer,
} from '../ComissoesStyles';
import styled from 'styled-components';
import { getComissaoKey } from '../hooks/useComissoes';



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

export const ComissoesPanel = ({
  comissoes,
  selectedComissoes,
  onToggleComissao,
  onToggleAllComissoes,
  totals,
  loading,
  totalRegistros = 0,
  isUsingFilteredData,
  hasSearched,
  onExportExcel,
  hasResults,
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

          <span className="badge" style={{ background: isUsingFilteredData ? '#fffbeb' : '#ebf8ff', color: isUsingFilteredData ? '#92400e' : '#2b6cb0' }}>
            {isUsingFilteredData ? 'Filtradas' : 'Padrão'}
          </span>
        </div>

        {comissoes.length > 0 && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="link-button" onClick={onToggleAllComissoes}>
              {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
            </button>
            {hasResults && selectedComissoes.size > 0 && (
              <button
                type="button"
                className="link-button"
                onClick={onExportExcel}
                style={{ color: '#217A4B' }}
              >
                <FaFileExcel style={{ marginRight: 4 }} />
                Exportar Excel
              </button>
            )}
          </div>
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
              const administradora = comissao.ADMINISTRADORA || comissao.administradora || comissao.CEDENTE_NOME || comissao.cedente_nome || '';
              const competencia = comissao.DT_INI_VIG || comissao.dt_ini_vig || '';

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
                      Fatura {fatura} | Parcela {comissao.PARCELA ?? comissao.parcela ?? '-'} | Tipo {tipo}
                    </span>
                    <span>
                      Vencimento: {formatDate(comissao.VENCIMENTO || comissao.vencimento)}
                      {comissao.VOUCHER ? ` | Voucher: ${comissao.VOUCHER}` : ' | Sem voucher'}
                    </span>
                    {administradora && (
                      <span style={{ fontSize: 12, color: '#718096' }}>
                        Admin: {administradora}
                      </span>
                    )}
                    {competencia && (
                      <span style={{ fontSize: 12, color: '#718096' }}>
                        Competência: {formatDate(competencia)}
                      </span>
                    )}
                    {produto && produto !== '-' && (
                      <span style={{ fontSize: 12, color: '#2d3748', fontWeight: 500 }}>
                        Produto: {produto}
                      </span>
                    )}
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
