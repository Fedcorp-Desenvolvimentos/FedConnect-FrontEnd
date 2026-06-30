import React from 'react';
import { FaPrint, FaEye, FaSpinner } from 'react-icons/fa';
import { Card, CardHeader, EmissaoOptions, EmissionResult, Actions, Button } from '../EmissaoRecibosVoucherStyles';

const formatDate = (date) => {
  if (!date) return '-';

  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '-';
  }
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
          <h2>3. Emissão</h2>
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginTop: '12px',
          marginBottom: '12px',
          padding: '14px',
          background: '#f7fafc',
          borderRadius: '10px',
          border: '1px solid #edf2f7',
        }}
      >
        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Total bruto</span>
          <strong style={{ display: 'block', color: '#2d3748', marginTop: 4 }}>
            {formatMoney(totals?.grossTotal || 0)}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Retenções</span>
          <strong style={{ display: 'block', color: '#dd6b20', marginTop: 4 }}>
            {formatMoney(totals?.retentionTotal || 0)}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Líquido</span>
          <strong style={{ display: 'block', color: '#2b6cb0', marginTop: 4 }}>
            {formatMoney(totals?.netTotal || 0)}
          </strong>
        </div>

        <div>
          <span style={{ fontSize: 12, color: '#718096' }}>Comissões</span>
          <strong style={{ display: 'block', color: '#2d3748', marginTop: 4 }}>
            {totals?.count || 0}
          </strong>
        </div>
      </div>

      {!canIssue && (
        <div
          style={{
            marginTop: '10px',
            marginBottom: '10px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#fffaf0',
            border: '1px solid #fbd38d',
            color: '#975a16',
            fontSize: '13px',
          }}
        >
          Selecione ao menos uma comissão para preparar a emissão.
        </div>
      )}

      {lastEmission && (
        <EmissionResult>
          <strong>✓ {lastEmission.tipo === 'voucher' ? 'Voucher' : 'Recibo'} preparado com sucesso</strong>
          <br />
          Número: {lastEmission.numero}
          <br />
          Emitido em: {formatDate(lastEmission.emitidoEm)}
          <br />
          Total líquido: {formatMoney(lastEmission.total)} | {lastEmission.quantidade} comissão(ões)
        </EmissionResult>
      )}

      <Actions>
        <Button
          className="primary"
          disabled={!canIssue || loading}
          onClick={onEmitir}
        >
          {loading ? <FaSpinner className="spin" /> : <FaPrint />}
          {loading ? 'Preparando...' : `Preparar ${documentType === 'voucher' ? 'Voucher' : 'Recibo'}`}
        </Button>

        <Button className="secondary" disabled={!canIssue || loading} onClick={onPreview}>
          <FaEye />
          Pré-visualizar
        </Button>

        <Button className="ghost" onClick={onSair} disabled={loading}>
          Sair
        </Button>
      </Actions>
    </Card>
  );
};
