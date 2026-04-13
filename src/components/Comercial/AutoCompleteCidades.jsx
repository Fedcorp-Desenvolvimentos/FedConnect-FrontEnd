// components/AutocompleteCidades.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { ConsultaService } from "../../services/consultaService";

const AutocompleteCidades = ({ uf, value, onChange, placeholder = "Digite o nome da cidade..." }) => {
    const [termo, setTermo] = useState(value || "");
    const [sugestoes, setSugestoes] = useState([]);
    const [carregando, setCarregando] = useState(false);
    const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
    const inputRef = useRef(null);
    const wrapperRef = useRef(null);

    // Busca cidades com debounce
    const buscarCidades = useCallback(
        async (termoBusca) => {
            if (!termoBusca || termoBusca.length < 2) {
                setSugestoes([]);
                setCarregando(false);
                return;
            }

            setCarregando(true);
            try {
                const response = await ConsultaService.buscarCidadesAutocomplete({
                    termo: termoBusca,
                    uf: uf
                });

                if (response?.data) {
                    setSugestoes(response.data);
                } else {
                    setSugestoes([]);
                }
            } catch (error) {
                console.error("Erro ao buscar cidades:", error);
                setSugestoes([]);
            } finally {
                setCarregando(false);
            }
        },
        [uf]
    );

    // Monitora mudanças no termo
    useEffect(() => {
        if (termo.length >= 2) {
            buscarCidades(termo);
            setMostrarSugestoes(true);
        } else {
            setSugestoes([]);
            setMostrarSugestoes(false);
        }
    }, [termo, buscarCidades]);

    // Fecha sugestões ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setMostrarSugestoes(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const novoTermo = e.target.value;
        setTermo(novoTermo);
        
        // Se o campo foi limpo, notifica o componente pai
        if (!novoTermo) {
            onChange({ target: { name: "municipio", value: "" } });
        }
    };

    const selecionarCidade = (cidade) => {
        setTermo(cidade.descricao);
        setMostrarSugestoes(false);
        onChange({ target: { name: "municipio", value: cidade.descricao } });
        
        // Disparar evento personalizado para carregar bairros se for Rio
        if (cidade.descricao.toLowerCase() === "rio de janeiro") {
            const event = new CustomEvent("cidadeSelecionada", { 
                detail: { cidade: cidade.descricao, codigo: cidade.codigo } 
            });
            window.dispatchEvent(event);
        }
    };

    return (
        <div ref={wrapperRef} className="autocomplete-container" style={{ position: "relative", width: "100%" }}>
            <input
                ref={inputRef}
                type="text"
                name="municipio"
                value={termo}
                onChange={handleChange}
                onFocus={() => termo.length >= 2 && setMostrarSugestoes(true)}
                placeholder={placeholder}
                className="autocomplete-input"
                autoComplete="off"
                required
                style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "1rem"
                }}
            />
            
            {carregando && (
                <div className="autocomplete-loading" style={{ position: "absolute", right: "10px", top: "10px" }}>
                    <i className="bi bi-hourglass-split"></i>
                </div>
            )}
            
            {mostrarSugestoes && sugestoes.length > 0 && (
                <ul className="autocomplete-sugestoes" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    maxHeight: "250px",
                    overflowY: "auto",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    zIndex: 1000,
                    margin: 0,
                    padding: 0,
                    listStyle: "none",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    {sugestoes.map((cidade, index) => (
                        <li
                            key={cidade.codigo || index}
                            onClick={() => selecionarCidade(cidade)}
                            style={{
                                padding: "0.5rem",
                                cursor: "pointer",
                                borderBottom: "1px solid #f0f0f0",
                                transition: "background 0.2s"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "white"}
                        >
                            <strong>{cidade.descricao}</strong>
                            {cidade.estado && <span style={{ color: "#666", marginLeft: "0.5rem" }}>({cidade.estado})</span>}
                        </li>
                    ))}
                </ul>
            )}
            
            {mostrarSugestoes && !carregando && sugestoes.length === 0 && termo.length >= 2 && (
                <div className="autocomplete-sem-resultados" style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    padding: "0.5rem",
                    backgroundColor: "white",
                    border: "1px solid #ddd",
                    borderTop: "none",
                    borderRadius: "0 0 4px 4px",
                    color: "#999",
                    textAlign: "center",
                    zIndex: 1000
                }}>
                    Nenhuma cidade encontrada para "{termo}"
                </div>
            )}
        </div>
    );
};

export default AutocompleteCidades;