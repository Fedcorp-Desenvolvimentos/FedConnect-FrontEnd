import { FaEraser, FaSearch, FaSlidersH } from "react-icons/fa";
import { PessoaSelect } from "./PessoaSelect";

export function ConsultaRecibosForm({
  filters,
  isSearching,
  onClear,
  onFilterChange,
  onSearch,
  onToggleAdvanced,
  pessoas,
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
          <h2>1. Consulta de faturas</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="recibos-form-grid">
          <label>
            Favorecido
            <PessoaSelect
              pessoas={pessoas}
              value={filters.favorecido}
              onChange={(value) => onFilterChange("favorecido", value)}
              placeholder="Nome, código ou documento"
            />
          </label>

          <label>
            Fatura
            <input
              type="text"
              value={filters.fatura}
              onChange={(event) => onFilterChange("fatura", event.target.value)}
              placeholder="Filtrar por número da fatura"
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
            Tipo de pagamento
            <select
              value={filters.tipo}
              onChange={(event) => onFilterChange("tipo", event.target.value)}
            >
              <option value="">Todos</option>
              <option value="A">Peaga</option>
              <option value="B">Outros</option>
              <option value="C">Fedcorp</option>
              <option value="D">Corretora</option>
              <option value="E">Lider</option>
              <option value="F">Condocorp</option>
              <option value="G">Cartão</option>
              <option value="H">Benefício</option>
            </select>
          </label>
        </div>

        <button
          type="button"
          className="advanced-toggle"
          onClick={onToggleAdvanced}
        >
          <FaSlidersH />
          {showAdvancedFilters
            ? "Ocultar filtros avançados"
            : "Exibir filtros avançados"}
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
              Recibo
              <input
                type="text"
                value={filters.recibo}
                onChange={(event) =>
                  onFilterChange("recibo", event.target.value)
                }
                placeholder="Número do recibo"
              />
            </label>

            <label>
              Vigência inicial
              <input
                type="date"
                value={filters.vigenciaInicial}
                onChange={(event) =>
                  onFilterChange("vigenciaInicial", event.target.value)
                }
              />
            </label>

            <label>
              Vigência final
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
            {isSearching ? "Consultando" : "Buscar"}
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