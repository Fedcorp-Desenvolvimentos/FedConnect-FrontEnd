import { FaEraser, FaSearch, FaSlidersH } from "react-icons/fa";

export function ConsultaRecibosForm({
  filters,
  isSearching,
  onClear,
  onFilterChange,
  onSearch,
  onToggleAdvanced,
  showAdvancedFilters,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section className="recibos-card">
      <div className="recibos-card-header">
        <div>
          <FaSearch />
          <h2>1. Consulta</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="recibos-form-grid">
          <label>
            Favorecido
            <input
              type="text"
              value={filters.favorecido}
              onChange={(event) => onFilterChange("favorecido", event.target.value)}
              placeholder="Nome, codigo ou documento"
            />
          </label>

          <label>
            Fatura
            <input
              type="text"
              value={filters.fatura}
              onChange={(event) => onFilterChange("fatura", event.target.value)}
              placeholder="Numero da fatura"
            />
          </label>

          <label>
            Vencimento inicial
            <input
              type="date"
              value={filters.vencimentoInicial}
              onChange={(event) =>
                onFilterChange("vencimentoInicial", event.target.value)
              }
            />
          </label>

          <label>
            Vencimento final
            <input
              type="date"
              value={filters.vencimentoFinal}
              onChange={(event) =>
                onFilterChange("vencimentoFinal", event.target.value)
              }
            />
          </label>

          <label>
            Status da fatura
            <select
              value={filters.status}
              onChange={(event) => onFilterChange("status", event.target.value)}
            >
              <option value="todas">Todas</option>
              <option value="baixadas">Somente baixadas</option>
              <option value="pendentes">Somente pendentes</option>
            </select>
          </label>

          <label>
            Tipo
            <select
              value={filters.tipo}
              onChange={(event) => onFilterChange("tipo", event.target.value)}
            >
              <option value="">Todos</option>
              <option value="A">Tipo A</option>
              <option value="B">Tipo B</option>
            </select>
          </label>
        </div>

        <button type="button" className="advanced-toggle" onClick={onToggleAdvanced}>
          <FaSlidersH />
          {showAdvancedFilters ? "Ocultar filtros avancados" : "Exibir filtros avancados"}
        </button>

        {showAdvancedFilters && (
          <div className="recibos-form-grid advanced-filters">
            <label>
              Co-estipulante
              <input
                type="text"
                value={filters.coEstipulante}
                onChange={(event) =>
                  onFilterChange("coEstipulante", event.target.value)
                }
                placeholder="Informe o co-estipulante"
              />
            </label>

            <label>
              Apolice
              <input
                type="text"
                value={filters.apolice}
                onChange={(event) => onFilterChange("apolice", event.target.value)}
                placeholder="Numero da apolice"
              />
            </label>

            <label>
              Comercial
              <input
                type="text"
                value={filters.comercial}
                onChange={(event) => onFilterChange("comercial", event.target.value)}
                placeholder="Responsavel comercial"
              />
            </label>

            <label>
              Recibo
              <input
                type="text"
                value={filters.recibo}
                onChange={(event) => onFilterChange("recibo", event.target.value)}
                placeholder="Numero do recibo"
              />
            </label>

            <label>
              Vigencia inicial
              <input
                type="date"
                value={filters.vigenciaInicial}
                onChange={(event) =>
                  onFilterChange("vigenciaInicial", event.target.value)
                }
              />
            </label>

            <label>
              Vigencia final
              <input
                type="date"
                value={filters.vigenciaFinal}
                onChange={(event) =>
                  onFilterChange("vigenciaFinal", event.target.value)
                }
              />
            </label>
          </div>
        )}

        <div className="recibos-actions">
          <button type="submit" className="primary-button" disabled={isSearching}>
            <FaSearch />
            {isSearching ? "Consultando" : "Consultar faturas"}
          </button>

          <button type="button" className="secondary-button">
            Consultar comissoes anteriores
          </button>

          <button type="button" className="ghost-button" onClick={onClear}>
            <FaEraser />
            Limpar filtros
          </button>
        </div>
      </form>
    </section>
  );
}
