// components/Faturamento/BarraPesquisaLocal.jsx
import React from 'react';
import { FaSearch, FaTimes, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
import * as S from "./styles/ConsultaFaturamentoStyles";

export const BarraPesquisaLocal = ({ 
    termoPesquisa, 
    setTermoPesquisa, 
    limparPesquisa, 
    resultadosFiltrados, 
    resultados,
    loading,
}) => {
    return (
        <S.SearchBar>
            <S.SearchInput>
                <FaSearch />
                <input
                    type="text"
                    placeholder="Filtrar resultados localmente..."
                    value={termoPesquisa}
                    onChange={(e) => setTermoPesquisa(e.target.value)}
                    disabled={loading || resultados.length === 0}
                />
                {termoPesquisa && (
                    <S.ClearButton onClick={limparPesquisa} disabled={loading}>
                        <FaTimes />
                    </S.ClearButton>
                )}
            </S.SearchInput>
            
            {termoPesquisa && (
                <S.SearchInfo>
                    {resultadosFiltrados.length > 0 ? (
                        <>
                            <FaInfoCircle />
                            Mostrando {resultadosFiltrados.length} de {resultados.length} registros
                            {resultadosFiltrados.length < resultados.length && " (filtrados localmente)"}
                        </>
                    ) : (
                        <S.NoResults>
                            <FaExclamationCircle />
                            Nenhum resultado encontrado para "{termoPesquisa}"
                        </S.NoResults>
                    )}
                </S.SearchInfo>
            )}
        </S.SearchBar>
    );
};