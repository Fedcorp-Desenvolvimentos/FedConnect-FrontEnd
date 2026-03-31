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