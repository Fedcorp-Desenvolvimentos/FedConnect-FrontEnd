import React from 'react';
import * as S from "../styles/ConsultaFaturamentoStyles";

export const STATUS_MAP = {
    A: { label: "Ativa", status: "A" },
    C: { label: "Cancelada", status: "C" },
    P: { label: "Pendente", status: "P" },
    Q: { label: "Quitada", status: "Q" },
    N: { label: "Inativa", status: "N" },
};

const getStatusBoleto = (boleto, parcela) => {
    const quitado =
        boleto.QUITADO === "S" ||
        parcela?.DT_BAIXA != null;

    if (quitado) return "quitado";

    const cancelado =
        boleto.STATUS_BOLETO === "C" ||
        boleto.DT_CANCEL != null;

    if (cancelado) return "cancelado";

    return "pendente";
};

export const getStatusFatura = (boletos, parcelas) => {
    if (!boletos || boletos.length === 0) {
        return { label: "Sem Boletos", status: "sem-boletos" };
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

    if (qtdCancelados === total) {
        return { label: "Cancelada", status: "C" };
    }

    if (qtdQuitados === total) {
        return { label: "Quitada", status: "Q" };
    }

    if (qtdPendentes > 0 && (qtdQuitados > 0 || qtdCancelados > 0)) {
        return { label: "Parcial", status: "parcial" };
    }

    if (qtdPendentes > 0) {
        return { label: "Pendente", status: "P" };
    }

    return { label: "Processada", status: "processada" };
};

// Componente de badge estilizado
export const renderStatusBadge = (boletos, parcelas, statusFaturaOriginal) => {
    if (boletos && boletos.length > 0) {
        const status = getStatusFatura(boletos, parcelas);
        
        return (
            <S.StatusBadge $status={status.status}>
                {status.label}
            </S.StatusBadge>
        );
    }

    const status = STATUS_MAP[statusFaturaOriginal] || { label: "Desconhecido", status: "desconhecida" };

    return (
        <S.StatusBadge $status={status.status}>
            {status.label}
        </S.StatusBadge>
    );
};