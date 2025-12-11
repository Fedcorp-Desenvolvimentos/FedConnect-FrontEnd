import React, { useState, useRef, useEffect } from "react";
import "../styles/ComercialRegiao.css";
import * as XLSX from "xlsx";
import { ConsultaService } from "../../services/consultaService";
import { FiCopy, FiCheck, FiX } from "react-icons/fi";

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
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 4;

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [dadosModal, setDadosModal] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [erroModal, setErroModal] = useState(null);
    const [copiado, setCopiado] = useState({});
    const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState("");

    const resultadosRef = useRef(null);

    useEffect(() => {
        if (resultados.length > 0 && resultadosRef.current) {
            setTimeout(() => {
                resultadosRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            }, 180);
        }
    }, [resultados]);

    useEffect(() => {
        setPaginaAtual(1);
    }, [resultados]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErro(null);

        if (!form.uf || !form.municipio) {
            setErro("UF e município são obrigatórios.");
            setLoading(false);
            return;
        }

        try {
            const resp = await ConsultaService.consultaRegiao(form);

            if (resp && Array.isArray(resp.resultados)) {
                setResultados(resp.resultados);
            } else {
                setResultados([]);
            }

            setHasSearched(true);
        } catch (err) {
            console.error(err);
            setErro("Erro ao buscar empresas. Tente novamente.");
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const exportarExcel = () => {
        if (!resultados.length) return;

        const data = resultados.map((item) => ({
            Nome: item.displayName?.text || "N/A",
            Endereço: item.formattedAddress || "N/A",
            Telefone: item.nationalPhoneNumber || "N/A",
            Site: item.websiteUri || "N/A",
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Empresas");
        XLSX.writeFile(wb, "empresas-regiao.xlsx");
    };

    const criarLinkMaps = (nome, endereco) => {
        const query = encodeURIComponent(`${nome} ${endereco}`);
        return `https://google.com/maps/search/${query}`;
    };

    // telefone -> link direto pro WhatsApp
    const criarLinkWhatsApp = (phoneRaw) => {
        if (!phoneRaw) return "#";
        let digits = phoneRaw.toString().replace(/\D/g, "");

        // remove zero à esquerda se vier tipo 061...
        if (digits.length === 11 && digits.startsWith("0")) {
            digits = digits.slice(1);
        }

        // garante DDI BR
        if (!digits.startsWith("55")) {
            digits = "55" + digits;
        }

        return `https://wa.me/${digits}`;
    };

    const copiarParaClipboard = (texto, campo) => {
        if (!texto) return;
        navigator.clipboard.writeText(texto);
        setCopiado((prev) => ({ ...prev, [campo]: true }));
        setTimeout(() => {
            setCopiado((prev) => ({ ...prev, [campo]: false }));
        }, 2000);
    };

    const formatarDataBrasileira = (data) => {
        if (!data) return "N/A";
        if (data.includes("-")) {
            const [ano, mes, dia] = data.split("-");
            return `${dia}/${mes}/${ano}`;
        }
        return data;
    };

    // Consulta Razão Social
    const buscarDetalhesPorRazaoSocial = async (razaoSocial) => {
        if (!razaoSocial) return;

        setModalAberto(true);
        setLoadingModal(true);
        setErroModal(null);
        setDadosModal(null);

        try {
            const bigDataCorpPayload = {
                Datasets: "basic_data",
                q: `name{${razaoSocial}}`,
                Limit: 1,
            };

            const payload = {
                tipo_consulta: "cnpj_razao_social",
                parametro_consulta: JSON.stringify(bigDataCorpPayload),
            };

            const resp = await ConsultaService.realizarConsulta(payload);

            const data = resp?.resultado_api ?? resp?.resultado ?? null;

            if (data && typeof data === "object") {
                setDadosModal(data);
            } else {
                setErroModal("Nenhum detalhe encontrado.");
            }
        } catch (err) {
            console.error(err);
            setErroModal("Erro ao buscar detalhes da empresa.");
        } finally {
            setLoadingModal(false);
        }
    };

    const fecharModal = () => {
        setModalAberto(false);
        setDadosModal(null);
        setErroModal(null);
        setCopiado({});
        setEmpresaSelecionadaNome("");
    };

    // Excel só da empresa selecionada (modal)
    const exportarExcelDetalhes = () => {
        if (!dadosModal) return;

        const enderecoCompleto = `${dadosModal.descricao_tipo_de_logradouro || ""} ${
            dadosModal.logradouro || ""
        }, ${dadosModal.numero || ""} ${dadosModal.complemento || ""}`.trim();

        const qsaFormatado = Array.isArray(dadosModal.qsa)
            ? dadosModal.qsa
                  .map((s) => `${s.nome_socio} - ${s.qualificacao_socio}`)
                  .join(" | ")
            : "";

        const data = [
            {
                "Razão Social": dadosModal.razao_social || "",
                "Nome Fantasia": dadosModal.nome_fantasia || "",
                CNPJ: dadosModal.cnpj || "",
                "Situação Cadastral": dadosModal.descricao_situacao_cadastral || "",
                "Data Início Atividade": formatarDataBrasileira(
                    dadosModal.data_inicio_atividade
                ),
                Telefone: dadosModal.ddd_telefone_1 || "",
                Email: dadosModal.email || "",
                Endereço: enderecoCompleto,
                Bairro: dadosModal.bairro || "",
                "Cidade / UF": `${dadosModal.municipio || ""} - ${dadosModal.uf || ""}`,
                "CNAE Principal": dadosModal.cnae_fiscal_descricao || "",
                Porte: dadosModal.porte || "",
                "Capital Social": dadosModal.capital_social || "",
                QSA: qsaFormatado,
            },
        ];

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Detalhes Empresa");

        const nomeArquivo = `detalhes-empresa-${
            (dadosModal.cnpj || "empresa").toString().replace(/\D/g, "")
        }.xlsx`;

        XLSX.writeFile(wb, nomeArquivo);
    };

    const indexUltimo = paginaAtual * itensPorPagina;
    const indexPrimeiro = indexUltimo - itensPorPagina;
    const resultadosPaginados = resultados.slice(indexPrimeiro, indexUltimo);
    const totalPaginas = Math.ceil(resultados.length / itensPorPagina);

    const mudarPagina = (n) => {
        setPaginaAtual(n);
        resultadosRef.current?.scrollIntoView({ behavior: "smooth" });
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
                    <input name="uf" value={form.uf} onChange={handleChange} maxLength={2} />
                </div>

                <div className="form-row">
                    <label>Município *</label>
                    <input name="municipio" value={form.municipio} onChange={handleChange} />
                </div>

                <div className="form-row">
                    <label>Bairro</label>
                    <input name="bairro" value={form.bairro} onChange={handleChange} />
                </div>

                <button type="submit" className="consulta-btn" disabled={loading}>
                    {loading ? (
                        <>
                            <i className="bi bi-hourglass-split loading-icon"></i>
                            Buscando...
                        </>
                    ) : (
                        <>
                            <i className="bi bi-search"></i>
                            Buscar
                        </>
                    )}
                </button>

                {erro && <p className="error-message">{erro}</p>}
            </form>

            <div className="resultados-regiao" ref={resultadosRef}>
                {resultados.length > 0 && (
                    <>
                        <div className="result-header">
                            <h3 className="result-title">
                                <i className="bi bi-building"></i>
                                Empresas encontradas:
                                <span className="count-badge">{resultados.length}</span>
                            </h3>

                            <button className="btn-exportar-excel" onClick={exportarExcel}>
                                <i className="bi bi-file-earmark-excel"></i>
                                Exportar Excel
                            </button>
                        </div>

                        <ul className="regiao-list">
                            {resultadosPaginados.map((item, i) => (
                                <li
                                    key={i}
                                    className="regiao-card-modern"
                                    /* card deixou de ser clicável,
                                       modal agora é pelo botão "Ver Detalhes" */
                                >
                                    <div className="card-header">
                                        <h4 className="card-title">{item.displayName?.text}</h4>
                                        <div className="card-icon">
                                            <i className="bi bi-building-fill"></i>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="info-item">
                                            <i className="bi bi-geo-alt-fill"></i>
                                            <span>{item.formattedAddress}</span>
                                        </div>

                                        {item.nationalPhoneNumber && (
                                            <div className="info-item">
                                                <i className="bi bi-telephone-fill"></i>
                                                <a
                                                    href={criarLinkWhatsApp(
                                                        item.nationalPhoneNumber
                                                    )}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="phone-link"
                                                >
                                                    {item.nationalPhoneNumber}
                                                </a>
                                            </div>
                                        )}

                                        {item.websiteUri && (
                                            <div className="info-item">
                                                <i className="bi bi-globe"></i>
                                                <a
                                                    href={item.websiteUri}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="site-link"
                                                >
                                                    Visitar site
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <div className="card-footer">
                                        <a
                                            href={criarLinkMaps(
                                                item.displayName?.text,
                                                item.formattedAddress
                                            )}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn-maps"
                                        >
                                            <i className="bi bi-map"></i>
                                            Ver no Maps
                                        </a>

                                        <button
                                            type="button"
                                            className="btn-detalhes"
                                            style={{ marginLeft: "0.5rem" }}
                                            onClick={() => {
                                                const nome = item.displayName?.text;
                                                setEmpresaSelecionadaNome(nome || "");
                                                buscarDetalhesPorRazaoSocial(nome);
                                            }}
                                        >
                                            <i className="bi bi-card-text"></i>
                                            Ver detalhes
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {totalPaginas > 1 && (
                            <div className="pagination">
                                <button
                                    className="pagination-btn"
                                    onClick={() => mudarPagina(paginaAtual - 1)}
                                    disabled={paginaAtual === 1}
                                >
                                    <i className="bi bi-chevron-left"></i>
                                    Anterior
                                </button>

                                <div className="pagination-numbers">
                                    {[...Array(totalPaginas)].map((_, index) => (
                                        <button
                                            key={index}
                                            className={`pagination-number ${
                                                paginaAtual === index + 1 ? "active" : ""
                                            }`}
                                            onClick={() => mudarPagina(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    className="pagination-btn"
                                    onClick={() => mudarPagina(paginaAtual + 1)}
                                    disabled={paginaAtual === totalPaginas}
                                >
                                    Próxima
                                    <i className="bi bi-chevron-right"></i>
                                </button>
                            </div>
                        )}
                    </>
                )}

                {!loading && hasSearched && resultados.length === 0 && (
                    <div className="no-results">
                        <i className="bi bi-search"></i>
                        <p>Nenhum resultado encontrado.</p>
                    </div>
                )}
            </div>

            {modalAberto && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>
                                <i className="bi bi-building"></i>
                                Detalhes da Empresa
                                {empresaSelecionadaNome && (
                                    <span style={{ marginLeft: 8, fontWeight: 300 }}>
                                        — {empresaSelecionadaNome}
                                    </span>
                                )}
                            </h3>
                            <button className="modal-close-btn" onClick={fecharModal}>
                                <FiX size={24} />
                            </button>

                             {!loadingModal && !erroModal && dadosModal && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: "0.5rem",
                                        marginBottom: "0.1rem",
                                        marginLeft: "1rem"
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="btn-exportar-excel"
                                        onClick={exportarExcelDetalhes}
                                    >
                                        <i className="bi bi-file-earmark-excel"></i>
                                        Baixar Excel
                                    </button>

                                </div>
                            )}
                        </div>

                        <div className="modal-body">
                            
                           

                            {loadingModal && (
                                <div className="modal-loading">
                                    <div className="spinner-modal"></div>
                                    <p>Buscando informações...</p>
                                </div>
                            )}

                            {!loadingModal && erroModal && (
                                <div className="modal-erro">
                                    <i className="bi bi-exclamation-circle"></i>
                                    <p>{erroModal}</p>
                                </div>
                            )}

                            {!loadingModal && dadosModal && (
                                <div className="modal-dados">
                                    <CampoCopiavel
                                        label="Razão Social"
                                        valor={dadosModal.razao_social}
                                        campo="razao"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    <CampoCopiavel
                                        label="CNPJ"
                                        valor={dadosModal.cnpj}
                                        campo="cnpj"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    <CampoCopiavel
                                        label="Situação Cadastral"
                                        valor={dadosModal.descricao_situacao_cadastral}
                                        campo="situacao"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    {dadosModal.ddd_telefone_1 && (
                                        <CampoCopiavel
                                            label="Telefone"
                                            valor={dadosModal.ddd_telefone_1}
                                            campo="telefone"
                                            copiar={copiarParaClipboard}
                                            copiado={copiado}
                                        />
                                    )}

                                    {dadosModal.email && (
                                        <CampoCopiavel
                                            label="Email"
                                            valor={dadosModal.email}
                                            campo="email"
                                            copiar={copiarParaClipboard}
                                            copiado={copiado}
                                        />
                                    )}

                                    <CampoCopiavel
                                        label="Endereço"
                                        valor={`${dadosModal.descricao_tipo_de_logradouro || ""} ${
                                            dadosModal.logradouro || ""
                                        }, ${dadosModal.numero || ""} ${
                                            dadosModal.complemento || ""
                                        }`.trim()}
                                        campo="endereco"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    <CampoCopiavel
                                        label="Bairro"
                                        valor={dadosModal.bairro}
                                        campo="bairro"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    <CampoCopiavel
                                        label="Cidade / UF"
                                        valor={`${dadosModal.municipio} - ${dadosModal.uf}`}
                                        campo="cidade_uf"
                                        copiar={copiarParaClipboard}
                                        copiado={copiado}
                                    />

                                    <div className="modal-field">
                                        <label>CNAE Principal:</label>
                                        <input
                                            readOnly
                                            value={dadosModal.cnae_fiscal_descricao || "N/A"}
                                        />
                                    </div>

                                    {dadosModal.cnaes_secundarios?.length > 0 && (
                                        <div className="modal-field">
                                            <label>CNAEs Secundários:</label>
                                            <ul className="lista-secundarios">
                                                {dadosModal.cnaes_secundarios.map((c, i) => (
                                                    <li key={i}>{c.descricao}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="modal-field">
                                        <label>Porte:</label>
                                        <input readOnly value={dadosModal.porte || "N/A"} />
                                    </div>

                                    {dadosModal.qsa?.length > 0 && (
                                        <div className="modal-field">
                                            <label>Quadro Societário (QSA):</label>
                                            <ul className="lista-qsa">
                                                {dadosModal.qsa.map((socio, i) => (
                                                    <li key={i}>
                                                        <strong>{socio.nome_socio}</strong> —{" "}
                                                        {socio.qualificacao_socio}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const CampoCopiavel = ({ label, valor, campo, copiar, copiado }) => {
    if (!valor) valor = "N/A";

    return (
        <div className="modal-field">
            <label>{label}:</label>
            <div className="modal-input-group">
                <input readOnly value={valor} />
                <button className="modal-copy-btn" onClick={() => copiar(valor, campo)}>
                    {copiado[campo] ? <FiCheck color="#10b981" /> : <FiCopy />}
                </button>
            </div>
        </div>
    );
};

export default ComercialRegiao;
