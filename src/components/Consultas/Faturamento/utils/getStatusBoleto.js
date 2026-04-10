// utils/Faturamento/getStatusBoleto.js

export const getStatusBoleto = (boleto, parcela = null, baixa = null) => {
    // 1. Cancelado (prioridade máxima)
    if (boleto.STATUS_BOLETO === "C") {
        return {
            status: 'cancelado',
            label: 'Cancelado',
            className: 'status-cancelado'
        };
    }

    // 2. Quitado - várias fontes possíveis
    const temBaixaParcela = parcela && parcela.DT_BAIXA;
    const temBaixaDireta = baixa && baixa.DT_BAIXA;
    const boletoMarcadoQuitado = boleto.QUITADO === "S";
    
    const estaQuitado = temBaixaParcela || temBaixaDireta || boletoMarcadoQuitado;
    
    if (estaQuitado) {
        return {
            status: 'quitado',
            label: 'Quitado',
            className: 'status-quitado'
        };
    }

    // 3. Pendente
    return {
        status: 'pendente',
        label: 'Pendente',
        className: 'status-pendente'
    };
};