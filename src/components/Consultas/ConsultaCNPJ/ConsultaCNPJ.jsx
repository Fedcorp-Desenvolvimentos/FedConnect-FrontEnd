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
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { ConsultaService } from "../../../services/consultaService";
import preencherZeros from "../../../utils/preencherZeros";
import * as XLSX from "xlsx";
import { BsFillBuildingFill } from "react-icons/bs";
import { useLoading } from "../../../hooks/useLoading";

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
  const { startLoading, stopLoading, updateProgress } = useLoading(); // ALTERADO
  const [activeTab, setActiveTab] = useState("cnpj");
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
    if (!texto || texto === "N/A") return;
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

  if (Array.isArray(root?.Result)) {
    return root.Result.map((item) => item.BasicData ?? item);
  }

  if (root?.cnpj || root?.razao_social) {
    return [root];
  }

  return [];
};

  const flatToBasicData = (flat) => {
    if (!flat) return null;
    return {
      OfficialName: flat.razao_social ?? null,
      TradeName: flat.nome_fantasia ?? null,
      TaxIdNumber: flat.cnpj ?? null,
      HeadquarterState: flat.uf ?? null,
      TaxIdStatus: flat.descricao_situacao_cadastral ?? null,
      FoundedDate: flat.data_inicio_atividade ?? null,
      CnaePrincipal: flat.cnae_fiscal_descricao ?? null,
      CnaeFiscal: flat.cnae_fiscal ?? null,
      Porte: flat.porte ?? null,
      NaturezaJuridica: flat.natureza_juridica ?? null,
      MatrizFilial: flat.descricao_identificador_matriz_filial ?? null,
      AtividadesSecundarias: flat.cnaes_secundarios ?? [],
      Contact: {
        Phone1: flat.ddd_telefone_1 ?? null,
        Phone2: flat.ddd_telefone_2 ?? null,
        Email: flat.email ?? null,
      },
      Address: {
        Neighborhood: flat.bairro ?? null,
        ZipCode: flat.cep ?? null,
        StreetType: flat.descricao_tipo_de_logradouro ?? null,
        Street: flat.logradouro ?? null,
        Complement: flat.complemento ?? null,
        Number: flat.numero ?? null,
        City: flat.municipio ?? null,
        State: flat.uf ?? null,
      },
    };
  };

  const cnpjData = getResultData(resultado);
  const resultList = getResultList(resultado);
  const cnpjDataFlat = flatToBasicData(cnpjData);

  const handleSubmit = async (event) => {
    event.preventDefault();
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
      return;
    }

    startLoading("Realizando consulta...");

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
      stopLoading();
    }
  };

  function formatarMoedaBR(valor) {
    if (valor == null || valor === "") return <i>não informado</i>;
    let numero = valor;
    if (typeof valor === "string") {
      numero = valor.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
    }
    numero = Number(numero);
    if (isNaN(numero)) return valor;
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const handleMassFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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
          enqueueSnackbar("Nenhum CNPJ válido encontrado.", { variant: "error" });
          setMassConsultaMessage("Nenhum CNPJ válido encontrado.");
          return;
        }

        if (cnpjsValidos.length > 250) {
          enqueueSnackbar("Limite máximo de 250 CNPJs por planilha.", { variant: "error" });
          setMassConsultaMessage("Limite máximo de 250 CNPJs por planilha.");
          return;
        }

        const total = cnpjsValidos.length;
        startLoading(`Iniciando consulta de ${total} CNPJs...`);
        
        const allResults = [];
        const batchSize = 5;
        
        for (let i = 0; i < cnpjsValidos.length; i += batchSize) {
          const batch = cnpjsValidos.slice(i, i + batchSize);
          const batchNumber = Math.floor(i / batchSize) + 1;
          const totalBatches = Math.ceil(total / batchSize);
          
          // Atualiza progresso real
          const processed = Math.min(i + batchSize, total);
          const percent = Math.round((processed / total) * 100);
          
          updateProgress(
            percent,
            // `Consultando CNPJs - Lote ${batchNumber}/${totalBatches} (${processed}/${total})`
            `Consultando CNPJs - ${processed}/${total} -`
          );
          
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
              "Atividades Secundárias": Array.isArray(data.cnaes_secundarios)
                ? data.cnaes_secundarios.map(c => c.descricao).filter(d => d).join(", ")
                : "N/A",
              
              // ENDEREÇO COMPLETO
              "Logradouro": `${data.descricao_tipo_de_logradouro || ""} ${data.logradouro || ""}`.trim() || "N/A",
              "Número": data.numero || "N/A",
              "Complemento": data.complemento || "N/A",
              "Bairro": data.bairro || "N/A",
              "CEP": data.cep || "N/A",
              "Município": data.municipio || "N/A",
              "UF": data.uf || "N/A",
              
              "Telefone": data.ddd_telefone_1 || data.ddd_telefone_2 || "N/A",
              "Email": data.email || "N/A",
              "Porte": data.porte || "N/A",
              "Matriz/Filial": data.descricao_identificador_matriz_filial || "N/A",
              "Natureza Jurídica": data.natureza_juridica || "N/A",
              "Capital Social": data.capital_social ? formatarMoedaBR(data.capital_social) : "N/A",
              "Data Início Atividade": formatarDataBrasileira(data.data_inicio_atividade) || "N/A",
              "Data Situação Cadastral": formatarDataBrasileira(data.data_situacao_cadastral) || "N/A",
              "Motivo Situação": data.descricao_motivo_situacao_cadastral || "N/A",
            });
          });
        }
        
        // 100% completo
        updateProgress(100, `Gerando planilha com ${allResults.length} registros...`);

        const newWorksheet = XLSX.utils.json_to_sheet(allResults);
        const newWorkbook = XLSX.utils.book_new();
        
        XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Resultados");
        XLSX.writeFile(newWorkbook, `resultado-cnpj-${new Date().toISOString().slice(0,19)}.xlsx`);
        
        setMassConsultaMessage(`Concluído! ${allResults.length} registros processados.`);
        enqueueSnackbar(`Planilha gerada com ${allResults.length} registros!`, { variant: "success" });
      } catch (err) {
        console.error("Erro ao processar planilha:", err);
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
    } finally {
      stopLoading();
    }
  };

  const tabs = [
    { id: "cnpj", label: "Consulta por CNPJ", icon: <BsFillBuildingFill /> },
    { id: "chaves", label: "Chaves Alternativas", icon: <FiFileText /> },
    { id: "massa", label: "Consulta em Massa", icon: <FiUsers /> },
  ];

  const podeAbrirMapa = (dados) => {
    return dados?.Address?.ZipCode && (dados?.Address?.Street || dados?.Address?.StreetType);
  };

  return (
    <PageLayout
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
                maxLength={18}
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
              <S.Label required>Razão Social</S.Label>
              <S.Input
                type="text"
                name="razaoSocial"
                placeholder="Digite a razão social"
                value={formData.razaoSocial}
                onChange={handleFormChange}
              />
            </S.FormGroup>

            <S.Button type="submit" disabled={!formData.razaoSocial.trim()}>
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

        {/* Resultado CNPJ - COMPLETO com todos os campos */}
        {activeTab === "cnpj" && cnpjDataFlat && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultado da Consulta</S.ResultTitle>
            
            <S.ResultField>
              <S.ResultLabel>Razão Social</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.OfficialName || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.OfficialName, "razao_social")}>
                  {copiado.razao_social ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Nome Fantasia</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.TradeName || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.TradeName, "nome_fantasia")}>
                  {copiado.nome_fantasia ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>CNPJ</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.TaxIdNumber || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.TaxIdNumber, "cnpj")}>
                  {copiado.cnpj ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Atividade Principal</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.CnaePrincipal || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.CnaePrincipal, "atividade_principal")}>
                  {copiado.atividade_principal ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {/* Atividades Secundárias */}
            <S.ResultField>
              <S.ResultLabel>Atividades Secundárias</S.ResultLabel>
              <S.ResultValue>
                <S.AtividadesSecundariasList>
                  {Array.isArray(cnpjDataFlat.AtividadesSecundarias) && cnpjDataFlat.AtividadesSecundarias.length > 0 ? (
                    cnpjDataFlat.AtividadesSecundarias
                      .filter(c => c.descricao && c.descricao.trim())
                      .map((c, idx) => <li key={idx}>{c.descricao}</li>)
                  ) : (
                    <span>Nenhuma atividade secundária</span>
                  )}
                </S.AtividadesSecundariasList>
                <S.CopyButton onClick={() => copiarParaClipboard(
                  Array.isArray(cnpjDataFlat.AtividadesSecundarias)
                    ? cnpjDataFlat.AtividadesSecundarias.filter(c => c.descricao).map(c => c.descricao).join("\n")
                    : "Nenhuma",
                  "atividades_secundarias"
                )}>
                  {copiado.atividades_secundarias ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {/* CNAE Fiscal */}
            <S.ResultField>
              <S.ResultLabel>CNAE Fiscal</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.CnaeFiscal || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.CnaeFiscal, "cnae_fiscal")}>
                  {copiado.cnae_fiscal ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {/* Porte */}
            <S.ResultField>
              <S.ResultLabel>Porte</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Porte || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Porte, "porte")}>
                  {copiado.porte ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {/* Natureza Jurídica */}
            <S.ResultField>
              <S.ResultLabel>Natureza Jurídica</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.NaturezaJuridica || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.NaturezaJuridica, "natureza_juridica")}>
                  {copiado.natureza_juridica ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Matriz / Filial</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.MatrizFilial || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.MatrizFilial, "matriz_filial")}>
                  {copiado.matriz_filial ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Telefone</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Contact?.Phone1 || cnpjDataFlat.Contact?.Phone2 || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Contact?.Phone1 || cnpjDataFlat.Contact?.Phone2, "telefone")}>
                  {copiado.telefone ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Situação Cadastral</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.TaxIdStatus || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.TaxIdStatus, "situacao_cadastral")}>
                  {copiado.situacao_cadastral ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Data de Início de Atividade</S.ResultLabel>
              <S.ResultValue>
                <span>{formatarDataBrasileira(cnpjDataFlat.FoundedDate) || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(formatarDataBrasileira(cnpjDataFlat.FoundedDate), "data_inicio")}>
                  {copiado.data_inicio ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Bairro</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Address?.Neighborhood || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Address?.Neighborhood, "bairro")}>
                  {copiado.bairro ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>CEP</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Address?.ZipCode || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Address?.ZipCode, "cep")}>
                  {copiado.cep ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Logradouro</S.ResultLabel>
              <S.ResultValue>
                <span>
                  {cnpjDataFlat.Address?.StreetType && cnpjDataFlat.Address?.Street
                    ? `${cnpjDataFlat.Address.StreetType} ${cnpjDataFlat.Address.Street}${cnpjDataFlat.Address.Number ? `, ${cnpjDataFlat.Address.Number}` : ""}`
                    : cnpjDataFlat.Address?.StreetType || cnpjDataFlat.Address?.Street || "N/A"}
                </span>
                <S.CopyButton onClick={() => copiarParaClipboard(
                  cnpjDataFlat.Address?.StreetType && cnpjDataFlat.Address?.Street
                    ? `${cnpjDataFlat.Address.StreetType} ${cnpjDataFlat.Address.Street}${cnpjDataFlat.Address.Number ? `, ${cnpjDataFlat.Address.Number}` : ""}`
                    : cnpjDataFlat.Address?.StreetType || cnpjDataFlat.Address?.Street || "N/A",
                  "logradouro"
                )}>
                  {copiado.logradouro ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Complemento</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Address?.Complement || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Address?.Complement, "complemento")}>
                  {copiado.complemento ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>Município</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.Address?.City || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.Address?.City, "municipio")}>
                  {copiado.municipio ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            <S.ResultField>
              <S.ResultLabel>UF</S.ResultLabel>
              <S.ResultValue>
                <span>{cnpjDataFlat.HeadquarterState || "N/A"}</span>
                <S.CopyButton onClick={() => copiarParaClipboard(cnpjDataFlat.HeadquarterState, "uf")}>
                  {copiado.uf ? <FiCheck /> : <FiCopy />}
                </S.CopyButton>
              </S.ResultValue>
            </S.ResultField>

            {/* Botão Maps */}
            {podeAbrirMapa(cnpjDataFlat) && (
              <S.MapsButtonFull
                onClick={() => {
                  const endereco = montarEnderecoParaMaps({
                    cep: cnpjDataFlat.Address?.ZipCode,
                    tipo: cnpjDataFlat.Address?.StreetType,
                    logradouro: cnpjDataFlat.Address?.Street,
                    numero: cnpjDataFlat.Address?.Number,
                    cidade: cnpjDataFlat.Address?.City,
                    uf: cnpjDataFlat.Address?.State,
                    complemento: cnpjDataFlat.Address?.Complement,
                  });
                  window.open(`https://www.google.com/maps/place/${encodeURIComponent(endereco)}`, "_blank");
                }}
              >
                <FiMapPin size={18} />
                Ver endereço no maps
              </S.MapsButtonFull>
            )}
          </S.ResultCard>
        )}

        {/* Resultados Chaves Alternativas */}
        {activeTab === "chaves" && resultList.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>Resultados Encontrados ({resultList.length})</S.ResultTitle>
            {resultList.map((item, idx) => {
              const data = flatToBasicData(item.BasicData ?? item) || item.BasicData || item;
              const isExpanded = selectedResultIndex === idx;
              
              const enderecoMaps = montarEnderecoParaMaps({
                cep: data.Address?.ZipCode,
                tipo: data.Address?.StreetType,
                logradouro: data.Address?.Street,
                numero: data.Address?.Number,
                cidade: data.Address?.City,
                uf: data.Address?.State || data.HeadquarterState,
                complemento: data.Address?.Complement,
              });
              
              const podeAbrirMapaChaves = enderecoMaps && (data.Address?.ZipCode || data.Address?.Street);

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
                      <S.DetailRow><strong>Razão Social:</strong> {data.OfficialName || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Nome Fantasia:</strong> {data.TradeName || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>CNPJ:</strong> {data.TaxIdNumber || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Situação Cadastral:</strong> {data.TaxIdStatus || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Atividade Principal:</strong> {data.CnaePrincipal || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Porte:</strong> {data.Porte || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Natureza Jurídica:</strong> {data.NaturezaJuridica || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Matriz/Filial:</strong> {data.MatrizFilial || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Telefone:</strong> {data.Contact?.Phone1 || data.Contact?.Phone2 || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Email:</strong> {data.Contact?.Email || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Data de Início:</strong> {formatarDataBrasileira(data.FoundedDate) || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>CEP:</strong> {data.Address?.ZipCode || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Logradouro:</strong> 
                        {data.Address?.StreetType || data.Address?.Street ? 
                          `${data.Address?.StreetType || ""} ${data.Address?.Street || ""}${data.Address?.Number ? `, ${data.Address?.Number}` : ""}`.trim()
                          : "N/A"}
                      </S.DetailRow>
                      <S.DetailRow><strong>Complemento:</strong> {data.Address?.Complement || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Bairro:</strong> {data.Address?.Neighborhood || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>Município:</strong> {data.Address?.City || "N/A"}</S.DetailRow>
                      <S.DetailRow><strong>UF:</strong> {data.HeadquarterState || "N/A"}</S.DetailRow>
                      
                      {data.AtividadesSecundarias && data.AtividadesSecundarias.length > 0 && (
                        <S.DetailRow>
                          <strong>Atividades Secundárias:</strong>
                          <ul style={{ marginTop: 4, paddingLeft: 20 }}>
                            {data.AtividadesSecundarias.filter(c => c.descricao).map((c, i) => (
                              <li key={i}>{c.descricao}</li>
                            ))}
                          </ul>
                        </S.DetailRow>
                      )}
                      
                      {podeAbrirMapaChaves && (
                        <S.MapsButtonFull
                          onClick={() => {
                            window.open(`https://www.google.com/maps/place/${encodeURIComponent(enderecoMaps)}`, "_blank");
                          }}
                        >
                          <FiMapPin size={18} />
                          Ver endereço no Google Maps
                        </S.MapsButtonFull>
                      )}
                    </S.ResultDetails>
                  )}
                </S.ResultItem>
              );
            })}
          </S.ResultCard>
        )}

        {/* Sem resultados */}
        {activeTab !== "massa" && resultado && resultList.length === 0 && (
          <S.NoResults>Nenhum resultado encontrado.</S.NoResults>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default ConsultaCNPJ;