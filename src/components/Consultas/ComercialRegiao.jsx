import React, { useState, useRef, useEffect } from "react";
import "../styles/ComercialRegiao.css";
import * as XLSX from "xlsx";
import { ConsultaService } from "../../services/consultaService";


const ComercialRegiao = () => {
    const [form, setForm] = useState({
        uf: "",
        municipio: "",
        bairro: "",
    });
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);

    const resultadosRef = useRef(null);

    useEffect(() => {
        if (resultados.length > 0 && resultadosRef.current) {
            setTimeout(() => {
                resultadosRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 180);
        }
    }, [resultados]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null); // Limpar erros anteriores

        if (!form.uf || !form.municipio) {
            setErro("UF e municipio são obrigatórios.");
            setLoading(false);
            return;
        }

        try {
            // 1. **MODIFICAÇÃO AQUI:** Acessa a propriedade 'resultados' do objeto de resposta
            const responseg = await ConsultaService.consultaRegiao(form);
            console.log(responseg)
            
            // Certifique-se de que 'resultados' existe antes de setar
            if (responseg && Array.isArray(responseg.resultados)) {
                setResultados(responseg.resultados);
            } else {
                setResultados([]); // Define como array vazio se a resposta não for a esperada
            }

            setHasSearched(true);
        } catch (err) {
            console.error("Erro ao buscar empresas:", err);
            setErro("Erro ao buscar empresas. Tente novamente.");
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const exportarExcel = () => {
        if (!resultados.length) return;

        // 2. **MODIFICAÇÃO AQUI:** Mapeia as novas chaves do JSON para o Excel
        const data = resultados.map(item => ({
            Nome: item.displayName ? item.displayName.text : 'N/A',
            Endereço: item.formattedAddress,
            Telefone: item.nationalPhoneNumber || 'N/A',
            Site: item.websiteUri || 'N/A',
            Status: item.businessStatus,
        }));
        
        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empresas");
        XLSX.writeFile(wb, "empresas-regiao.xlsx");
    };

    return (
        <div className="comercial-regiao-container">
            <h2 className="comercial-title">
                <i className="bi bi-geo-alt-fill"></i>
                Buscar por Região
            </h2>
            <form className="regiao-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <label>UF *</label>
                    <input name="uf" value={form.uf} onChange={handleChange} maxLength={2} required />
                </div>
                <div className="form-row">
                    <label>municipio *</label>
                    <input name="municipio" value={form.municipio} onChange={handleChange} required />
                </div>
                <div className="form-row">
                    <label>Bairro</label>
                    <input name="bairro" value={form.bairro} onChange={handleChange} />
                </div>
                <button type="submit" className="consulta-btn" disabled={loading}>
                    {loading ? "Buscando..." : "Buscar"}
                </button>
                {erro && <p className="error-message">{erro}</p>}
            </form>

            <div className="resultados-regiao" ref={resultadosRef}>
                {resultados.length > 0 && (
                    <>
                        <h3 className="result-title">Empresas encontradas ({resultados.length}):</h3>
                        <ul className="regiao-list">
                            {resultados.map((item, i) => (
                                // 3. **MODIFICAÇÃO AQUI:** Exibe os dados usando as novas chaves do JSON
                                <li key={i} className="regiao-card-mock">
                                    <div className="mock-title-row">
                                        {/* Use o businessStatus ou displayName para o ícone, se necessário */}
                                        <span className="mock-icon">🏢</span> 
                                        <strong className="mock-title">{item.displayName.text}</strong>
                                    </div>
                                    <div className="mock-endereco">
                                        <i className="bi bi-geo-alt"></i> {item.formattedAddress}
                                    </div>
                                    <div className="mock-telefone-site">
                                        <a href={`tel:${item.nationalPhoneNumber}`} className="mock-phone">
                                            📞 {item.nationalPhoneNumber}
                                        </a>
                                        {item.websiteUri && (
                                            <a href={item.websiteUri} target="_blank" rel="noopener noreferrer" className="mock-site-link">
                                                🌐 Site
                                            </a>
                                        )}
                                    </div>
                                    <div className="mock-tipo">Status: {item.businessStatus}</div>
                                </li>
                            ))}
                        </ul>
                        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                            <button className="btn-exportar-excel" onClick={exportarExcel}>Exportar para Excel</button>
                        </div>
                    </>
                )}
                {!loading && hasSearched && resultados.length === 0 && (
                    <p className="no-results-message">Nenhum resultado para os filtros informados.</p>
                )}
            </div>
        </div>
    );
};

export default ComercialRegiao;