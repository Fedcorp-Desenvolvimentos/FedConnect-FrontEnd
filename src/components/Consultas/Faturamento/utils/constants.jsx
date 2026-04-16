export const STATUS_MAP = {
    A: { label: "Ativa", className: "status-ativa" },
    C: { label: "Cancelada", className: "status-cancelada" },
    P: { label: "Pendente", className: "status-pendente" },
    Q: { label: "Quitada", className: "status-quitada" },
    N: { label: "Inativa", className: "status-inativa" },
};

const getStatusBoleto = (boleto, parcela) => {
    const cancelado =
        boleto.STATUS_BOLETO === "C" ||
        boleto.DT_CANCEL != null;

    if (cancelado) return "cancelado";

    const quitado =
        boleto.QUITADO === "S" ||
        parcela?.DT_BAIXA != null;

    if (quitado) return "quitado";

    return "pendente";
};

export const getStatusFatura = (boletos, parcelas) => {
    if (!boletos || boletos.length === 0) {
        return { label: "Sem Boletos", className: "status-sem-boletos" };
    }

    const statusBoletos = boletos.map((boleto) => {
        const parcela = parcelas?.find(
            p => p.DOCUMENTO === boleto.DOCUMENTO
        );

        return getStatusBoleto(boleto, parcela);
    });

    const total = statusBoletos.length;

    const qtdCancelados = statusBoletos.filter(s => s === "cancelado").length;
    const qtdQuitados = statusBoletos.filter(s => s === "quitado").length;
    const qtdPendentes = statusBoletos.filter(s => s === "pendente").length;

    // 🔥 regras determinísticas

    if (qtdCancelados === total) {
        return { label: "Cancelada", className: "status-cancelada" };
    }

    if (qtdQuitados === total) {
        return { label: "Quitada", className: "status-quitada" };
    }

    // mistura (cenário real do teu exemplo)
    if (qtdPendentes > 0 && (qtdQuitados > 0 || qtdCancelados > 0)) {
        return { label: "Parcial", className: "status-parcial" };
    }

    if (qtdPendentes > 0) {
        return { label: "Pendente", className: "status-pendente" };
    }

    // fallback (não deveria acontecer)
    return { label: "Ativa", className: "status-ativa" };
};

export const renderStatusBadge = (boletos, parcelas, statusFaturaOriginal) => {
    if (boletos && boletos.length > 0) {
        const status = getStatusFatura(boletos, parcelas);

        return (
            <span className={`status-badge ${status.className}`}>
                {status.label}
            </span>
        );
    }

    const info =
        STATUS_MAP[statusFaturaOriginal] ||
        { label: "Desconhecido", className: "status-desconhecida" };

    return (
        <span className={`status-badge ${info.className}`}>
            {info.label}
        </span>
    );
};