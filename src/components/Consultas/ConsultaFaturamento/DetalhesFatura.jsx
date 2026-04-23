// components/Faturamento/DetalhesFatura.jsx
import React from 'react';
import { FaReceipt, FaFileInvoiceDollar } from 'react-icons/fa';
import * as S from "./ConsultaFaturamentoStyles";
import { formatarData, formatarValor, formatarVigencia } from "./utils/formatacao";
import { TabelaBoletos } from "./TabelaBoletos";

export const DetalhesFatura = ({ fatura, obterNomeCedente, obterNomeCorretor }) => {
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
                    <S.SectionTitle>
                        <FaReceipt /> BOLETOS ({fatura.QTD_BOLETOS})
                        {fatura.VALOR_TOTAL_BOLETOS > 0 && (
                            <span style={{ marginLeft: 8, fontSize: "0.75rem" }}>
                                Total: {formatarValor(fatura.VALOR_TOTAL_BOLETOS)}
                            </span>
                        )}
                    </S.SectionTitle>
                    <TabelaBoletos boletos={fatura.BOLETOS} parcelas={fatura.PARCELAS} />
                </div>
            )}
        </div>
    );
};