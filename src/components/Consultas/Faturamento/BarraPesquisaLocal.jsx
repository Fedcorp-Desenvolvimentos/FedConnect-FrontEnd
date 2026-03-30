
export const BarraPesquisaLocal = ({ 
    termoPesquisa, 
    setTermoPesquisa, 
    limparPesquisa, 
    resultadosFiltrados, 
    resultados,
    loading,
    resultadosPaginados
}) => {
    return (
        <div className="barra-pesquisa-wrapper">
            <div className="barra-pesquisa-resultados">
                <div className="input-group-pesquisa" role="search">
                    <span className="search-icon" aria-hidden="true">
                        <i className="bi bi-search" />
                    </span>
                    <input
                        type="text"
                        className="form-control pesquisa-input"
                        placeholder="Filtrar resultados localmente..."
                        value={termoPesquisa}
                        onChange={(e) => {
                            const v = e.target.value;
                            setTermoPesquisa(v);
                        }}
                        disabled={loading || resultados.length === 0}
                    />
                    {termoPesquisa && (
                        <button
                            className="btn-limpar-pesquisa"
                            type="button"
                            aria-label="Limpar filtro"
                            onClick={limparPesquisa}
                            disabled={loading}
                        >
                            <i className="bi bi-x" />
                        </button>
                    )}
                </div>
                {termoPesquisa && (
                    <div className="info-pesquisa">
                        {resultadosFiltrados.length > 0 ? (
                            <>
                                <i className="bi-info-circle me-1"></i>
                                Mostrando {resultadosFiltrados.length} de {resultados.length} registros
                                {resultadosFiltrados.length < resultados.length && " (filtrados localmente)"}
                            </>
                        ) : (
                            <div className="sem-resultados">
                                <i className="bi-exclamation-circle me-1"></i>
                                Nenhum resultado encontrado para "{termoPesquisa}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};