import { useState, useRef, useEffect } from "react";
import { useSnackbar } from "notistack";
import * as S from "./ConsultaEndStyles";
import { 
  FiMapPin, 
  FiFileText, 
  FiUsers, 
  FiCopy, 
  FiCheck,
  FiSearch,
  FiDownload,
  FiUpload,
  FiChevronDown,
  FiChevronUp,
  FiMap
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { ConsultaService } from "../../../services/consultaService";
import * as XLSX from "xlsx";

const ConsultaEnd = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState("cep");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState({});
  const [selectedResultIndex, setSelectedResultIndex] = useState(null);
  const [massConsultaMessage, setMassConsultaMessage] = useState("");
  const resultadoRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    cep: "",
    uf: "",
    cidade: "",
    rua: "",
    bairro: "",
  });

  const isValidCEP = (raw) => {
    const cep = String(raw || "").replace(/\D/g, "");
    return cep.length === 8 && cep !== "00000000";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cep") {
      formattedValue = value.replace(/\D/g, "").substring(0, 8);
    }
    if (name === "uf") {
      formattedValue = value.toUpperCase().substring(0, 2);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const copiarParaClipboard = (texto, campo) => {
    if (!texto || texto === "N/A") return;
    navigator.clipboard.writeText(texto);
    setCopiado((prev) => ({ ...prev, [campo]: true }));
    enqueueSnackbar("Copiado para área de transferência!", { variant: "success" });
    setTimeout(() => {
      setCopiado((prev) => ({ ...prev, [campo]: false }));
    }, 1500);
  };

  const buildMapsUrl = ({ street, neighborhood, city, state, cep }) => {
    const parts = [
      street?.trim(),
      neighborhood?.trim(),
      city?.trim(),
      state?.trim(),
      cep?.trim(),
    ].filter(Boolean);
    const query = parts.join(", ");
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setResultado(null);
    setSelectedResultIndex(null);

    let payload = {};
    let isValid = true;

    if (activeTab === "cep") {
      if (!formData.cep || formData.cep.length !== 8) {
        enqueueSnackbar("Por favor, insira um CEP válido com 8 dígitos.", { variant: "error" });
        isValid = false;
      } else {
        payload = { tipo_consulta: "endereco", parametro_consulta: formData.cep, origem: "manual" };
      }
    } else if (activeTab === "chaves") {
      if (!formData.uf || !formData.cidade || !formData.rua) {
        enqueueSnackbar("Por favor, preencha UF, Cidade e Rua.", { variant: "error" });
        isValid = false;
      } else if (!/^[A-Z]{2}$/.test(formData.uf)) {
        enqueueSnackbar("UF inválida. Use 2 letras maiúsculas (ex: RJ).", { variant: "error" });
        isValid = false;
      } else {
        payload = {
          tipo_consulta: "cep_rua_cidade",
          parametro_consulta: JSON.stringify({
            estado: formData.uf,
            cidade: formData.cidade,
            logradouro: formData.rua,
            ...(formData.bairro?.trim() && { bairro: formData.bairro.trim() }),
          }),
          origem: "manual",
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

        const cepsValidos = jsonData
          .map(row => String(row.CEP || "").replace(/\D/g, ""))
          .filter(cep => isValidCEP(cep));

        if (cepsValidos.length === 0) {
          setMassConsultaMessage("Nenhum CEP válido encontrado.");
          setLoading(false);
          return;
        }

        if (cepsValidos.length > 250) {
          setMassConsultaMessage("Limite máximo de 250 CEPs por planilha.");
          setLoading(false);
          return;
        }

        setMassConsultaMessage(`Consultando ${cepsValidos.length} CEPs...`);
        
        const allResults = [];
        const batchSize = 5;
        
        for (let i = 0; i < cepsValidos.length; i += batchSize) {
          const batch = cepsValidos.slice(i, i + batchSize);
          const batchPromises = batch.map(cep => 
            ConsultaService.realizarConsulta({ tipo_consulta: "endereco", parametro_consulta: cep, origem: "planilha" })
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          batchResults.forEach((result, idx) => {
            const data = result.value?.resultado_api ?? result.value?.data ?? {};
            allResults.push({
              "CEP Original": batch[idx],
              "Logradouro": data.street || data.logradouro || "N/A",
              "Bairro": data.neighborhood || data.bairro || "N/A",
              "Cidade": data.city || data.localidade || "N/A",
              "UF": data.state || data.uf || "N/A",
              "IBGE": data.ibge || "N/A",
            });
          });
          
          setMassConsultaMessage(`Processando ${Math.min(i + batchSize, cepsValidos.length)} de ${cepsValidos.length}...`);
        }

        const newWorksheet = XLSX.utils.json_to_sheet(allResults);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Resultados");
        XLSX.writeFile(newWorkbook, `resultado-cep-${new Date().toISOString().slice(0,19)}.xlsx`);
        
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
      const response = await ConsultaService.baixarPlanilhaModeloCEP();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo-cep.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      enqueueSnackbar("Download do modelo iniciado!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Erro ao baixar modelo.", { variant: "error" });
    }
  };

  const tabs = [
    { id: "cep", label: "Consulta por CEP", icon: <FiMapPin /> },
    { id: "chaves", label: "Chaves Alternativas", icon: <FiFileText /> },
    { id: "massa", label: "Consulta em Massa", icon: <FiUsers /> },
  ];

  const cepData = resultado?.resultado_api;
  const chavesResults = resultado?.resultado_api?.resultados_viacep || [];

  return (
    <PageLayout
      title="Consulta de Endereço"
      subtitle="Consulte informações de endereços por CEP"
      icon={<FiMap />}
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
                setFormData({ cep: "", uf: "", cidade: "", rua: "", bairro: "" });
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </S.Tab>
          ))}
        </S.TabsContainer>

        {/* Formulário CEP */}
        {activeTab === "cep" && (
          <S.Form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label>CEP</S.Label>
              <S.Input
                type="text"
                name="cep"
                placeholder="Digite apenas números"
                value={formData.cep}
                onChange={handleFormChange}
                disabled={loading}
                maxLength={8}
              />
            </S.FormGroup>
             <S.Button type="submit" disabled={loading}>
                {loading ? "Consultando..." : "Consultar"}
             </S.Button>
          </S.Form>
        )}

        {/* Formulário Chaves Alternativas */}
        {activeTab === "chaves" && (
          <S.Form onSubmit={handleSubmit}>
            <S.Row>
              <S.FormGroup>
                <S.Label required>UF</S.Label>
                <S.Input
                  type="text"
                  name="uf"
                  placeholder="EX: RJ"
                  value={formData.uf}
                  onChange={handleFormChange}
                  disabled={loading}
                  maxLength={2}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.Label required>Cidade</S.Label>
                <S.Input
                  type="text"
                  name="cidade"
                  placeholder="Nome da cidade"
                  value={formData.cidade}
                  onChange={handleFormChange}
                  disabled={loading}
                />
              </S.FormGroup>
            </S.Row>

            <S.FormGroup>
              <S.Label required>Rua / Logradouro</S.Label>
              <S.Input
                type="text"
                name="rua"
                placeholder="Nome da rua"
                value={formData.rua}
                onChange={handleFormChange}
                disabled={loading}
              />
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>Bairro (Opcional)</S.Label>
              <S.Input
                type="text"
                name="bairro"
                placeholder="Nome do bairro"
                value={formData.bairro}
                onChange={handleFormChange}
                disabled={loading}
              />
            </S.FormGroup>

            <S.Button type="submit" disabled={loading || !formData.uf || !formData.cidade || !formData.rua}>
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

        {/* Resultado CEP */}
        {activeTab === "cep" && cepData && cepData.cep && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultado da Consulta</S.ResultTitle>
            
            <S.ResultField>
              <S.ResultLabel>CEP</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.cep}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.cep, "cep")}>
                  {copiado.cep ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Logradouro</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.street || cepData.logradouro || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.street || cepData.logradouro || "N/A", "logradouro")}>
                  {copiado.logradouro ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Bairro</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.neighborhood || cepData.bairro || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.neighborhood || cepData.bairro || "N/A", "bairro")}>
                  {copiado.bairro ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Cidade</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.city || cepData.localidade || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.city || cepData.localidade || "N/A", "cidade")}>
                  {copiado.cidade ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>UF</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.state || cepData.uf || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.state || cepData.uf || "N/A", "uf")}>
                  {copiado.uf ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>IBGE</S.ResultLabel>
              <S.ResultValue>
                <span>{cepData.ibge || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cepData.ibge || "N/A", "ibge")}>
                  {copiado.ibge ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {(cepData.cep && (cepData.street || cepData.logradouro)) && (
              <S.MapsButton
                onClick={() => {
                  const url = buildMapsUrl({
                    street: cepData.street || cepData.logradouro,
                    neighborhood: cepData.neighborhood || cepData.bairro,
                    city: cepData.city || cepData.localidade,
                    state: cepData.state || cepData.uf,
                    cep: cepData.cep,
                  });
                  window.open(url, "_blank");
                }}
              >
                <FiMapPin /> Ver no Google Maps
              </S.MapsButton>
            )}
          </S.ResultCard>
        )}

        {/* Resultados Chaves Alternativas */}
        {activeTab === "chaves" && chavesResults.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultados Encontrados ({chavesResults.length})</S.ResultTitle>
            {chavesResults.map((item, idx) => {
              const isExpanded = selectedResultIndex === idx;
              return (
                <S.ResultItem key={idx} $expanded={isExpanded}>
                  <S.ResultHeader onClick={() => setSelectedResultIndex(isExpanded ? null : idx)}>
                    <div>
                      <strong>{item.logradouro || "N/A"}</strong>
                      <small>{item.cep || "N/A"} - {item.localidade || "N/A"}/{item.uf || "N/A"}</small>
                    </div>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </S.ResultHeader>
                  {isExpanded && (
                    <S.ResultDetails>
                      <S.DetailRow><strong>CEP:</strong> {item.cep || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Logradouro:</strong> {item.logradouro || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Bairro:</strong> {item.bairro || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Cidade:</strong> {item.localidade || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>UF:</strong> {item.uf || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Complemento:</strong> {item.complemento || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>IBGE:</strong> {item.ibge || "N/A"}</S.DetailRow>
                      {(item.cep && item.logradouro) && (
                        <S.MapsButtonSmall
                          onClick={() => {
                            const url = buildMapsUrl({
                              street: item.logradouro,
                              neighborhood: item.bairro,
                              city: item.localidade,
                              state: item.uf,
                              cep: item.cep,
                            });
                            window.open(url, "_blank");
                          }}
                        >
                          <FiMapPin size={14} /> Ver no Maps
                        </S.MapsButtonSmall>
                      )}
                    </S.ResultDetails>
                  )}
                </S.ResultItem>
              );
            })}
          </S.ResultCard>
        )}

        {/* Sem resultados */}
        {activeTab !== "massa" && resultado && chavesResults.length === 0 && !loading && (
          <S.NoResults>Nenhum resultado encontrado.</S.NoResults>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default ConsultaEnd;