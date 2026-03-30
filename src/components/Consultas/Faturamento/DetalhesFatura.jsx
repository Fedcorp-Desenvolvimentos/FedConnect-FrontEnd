import { TabelaBoletos } from "./TabelaBoletos";
import { TabelaBaixas } from "./TabelaBaixas";
import { formatarData, formatarValor, formatarVigencia } from "./utils/formatacao";

export const DetalhesFatura = ({ fatura, obterNomeCedente, obterNomeCorretor }) => {
    return (
        <div className="expansion-content">
            <div className="expansion-header">
                <h6 className="section-title">
                    <i className="bi-info-circle me-2"></i>FATURA
                </h6>
            </div>

            <div className="info-grid">
                <div className="info-item">
                    <strong>Prêmio Bruto:</strong>
                    <span className="valor">{formatarValor(fatura.PREMIO_BRUTO)}</span>
                </div>

                <div className="info-item">
                    <strong>Prêmio Líquido:</strong>
                    <span className="valor">{formatarValor(fatura.PREMIO_LIQ)}</span>
                </div>

                <div className="info-item">
                    <strong>Corretor:</strong>
                    <span className="text-truncate">{obterNomeCorretor(fatura.CORRETOR)}</span>
                </div>

                <div className="info-item">
                    <strong>Corretor 2:</strong>
                    <span className="text-truncate">{obterNomeCorretor(fatura.CORRETOR2)}</span>
                </div>

                <div className="info-item">
                    <strong>Comissão (%):</strong>
                    <span className="valor">
                        {fatura.COMISSAO === null || fatura.COMISSAO === undefined
                            ? "-"
                            : `${formatarValor(fatura.COMISSAO, false)}%`}
                    </span>
                </div>

                <div className="info-item">
                    <strong>Comissão 2 (%):</strong>
                    <span className="valor">
                        {fatura.COMISSAO2 === null || fatura.COMISSAO2 === undefined
                            ? "-"
                            : `${formatarValor(fatura.COMISSAO2, false)}%`}
                    </span>
                </div>

                <div className="info-item">
                    <strong>Data Baixa:</strong>
                    <span>{formatarData(fatura.DT_BAIXA)}</span>
                </div>

                <div className="info-item">
                    <strong>Vigência:</strong>
                    <span>{formatarVigencia(fatura.DT_INI_VIG, fatura.DT_FIM_VIG)}</span>
                </div>

                <div className="info-item">
                    <strong>Cedente:</strong>
                    <span>{obterNomeCedente(fatura.CEDENTE)}</span>
                </div>

                {!!fatura.DT_CANCEL && (
                    <div className="info-item" style={{ gridColumn: "1 / -1" }}>
                        <strong>Cancelamento:</strong>
                        <span style={{ marginLeft: 8 }}>
                            {formatarData(fatura.DT_CANCEL)}
                            {!!fatura.OBS_CANCEL && (
                                <span style={{ marginLeft: 8, color: "#d21a1a" }}>
                                    ({fatura.OBS_CANCEL})
                                </span>
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* SEÇÃO DE BAIXA */}
            {fatura.BAIXAS && fatura.BAIXAS.length > 0 && (
                <div className="boletos-section">
                    <h6 className="section-title mt-3">
                        <i className="bi bi-check-circle"></i>
                        BAIXA
                    </h6>
                    <TabelaBaixas baixas={fatura.BAIXAS} />
                </div>
            )}

            {/* SEÇÃO DE BOLETOS */}
            {fatura.BOLETOS && fatura.BOLETOS.length > 0 && (
                <div className="boletos-section">
                    <h6 className="section-title mt-3">
                        <i className="bi-receipt me-2"></i>
                        BOLETOS ({fatura.QTD_BOLETOS})
                        {fatura.VALOR_TOTAL_BOLETOS > 0 && (
                            <span className="valor-total-boletos ms-2">
                                Total: {formatarValor(fatura.VALOR_TOTAL_BOLETOS)}
                            </span>
                        )}
                    </h6>
                    <TabelaBoletos boletos={fatura.BOLETOS} parcelas={fatura.PARCELAS} />
                </div>
            )}
        </div>
    );
};