// components/Faturamento/ModalBoleto.jsx
import React from 'react';
import { FaTimes, FaReceipt } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import * as S from "./ConsultaFaturamentoStyles";
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";
import { renderStatusBadge } from './utils/constants';

export const ModalBoleto = ({ isOpen, onClose, boleto, parcela }) => {
    if (!boleto) return null;

    const vencBoleto = verificarVencimento(boleto.DATA_VENCIMENTO);
    
    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 1000
                }} />
                <Dialog.Content style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'white',
                    borderRadius: '24px',
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '90vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    zIndex: 1001,
                    animation: 'fadeIn 0.2s ease'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '1.25rem 1.5rem',
                        borderBottom: '1px solid #e2e8f0',
                        background: '#f8fafc'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '1.125rem',
                            fontWeight: 700,
                            color: '#0F3D5D',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <FaReceipt /> Detalhes do Boleto
                        </h3>
                        <Dialog.Close asChild>
                            <button style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#64748b',
                                padding: '0.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease'
                            }}>
                                <FaTimes size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    <div style={{
                        padding: '1.5rem',
                        overflowY: 'auto',
                        flex: 1
                    }}>
                        {/* Informações do Documento */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{
                                margin: '0 0 0.75rem 0',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: '#0F3D5D',
                                paddingBottom: '0.5rem',
                                borderBottom: '1px solid #e2e8f0'
                            }}>Informações do Documento</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Documento:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{boleto.DOCUMENTO || "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Nosso Número:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{boleto.NOSSO_NUMERO || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Dados do Cliente */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{
                                margin: '0 0 0.75rem 0',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: '#0F3D5D',
                                paddingBottom: '0.5rem',
                                borderBottom: '1px solid #e2e8f0'
                            }}>Dados do Cliente</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Nome:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{boleto.NOME_COBRADO || "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>CNPJ/CPF:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{boleto.CNPJ_COBRADO || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Informações Financeiras */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{
                                margin: '0 0 0.75rem 0',
                                fontSize: '0.875rem',
                                fontWeight: 700,
                                color: '#0F3D5D',
                                paddingBottom: '0.5rem',
                                borderBottom: '1px solid #e2e8f0'
                            }}>Informações Financeiras</h4>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                gap: '0.75rem'
                            }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Valor:</label>
                                    <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0F3D5D', fontFamily: 'monospace' }}>{formatarValor(boleto.VALOR)}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Parcela:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>{boleto.PARCELA_BOLETO ? boleto.PARCELA_BOLETO + "x" : "Não informado"}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Vencimento:</label>
                                    <span className={vencBoleto.status} style={{
                                        display: 'inline-block',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '20px',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        background: vencBoleto.status === 'vencido' ? '#fee2e2' : vencBoleto.status === 'proximo' ? '#fef3c7' : '#dcfce7',
                                        color: vencBoleto.status === 'vencido' ? '#dc2626' : vencBoleto.status === 'proximo' ? '#d97706' : '#16a34a'
                                    }}>
                                        {formatarData(boleto.DATA_VENCIMENTO)}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Status:</label>
                                    <span>{renderStatusBadge([boleto], parcela ? [parcela] : [], boleto.STATUS_BOLETO)}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Data Baixa:</label>
                                    <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1e293b' }}>
                                        {parcela?.DT_BAIXA ? formatarData(parcela.DT_BAIXA) : boleto.DT_CANCEL ? formatarData(boleto.DT_CANCEL) : "Não baixado"}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Linha Digitável:</label>
                                    <span style={{ fontSize: '0.75rem', wordBreak: 'break-all', color: '#1e293b' }}>{boleto.LINHA_DIGITAVEL || "Não informado"}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                    <label style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Código de Barras:</label>
                                    <span style={{ fontSize: '0.75rem', wordBreak: 'break-all', fontFamily: 'monospace', color: '#1e293b' }}>{boleto.CODIGO_BARRAS || "Não informado"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Ações */}
                        {boleto.LINK_BOLETO && (
                            <div>
                                <h4 style={{
                                    margin: '0 0 0.75rem 0',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    color: '#0F3D5D',
                                    paddingBottom: '0.5rem',
                                    borderBottom: '1px solid #e2e8f0'
                                }}>Ações</h4>
                                <a 
                                    href={boleto.LINK_BOLETO} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.75rem 1.5rem',
                                        background: 'linear-gradient(135deg, #0F3D5D 0%, #1a5a7a 100%)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: 600,
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    Visualizar Boleto
                                </a>
                            </div>
                        )}
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};