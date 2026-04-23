import { useState, useRef, useEffect } from "react";
import * as XLSX from "xlsx";
import { FiCopy, FiCheck, FiX, FiMapPin, FiPhone, FiGlobe, FiSearch, FiDownload, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { FaBuilding, FaMapMarkerAlt, FaPhoneAlt, FaGlobe, FaFileExcel, FaBuilding as FaCompany, FaTimes } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import * as S from "./ComercialRegiaoStyles";
import { ConsultaService } from "../../../services/consultaService";
import { ConsultaRegiaoService } from "../../../services/consultaRegiaoService";
import { useGlobal } from "../../../context/GlobalContext";
import PageTemplate from "../../../components/PageTemplate/PageTemplate";

const ComercialRegiao = () => {
    const [form, setForm] = useState({
        uf: "",
        municipio: "",
        bairro: "",
    });

    const { loading, setLoading, setLoadingMessage } = useGlobal();
    const [erro, setErro] = useState(null);
    const [resultados, setResultados] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const [nextPageToken, setNextPageToken] = useState(null);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [todosResultados, setTodosResultados] = useState([]);

    // Modal
    const [modalAberto, setModalAberto] = useState(false);
    const [dadosModal, setDadosModal] = useState(null);
    const [loadingModal, setLoadingModal] = useState(false);
    const [erroModal, setErroModal] = useState(null);
    const [copiado, setCopiado] = useState({});
    const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState("");

    // Dados de localidades
    const [localidades, setLocalidades] = useState({});
    const [municipios, setMunicipios] = useState([]);
    const [bairros, setBairros] = useState([]);

    const resultadosRef = useRef(null);

    // Carregar localidades
    useEffect(() => {
        const fetchLocalidades = async () => {
            setLoadingMessage("Carregando localidades...");
            setLoading(true);
            try {
                const data = await ConsultaRegiaoService.getLocalidades();
                setLocalidades(data.data || {});
            } catch (err) {
                setErro("Erro ao carregar localidades. Tente novamente mais tarde.");
            } finally {
                setLoading(false);
            }
        };
        fetchLocalidades();
    }, []);

    // Quando UF mudar, atualizar municípios
    useEffect(() => {
        if (form.uf && localidades[form.uf]) {
            const municipiosList = Object.keys(localidades[form.uf].municipios).map(nome => ({
                nome: nome,
                total_bairros: localidades[form.uf].municipios[nome].total_bairros
            }));
            setMunicipios(municipiosList.sort((a, b) => a.nome.localeCompare(b.nome)));
            setForm(prev => ({ ...prev, municipio: "", bairro: "" }));
            setBairros([]);
        } else {
            setMunicipios([]);
            setBairros([]);
        }
    }, [form.uf, localidades]);

    // Quando município mudar, atualizar bairros
    useEffect(() => {
        if (form.uf && form.municipio && localidades[form.uf]) {
            const municipioData = localidades[form.uf].municipios[form.municipio];
            if (municipioData && municipioData.bairros) {
                setBairros(municipioData.bairros || []);
                setForm(prev => ({ ...prev, bairro: "" }));
            } else {
                setBairros([]);
            }
        } else {
            setBairros([]);
        }
    }, [form.uf, form.municipio, localidades]);

    useEffect(() => {
        if (resultados.length > 0 && resultadosRef.current) {
            setTimeout(() => {
                resultadosRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
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
        setLoadingMessage("Carregando dados, por favor aguarde...");
        setLoading(true);
        setErro(null);

        if (!form.uf || !form.municipio) {
            setErro("UF e município são obrigatórios.");
            setLoading(false);
            return;
        }

        try {
            setTodosResultados([]);
            setNextPageToken(null);
            
            const payload = {
                uf: form.uf,
                municipio: form.municipio,
                ...(form.bairro && { bairro: form.bairro })
            };
            
            const resp = await ConsultaService.consultaRegiao(payload);

            if (resp && Array.isArray(resp.resultados)) {
                setTodosResultados(resp.resultados);
                setResultados(resp.resultados);
                setNextPageToken(resp.next_page_token);
            } else {
                setTodosResultados([]);
                setResultados([]);
            }

            setHasSearched(true);
        } catch (err) {
            console.error(err);
            setErro("Erro ao consultar a região. Tente novamente.");
            setTodosResultados([]);
            setResultados([]);
        } finally {
            setLoading(false);
        }
    };

    const carregarMaisResultados = async () => {
        if (!nextPageToken || carregandoMais) return;
        
        setCarregandoMais(true);
        
        try {
            const payload = {
                uf: form.uf,
                municipio: form.municipio,
                ...(form.bairro && { bairro: form.bairro }),
                page_token: nextPageToken
            };
            
            const resp = await ConsultaService.consultaRegiao(payload);

            if (resp && Array.isArray(resp.resultados)) {
                const novosResultados = [...todosResultados, ...resp.resultados];
                setTodosResultados(novosResultados);
                setResultados(novosResultados);
                setNextPageToken(resp.next_page_token);
            }
        } catch (err) {
            console.error("Erro ao carregar mais resultados:", err);
            setErro("Erro ao carregar mais resultados.");
        } finally {
            setCarregandoMais(false);
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

    const criarLinkWhatsApp = (phoneRaw) => {
        if (!phoneRaw) return "#";
        let digits = phoneRaw.toString().replace(/\D/g, "");
        if (digits.length === 11 && digits.startsWith("0")) {
            digits = digits.slice(1);
        }
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
                "Data Início Atividade": formatarDataBrasileira(dadosModal.data_inicio_atividade),
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

    const CampoCopiavel = ({ label, valor, campo }) => {
        const displayValor = valor || "N/A";
        return (
            <S.ModalField>
                <S.ModalLabel>{label}:</S.ModalLabel>
                <S.ModalInputGroup>
                    <S.ModalInput readOnly value={displayValor} />
                    <S.ModalCopyBtn onClick={() => copiarParaClipboard(displayValor, campo)}>
                        {copiado[campo] ? <FiCheck color="#10b981" size={18} /> : <FiCopy size={18} />}
                    </S.ModalCopyBtn>
                </S.ModalInputGroup>
            </S.ModalField>
        );
    };

    return (
        <PageTemplate
            title="Buscar por Região"
            subtitle="Encontre empresas por estado, município e bairro"
            icon={<FaMapMarkerAlt />}
        >
            <S.Container>
                <S.Form onSubmit={handleSubmit}>
                    <S.FormRow>
                        <S.Label>Estado *</S.Label>
                        <S.Select 
                            name="uf" 
                            value={form.uf} 
                            onChange={handleChange}
                        >
                            <option value="">
                                {Object.keys(localidades).length > 0 ? "Selecione um estado" : "Carregando estados..."}
                            </option>
                            {Object.keys(localidades).sort().map(sigla => (
                                <option key={sigla} value={sigla}>{sigla}</option>
                            ))}
                        </S.Select>
                    </S.FormRow>

                    <S.FormRow>
                        <S.Label>Município *</S.Label>
                        <S.Select 
                            name="municipio" 
                            value={form.municipio} 
                            onChange={handleChange}
                            disabled={!form.uf || municipios.length === 0}
                        >
                            <option value="">Selecione um município</option>
                            {municipios.map(m => (
                                <option key={m.nome} value={m.nome}>{m.nome}</option>
                            ))}
                        </S.Select>
                    </S.FormRow>

                    {bairros.length > 0 && (
                        <S.FormRow>
                            <S.Label>Bairro (opcional)</S.Label>
                            <S.Select 
                                name="bairro" 
                                value={form.bairro} 
                                onChange={handleChange}
                            >
                                <option value="">Todos os bairros</option>
                                {bairros.map(b => (
                                    <option key={b.nome} value={b.nome}>{b.nome}</option>
                                ))}
                            </S.Select>
                        </S.FormRow>
                    )}

                    <S.SubmitButton type="submit" disabled={loading}>
                        {loading ? <S.SpinnerIcon /> : <FiSearch />}
                        {loading ? "Buscando..." : "Buscar"}
                    </S.SubmitButton>

                    {erro && <S.ErrorAlert>{erro}</S.ErrorAlert>}
                </S.Form>

                <S.ResultsContainer ref={resultadosRef}>
                    {resultados.length > 0 && (
                        <>
                            <S.ResultHeader>
                                <S.ResultTitle>
                                    <FaBuilding /> Empresas encontradas:
                                    <S.CountBadge>{resultados.length}</S.CountBadge>
                                </S.ResultTitle>
                                <S.ExportButton onClick={exportarExcel}>
                                    <FaFileExcel /> Exportar Excel
                                </S.ExportButton>
                            </S.ResultHeader>

                            <S.CardsList>
                                {resultadosPaginados.map((item, i) => (
                                    <S.Card key={i}>
                                        <S.CardHeader>
                                            <S.CardTitle>{item.displayName?.text || "Nome não informado"}</S.CardTitle>
                                            <S.CardIcon>
                                                <FaCompany />
                                            </S.CardIcon>
                                        </S.CardHeader>

                                        <S.CardBody>
                                            <S.InfoItem>
                                                <FiMapPin />
                                                <span>{item.formattedAddress || "Endereço não informado"}</span>
                                            </S.InfoItem>
                                            
                                            {item.nationalPhoneNumber && (
                                                <S.InfoItem>
                                                    <FiPhone />
                                                    <S.StyledLink href={criarLinkWhatsApp(item.nationalPhoneNumber)} target="_blank" rel="noreferrer">
                                                        {item.nationalPhoneNumber}
                                                    </S.StyledLink>
                                                </S.InfoItem>
                                            )}

                                            {item.websiteUri && (
                                                <S.InfoItem>
                                                    <FiGlobe />
                                                    <S.StyledLink href={item.websiteUri.startsWith("http") ? item.websiteUri : `https://${item.websiteUri}`} target="_blank" rel="noreferrer">
                                                        {item.websiteUri.replace(/^https?:\/\//, "")}
                                                    </S.StyledLink>
                                                </S.InfoItem>
                                            )}
                                        </S.CardBody>

                                        <S.CardFooter>
                                            <S.MapsButton 
                                                href={criarLinkMaps(item.displayName?.text, item.formattedAddress)} 
                                                target="_blank" 
                                                rel="noreferrer"
                                            >
                                                <FiMapPin /> Ver no Maps
                                            </S.MapsButton>
                                            <S.DetailsButton 
                                                onClick={() => {
                                                    const nome = item.displayName?.text;
                                                    setEmpresaSelecionadaNome(nome || "");
                                                    buscarDetalhesPorRazaoSocial(nome);
                                                }}
                                            >
                                                <FaBuilding /> Ver detalhes
                                            </S.DetailsButton>
                                        </S.CardFooter>
                                    </S.Card>
                                ))}
                            </S.CardsList>

                            {totalPaginas > 1 && (
                                <S.Pagination>
                                    <S.PaginationButton 
                                        onClick={() => mudarPagina(paginaAtual - 1)}
                                        disabled={paginaAtual === 1}
                                    >
                                        <FiChevronLeft /> Anterior
                                    </S.PaginationButton>
                                    <S.PaginationNumbers>
                                        {[...Array(totalPaginas)].map((_, index) => (
                                            <S.PaginationNumber
                                                key={index}
                                                $active={paginaAtual === index + 1}
                                                onClick={() => mudarPagina(index + 1)}
                                            >
                                                {index + 1}
                                            </S.PaginationNumber>
                                        ))}
                                    </S.PaginationNumbers>
                                    <S.PaginationButton 
                                        onClick={() => mudarPagina(paginaAtual + 1)}
                                        disabled={paginaAtual === totalPaginas}
                                    >
                                        Próxima <FiChevronRight />
                                    </S.PaginationButton>
                                </S.Pagination>
                            )}
                        </>
                    )}

                    {nextPageToken && (
                        <S.LoadMoreContainer>
                            <S.LoadMoreButton onClick={carregarMaisResultados} disabled={carregandoMais}>
                                {carregandoMais ? <FiLoader /> : <FiSearch />}
                                {carregandoMais ? "Carregando..." : "Carregar mais resultados"}
                            </S.LoadMoreButton>
                        </S.LoadMoreContainer>
                    )}

                    {!loading && hasSearched && resultados.length === 0 && (
                        <S.NoResults>
                            <FiSearch size={48} />
                            <p>Nenhum resultado encontrado.</p>
                        </S.NoResults>
                    )}
                </S.ResultsContainer>

                {/* Modal */}
                {modalAberto && (
                    <S.ModalOverlay onClick={fecharModal}>
                        <S.ModalContent onClick={(e) => e.stopPropagation()}>
                            <S.ModalHeader>
                                <S.ModalTitle>
                                    <FaBuilding /> Detalhes da Empresa
                                    {empresaSelecionadaNome && <span>— {empresaSelecionadaNome}</span>}
                                </S.ModalTitle>
                                <S.ModalCloseBtn onClick={fecharModal}>
                                    <FaTimes />
                                </S.ModalCloseBtn>
                            </S.ModalHeader>

                            <S.ModalBody>
                                {loadingModal && (
                                    <S.ModalLoading>
                                        <S.ModalSpinner />
                                        <p>Buscando informações...</p>
                                    </S.ModalLoading>
                                )}

                                {!loadingModal && erroModal && (
                                    <S.ModalError>
                                        <GiCancel size={48} />
                                        <p>{erroModal}</p>
                                    </S.ModalError>
                                )}

                                {!loadingModal && dadosModal && (
                                    <>
                                        <S.ModalActions>
                                            {!loadingModal && !erroModal && dadosModal && (
                                                <S.ExportButtonModal onClick={exportarExcelDetalhes}>
                                                    <FaFileExcel /> Baixar Excel
                                                </S.ExportButtonModal>
                                            )}
                                        </S.ModalActions>
                                        <S.ModalDados>
                                            <CampoCopiavel label="Razão Social" valor={dadosModal.razao_social} campo="razao" />
                                            <CampoCopiavel label="CNPJ" valor={dadosModal.cnpj} campo="cnpj" />
                                            <CampoCopiavel label="Situação Cadastral" valor={dadosModal.descricao_situacao_cadastral} campo="situacao" />
                                            {dadosModal.ddd_telefone_1 && <CampoCopiavel label="Telefone" valor={dadosModal.ddd_telefone_1} campo="telefone" />}
                                            {dadosModal.email && <CampoCopiavel label="Email" valor={dadosModal.email} campo="email" />}
                                            <CampoCopiavel 
                                                label="Endereço" 
                                                valor={`${dadosModal.descricao_tipo_de_logradouro || ""} ${dadosModal.logradouro || ""}, ${dadosModal.numero || ""} ${dadosModal.complemento || ""}`.trim()} 
                                                campo="endereco" 
                                            />
                                            <CampoCopiavel label="Bairro" valor={dadosModal.bairro} campo="bairro" />
                                            <CampoCopiavel label="Cidade / UF" valor={`${dadosModal.municipio} - ${dadosModal.uf}`} campo="cidade_uf" />
                                            
                                            <S.ModalField>
                                                <S.ModalLabel>CNAE Principal:</S.ModalLabel>
                                                <S.ModalInput readOnly value={dadosModal.cnae_fiscal_descricao || "N/A"} />
                                            </S.ModalField>

                                            {dadosModal.cnaes_secundarios?.length > 0 && (
                                                <S.ModalField>
                                                    <S.ModalLabel>CNAEs Secundários:</S.ModalLabel>
                                                    <S.SecondaryList>
                                                        {dadosModal.cnaes_secundarios.map((c, i) => (
                                                            <li key={i}>{c.descricao}</li>
                                                        ))}
                                                    </S.SecondaryList>
                                                </S.ModalField>
                                            )}

                                            <S.ModalField>
                                                <S.ModalLabel>Porte:</S.ModalLabel>
                                                <S.ModalInput readOnly value={dadosModal.porte || "N/A"} />
                                            </S.ModalField>

                                            {dadosModal.qsa?.length > 0 && (
                                                <S.ModalField>
                                                    <S.ModalLabel>Quadro Societário (QSA):</S.ModalLabel>
                                                    <S.QsaList>
                                                        {dadosModal.qsa.map((socio, i) => (
                                                            <li key={i}>
                                                                <strong>{socio.nome_socio}</strong> — {socio.qualificacao_socio}
                                                            </li>
                                                        ))}
                                                    </S.QsaList>
                                                </S.ModalField>
                                            )}
                                        </S.ModalDados>
                                    </>
                                )}
                            </S.ModalBody>
                        </S.ModalContent>
                    </S.ModalOverlay>
                )}
            </S.Container>
        </PageTemplate>
    );
};

export default ComercialRegiao;