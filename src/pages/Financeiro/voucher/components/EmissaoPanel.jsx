// src/pages/Financeiro/voucher/components/EmissaoPanel.jsx

import React from 'react';
import { FaPrint, FaEye } from 'react-icons/fa';
import { Card, CardHeader, EmissaoOptions, EmissionResult, Actions, Button } from '../EmissaoRecibosVoucherStyles';

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

export const EmissaoPanel = ({
  canIssue,
  documentType,
  loading,
  lastEmission,
  totals,
  onDocumentTypeChange,
  onEmitir,
  onPreview,
  onSair,
}) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <FaPrint />
          <h2>4. Emissão</h2>
        </div>
      </CardHeader>

      <EmissaoOptions>
        <label>
          Tipo de documento
          <select value={documentType} onChange={(e) => onDocumentTypeChange(e.target.value)}>
            <option value="recibo">Recibo</option>
            <option value="voucher">Voucher</option>
          </select>
        </label>
      </EmissaoOptions>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '10px',
        marginTop: '12px',
        marginBottom: '12px',
        padding: '12px',
        background: '#f7fafc',
        borderRadius: '8px'
      }}>
        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Total Bruto</span>
          <strong style={{ display: 'block', color: '#2d3748' }}>
            {formatMoney(totals?.grossTotal || 0)}
          </strong>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Retenções</span>
          <strong style={{ display: 'block', color: '#dd6b20' }}>
            {formatMoney(totals?.retentionTotal || 0)}
          </strong>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Líquido</span>
          <strong style={{ display: 'block', color: '#2b6cb0' }}>
            {formatMoney(totals?.netTotal || 0)}
          </strong>
        </div>
        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Comissões</span>
          <strong style={{ display: 'block', color: '#2d3748' }}>
            {totals?.count || 0}
          </strong>
        </div>
      </div>

      {lastEmission && (
        <EmissionResult>
          <strong>✓ {documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido!</strong>
          <br />
          Número: {lastEmission.numero}
          <br />
          Emitido em: {formatDate(lastEmission.emitidoEm)}
          <br />
          Total: {formatMoney(lastEmission.total)} | {lastEmission.quantidade} comissões
        </EmissionResult>
      )}

      <Actions>
        <Button
          className="primary"
          disabled={!canIssue || loading}
          onClick={onEmitir}
        >
          <FaPrint />
          {loading ? 'Emitindo...' : `Emitir ${documentType === 'voucher' ? 'Voucher' : 'Recibo'}`}
        </Button>

        <Button className="secondary" disabled={!canIssue} onClick={onPreview}>
          <FaEye />
          Pré-visualizar
        </Button>

        <Button className="ghost" onClick={onSair}>
          Sair
        </Button>
      </Actions>
    </Card>
  );
};