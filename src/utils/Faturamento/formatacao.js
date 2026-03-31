export const formatarData = (dataString) => {
    if (!dataString) return "-";
    try {
        let data;
        if (String(dataString).includes("T")) {
            data = new Date(dataString);
        } else {
            const [year, month, day] = String(dataString).split("-");
            if (!year || !month || !day) return "-";
            data = new Date(Number(year), Number(month) - 1, Number(day));
        }
        if (Number.isNaN(data.getTime())) return "-";
        return data.toLocaleDateString("pt-BR");
    } catch {
        return "-";
    }
};

export const formatarValor = (valor, asCurrency = true) => {
    if (valor === null || valor === undefined || valor === "") return "-";
    const num = Number(valor);
    if (Number.isNaN(num)) return "-";
    if (!asCurrency) {
        return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

export const formatarVigencia = (dataInicio, dataFim) => `${formatarData(dataInicio)} até ${formatarData(dataFim)}`;

