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
import { EMPRESAS_PAGADORAS } from '../constants/empresasPagadoras';

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
  loadingPreview = false,
  loading = false,
  empresaPagadora = null,
  empresaPagadoraTipo = null,
  tiposMistos = false,
  onEmpresaPagadoraChange = () => {},
}) => {
  const empresaObrigatoria = documentType === 'voucher' && tiposMistos && !empresaPagadoraTipo;

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

        {documentType === 'voucher' && (
          <label>
            Empresa pagadora (Recebemos de)
            <select
              value={empresaPagadoraTipo || ''}
              onChange={(e) => onEmpresaPagadoraChange(e.target.value || null)}
              style={empresaObrigatoria ? { borderColor: '#e53e3e' } : undefined}
            >
              <option value="">
                {empresaPagadora
                  ? `Automático — ${empresaPagadora.label}`
                  : tiposMistos
                    ? 'Selecione a empresa...'
                    : 'Automático (pelo tipo da comissão)'}
              </option>
              {EMPRESAS_PAGADORAS.map((e) => (
                <option key={e.tipo} value={e.tipo}>{e.label} — {e.cnpj}</option>
              ))}
            </select>
          </label>
        )}
      </EmissaoOptions>

      {empresaObrigatoria && (
        <div
          style={{
            marginBottom: '4px',
            padding: '10px 12px',
            borderRadius: '9px',
            background: '#fff5f5',
            border: '1px solid #feb2b2',
            color: '#c53030',
            fontSize: '12.5px',
          }}
        >
          As comissões selecionadas são de empresas diferentes — escolha a empresa
          pagadora para liberar a emissão do voucher.
        </div>
      )}

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
          disabled={!canIssue || loadingPreview || loading}
          onClick={onPreview}
        >
          <FaEye />
          {loadingPreview ? 'Carregando...' : 'Pré-visualizar'}
        </Button>

        <Button
          className="success block"
          disabled={!canIssue || loadingPreview || loading}
          onClick={onEmitir}
        >
          <FaPrint />
          {loading
            ? 'Emitindo...'
            : `Emitir ${documentType === 'voucher' ? 'Voucher' : 'Recibo'}`}
        </Button>

        <Button className="ghost block" onClick={onSair}>
          Sair
        </Button>
      </Actions>
    </Card>
  );
};