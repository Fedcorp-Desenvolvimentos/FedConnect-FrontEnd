// FormularioHeader.js
import AdministradoraAutocomplete from "../../Adm/AdministradorasAutocomplete";

export const FormularioHeader = ({ 
    formData, 
    handleChange, 
    handleAdministradoraSelect, 
    carregarFaturas, 
    handleLimparFiltros, 
    loading 
}) => {
    return (
        <form className="form-fatura" onSubmit={carregarFaturas}>
            <div className="filtros-principais">
                <div className="form-group">
                    <label htmlFor="fatura">Fatura:</label>
                    <input
                        type="text"
                        id="fatura"
                        name="fatura"
                        value={formData.fatura}
                        onChange={handleChange}
                        placeholder="Número da fatura"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="apolice">Apólice:</label>
                    <input
                        type="text"
                        id="apolice"
                        name="apolice"
                        value={formData.apolice}
                        onChange={handleChange}
                        placeholder="Número da apólice"
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select 
                        id="status" 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange} 
                        className="form-control"
                    >
                        <option value="">Todos</option>
                        <option value="A">Ativa</option>
                        <option value="C">Cancelada</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="data_ini">Data Inicial:</label>
                    <input
                        type="date"
                        id="data_ini"
                        name="data_ini"
                        value={formData.data_ini}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="data_fim">Data Final:</label>
                    <input
                        type="date"
                        id="data_fim"
                        name="data_fim"
                        value={formData.data_fim}
                        onChange={handleChange}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="administradora">Administradora:</label>
                    <AdministradoraAutocomplete
                        value={formData.administradora}
                        onChange={handleChange}
                        onSelect={handleAdministradoraSelect}
                        placeholder="Digite o nome da administradora..."
                        disabled={loading}
                    />
                </div>
            </div>

            <div className="botoes-acao">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Consultando..." : "Consultar"}
                </button>

                <button 
                    type="button" 
                    className="btn btn-primary" 
                    onClick={handleLimparFiltros} 
                    disabled={loading}
                >
                    Limpar Filtros
                </button>
            </div>
        </form>
    );
};