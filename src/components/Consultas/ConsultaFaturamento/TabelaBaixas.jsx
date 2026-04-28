// components/Faturamento/TabelaBaixas.jsx
import React from 'react';
import * as S from "./styles/ConsultaFaturamentoStyles";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";

export const TabelaBaixas = ({ baixas }) => {
    if (!baixas || baixas.length === 0) {
        return <p style={{ color: "#64748b", fontSize: "0.75rem", textAlign: "center", padding: "1rem" }}>
            Nenhuma baixa encontrada para esta fatura.
        </p>;
    }

    return (
        <S.SubTable>
            <table>
                <thead>
                    <tr>
                        <th>Documento</th>
                        <th>Valor</th>
                        <th>Data Baixa</th>
                        <th>Data Pagamento</th>
                        <th>Valor Pago</th>
                        <th>Depósito CC</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {baixas.map((baixa, idx) => (
                        <tr key={idx}>
                            <td>{baixa.DOCUMENTO || "-"}</td>
                            <td className="valor">{formatarValor(baixa.VALOR)}</td>
                            <td>{formatarData(baixa.DT_BAIXA)}</td>
                            <td>{formatarData(baixa.DT_PGTO)}</td>
                            <td className="valor">{formatarValor(baixa.VALOR_PGTO)}</td>
                            <td>{baixa.DEPOSITO_CC === "N" ? "Não" : "Sim"}</td>
                            <td>
                                <S.StatusBadge $status={baixa.STATUS === "B" ? "A" : "C"}>
                                    {baixa.STATUS === "B" ? "Baixada" : "Pendente"}
                                </S.StatusBadge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </S.SubTable>
    );
};