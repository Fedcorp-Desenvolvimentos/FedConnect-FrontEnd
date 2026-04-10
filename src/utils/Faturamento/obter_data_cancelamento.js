export const obterDataBaixaOuCancelamento = (fatura) => {
    if (fatura.DT_BAIXA) return fatura.DT_BAIXA;

    if (!fatura.BOLETOS || fatura.BOLETOS.length === 0) return null;

    const boletosCancelados = fatura.BOLETOS
        .filter(b => b.DT_CANCEL);

    if (boletosCancelados.length === 0) return null;

    // pega o mais recente
    const maisRecente = boletosCancelados.reduce((acc, curr) => {
        return new Date(curr.DT_CANCEL) > new Date(acc.DT_CANCEL) ? curr : acc;
    });

    return maisRecente.DT_CANCEL;
};