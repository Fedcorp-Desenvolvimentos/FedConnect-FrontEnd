export const formatarValor = (valor, asCurrency = true) => {
    if (valor === null || valor === undefined || valor === "") return "-";
    const num = Number(valor);
    if (Number.isNaN(num)) return "-";
    if (!asCurrency) {
        return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};