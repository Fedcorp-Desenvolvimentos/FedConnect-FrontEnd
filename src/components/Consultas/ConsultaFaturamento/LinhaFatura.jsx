// components/Faturamento/LinhaFatura.jsx
import React from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import * as S from "./styles/ConsultaFaturamentoStyles";
import { formatarData } from "../../../utils/Faturamento/formatarData";
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { renderStatusBadge } from "./utils/constants";
import { DetalhesFatura } from "./DetalhesFatura";

// Mapeamento de status para classes CSS
const getStatusClass = (status) => {
    const statusMap = {
        'vencido': 'vencido',
        'hoje': 'vencido',
        'pendente': 'proximo',
        'proximo': 'proximo',
        'ok': 'ok',
        'desconhecido': 'desconhecido'
    };
    return statusMap[status] || 'desconhecido';
};

export const LinhaFatura = ({ fatura, index, isExpanded, toggleExpandRow, obterNomeCedente, obterNomeCorretor, onSyncComplete }) => {
    const venc = verificarVencimento(fatura.VENCIMENTO);
    const statusClass = getStatusClass(venc.status);

    return (
        <React.Fragment>
            <S.TableRow 
                onClick={() => toggleExpandRow(index)}
                className={isExpanded ? "expanded" : ""}
            >
                <td style={{ textAlign: "center", width: "40px" }}>
                    {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </td>
                <td><S.FaturaNumero>#{fatura.FATURA}</S.FaturaNumero></td>
                <td>{fatura.APOLICE || "-"}</td>
                <td style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {fatura.NOME_ADMINISTRADORA || "-"}
                </td>
                <td>{formatarData(fatura.DATA_FAT)}</td>
                <td>{renderStatusBadge(fatura.BOLETOS, fatura.PARCELAS, fatura.STATUS)}</td>
                <td>
                    <S.VencimentoSpan className={statusClass}>
                        {venc.label}
                    </S.VencimentoSpan>
                </td>
            </S.TableRow>

            {isExpanded && (
                <tr>
                    <td colSpan="7" style={{ padding: 0 }}>
                        <S.ExpandedContent>
                            <DetalhesFatura
                                fatura={fatura}
                                obterNomeCedente={obterNomeCedente}
                                obterNomeCorretor={obterNomeCorretor}
                                onSyncComplete={onSyncComplete}
                            />
                        </S.ExpandedContent>
                    </td>
                </tr>
            )}
        </React.Fragment>
    );
};