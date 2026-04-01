// TabelaBoletos.js
import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";

export const TabelaBoletos = ({ boletos, parcelas }) => { 
    if (!boletos || boletos.length === 0) {
        return <p className="text-muted">Nenhum boleto encontrado para esta fatura.</p>;
    }

    return (
        <div className="boletos-table-container">
            <table className="boletos-table">
                <thead>
                    <tr>
                        <th>Documento</th>
                        {/* <th>Nosso Número</th> */}
                        {/* <th>ID NFS-E</th> */}
                        <th>Nº Nota Fiscal</th>
                        <th>Nome Cobrado</th>
                        <th>CNPJ/CPF</th>
                        <th>Valor</th>
                        <th>Vencimento</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {boletos.map((boleto, idx) => {
                        const vencBoleto = verificarVencimento(boleto.DATA_VENCIMENTO);
                        
                        // Lógica para verificar se está quitado baseado nas parcelas
                        const parcelaCorrespondente = parcelas?.find(p => p.DOCUMENTO === boleto.DOCUMENTO);
                        const estaQuitado = parcelaCorrespondente && parcelaCorrespondente.DT_BAIXA !== null;
                        
                        return (
                            <tr key={idx} className={boleto.STATUS_BOLETO === "C" ? "boleto-cancelado" : ""}>
                                <td>{boleto.DOCUMENTO || "N/A"}</td>
                                {/* <td>{boleto.NOSSO_NUMERO || "N/A"}</td> */}
                                {/* <td>{boleto.ID_NFS_E || "N/A"}</td> */}
                                <td>{boleto.NUMERO_NOTA || "N/A"}</td>
                                <td>{boleto.NOME_COBRADO || "N/A"}</td>
                                <td className="cnpj">{boleto.CNPJ_COBRADO || "N/A"}</td>
                                <td className="valor">{formatarValor(boleto.VALOR)}</td>
                                <td>
                                    <span className={`vencimento ${vencBoleto.status}`}>
                                        {formatarData(boleto.DATA_VENCIMENTO)}
                                    </span>
                                </td>
                                <td>
                                    {estaQuitado ? (  // ← usar a lógica correta
                                        <span className="status-badge status-quitada">Quitado</span>
                                    ) : boleto.STATUS_BOLETO === "C" ? (
                                        <span className="status-badge status-cancelada">Cancelado</span>
                                    ) : (
                                        <span className="status-badge status-pendente">Pendente</span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};