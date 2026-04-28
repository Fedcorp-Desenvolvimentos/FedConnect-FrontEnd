// components/Faturamento/PaginationControls.jsx
import React from 'react';
import * as S from "./styles/ConsultaFaturamentoStyles";

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
                <S.PageButton
                    key="first"
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(1) : irParaPagina(1))}
                    disabled={loading}
                    title="Primeira página"
                >
                    1
                </S.PageButton>
            );
            if (start > 2) pages.push(<S.Ellipsis key="e1">...</S.Ellipsis>);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <S.PageButton
                    key={i}
                    $active={pag.current_page === i}
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(i) : irParaPagina(i))}
                    disabled={loading}
                >
                    {i}
                </S.PageButton>
            );
        }

        if (end < pag.total_pages) {
            if (end < pag.total_pages - 1) pages.push(<S.Ellipsis key="e2">...</S.Ellipsis>);
            pages.push(
                <S.PageButton
                    key="last"
                    onClick={() => (usandoFiltroLocal ? irParaPaginaLocal(pag.total_pages) : irParaPagina(pag.total_pages))}
                    disabled={loading}
                    title="Última página"
                >
                    {pag.total_pages}
                </S.PageButton>
            );
        }

        return pages;
    };

    return (
        <S.PaginationContainer>
            <S.PaginationInfo>
                {usandoFiltroLocal ? (
                    <>
                        Mostrando <strong>{(localPagination.current_page - 1) * localPagination.page_size + 1}</strong> –{" "}
                        <strong>{Math.min(localPagination.current_page * localPagination.page_size, localPagination.total_records)}</strong>{" "}
                        de <strong>{localPagination.total_records}</strong> registros filtrados
                        <br />
                        <small style={{ fontSize: "0.7rem", color: "#64748b" }}>
                            (Total: {pagination.total_records} registros da consulta)
                        </small>
                    </>
                ) : (
                    <>
                        Mostrando <strong>{(pagination.current_page - 1) * pagination.page_size + 1}</strong> –{" "}
                        <strong>{Math.min(pagination.current_page * pagination.page_size, pagination.total_records)}</strong> de{" "}
                        <strong>{pagination.total_records}</strong> registros
                    </>
                )}
            </S.PaginationInfo>

            <S.PaginationControls>
                <S.PageButton
                    onClick={usandoFiltroLocal ? irParaPaginaAnteriorLocal : irParaPaginaAnterior}
                    disabled={usandoFiltroLocal ? !localPagination.has_previous : !pagination.has_previous || loading}
                    title="Página anterior"
                >
                    ‹
                </S.PageButton>
                {renderPageNumbers()}
                <S.PageButton
                    onClick={usandoFiltroLocal ? irParaProximaPaginaLocal : irParaProximaPagina}
                    disabled={usandoFiltroLocal ? !localPagination.has_next : !pagination.has_next || loading}
                    title="Próxima página"
                >
                    ›
                </S.PageButton>
            </S.PaginationControls>
        </S.PaginationContainer>
    );
};