import React, { useEffect } from 'react';
import { FaPercentage, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import {
  RetentionCard,
  CardHeader,
  RetentionStats,
  RetentionOptionList,
  RetentionOption,
  RetentionStatus,
  RetentionInfo
} from '../ComissoesStyles';

const RETENTION_OPTIONS = [
  { id: 'iss', label: 'ISS', rate: 0.02 },
  { id: 'ir', label: 'IR', rate: 0.015 },
  { id: 'cofins', label: 'COFINS', rate: 0.03 },
  { id: 'csll', label: 'CSLL', rate: 0.01 },
  { id: 'pis', label: 'PIS', rate: 0.0065 },
  { id: 'inss', label: 'INSS', rate: 0.11 },
];

const formatMoney = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const formatRate = (rate) => `${(rate * 100).toFixed(rate * 100 % 1 ? 2 : 0)}%`;

export function RetencoesPanel({ 
  selectedRetentions, 
  totals, 
  onToggleRetention, 
  hasResults, 
  comissoes,
  onVerificarRetencoes,
  retencoesVerificadas,
  loading 
}) {
  const hasAutomaticRetentions = retencoesVerificadas?.comissoes?.some(
    c => c.retencoes_calculadas?.aplicaveis?.length > 0
  );

  const getIsencaoMotivo = () => {
    if (!retencoesVerificadas?.comissoes) return null;
    
    const motivos = new Set();
    retencoesVerificadas.comissoes.forEach(c => {
      if (c.retencoes_calculadas?.motivo) {
        motivos.add(c.retencoes_calculadas.motivo);
      }
    });
    
    return Array.from(motivos).join('; ');
  };

  return (
    <RetentionCard>
      <CardHeader>
        <div>
          <FaPercentage />
          <h2>Retenções</h2>
          <span>Aplicadas sobre o total selecionado</span>
        </div>
        
        {hasResults && comissoes.length > 0 && (
          <button 
            onClick={onVerificarRetencoes}
            disabled={loading}
            style={{
              background: 'var(--navy-800)',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <FaCheckCircle />
            Verificar Retenções
          </button>
        )}
      </CardHeader>

      {retencoesVerificadas && !hasAutomaticRetentions && (
        <RetentionStatus>
          <FaInfoCircle />
          <span>
            {retencoesVerificadas.comissoes.length > 0 
              ? `Isento de retenções: ${getIsencaoMotivo() || 'Aplicam-se regras de isenção'}`
              : 'Nenhuma retenção aplicável'}
          </span>
        </RetentionStatus>
      )}

      <RetentionStats>
        <div>
          <span>Bruto</span>
          <strong>{formatMoney(totals.grossTotal)}</strong>
        </div>
        <div className="retained">
          <span>Retido</span>
          <strong>{formatMoney(totals.retentionTotal)}</strong>
        </div>
        <div className="net" style={{ gridColumn: '1 / -1' }}>
          <span>Líquido a repassar</span>
          <strong>{formatMoney(totals.netTotal)}</strong>
        </div>
      </RetentionStats>

      <RetentionOptionList>
        {RETENTION_OPTIONS.map((item) => {
          const checked = selectedRetentions.includes(item.id);
          const value = hasResults ? totals.grossTotal * item.rate : 0;
          
          const isAutomatic = retencoesVerificadas?.comissoes?.some(
            c => c.retencoes_calculadas?.aplicaveis?.some(r => r.tipo === item.id)
          );

          return (
            <RetentionOption key={item.id} checked={checked} isAutomatic={isAutomatic}>
              <span className="left">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggleRetention(item.id)}
                  disabled={isAutomatic}
                />
                <span className="name">{item.label}</span>
                <span className="rate">{formatRate(item.rate)}</span>
                {isAutomatic && <span className="auto-badge">Auto</span>}
              </span>
              <span className="amount">{checked ? `- ${formatMoney(value)}` : formatMoney(0)}</span>
            </RetentionOption>
          );
        })}
      </RetentionOptionList>
    </RetentionCard>
  );
}