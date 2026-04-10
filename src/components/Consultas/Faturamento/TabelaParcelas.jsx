import { verificarVencimento } from "../../../utils/Faturamento/verificarVencimento";
import { formatarValor } from "../../../utils/Faturamento/formatarValor";
import { formatarData } from "../../../utils/Faturamento/formatarData";

export const TabelaParcelas = ({ parcelas }) => {
    if (!parcelas || parcelas.length === 0) {
        return <p className="text-muted">Nenhuma parcela encontrada para esta fatura.</p>;
    }

    return (
        <div className="parcelas-table-container">
            <table className="parcelas-table">
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
                        // console.log("vencParcela", vencParcela)
                        // console.log("VENCIMENTO", parcela.VENCIMENTO)
                        return (
                            <tr key={idx} className={parcela.STATUS === "C" ? "parcela-cancelada" : ""}>
                                <td className="text-center">{parcela.NUMERO_PARCELA || "-"}</td>
                                <td>{parcela.DOCUMENTO || "-"}</td>
                                <td className="valor">{formatarValor(parcela.VALOR)}</td>
                                <td>
                                    <span className={`vencimento ${vencParcela.status}`}>
                                        {formatarData(parcela.VENCIMENTO)}
                                    </span>
                                </td>
                                
                                <td>{formatarData(parcela.DT_BAIXA)}</td>
                                <td className="text-truncate" style={{ maxWidth: "150px" }}>
                                    {parcela.OBS || "-"}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};