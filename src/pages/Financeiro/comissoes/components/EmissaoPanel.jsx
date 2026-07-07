// components/EmissaoPanel.jsx
import React from 'react';
import { FaPrint, FaEye, FaSpinner } from 'react-icons/fa';
import {
  Card,
  CardHeader,
  EmissaoOptions,
  EmissionResult,
  Actions,
  Button,
} from '../ComissoesStyles';

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

// Função para verificar se todas as comissões selecionadas estão baixadas
const areAllSelectedBaixadas = (selectedComissoes, comissoes) => {
  if (selectedComissoes.size === 0 || comissoes.length === 0) return false;
  
  // Filtra as comissões selecionadas
  const selectedItems = comissoes.filter(c => {
    const key = getComissaoKey(c);
    return selectedComissoes.has(key);
  });

  // Verifica se todas têm status "baixada" ou "baixadas"
  return selectedItems.every(c => {
    const status = c.STATUS?.toLowerCase() || c.status?.toLowerCase() || '';
    return status === 'baixada' || status === 'baixadas';
  });
};

// Função auxiliar para gerar a chave da comissão (mesma lógica do useComissoes)
const getComissaoKey = (c) => {
  const documento = c.DOCUMENTO ?? '';
  const favor = c.FAVOR ?? '';
  const tipo = c.TIPO ?? '';
  const parcela = c.PARCELA ?? '1';
  const valor = Number(c.VALOR ?? 0).toFixed(2);
  return [documento, favor, tipo, parcela, valor].join('|');
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
  selectedComissoes, // Adicionado
  comissoes, // Adicionado
}) => {
  // Verifica se todas as comissões selecionadas estão baixadas
  const allSelectedBaixadas = areAllSelectedBaixadas(selectedComissoes, comissoes);
  
  // Determina o texto do botão
  const getButtonText = () => {
    if (loading) return 'Preparando...';
    if (documentType === 'voucher') return 'Emitir Voucher';
    if (allSelectedBaixadas && documentType === 'recibo') {
      // Se for recibo e todas estiverem baixadas, mostra "Reemitir Recibo"
      return 'Reemitir Recibo';
    }
    return `Emitir ${documentType === 'voucher' ? 'Voucher' : 'Recibo'}`;
  };

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
            <option value="voucher">Voucher</option>
          </select>
        </label>
        
        {/* Indicador visual do status */}
        {documentType === 'recibo' && totals.count > 0 && (
          <span style={{ 
            fontSize: '12px', 
            color: allSelectedBaixadas ? '#1f9d55' : '#dd6b20',
            fontWeight: '600',
            marginLeft: '8px'
          }}>
            {allSelectedBaixadas ? '✓ Todas baixadas' : '⚠️ Com pendentes'}
          </span>
        )}
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

      {/* Mensagem informativa sobre reemissão */}
      {allSelectedBaixadas && documentType === 'recibo' && totals.count > 0 && (
        <div
          style={{
            marginBottom: '4px',
            padding: '10px 12px',
            borderRadius: '9px',
            background: '#ebf8ff',
            border: '1px solid #bee3f8',
            color: '#2b6cb0',
            fontSize: '12.5px',
          }}
        >
          ℹ️ As comissões selecionadas já estão baixadas. Você está reemitindo os recibos.
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
          disabled={!canIssue || loading}
          onClick={onEmitir}
        >
          {loading ? <FaSpinner className="spin" /> : <FaPrint />}
          {getButtonText()}
        </Button>

        <Button 
          className="secondary block" 
          disabled={!canIssue || loading || documentType === 'voucher'} 
          onClick={onPreview}
        >
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