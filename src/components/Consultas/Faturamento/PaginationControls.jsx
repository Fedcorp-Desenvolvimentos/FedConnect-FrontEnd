import React from "react";

export const PaginationControls = ({ 
    pagination, 
    localPagination, 
    termoPesquisa, 
    loading,
    irParaPagina,
    irParaPaginaAnterior,
    irParaProximaPagina,
    irParaPaginaLocal,
    irParaPaginaAnteriorLocal,
    irParaProximaPaginaLocal
}) => {
    const usandoFiltroLocal = termoPesquisa.trim() !== "";
    const pag = usandoFiltroLocal ? localPagination : pagination;

    if (pag.total_records === 0 || pag.total_pages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, pag.current_page - Math.floor(maxVisible / 2));
        let end = Math.min(pag.total_pages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);

        if (start > 1) {
            pages.push(
                <button
                    key="first"
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(1) : irParaPagina(1))}
                    className="pagination-btn"
                    disabled={loading}
                    title="Primeira página"
                >
                    1
                </button>
            );
            if (start > 2) pages.push(<span key="e1" className="pagination-ellipsis">...</span>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(i) : irParaPagina(i))}
                    className={`pagination-btn ${pag.current_page === i ? "active" : ""}`}
                    disabled={loading}
                >
                    {i}
                </button>
            );
        }

        if (end < pag.total_pages) {
            if (end < pag.total_pages - 1) pages.push(<span key="e2" className="pagination-ellipsis">...</span>);
            pages.push(
                <button
                    key="last"
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(pag.total_pages) : irParaPagina(pag.total_pages))}
                    className="pagination-btn"
                    disabled={loading}
                    title="Última página"
                >
                    {pag.total_pages}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="pagination-container">
            <div className="pagination-info">
                {usandoFiltroLocal ? (
                    <>
                        Mostrando <strong>{(localPagination.current_page - 1) * localPagination.page_size + 1}</strong> –{" "}
                        <strong>{Math.min(localPagination.current_page * localPagination.page_size, localPagination.total_records)}</strong>{" "}
                        de <strong>{localPagination.total_records}</strong> registros filtrados
                        <br />
                        <small className="text-muted">(Total: {pagination.total_records} registros da consulta)</small>
                    </>
                ) : (
                    <>
                        Mostrando <strong>{(pagination.current_page - 1) * pagination.page_size + 1}</strong> –{" "}
                        <strong>{Math.min(pagination.current_page * pagination.page_size, pagination.total_records)}</strong> de{" "}
                        <strong>{pagination.total_records}</strong> registros
                    </>
                )}
            </div>

            <div className="pagination-controls">
                <button
                    onClick={usandoFiltroLocal ? irParaPaginaAnteriorLocal : irParaPaginaAnterior}
                    disabled={usandoFiltroLocal ? !localPagination.has_previous : !pagination.has_previous || loading}
                    className="pagination-btn nav"
                    title="Página anterior"
                >
                    ‹
                </button>
                {renderPageNumbers()}
                <button
                    onClick={usandoFiltroLocal ? irParaProximaPaginaLocal : irParaProximaPagina}
                    disabled={usandoFiltroLocal ? !localPagination.has_next : !pagination.has_next || loading}
                    className="pagination-btn nav"
                    title="Próxima página"
                >
                    ›
                </button>
            </div>
        </div>
    );
};