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

export const EmissaoPanel = ({
  canIssue,
  documentType,
  loading,
  lastEmission,
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

      {lastEmission && (
        <EmissionResult>
          <strong>✓ {documentType === 'voucher' ? 'Voucher' : 'Recibo'} emitido!</strong>
          <br />
          Número: {lastEmission.numero}
          <br />
          Emitido em: {formatDate(lastEmission.emitidoEm)}
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