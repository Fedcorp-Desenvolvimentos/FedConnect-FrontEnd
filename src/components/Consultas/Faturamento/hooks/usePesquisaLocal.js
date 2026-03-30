import { useState, useMemo, useEffect } from "react";
import { formatarData, formatarVigencia } from "../utils/formatacao";

export const usePesquisaLocal = (resultados, obterNomeCedente) => {
    const [termoPesquisa, setTermoPesquisa] = useState("");
    const [localPagination, setLocalPagination] = useState({
        current_page: 1,
        page_size: 10,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });

    const resultadosFiltrados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;
        const termo = termoPesquisa.toLowerCase().trim();

        return resultados.filter((f) => {
            const campos = [
                f.FATURA || "",
                f.APOLICE || "",
                f.NOME_ADMINISTRADORA || "",
                f.CNPJ_ADMINISTRADORA || "",
                ...(f.BOLETOS?.map(b => b.NOME_COBRADO || "") || []),
                ...(f.BOLETOS?.map(b => b.CNPJ_COBRADO || "") || []),
                ...(f.BOLETOS?.map(b => b.DOCUMENTO || "") || []),
                obterNomeCedente(f.CEDENTE) || "",
                formatarData(f.DATA_FAT),
                formatarData(f.VENCIMENTO),
                formatarVigencia(f.DT_INI_VIG, f.DT_FIM_VIG),
            ].map((x) => x?.toString().toLowerCase() || "");

            return campos.some((c) => c.includes(termo));
        });
    }, [resultados, termoPesquisa, obterNomeCedente]);

    useEffect(() => {
        if (termoPesquisa.trim()) {
            const totalLocal = resultadosFiltrados.length;
            const size = localPagination.page_size;
            const totalPages = Math.max(1, Math.ceil(totalLocal / size));
            let currentPage = localPagination.current_page;
            if (currentPage > totalPages) currentPage = 1;

            setLocalPagination({
                current_page: currentPage,
                page_size: size,
                total_records: totalLocal,
                total_pages: totalPages,
                has_next: currentPage < totalPages,
                has_previous: currentPage > 1,
            });
        } else {
            setLocalPagination({
                current_page: 1,
                page_size: 10,
                total_records: 0,
                total_pages: 1,
                has_next: false,
                has_previous: false,
            });
        }
    }, [resultadosFiltrados, termoPesquisa]);

    const resultadosPaginados = useMemo(() => {
        if (!termoPesquisa.trim()) return resultados;
        const start = (localPagination.current_page - 1) * localPagination.page_size;
        return resultadosFiltrados.slice(start, start + localPagination.page_size);
    }, [resultados, resultadosFiltrados, termoPesquisa, localPagination]);

    const limparPesquisa = () => {
        setTermoPesquisa("");
        setLocalPagination({
            current_page: 1,
            page_size: 10,
            total_records: 0,
            total_pages: 1,
            has_next: false,
            has_previous: false,
        });
    };

    return {
        termoPesquisa,
        setTermoPesquisa,
        localPagination,
        setLocalPagination,
        resultadosFiltrados,
        resultadosPaginados,
        limparPesquisa,
    };
};