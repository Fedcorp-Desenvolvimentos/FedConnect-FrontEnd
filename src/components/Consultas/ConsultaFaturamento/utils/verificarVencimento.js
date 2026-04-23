export const verificarVencimento = (vencimento) => {
    if (!vencimento) return { status: "desconhecido", label: "Data inválida" };
    try {
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const [ano, mes, dia] = String(vencimento).split("-").map(Number);
        const dataVenc = new Date(ano, mes - 1, dia, 0, 0, 0, 0);

        if (dataVenc < hoje) return { status: "vencido", label: "Vencido" };
        if (dataVenc.getTime() === hoje.getTime()) return { status: "hoje", label: "Vence hoje" };

        const diffDays = Math.ceil((dataVenc - hoje) / (1000 * 60 * 60 * 24));
        return { status: "pendente", label: `Vence em ${diffDays} dias` };
    } catch {
        return { status: "desconhecido", label: "Data inválida" };
    }
};
