import React, { useMemo } from 'react';
import { FaPercentage, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';

import {
    RetentionCard,
    CardHeader,
    RetentionStats,
    RetentionOptionList,
    RetentionOption,
    RetentionStatus
} from '../ComissoesStyles';
import { getComissaoKey } from '../hooks/useComissoes';

const RETENTION_OPTIONS = [
    { id: 'iss', label: 'ISS', rate: 0.02 },
    { id: 'ir', label: 'IR', rate: 0.015 },
    { id: 'cofins', label: 'COFINS', rate: 0.03 },
    { id: 'csll', label: 'CSLL', rate: 0.01 },
    { id: 'pis', label: 'PIS', rate: 0.0065 },
    { id: 'inss', label: 'INSS', rate: 0.11 },
];

// Impostos que vêm PRÉ-SELECIONADOS por padrão
const DEFAULT_SELECTED = ['pis', 'cofins', 'csll'];

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
    loading,
    selectedComissoes,
    documentType
}) {
    const isRecibo = documentType === 'recibo';
    const isIsento = retencoesVerificadas?.isIsento || false;
    const motivo = retencoesVerificadas?.motivo || '';
    const detalhesRetencoes = retencoesVerificadas?.detalhesRetencoes || {};
    const regimeInfo = retencoesVerificadas?.regimeInfo;

    // CALCULA O TOTAL BRUTO DAS COMISSÕES SELECIONADAS
    const totalBrutoSelecionado = useMemo(() => {
        if (!comissoes || !selectedComissoes || selectedComissoes.size === 0) return 0;
        
        return comissoes
            .filter(c => selectedComissoes.has(getComissaoKey(c)))
            .reduce((sum, c) => sum + Number(c.VALOR || c.valor || 0), 0);
    }, [comissoes, selectedComissoes]);

    // CALCULA AS RETENÇÕES COM BASE NO TOTAL BRUTO REAL
    const retencoesCalculadas = useMemo(() => {
        const result = {};
        const grossTotal = totalBrutoSelecionado;
        
        RETENTION_OPTIONS.forEach(item => {
            const isAplicavel = detalhesRetencoes[item.id]?.aplicavel || false;
            
            // RECIBO: nenhum imposto (desabilitado)
            // ISENTO: nenhum imposto (desabilitado)
            // VOUCHER: marca se estiver no selectedRetentions
            const checked = !isRecibo && !isIsento && selectedRetentions.includes(item.id);
            
            result[item.id] = {
                ...item,
                checked: checked,
                valor: checked ? grossTotal * item.rate : 0,
                isAutomatic: DEFAULT_SELECTED.includes(item.id) && !isIsento && !isRecibo,
                isIsento: isIsento,
                isRecibo: isRecibo,
                aplicavel: isAplicavel,
                isDefault: DEFAULT_SELECTED.includes(item.id),
            };
        });
        
        return result;
    }, [totalBrutoSelecionado, selectedRetentions, detalhesRetencoes, isIsento]);

    // CALCULA OS TOTAIS REAIS
    const totaisReais = useMemo(() => {
        const grossTotal = totalBrutoSelecionado;
        const retentionTotal = Object.values(retencoesCalculadas)
            .filter(r => r.checked)
            .reduce((sum, r) => sum + r.valor, 0);
        
        return {
            grossTotal,
            retentionTotal,
            netTotal: grossTotal - retentionTotal
        };
    }, [totalBrutoSelecionado, retencoesCalculadas]);

    // DEFINE O STATUS
    let statusText = '';
    let statusColor = '';
    let statusBg = '';
    
    if (isRecibo) {
        statusText = '📄 Recibo - Nenhum imposto será gerado no PDF';
        statusColor = '#6A1B9A';
        statusBg = '#F3E5F5';
    } else if (retencoesVerificadas) {
        if (isIsento) {
            statusText = `✅ ${motivo || 'Isento de retenções'}`;
            statusColor = '#2E7D32';
            statusBg = '#E8F5E9';
        } else if (regimeInfo?.temIR) {
            statusText = '⚠️ Retenções completas (PIS, COFINS, CSLL, IR)';
            statusColor = '#C62828';
            statusBg = '#FFEBEE';
        } else {
            statusText = '📋 Retenções aplicadas (PIS, COFINS, CSLL)';
            statusColor = '#1565C0';
            statusBg = '#E3F2FD';
        }
    }

    const mostrarValores = totalBrutoSelecionado > 0 && !isIsento && !isRecibo;

    return (
        <RetentionCard>
            <CardHeader>
                <div>
                    <FaPercentage />
                    <h2>Retenções</h2>
                    <span>Aplicadas sobre o total selecionado</span>
                </div>
                
                {!isRecibo && hasResults && comissoes.length > 0 && selectedComissoes?.size > 0 && (
                    <button 
                        onClick={onVerificarRetencoes}
                        disabled={loading}
                        style={{
                            background: '#2b6cb0',
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
                        Verificar
                    </button>
                )}
            </CardHeader>

            {retencoesVerificadas && statusText && (
                <RetentionStatus style={{ 
                    backgroundColor: statusBg,
                    borderColor: statusColor,
                    color: statusColor
                }}>
                    <FaInfoCircle />
                    <span>{statusText}</span>
                </RetentionStatus>
            )}

            <RetentionStats>
                <div>
                    <span>Bruto</span>
                    <strong>{formatMoney(totaisReais.grossTotal)}</strong>
                </div>
                <div className="retained">
                    <span>Retido</span>
                    <strong>{isIsento ? formatMoney(0) : formatMoney(totaisReais.retentionTotal)}</strong>
                </div>
                <div className="net" style={{ gridColumn: '1 / -1' }}>
                    <span>Líquido a repassar</span>
                    <strong>{formatMoney(totaisReais.netTotal)}</strong>
                </div>
            </RetentionStats>

            <RetentionOptionList>
                {RETENTION_OPTIONS.map((item) => {
                    const retention = retencoesCalculadas[item.id];
                    const checked = retention?.checked || false;
                    const value = retention?.valor || 0;
                    const isAutomatic = retention?.isAutomatic || false;
                    const isDefault = retention?.isDefault || false;
                    const aplicavel = retention?.aplicavel || false;

                    return (
                        <RetentionOption 
                            key={item.id} 
                            checked={checked}
                            isAutomatic={isAutomatic}
                            isIsento={isIsento}
                            style={{
                                opacity: (isIsento || isRecibo) ? 0.7 : 1,
                                backgroundColor: isAutomatic && !isIsento && !isRecibo ? '#E3F2FD' : 
                                                ((isIsento || isRecibo) ? '#F5F5F5' : undefined),
                                borderColor: isAutomatic && !isIsento && !isRecibo ? '#90CAF9' :
                                            ((isIsento || isRecibo) ? '#E0E0E0' : undefined),
                                cursor: (isIsento || isRecibo) ? 'default' : 'pointer',
                            }}
                        >
                            <span className="left">
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggleRetention(item.id)}
                                    disabled={isIsento || isRecibo}
                                    style={{ 
                                        accentColor: '#2b6cb0',
                                        cursor: (isIsento || isRecibo) ? 'default' : 'pointer'
                                    }}
                                />
                                <span className="name">{item.label}</span>
                                <span className="rate">{formatRate(item.rate)}</span>
                                {isRecibo && (
                                    <span style={{ 
                                        fontSize: '9px', 
                                        background: '#6A1B9A', 
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '3px',
                                        marginLeft: '4px'
                                    }}>
                                        Recibo
                                    </span>
                                )}
                                {!isRecibo && isDefault && !isIsento && (
                                    <span style={{ 
                                        fontSize: '9px', 
                                        background: '#2b6cb0', 
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '3px',
                                        marginLeft: '4px'
                                    }}>
                                        Auto
                                    </span>
                                )}
                                {!isRecibo && isIsento && (
                                    <span style={{ 
                                        fontSize: '9px', 
                                        background: '#4CAF50', 
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '3px',
                                        marginLeft: '4px'
                                    }}>
                                        Isento
                                    </span>
                                )}
                                {!isIsento && !isRecibo && !isDefault && !checked && (
                                    <span style={{ 
                                        fontSize: '9px', 
                                        color: '#999',
                                        marginLeft: '4px'
                                    }}>
                                        (opcional)
                                    </span>
                                )}
                            </span>
                            <span className="amount">
                                {checked && mostrarValores ? `- ${formatMoney(value)}` : formatMoney(0)}
                            </span>
                        </RetentionOption>
                    );
                })}
            </RetentionOptionList>
        </RetentionCard>
    );
}
