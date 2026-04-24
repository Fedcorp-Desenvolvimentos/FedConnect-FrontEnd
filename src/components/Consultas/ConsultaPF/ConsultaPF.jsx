import { useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import * as S from "./ConsultaPFStyles";
import { 
  FiUser, 
  FiFileText, 
  FiUsers, 
  FiCopy, 
  FiCheck,
  FiSearch,
  FiDownload,
  FiUpload,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import PageTemplate from "../../PageTemplate/PageTemplate";
import { formatarData } from "../../../utils/formatar_data";
import { ConsultaService } from "../../../services/consultaService";
import preencherZeros from "../../../utils/preencherZeros";
import * as XLSX from "xlsx";
import { useLoading } from "../../../hooks/useLoading";

const ConsultaPF = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { startLoading, stopLoading, withLoading } = useLoading();
  const [activeTab, setActiveTab] = useState("cpf");
  const [resultado, setResultado] = useState(null);
  const [copiado, setCopiado] = useState({});
  const [selectedResultIndex, setSelectedResultIndex] = useState(null);
  const [massConsultaMessage, setMassConsultaMessage] = useState("");
  const resultadoRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    cpf: "",
    nome: "",
    dataNascimento: "",
    motherName: "",
    fatherName: "",
    estado: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    if (name === "cpf") {
      formattedValue = value.replace(/\D/g, "").substring(0, 11);
    }
    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResultado(null);
    setSelectedResultIndex(null);

    let payload = {};
    let isValid = true;

    if (activeTab === "cpf") {
      if (formData.cpf.length !== 11) {
        enqueueSnackbar("Por favor, insira um CPF válido com 11 dígitos.", { variant: "error" });
        isValid = false;
      } else {
        payload = { tipo_consulta: "cpf", parametro_consulta: formData.cpf };
      }
    } else if (activeTab === "chaves") {
      if (!formData.nome.trim()) {
        enqueueSnackbar("Por favor, preencha o campo Nome.", { variant: "error" });
        isValid = false;
      } else {
        let formattedBirthDate = "";
        if (formData.dataNascimento) {
          const [year, month, day] = formData.dataNascimento.split("-");
          formattedBirthDate = new Date(year, month - 1, day).toLocaleDateString("pt-BR");
        }
        payload = {
          tipo_consulta: "cpf_alternativa",
          parametro_consulta: JSON.stringify({
            Datasets: "basic_data",
            q: `name{${formData.nome}}, birthdate{${formattedBirthDate}}, dateformat{dd/MM/yyyy}, mothername{${formData.motherName}}, fathername{${formData.fatherName}}`,
            Limit: 5,
          }),
        };
      }
    }

    if (!isValid) {
      return;
    }

    startLoading("Realizando consulta...");

    try {
      const response = await ConsultaService.realizarConsulta(payload);
      const apiData = response?.data ?? response;
      const apiStatus = apiData?.resultado_api?.Status?.api || apiData?.Status?.api;
      
      if (Array.isArray(apiStatus) && apiStatus[0]?.Code === -128) {
        enqueueSnackbar("Erro na base de consulta, tente novamente mais tarde", { variant: "error" });
      } else {
        setResultado(apiData);
        setTimeout(() => {
          resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err) {
      enqueueSnackbar(err?.response?.data?.detail || err?.message || "Erro ao realizar consulta.", { variant: "error" });
    } finally {
      stopLoading();
    }
  };

  const handleMassFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMassConsultaMessage("Lendo planilha...");
    startLoading("Processando planilha...");

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const cpfsValidos = jsonData
          .map(row => ({ CPF: preencherZeros(row.CPF, 11) }))
          .filter(item => item.CPF.length === 11);

        if (cpfsValidos.length === 0) {
          setMassConsultaMessage("Nenhum CPF válido encontrado.");
          stopLoading();
          return;
        }

        if (cpfsValidos.length > 250) {
          setMassConsultaMessage("Limite máximo de 250 CPFs por planilha.");
          stopLoading();
          return;
        }

        setMassConsultaMessage(`Consultando ${cpfsValidos.length} CPFs...`);
        
        const allResults = [];
        const batchSize = 5;
        
        for (let i = 0; i < cpfsValidos.length; i += batchSize) {
          const batch = cpfsValidos.slice(i, i + batchSize);
          const batchPromises = batch.map(item => 
            ConsultaService.realizarConsulta({ tipo_consulta: "cpf", parametro_consulta: item.CPF })
          );
          
          const batchResults = await Promise.allSettled(batchPromises);
          
          batchResults.forEach((result, idx) => {
            const consultaResult = result.value?.resultado_api?.Result?.[0]?.BasicData;
            allResults.push({
              "CPF Original": batch[idx].CPF,
              "Nome Completo": consultaResult?.Name || "N/A",
              CPF: consultaResult?.TaxIdNumber || "N/A",
              "Situação Cadastral": consultaResult?.TaxIdStatus || "N/A",
              "Data de Nascimento": formatarData(consultaResult?.BirthDate),
              Idade: consultaResult?.Age || "N/A",
              "Nome da Mãe": consultaResult?.MotherName || "N/A",
            });
          });
          
          setMassConsultaMessage(`Processando ${Math.min(i + batchSize, cpfsValidos.length)} de ${cpfsValidos.length}...`);
        }

        const newWorksheet = XLSX.utils.json_to_sheet(allResults);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Resultados");
        XLSX.writeFile(newWorkbook, `resultado-cpf-${new Date().toISOString().slice(0,19)}.xlsx`);
        
        setMassConsultaMessage("Processamento concluído! Download iniciado.");
        enqueueSnackbar("Planilha de resultados gerada com sucesso!", { variant: "success" });
      } catch (err) {
        setMassConsultaMessage("Erro ao processar planilha.");
        enqueueSnackbar("Erro ao processar arquivo.", { variant: "error" });
      } finally {
        stopLoading();
        event.target.value = null;
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleDownloadModel = async () => {
    startLoading("Baixando modelo...");
    try {
      const response = await ConsultaService.baixarPlanilhaModeloCPF();
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "modelo-cpf.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      enqueueSnackbar("Download do modelo iniciado!", { variant: "success" });
    } catch (err) {
      enqueueSnackbar("Erro ao baixar modelo.", { variant: "error" });
    } finally {
      stopLoading();
    }
  };

  const tabs = [
    { id: "cpf", label: "Consulta por CPF", icon: <FiUser /> },
    { id: "chaves", label: "Chaves Alternativas", icon: <FiFileText /> },
    { id: "massa", label: "Consulta em Massa", icon: <FiUsers /> },
  ];

  // Remove o loading local da UI - o global cuida disso
  return (
    <PageTemplate
      title="Consulta por Pessoa Física"
      subtitle="Consulte informações de pessoas físicas"
      icon={<FiUser />}
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
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </S.Tab>
          ))}
        </S.TabsContainer>

        {/* Formulário CPF - removido disabled do botão baseado no loading global */}
        {activeTab === "cpf" && (
          <S.Form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label>CPF</S.Label>
              <S.Input
                type="text"
                name="cpf"
                placeholder="Digite apenas números"
                value={formData.cpf}
                onChange={handleFormChange}
                maxLength={14}
              />
            </S.FormGroup>
            <S.Button type="submit">
              <FiSearch /> Consultar
            </S.Button>
          </S.Form>
        )}

        {/* Formulário Chaves Alternativas */}
        {activeTab === "chaves" && (
          <S.Form onSubmit={handleSubmit}>
            <S.FormGroup>
              <S.Label required>Nome Completo</S.Label>
              <S.Input
                type="text"
                name="nome"
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={handleFormChange}
              />
            </S.FormGroup>
            
            <S.Row>
              <S.FormGroup>
                <S.Label>Data de Nascimento</S.Label>
                <S.Input
                  type="date"
                  name="dataNascimento"
                  value={formData.dataNascimento}
                  onChange={handleFormChange}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.Label>Estado</S.Label>
                <S.Select
                  name="estado"
                  value={formData.estado}
                  onChange={handleFormChange}
                >
                  <option value="">Selecione</option>
                  <option value="DF-GO-MS-MT-TO">Centro-Oeste</option>
                  <option value="AC-AM-AP-PA-RO-RR">Norte</option>
                  <option value="CE-MA-PI">Nordeste I</option>
                  <option value="AL-PB-PE-RN">Nordeste II</option>
                  <option value="BA-SE">Nordeste III</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="ES-RJ">Espírito Santo / Rio de Janeiro</option>
                  <option value="SP">São Paulo</option>
                  <option value="PR-SC">Paraná / Santa Catarina</option>
                  <option value="RS">Rio Grande do Sul</option>
                </S.Select>
              </S.FormGroup>
            </S.Row>

            <S.Row>
              <S.FormGroup>
                <S.Label>Nome da Mãe</S.Label>
                <S.Input
                  type="text"
                  name="motherName"
                  placeholder="Nome da mãe"
                  value={formData.motherName}
                  onChange={handleFormChange}
                />
              </S.FormGroup>
              <S.FormGroup>
                <S.Label>Nome do Pai</S.Label>
                <S.Input
                  type="text"
                  name="fatherName"
                  placeholder="Nome do pai"
                  value={formData.fatherName}
                  onChange={handleFormChange}
                />
              </S.FormGroup>
            </S.Row>

            <S.Button type="submit" disabled={!formData.nome.trim()}>
              <FiSearch /> Consultar
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
            />
            {massConsultaMessage && (
              <S.InfoMessage $isError={massConsultaMessage.includes("erro") || massConsultaMessage.includes("inválido")}>
                {massConsultaMessage}
              </S.InfoMessage>
            )}
          </S.MassContainer>
        )}

        {/* Resultados CPF */}
        {activeTab === "cpf" && resultado?.resultado_api?.Result?.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultado da Consulta</S.ResultTitle>
            {(() => {
              const data = resultado.resultado_api.Result[0]?.BasicData || {};
              const fields = [
                { label: "Nome Completo", key: "nome", value: data.Name },
                { label: "CPF", key: "cpf", value: data.TaxIdNumber },
                { label: "Situação Cadastral", key: "situacao", value: data.TaxIdStatus },
                { label: "Data de Nascimento", key: "nascimento", value: formatarData(data.BirthDate) },
                { label: "Idade", key: "idade", value: data.Age },
                { label: "Nome da Mãe", key: "mae", value: data.MotherName },
                { label: "Gênero", key: "genero", value: data.Gender },
                { label: "Nome Comum", key: "alias", value: data.Aliases?.CommonName },
                { label: "Indicação de Óbito", key: "obito", value: data.HasObitIndication !== undefined ? (data.HasObitIndication ? "Sim" : "Não") : "N/A" },
              ];
              return fields.map((field) => (
                <S.ResultField key={field.key}>
                  <S.ResultLabel>{field.label}</S.ResultLabel>
                  <S.ResultValue>
                    <span>{field.value || "N/A"}</span>
                    <S.CopyButton onClick={() => copiarParaClipboard(field.value || "N/A", field.key)}>
                      {copiado[field.key] ? <FiCheck /> : <FiCopy />}
                    </S.CopyButton>
                  </S.ResultValue>
                </S.ResultField>
              ));
            })()}
          </S.ResultCard>
        )}

        {/* Resultados Chaves Alternativas */}
        {activeTab === "chaves" && resultado?.resultado_api?.Result?.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultados Encontrados ({resultado.resultado_api.Result.length})</S.ResultTitle>
            {resultado.resultado_api.Result.map((item, idx) => {
              const data = item.BasicData || {};
              const isExpanded = selectedResultIndex === idx;
              return (
                <S.ResultItem key={idx} $expanded={isExpanded}>
                  <S.ResultHeader onClick={() => setSelectedResultIndex(isExpanded ? null : idx)}>
                    <div>
                      <strong>{data.Name || "N/A"}</strong>
                      <small>CPF: {data.TaxIdNumber || "N/A"}</small>
                    </div>
                    {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                  </S.ResultHeader>
                  {isExpanded && (
                    <S.ResultDetails>
                      <S.DetailRow><strong>Data Nascimento:</strong> {formatarData(data.BirthDate)}</S.DetailRow>
                      <S.DetailRow><strong>Situação Cadastral:</strong> {data.TaxIdStatus || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Nome da Mãe:</strong> {data.MotherName || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Gênero:</strong> {data.Gender || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Idade:</strong> {data.Age || "N/A"}</S.DetailRow>
                    </S.ResultDetails>
                  )}
                </S.ResultItem>
              );
            })}
          </S.ResultCard>
        )}

        {/* Sem resultados */}
        {activeTab !== "massa" && resultado?.resultado_api?.Result?.length === 0 && (
          <S.NoResults>Nenhum resultado encontrado.</S.NoResults>
        )}
      </S.Container>
    </PageTemplate>
  );
};

export default ConsultaPF;