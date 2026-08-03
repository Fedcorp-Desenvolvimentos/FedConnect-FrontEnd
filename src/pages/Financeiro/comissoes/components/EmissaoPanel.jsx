// components/EmissaoPanel.jsx
import React from 'react';
import { FaEye, FaPrint } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  EmissaoOptions,
  Actions,
  Button,
} from '../ComissoesStyles';

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

export const EmissaoPanel = ({
  canIssue,
  documentType,
  totals,
  onDocumentTypeChange,
  onPreview,
  onEmitir,
  onSair,
}) => {
  return (
    <Card>
      <CardHeader>
        <div>
          <h2>Emissão</h2>
          <span>{totals?.count || 0} selecionada(s) · {formatMoney(totals?.netTotal || 0)}</span>
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

      <Actions style={{ flexDirection: 'column' }}>
        <Button
          className="primary block"
          disabled={!canIssue}
          onClick={onPreview}
        >
          <FaEye />
          Pré-visualizar
        </Button>

        <Button
          className="success block"
          disabled={!canIssue}
          onClick={onEmitir}
        >
          <FaPrint />
          Emitir {documentType === 'voucher' ? 'Voucher' : 'Recibo'}
        </Button>

        <Button className="ghost block" onClick={onSair}>
          Sair
        </Button>
      </Actions>
    </Card>
  );
};