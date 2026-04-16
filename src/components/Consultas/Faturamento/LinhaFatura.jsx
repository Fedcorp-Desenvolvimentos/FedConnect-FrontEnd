import React from "react";
import { formatarData } from "./utils/formatarData";
import { verificarVencimento } from "./utils/verificarVencimento";
import { renderStatusBadge } from "./utils/constants";
import { DetalhesFatura } from "./DetalhesFatura";
import { useFaturamento } from "./hooks/useFaturamento";

export const LinhaFatura = ({ fatura, index, isExpanded, toggleExpandRow }) => {
    const venc = verificarVencimento(fatura.VENCIMENTO);

    const {
        obterNomeCedente,
        obterNomeCorretor,
    } = useFaturamento();

    return (
        <>
            <tr
                onClick={() => toggleExpandRow(index)}
                className={`linha-clicavel ${isExpanded ? "expanded" : ""}`}
            >
                <td>
                    <i className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}></i>
                </td>

                <td>
                    <strong className="numero-fatura">
                        #{fatura.FATURA}
                    </strong>
                </td>

                <td>{fatura.APOLICE || "-"}</td>

                <td>
                    <div className="adm-info">
                        <span className="adm-nome">
                            {fatura.NOME_ADMINISTRADORA || "-"}
                        </span>
                    </div>
                </td>

                <td>{formatarData(fatura.DATA_FAT)}</td>

                <td>
                    {renderStatusBadge(fatura.BOLETOS, fatura.PARCELAS, fatura.STATUS)}
                </td>

                <td>
                    <span className={`vencimento ${venc.status}`}>
                        {formatarData(fatura.VENCIMENTO)}
                    </span>
                </td>
            </tr>

            {isExpanded && (
                <tr className="expanded-details">
                    <td colSpan="7">
                        <DetalhesFatura
                            fatura={fatura}
                            obterNomeCedente={obterNomeCedente}
                            obterNomeCorretor={obterNomeCorretor}
                        />
                    </td>
                </tr>
            )}
        </>
    );
};