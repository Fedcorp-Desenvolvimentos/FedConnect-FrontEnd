// components/Faturamento/DetalhesFatura.jsx
import React, { useState } from 'react';
import { FaReceipt, FaFileInvoiceDollar, FaSync } from 'react-icons/fa';
import * as S from "./styles/ConsultaFaturamentoStyles";
import { formatarData, formatarValor, formatarVigencia } from "./utils/formatacao";
import { TabelaBoletos } from "./TabelaBoletos";
import { sincronizarBoletos } from "../../../services/boletofedbnk";

export const DetalhesFatura = ({ fatura, obterNomeCedente, obterNomeCorretor, onSyncComplete }) => {
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncResult, setSyncResult] = useState(null);

    const handleSincronizar = async () => {
        if (!fatura.FATURA) return;

        setSyncLoading(true);
        setSyncResult(null);

        try {
            const resultado = await sincronizarBoletos(fatura.FATURA);
            setSyncResult(resultado);

            if (resultado.total_atualizados > 0 && onSyncComplete) {
                onSyncComplete();
            }
        } catch (error) {
            setSyncResult({ erro: error.response?.data?.erro || "Erro ao sincronizar boletos" });
        } finally {
            setSyncLoading(false);
        }
    };

    // Dados para os cards
    const infoItems = [
        { label: "Prêmio Bruto", value: formatarValor(fatura.PREMIO_BRUTO), highlight: true },
        { label: "Prêmio Líquido", value: formatarValor(fatura.PREMIO_LIQ), highlight: true },
        { label: "Nome cobrado", value: obterNomeCorretor(fatura.NOME_ADMINISTRADORA) },
        { label: "CNPJ Cobrado", value: obterNomeCorretor(fatura.CNPJ_ADMINISTRADORA) },
        { label: "Corretor", value: obterNomeCorretor(fatura.CORRETOR) },
        { label: "Corretor 2", value: obterNomeCorretor(fatura.CORRETOR2) },
        { label: "Comissão (%)", value: fatura.COMISSAO ? `${formatarValor(fatura.COMISSAO, false)}%` : "-", highlight: true },
        { label: "Comissão 2 (%)", value: fatura.COMISSAO2 ? `${formatarValor(fatura.COMISSAO2, false)}%` : "-", highlight: true },
        { label: "Vigência", value: formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG) },
        { label: "Cedente", value: obterNomeCedente(fatura.CEDENTE) },
    ];

    return (
        <div>
            <S.SectionTitle>
                <FaFileInvoiceDollar /> FATURA
            </S.SectionTitle>

            {/* Desktop: Cards */}
            <S.DesktopCardsGrid>
                {infoItems.map((item, idx) => (
                    <S.InfoCardDesktop key={idx}>
                        <div className="card-label">{item.label}</div>
                        <div className={item.highlight ? "card-value-highlight" : "card-value"}>
                            {item.value || "-"}
                        </div>
                    </S.InfoCardDesktop>
                ))}
                
                {/* Cancelamento em card separado se existir */}
                {!!fatura.DT_CANCEL && (
                    <S.InfoCardDesktop>
                        <div className="card-label">Cancelamento</div>
                        <div className="card-value">
                            {formatarData(fatura.DT_CANCEL)}
                            {fatura.OBS_CANCEL && <span style={{ marginLeft: 8, color: "#dc2626" }}>({fatura.OBS_CANCEL})</span>}
                        </div>
                    </S.InfoCardDesktop>
                )}
            </S.DesktopCardsGrid>

            {/* Mobile: Linhas */}
            <S.MobileInfoList>
                {infoItems.map((item, idx) => (
                    <S.InfoItem key={idx}>
                        <strong>{item.label}:</strong>
                        <span className={item.highlight ? "valor" : ""}>{item.value || "-"}</span>
                    </S.InfoItem>
                ))}
                
                {!!fatura.DT_CANCEL && (
                    <S.InfoItem>
                        <strong>Cancelamento:</strong>
                        <span>
                            {formatarData(fatura.DT_CANCEL)}
                            {fatura.OBS_CANCEL && <span style={{ marginLeft: 8, color: "#dc2626" }}>({fatura.OBS_CANCEL})</span>}
                        </span>
                    </S.InfoItem>
                )}
            </S.MobileInfoList>

            {/* BOLETOS */}
            {fatura.BOLETOS && fatura.BOLETOS.length > 0 && (
                <div style={{ marginTop: "1.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                        <S.SectionTitle>
                            <FaReceipt /> BOLETOS ({fatura.QTD_BOLETOS})
                            {fatura.VALOR_TOTAL_BOLETOS > 0 && (
                                <span style={{ marginLeft: 8, fontSize: "0.75rem" }}>
                                    Total: {formatarValor(fatura.VALOR_TOTAL_BOLETOS)}
                                </span>
                            )}
                        </S.SectionTitle>

                        <S.Button 
                            $secondary 
                            onClick={handleSincronizar} 
                            disabled={syncLoading}
                            style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
                        >
                            <FaSync className={syncLoading ? "rb-spin" : ""} style={{ animation: syncLoading ? "spin 1s linear infinite" : "none" }} />
                            {syncLoading ? "Sincronizando..." : "Sincronizar Boletos"}
                        </S.Button>
                    </div>

                    {/* Resultado da sincronização */}
                    {syncResult && (
                        <div style={{ 
                            marginTop: "0.75rem", 
                            padding: "0.75rem", 
                            borderRadius: "8px", 
                            fontSize: "0.75rem",
                            background: syncResult.erro ? "#fef2f2" : "#f0fdf4",
                            border: syncResult.erro ? "1px solid #fecaca" : "1px solid #bbf7d0",
                            color: syncResult.erro ? "#dc2626" : "#16a34a"
                        }}>
                            {syncResult.erro ? (
                                <span>Erro: {syncResult.erro}</span>
                            ) : (
                                <span>
                                    {syncResult.total_atualizados > 0 && `${syncResult.total_atualizados} boleto(s) atualizado(s)`}
                                    {syncResult.total_erros > 0 && ` | ${syncResult.total_erros} erro(s)`}
                                    {syncResult.total_atualizados === 0 && syncResult.total_erros === 0 && "Nenhum boleto precisou ser atualizado"}
                                </span>
                            )}
                        </div>
                    )}

                    <TabelaBoletos boletos={fatura.BOLETOS} parcelas={fatura.PARCELAS} />
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};
