// components/Faturamento/TabelaBoletos.jsx
import React, { useState } from 'react';
import * as S from "./ConsultaFaturamentoStyles";
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";
import { ModalBoleto } from './ModalBoleto';
import { renderStatusBadge } from './utils/constants';

export const TabelaBoletos = ({ boletos, parcelas }) => {
    const [selectedBoleto, setSelectedBoleto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRowClick = (boleto, parcela) => {
        setSelectedBoleto({ ...boleto, parcela });
        setIsModalOpen(true);
    };

    if (!boletos || boletos.length === 0) {
        return <p style={{ color: "#64748b", fontSize: "0.75rem", textAlign: "center", padding: "1rem" }}>
            Nenhum boleto encontrado para esta fatura.
        </p>;
    }

    return (
        <>
            <S.SubTable>
                <table>
                    <thead>
                        <tr>
                            <th>Documento</th>
                            <th>Nome</th>
                            <th>Valor</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {boletos.map((boleto, idx) => {
                            const vencBoleto = verificarVencimento(boleto.DATA_VENCIMENTO);
                            const parcelaCorrespondente = parcelas?.find(p => p.DOCUMENTO === boleto.DOCUMENTO);
                            
                            return (
                                <tr 
                                    key={idx} 
                                    onClick={() => handleRowClick(boleto, parcelaCorrespondente)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td style={{ fontWeight: "500", color: "#0F3D5D" }}>
                                        {boleto.DOCUMENTO || "N/A"}
                                    </td>
                                    <td style={{ maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {boleto.NOME_COBRADO || "N/A"}
                                    </td>
                                    <td className="valor">{formatarValor(boleto.VALOR)}</td>
                                    <td>
                                        <S.VencimentoSpan className={vencBoleto.status}>
                                            {formatarData(boleto.DATA_VENCIMENTO)}
                                        </S.VencimentoSpan>
                                    </td>
                                    <td>
                                        {renderStatusBadge([boleto], parcelaCorrespondente ? [parcelaCorrespondente] : [], boleto.STATUS_BOLETO)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </S.SubTable>

            <ModalBoleto 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                boleto={selectedBoleto}
                parcela={selectedBoleto?.parcela}
            />
        </>
    );
};