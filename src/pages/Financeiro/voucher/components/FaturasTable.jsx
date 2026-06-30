// src/pages/Financeiro/voucher/components/FaturasTable.jsx

import React from 'react';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import { Card, CardHeader, TableWrapper, Table, StatusBadge, EmptyState } from '../EmissaoRecibosVoucherStyles';

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

export const FaturasTable = ({
  faturas,
  selectedFaturas,
  onToggleFatura,
  onToggleAllFaturas,
  loading,
}) => {
  const allSelected = faturas.length > 0 && selectedFaturas.length === faturas.length;

  const getStatusInfo = (status) => {
    const statusMap = {
      'P': { label: 'Pendente', className: 'pending' },
      'B': { label: 'Baixada', className: 'paid' },
      'A': { label: 'Ativa', className: 'paid' },
      'C': { label: 'Cancelada', className: 'overdue' },
    };
    return statusMap[status] || { label: status || 'Desconhecido', className: 'pending' };
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div>
            <FaFileInvoiceDollar />
            <h2>2. Faturas</h2>
          </div>
        </CardHeader>
        <EmptyState>Carregando faturas...</EmptyState>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div>
          <FaFileInvoiceDollar />
          <h2>2. Faturas</h2>
          <span style={{ fontSize: 13, color: '#718096' }}>
            ({faturas.length} encontradas)
          </span>
        </div>
        {faturas.length > 0 && (
          <button type="button" className="link-button" onClick={onToggleAllFaturas}>
            {allSelected ? 'Desmarcar todas' : 'Selecionar todas'}
          </button>
        )}
      </CardHeader>

      {faturas.length === 0 ? (
        <EmptyState>Nenhuma fatura encontrada.</EmptyState>
      ) : (
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={onToggleAllFaturas}
                  />
                </th>
                <th>Fatura</th>
                <th>Administradora</th>
                <th>Apólice</th>
                <th>Vencimento</th>
                <th>Prêmio Líquido</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {faturas.map((fatura) => {
                const id = fatura.FATURA || fatura.id;
                const isSelected = selectedFaturas.includes(id);
                const statusInfo = getStatusInfo(fatura.STATUS || fatura.status);

                return (
                  <tr key={id} className={isSelected ? 'selected' : ''}>
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleFatura(id)}
                      />
                    </td>
                    <td>{id}</td>
                    <td>{fatura.ADMINISTRADORA || fatura.administradora || '-'}</td>
                    <td>{fatura.APOLICE || fatura.apolice || '-'}</td>
                    <td>{formatDate(fatura.VENCIMENTO || fatura.vencimento)}</td>
                    <td>{formatMoney(fatura.PREMIO_LIQ || fatura.premio_liq || fatura.VALOR || 0)}</td>
                    <td>
                      <StatusBadge className={statusInfo.className}>
                        {statusInfo.label}
                      </StatusBadge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </TableWrapper>
      )}
    </Card>
  );
};