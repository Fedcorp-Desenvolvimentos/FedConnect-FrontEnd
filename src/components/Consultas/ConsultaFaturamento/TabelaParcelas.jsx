// components/Faturamento/TabelaParcelas.jsx
import React from 'react';
import * as S from "./ConsultaFaturamentoStyles";
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";

export const TabelaParcelas = ({ parcelas }) => {
    if (!parcelas || parcelas.length === 0) {
        return <p style={{ color: "#64748b", fontSize: "0.75rem", textAlign: "center", padding: "1rem" }}>
            Nenhuma parcela encontrada para esta fatura.
        </p>;
    }

    return (
        <S.SubTable>
            <table>
                <thead>
                    <tr>
                        <th>Nº Parcela</th>
                        <th>Documento</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Data Baixa</th>
                        <th>Observação</th>
                    </tr>
                </thead>
                <tbody>
                    {parcelas.map((parcela, idx) => {
                        const vencParcela = verificarVencimento(parcela.VENCIMENTO);
                        return (
                            <tr key={idx}>
                                <td style={{ textAlign: "center" }}>{parcela.NUMERO_PARCELA || "-"}</td>
                                <td>{parcela.DOCUMENTO || "-"}</td>
                                <td className="valor">{formatarValor(parcela.VALOR)}</td>
                                <td>
                                    <S.VencimentoSpan className={vencParcela.status}>
                                        {formatarData(parcela.VENCIMENTO)}
                                    </S.VencimentoSpan>
                                </td>
                                <td>{formatarData(parcela.DT_BAIXA)}</td>
                                <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {parcela.OBS || "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </S.SubTable>
    );
};