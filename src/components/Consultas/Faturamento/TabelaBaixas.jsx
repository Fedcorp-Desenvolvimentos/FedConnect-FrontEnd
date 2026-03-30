import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";

export const TabelaBaixas = ({ baixas }) => {
    if (!baixas || baixas.length === 0) {
        return <p className="text-muted">Nenhuma baixa encontrada para esta fatura.</p>;
    }

    return (
        <div className="baixas-table-container">
            <table className="baixas-table">
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
                                {baixa.STATUS === "B" ? (
                                    <span className="status-badge status-baixada">Baixada</span>
                                ) : (
                                    <span className="status-badge status-pendente">Pendente</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};