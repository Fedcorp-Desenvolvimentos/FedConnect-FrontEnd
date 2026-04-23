import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import * as S from "./ConsultaCNPJStyles";
import { 
  FiFileText, 
  FiUsers, 
  FiCopy, 
  FiCheck,
  FiSearch,
  FiDownload,
  FiUpload,
  FiChevronDown,
  FiChevronUp,
  FiMapPin
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import PageTemplate from "../../PageTemplate/PageTemplate";
import { ConsultaService } from "../../../services/consultaService";
import preencherZeros from "../../../utils/preencherZeros";
import * as XLSX from "xlsx";
import { BsFillBuildingFill } from "react-icons/bs";

function formatarDataBrasileira(dataStr) {
  if (!dataStr) return "";
  if (dataStr.length > 10 && dataStr[4] === "-") {
    const [ano, mes, dia] = dataStr.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
  }
  const match = dataStr.match(/^(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})$/);
  if (match) {
    const [, ano, mes, dia] = match;
    return `${String(dia).padStart(2, "0")}/${String(mes).padStart(2, "0")}/${ano}`;
  }
  return dataStr;
}

function isValidCNPJ(raw) {
  const cnpj = String(raw).replace(/\D/g, "");
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  
  const calcDV = (base) => {
    let soma = 0;
    const pesos = base.length === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < pesos.length; i++) {
      soma += Number(base[i]) * pesos[i];
    }
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };
  
  const dv1 = calcDV(cnpj.slice(0, 12));
  const dv2 = calcDV(cnpj.slice(0, 12) + dv1);
  return cnpj.endsWith(`${dv1}${dv2}`);
}

function montarEnderecoParaMaps({ cep, tipo, logradouro, numero, cidade, uf, complemento }) {
  const partes = [];
  if (cep) partes.push(String(cep));
  const rua = (tipo && logradouro ? `${tipo} ${logradouro}` : tipo || logradouro) || "";
  const ruaNumero = rua ? `${rua}${numero ? `, ${numero}` : ""}` : "";
  if (ruaNumero) partes.push(ruaNumero);
  if (complemento) partes.push(String(complemento));
  if (cidade) partes.push(String(cidade));
  if (uf) partes.push(String(uf));

  return partes
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" ");
}

const ConsultaCNPJ = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("cnpj");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState({});
  const [selectedResultIndex, setSelectedResultIndex] = useState(null);
  const [massConsultaMessage, setMassConsultaMessage] = useState("");
  const resultadoRef = useRef(null);

  // Form state
  const [cnpj, setCnpj] = useState("");
  const [formData, setFormData] = useState({
    razaoSocial: "",
    uf: "",
    email: "",
    telefone: "",
  });

  const handleCnpjChange = (e) => {
    const rawCnpj = e.target.value.replace(/\D/g, "").slice(0, 14);
    setCnpj(rawCnpj);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const copiarParaClipboard = (texto, campo) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopiado((prev) => ({ ...prev, [campo]: true }));
    enqueueSnackbar("Copiado para área de transferência!", { variant: "success" });
    setTimeout(() => {
      setCopiado((prev) => ({ ...prev, [campo]: false }));
    }, 1500);
  };

  const getResultData = (res) => {
    if (!res) return null;
    const root = res?.resultado_api ?? res;
    return root;
  };

  const getResultList = (res) => {
    if (!res) return [];
    const root = getResultData(res);
    if (Array.isArray(root?.Result)) return root.Result;
    if (root?.cnpj || root?.razao_social) return [{ BasicData: root }];
    return [];
  };

  const cnpjData = getResultData(resultado);
  const resultList = getResultList(resultado);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResultado(null);
    setSelectedResultIndex(null);

    let payload = {};
    let isValid = true;

    if (activeTab === "cnpj") {
      if (cnpj.length !== 14) {
        enqueueSnackbar("Por favor, insira um CNPJ válido com 14 dígitos.", { variant: "error" });
        isValid = false;
      } else if (!isValidCNPJ(cnpj)) {
        enqueueSnackbar("CNPJ inválido: os dígitos verificadores não conferem.", { variant: "error" });
        isValid = false;
      } else {
        payload = { tipo_consulta: "cnpj", parametro_consulta: cnpj };
      }
    } else if (activeTab === "chaves") {
      if (!formData.razaoSocial.trim()) {
        enqueueSnackbar("Por favor, preencha a Razão Social.", { variant: "error" });
        isValid = false;
      } else {
        const bigDataCorpPayload = {
          Datasets: "basic_data",
          q: `name{${formData.razaoSocial.trim()}}`,
          Limit: 5,
        };
        payload = {
          tipo_consulta: "cnpj_razao_social",
          parametro_consulta: JSON.stringify(bigDataCorpPayload),
        };
      }
    }

    if (!isValid) {
      setLoading(false);
      return;
    }

    try {
      const response = await ConsultaService.realizarConsulta(payload);
      const apiData = response?.data ?? response;
      setResultado(apiData);
      setTimeout(() => {
        resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.detail || err?.message || "Erro ao realizar consulta.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleMassFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setMassConsultaMessage("Lendo planilha...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const cnpjsValidos = jsonData
          .map(row => preencherZeros(row.CNPJ, 14))
          .filter(cnpj => cnpj.length === 14 && isValidCNPJ(cnpj));

        if (cnpjsValidos.length === 0) {
          setMassConsultaMessage("Nenhum CNPJ válido encontrado.");
          setLoading(false);
          return;
        }

        if (cnpjsValidos.length > 250) {
          setMassConsultaMessage("Limite máximo de 250 CNPJs por planilha.");
          setLoading(false);
          return;
        }

        setMassConsultaMessage(`Consultando ${cnpjsValidos.length} CNPJs...`);
        
        const allResults = [];
        const batchSize = 5;
        
        for (let i = 0; i < cnpjsValidos.length; i += batchSize) {
          const batch = cnpjsValidos.slice(i, i + batchSize);
          const batchPromises = batch.map(item => 
            ConsultaService.realizarConsulta({ tipo_consulta: "cnpj", parametro_consulta: item })
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          batchResults.forEach((result, idx) => {
            const data = result.value?.resultado_api ?? result.value?.data ?? {};
            allResults.push({
              "CNPJ Original": batch[idx],
              "Razão Social": data.razao_social || "N/A",
              "Nome Fantasia": data.nome_fantasia || "N/A",
              "Situação Cadastral": data.descricao_situacao_cadastral || "N/A",
              "Atividade Principal": data.cnae_fiscal_descricao || "N/A",
              "UF": data.uf || "N/A",
              "Município": data.municipio || "N/A",
              "Telefone": data.ddd_telefone_1 || data.ddd_telefone_2 || "N/A",
            });
          });
          
          setMassConsultaMessage(`Processando ${Math.min(i + batchSize, cnpjsValidos.length)} de ${cnpjsValidos.length}...`);
        }

        const newWorksheet = XLSX.utils.json_to_sheet(allResults);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Resultados");
        XLSX.writeFile(newWorkbook, `resultado-cnpj-${new Date().toISOString().slice(0,19)}.xlsx`);
        
        setMassConsultaMessage("Processamento concluído! Download iniciado.");
        enqueueSnackbar("Planilha de resultados gerada com sucesso!", { variant: "success" });
      } catch (err) {
        setMassConsultaMessage("Erro ao processar planilha.");
        enqueueSnackbar("Erro ao processar arquivo.", { variant: "error" });
      } finally {
        setLoading(false);
        event.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadModel = async () => {
    try {
      const response = await ConsultaService.baixarPlanilhaModeloCNPJ();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo-cnpj.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      enqueueSnackbar("Download do modelo iniciado!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Erro ao baixar modelo.", { variant: "error" });
    }
  };

  const tabs = [
    { id: "cnpj", label: "Consulta por CNPJ", icon: <BsFillBuildingFill /> },
    { id: "chaves", label: "Chaves Alternativas", icon: <FiFileText /> },
    { id: "massa", label: "Consulta em Massa", icon: <FiUsers /> },
  ];

  return (
    <PageTemplate
      title="Consulta por Pessoa Jurídica"
      subtitle="Consulte informações de pessoas jurídicas"
      icon={<BsFillBuildingFill />}
    >
      <S.Container>
        {/* Tabs */}
        <S.TabsContainer>
          {tabs.map((tab) => (
            <S.Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResultado(null);
                setMassConsultaMessage("");
                setCnpj("");
                setFormData({ razaoSocial: "", uf: "", email: "", telefone: "" });
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </S.Tab>
          ))}
        </S.TabsContainer>

        {/* Formulário CNPJ */}
        {activeTab === "cnpj" && (
          <S.Form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label>CNPJ</S.Label>
              <S.Input
                type="text"
                name="cnpj"
                placeholder="Digite apenas números"
                value={cnpj}
                onChange={handleCnpjChange}
                disabled={loading}
                maxLength={14}
              />
            </S.FormGroup>
            <S.Button type="submit" disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : <FiSearch />}
              {loading ? "Consultando..." : "Consultar"}
            </S.Button>
          </S.Form>
        )}

        {/* Formulário Chaves Alternativas */}
        {activeTab === "chaves" && (
          <S.Form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label required>Razão Social</S.Label>
              <S.Input
                type="text"
                name="razaoSocial"
                placeholder="Digite a razão social"
                value={formData.razaoSocial}
                onChange={handleFormChange}
                disabled={loading}
              />
            </S.FormGroup>

            <S.Button type="submit" disabled={loading || !formData.razaoSocial.trim()}>
              {loading ? <FaSpinner className="spinner" /> : <FiSearch />}
              {loading ? "Consultando..." : "Consultar"}
            </S.Button>
          </S.Form>
        )}

        {/* Formulário Massa */}
        {activeTab === "massa" && (
          <S.MassContainer>
            <S.ButtonGroup>
              <S.ButtonOutline onClick={() => document.getElementById("mass-file-input").click()}>
                <FiUpload />
                Importar Planilha
              </S.ButtonOutline>
              <S.ButtonOutline onClick={handleDownloadModel}>
                <FiDownload />
                Baixar Modelo
              </S.ButtonOutline>
            </S.ButtonGroup>
            <input
              id="mass-file-input"
              type="file"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleMassFileUpload}
              disabled={loading}
            />
            {loading && (
              <S.LoadingMessage>
                <FaSpinner className="spinner" />
                {massConsultaMessage || "Processando..."}
              </S.LoadingMessage>
            )}
            {!loading && massConsultaMessage && (
              <S.InfoMessage $isError={massConsultaMessage.includes("erro") || massConsultaMessage.includes("inválido")}>
                {massConsultaMessage}
              </S.InfoMessage>
            )}
          </S.MassContainer>
        )}

        {/* Resultado CNPJ */}
        {activeTab === "cnpj" && cnpjData && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultado da Consulta</S.ResultTitle>
            
            <S.ResultField>
              <S.ResultLabel>Razão Social</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.razao_social || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.razao_social || "N/A", "razao_social")}>
                  {copiado.razao_social ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Nome Fantasia</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.nome_fantasia || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.nome_fantasia || "N/A", "nome_fantasia")}>
                  {copiado.nome_fantasia ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>CNPJ</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.cnpj || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.cnpj || "N/A", "cnpj")}>
                  {copiado.cnpj ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Situação Cadastral</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.descricao_situacao_cadastral || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.descricao_situacao_cadastral || "N/A", "situacao")}>
                  {copiado.situacao ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Atividade Principal</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.cnae_fiscal_descricao || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.cnae_fiscal_descricao || "N/A", "atividade")}>
                  {copiado.atividade ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Matriz/Filial</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.descricao_identificador_matriz_filial || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.descricao_identificador_matriz_filial || "N/A", "matriz")}>
                  {copiado.matriz ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Data de Início</S.ResultLabel>
              <S.ResultValue>
                <span>{formatarDataBrasileira(cnpjData.data_inicio_atividade) || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(formatarDataBrasileira(cnpjData.data_inicio_atividade) || "N/A", "data_inicio")}>
                  {copiado.data_inicio ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Telefone</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.ddd_telefone_1 || cnpjData.ddd_telefone_2 || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.ddd_telefone_1 || cnpjData.ddd_telefone_2 || "N/A", "telefone")}>
                  {copiado.telefone ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Endereço</S.ResultLabel>
              <S.ResultValue>
                <span>
                  {cnpjData.logradouro ? 
                    `${cnpjData.descricao_tipo_de_logradouro || ""} ${cnpjData.logradouro || ""}${cnpjData.numero ? `, ${cnpjData.numero}` : ""}`.trim() 
                    : "N/A"}
                </span>
                {cnpjData.cep && (cnpjData.logradouro || cnpjData.descricao_tipo_de_logradouro) && (
                  <S.MapsButton
                    onClick={() => {
                      const endereco = montarEnderecoParaMaps({
                        cep: cnpjData.cep,
                        tipo: cnpjData.descricao_tipo_de_logradouro,
                        logradouro: cnpjData.logradouro,
                        numero: cnpjData.numero,
                        cidade: cnpjData.municipio,
                        uf: cnpjData.uf,
                        complemento: cnpjData.complemento,
                      });
                      window.open(`https://www.google.com/maps/place/${encodeURIComponent(endereco)}`, "_blank");
                    }}
                  >
                    <FiMapPin />
                  </S.MapsButton>
                )}
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Bairro</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.bairro || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.bairro || "N/A", "bairro")}>
                  {copiado.bairro ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Município/UF</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.municipio || "N/A"} / {cnpjData.uf || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(`${cnpjData.municipio || "N/A"} / ${cnpjData.uf || "N/A"}`, "municipio")}>
                  {copiado.municipio ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>CEP</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjData.cep || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjData.cep || "N/A", "cep")}>
                  {copiado.cep ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>
          </S.ResultCard>
        )}

        {/* Resultados Chaves Alternativas */}
        {activeTab === "chaves" && resultList.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultados Encontrados ({resultList.length})</S.ResultTitle>
            {resultList.map((item, idx) => {
              const data = item.BasicData || item;
              const isExpanded = selectedResultIndex === idx;
              const enderecoMaps = data.Address ? montarEnderecoParaMaps({
                cep: data.Address?.ZipCode,
                tipo: data.Address?.StreetType,
                logradouro: data.Address?.Street,
                numero: data.Address?.Number,
                cidade: data.Address?.City,
                uf: data.Address?.State || data.HeadquarterState,
                complemento: data.Address?.Complement,
              }) : "";
              const podeAbrirMapa = enderecoMaps && (data.Address?.ZipCode || data.Address?.Street);

              return (
                <S.ResultItem key={idx} $expanded={isExpanded}>
                  <S.ResultHeader onClick={() => setSelectedResultIndex(isExpanded ? null : idx)}>
                    <div>
                      <strong>{data.OfficialName || "N/A"}</strong>
                      <small>CNPJ: {data.TaxIdNumber || "N/A"}</small>
                    </div>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </S.ResultHeader>
                  {isExpanded && (
                    <S.ResultDetails>
                      <S.DetailRow><strong>Nome Fantasia:</strong> {data.TradeName || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Situação Cadastral:</strong> {data.TaxIdStatus || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Telefone:</strong> {data.Contact?.Phone1 || data.Contact?.Phone2 || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Email:</strong> {data.Contact?.Email || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Endereço:</strong> 
                        {data.Address?.StreetType || data.Address?.Street ? 
                          `${data.Address?.StreetType || ""} ${data.Address?.Street || ""}${data.Address?.Number ? `, ${data.Address?.Number}` : ""}`.trim()
                          : "N/A"}
                        {podeAbrirMapa && (
                          <S.MapsButtonSmall
                            onClick={() => window.open(`https://www.google.com/maps/place/${encodeURIComponent(enderecoMaps)}`, "_blank")}
                          >
                            <FiMapPin size={14} /> Maps
                          </S.MapsButtonSmall>
                        )}
                      </S.DetailRow>
                      <S.DetailRow><strong>Bairro:</strong> {data.Address?.Neighborhood || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Município/UF:</strong> {data.Address?.City || "N/A"} / {data.HeadquarterState || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>CEP:</strong> {data.Address?.ZipCode || "N/A"}</S.DetailRow>
                    </S.ResultDetails>
                  )}
                </S.ResultItem>
              );
            })}
          </S.ResultCard>
        )}

        {/* Sem resultados */}
        {activeTab !== "massa" && resultado && resultList.length === 0 && !loading && (
          <S.NoResults>Nenhum resultado encontrado.</S.NoResults>
        )}
      </S.Container>
    </PageTemplate>
  );
};

export default ConsultaCNPJ;