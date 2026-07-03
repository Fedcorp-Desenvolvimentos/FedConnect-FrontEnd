import React from 'react';
import { FaPrint, FaEye, FaSpinner } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  EmissaoOptions,
  EmissionResult,
  Actions,
  Button,
} from '../EmissaoRecibosVoucherStyles';

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
          <h2>Emissão</h2>
          <span>{totals?.count || 0} selecionada(s) · {formatMoney(totals?.netTotal || 0)}</span>
        </div>
      </CardHeader>

      <EmissaoOptions>
        <label>
          Tipo de documento
          <select value={documentType} onChange={(e) => onDocumentTypeChange(e.target.value)}>
            <option value="recibo">Recibo</option>
            <option value="recibo_corretor">Recibo do Corretor</option>
            <option value="voucher">Voucher</option>
          </select>
        </label>
      </EmissaoOptions>

      {!canIssue && (
        <div
          style={{
            marginBottom: '4px',
            padding: '10px 12px',
            borderRadius: '9px',
            background: '#fffaf0',
            border: '1px solid #fbd38d',
            color: '#975a16',
            fontSize: '12.5px',
          }}
        >
          Selecione ao menos uma comissão na lista para liberar a emissão.
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

      <Actions style={{ flexDirection: 'column' }}>
        <Button
          className="primary block"
          disabled={!canIssue || loading || documentType === 'voucher'}
          onClick={onEmitir}
        >
          {loading ? <FaSpinner className="spin" /> : <FaPrint />}
          {loading ? 'Preparando...' : `Emitir ${documentType === 'voucher' ? 'Voucher' : 'Recibo'}`}
        </Button>

        <Button className="secondary block" disabled={!canIssue || loading || documentType === 'voucher'} onClick={onPreview}>
          <FaEye />
          Pré-visualizar
        </Button>

        <Button className="ghost block" onClick={onSair} disabled={loading}>
          Sair
        </Button>
      </Actions>
    </Card>
  );
};