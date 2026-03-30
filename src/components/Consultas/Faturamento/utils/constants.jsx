export const STATUS_MAP = {
    A: { label: "Ativa", className: "status-ativa" },
    C: { label: "Cancelada", className: "status-cancelada" },
    P: { label: "Pendente", className: "status-pendente" },
    Q: { label: "Quitada", className: "status-quitada" },
    N: { label: "Inativa", className: "status-inativa" },
};

export const renderStatusBadge = (status, boletos) => {
    const temQuitado = boletos?.some(b => b.QUITADO === "S");
    if (temQuitado) {
        return <span className="status-badge status-quitada">Quitada</span>;
    }
    const info = STATUS_MAP[status] || { label: "Desconhecido", className: "status-desconhecida" };
    return <span className={`status-badge ${info.className}`}>{info.label}</span>;
};