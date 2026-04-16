// TabelaBoletos.js
import { useState } from 'react';
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
        return <p className="text-muted">Nenhum boleto encontrado para esta fatura.</p>;
    }

    return (
        <>
            <div className="boletos-table-container">
                <table className="boletos-table">
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
                            
                            const estaQuitado = boleto.QUITADO === "S" || (parcelaCorrespondente?.DT_BAIXA != null && boleto.STATUS_BOLETO === "A" && boleto.STATUS_BOLETO !== "C");
                            const estaCancelado = boleto.STATUS_BOLETO === "C";
                            const estaPendente = !estaQuitado && !estaCancelado && boleto.STATUS_BOLETO === "A";
                            
                            return (
                                <tr 
                                    key={idx} 
                                    className={estaCancelado ? "boleto-cancelado" : "boleto-linha"}
                                    onClick={() => handleRowClick(boleto, parcelaCorrespondente)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td className="documento-link">{boleto.DOCUMENTO || "N/A"}</td>
                                    <td>{boleto.NOME_COBRADO || "N/A"}</td>
                                    <td className="valor">{formatarValor(boleto.VALOR)}</td>
                                    <td>
                                        <span className={`vencimento ${vencBoleto.status}`}>
                                            {formatarData(boleto.DATA_VENCIMENTO)}
                                        </span>
                                    </td>
                                    <td>
                                        {renderStatusBadge([boleto], parcelaCorrespondente ? [parcelaCorrespondente] : [], boleto.STATUS_BOLETO)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <ModalBoleto 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                boleto={selectedBoleto}
                parcela={selectedBoleto?.parcela}
            />
        </>
    );
};