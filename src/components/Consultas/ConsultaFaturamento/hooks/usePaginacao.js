import { useState, useCallback } from "react";

const PAGE_SIZE = 10;

export const usePaginacao = () => {
    const [pagination, setPagination] = useState({
        current_page: 1,
        page_size: PAGE_SIZE,
        total_records: 0,
        total_pages: 1,
        has_next: false,
        has_previous: false,
    });

    const atualizarPagination = useCallback((novaPagination) => {
        setPagination(prev => ({ ...prev, ...novaPagination }));
    }, []);

    const irParaProximaPagina = useCallback(() => {
        if (pagination.has_next) {
            return pagination.current_page + 1;
        }
        return null;
    }, [pagination]);

    const irParaPaginaAnterior = useCallback(() => {
        if (pagination.has_previous) {
            return pagination.current_page - 1;
        }
        return null;
    }, [pagination]);

    const irParaPagina = useCallback((page) => {
        if (page >= 1 && page <= pagination.total_pages) {
            return page;
        }
        return null;
    }, [pagination]);

    return {
        pagination,
        atualizarPagination,
        irParaProximaPagina,
        irParaPaginaAnterior,
        irParaPagina,
        PAGE_SIZE,
    };
};