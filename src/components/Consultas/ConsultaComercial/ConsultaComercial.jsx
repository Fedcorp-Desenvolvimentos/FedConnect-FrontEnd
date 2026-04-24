import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBriefcase, FaFileExcel, FaSearch, FaMapMarkerAlt, FaFilm, FaTimes, FaSpinner, FaChartLine } from "react-icons/fa";
import { IoIosBusiness } from "react-icons/io";
import { FiUsers, FiSettings } from "react-icons/fi";
import * as XLSX from "xlsx";
import * as S from "./ConsultaComercialStyles";
import PageTemplate from "../../PageTemplate/PageTemplate";
import { ConsultaService } from "../../../services/consultaService";
import ConsultaComercialHelp from "./ConsultaComercialHelp";

const ConsultaComercial = () => {
  const [activeTab, setActiveTab] = useState("cnpj");
  const [activeSubTab, setActiveSubTab] = useState(null);
  const resultadoRef = useRef(null);
  const [form, setForm] = useState({ cnpj: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalPersonData, setModalPersonData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [massConsultaMessage, setMassConsultaMessage] = useState("");
  const [massLoading, setMassLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (result && resultadoRef.current) {
      setTimeout(() => {
        resultadoRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 220);
    }
  }, [result]);

  const handleCnpjChange = (e) => {
    const onlyDigits = e.target.value.replace(/\D/g, "");
    setForm({ cnpj: onlyDigits.slice(0, 14) });
  };

  const handleSearch = async () => {
    setResult(null);
    setError(null);
    if (!form.cnpj) {
      setError("Por favor, digite um CNPJ.");
      return;
    }
    if (form.cnpj.length < 14) {
      setError("O CNPJ deve conter 14 dígitos.");
      return;
    }
    setLoading(true);
    try {
      const { resultado_api } = await ConsultaService.consultarComercial(form.cnpj);
      const empresa = resultado_api?.Result?.[0] || null;
      if (empresa) {
        setResult(empresa);
        setForm({ cnpj: "" });
      } else {
        setError("Nenhum resultado de empresa encontrado para o CNPJ fornecido.");
      }
    } catch (err) {
      setError(err.message || "Ocorreu um erro ao consultar o CNPJ da empresa.");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonClick = async (person) => {
    const cpf = person.RelatedEntityTaxIdNumber;
    if (!cpf || person.RelatedEntityTaxIdType !== "CPF") {
      setModalError("CPF não disponível ou tipo de documento inválido.");
      setShowModal(true);
      return;
    }
    setModalLoading(true);
    setModalError(null);
    setModalPersonData(null);
    try {
      const { resultado_api } = await ConsultaService.consultarContatoComercial(cpf);
      const regData = resultado_api?.Result?.[0]?.RegistrationData || null;
      if (regData) setModalPersonData(regData);
      else setModalError("Nenhum dado de contato encontrado para esta pessoa.");
    } catch (err) {
      setModalError(err.message || "Erro ao consultar detalhes de contato.");
    } finally {
      setModalLoading(false);
      setShowModal(true);
    }
  };

  const renderFilteredRelationships = (rels) => {
    if (!rels?.length) return null;
    const filtered = rels.filter(
      (r) =>
        r.RelationshipType === "QSA" ||
        r.RelationshipType === "Ownership" ||
        r.RelationshipType === "REPRESENTANTELEGAL"
    );
    if (!filtered.length) return null;
    return (
      <>
        <S.RelTitle>Sócios, Administradores e Representantes Legais</S.RelTitle>
        <S.RelList>
          {filtered.map((p, i) => (
            <S.RelListItem key={`${p.RelatedEntityTaxIdNumber}-${i}`}>
              <S.RelInfo>
                <strong>{p.RelatedEntityName || "Nome N/A"}</strong>
                <S.RelType>Tipo: {p.RelationshipType}</S.RelType>
                <S.RelCpf>CPF: {p.RelatedEntityTaxIdNumber}</S.RelCpf>
              </S.RelInfo>
              <S.RelButton onClick={() => handlePersonClick(p)}>
                Ver Detalhes
              </S.RelButton>
            </S.RelListItem>
          ))}
        </S.RelList>
      </>
    );
  };

  const handleImportFile = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setMassConsultaMessage("Por favor, selecione um arquivo Excel (.xlsx ou .xls).");
      return;
    }

    setMassLoading(true);
    setMassConsultaMessage("Lendo arquivo e preparando para consulta em massa...");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonSheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          let cnpjs = [];
          if (jsonSheet.length > 1) {
            cnpjs = jsonSheet
              .slice(1)
              .map((row) => String(row[0]).replace(/\D/g, ""))
              .filter((cnpj) => cnpj.length === 14);
          } else if (jsonSheet.length === 1 && jsonSheet[0].length > 0) {
            cnpjs = [String(jsonSheet[0][0]).replace(/\D/g, "")].filter(
              (cnpj) => cnpj.length === 14
            );
          }

          if (cnpjs.length === 0) {
            setMassConsultaMessage(
              "Nenhum CNPJ válido encontrado na planilha. Verifique se a coluna de CNPJs é a primeira e não há cabeçalhos inesperados ou dados inválidos."
            );
            setMassLoading(false);
            return;
          }

          setMassConsultaMessage(`Encontrados ${cnpjs.length} CNPJs. Iniciando consulta em massa...`);

          const payload = { cnpjs: cnpjs };
          const excelBlob = await ConsultaService.consultarComercialMassa(payload);

          const url = window.URL.createObjectURL(excelBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "resultados_consulta_massa_cpf.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);

          setMassConsultaMessage("Consulta em massa concluída! Planilha de resultados baixada.");
        } catch (readError) {
          console.error("Erro ao ler o arquivo Excel:", readError);
          setMassConsultaMessage("Erro ao processar o arquivo. Certifique-se de que é um Excel válido e no formato esperado.");
        } finally {
          setMassLoading(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (serviceError) {
      console.error("Erro na consulta em massa:", serviceError);
      setMassConsultaMessage(`Erro na consulta em massa: ${serviceError.message || "Verifique o console para mais detalhes."}`);
      setMassLoading(false);
    }
  };

  const handleDownloadModel = async () => {
    setMassLoading(true);
    setMassConsultaMessage("Baixando modelo...");
    try {
      const response = await ConsultaService.baixarPlanilhaModeloCNPJ();
      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "modelo-cnpj.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setMassConsultaMessage("Download do modelo concluído.");
    } catch {
      setMassConsultaMessage("Erro ao baixar modelo.");
    } finally {
      setMassLoading(false);
    }
  };

  const formatarData = (dataStr) => {
    if (!dataStr) return "Não localizado";
    return new Date(dataStr).toLocaleDateString("pt-BR");
  };

  const exibirValor = (valor, fallback = "Não localizado") => {
    if (valor === undefined || valor === null || valor === "" || valor === "undefined" || valor === "null") {
      return fallback;
    }
    return valor;
  };

  // Tabs principais
  const mainTabs = [
    { id: "relacionamentos", label: "Relacionamentos", icon: <FiUsers /> },
    { id: "operacional", label: "Operacional", icon: <FiSettings /> },
  ];

  // Sub-opções para cada tab
  const subOptions = {
    relacionamentos: [
      { id: "cnpj", label: "Consulta CNPJ", icon: <FaBriefcase /> },
      { id: "massa", label: "Consulta em Massa", icon: <FaFileExcel /> },
      { id: "regiao", label: "Consulta por Região", icon: <FaMapMarkerAlt />, isExternal: true, path: "/consultas/comercial-regiao" },
    ],
    operacional: [
      { id: "conteudo", label: "Estudo Conteúdo", icon: <FaSearch />, isExternal: true, path: "/cotacao-conteudo" },
      { id: "produtos", label: "Apresentação Comercial", icon: <FaFilm />, isExternal: true, path: "/produtos" },
    ],
  };

  return (
    <PageTemplate
      title="Consultas Comerciais"
      subtitle="Consulte informações comerciais"
      icon={<IoIosBusiness />}
      helpContent={<ConsultaComercialHelp />}
    >
      <S.Container>
        {/* Tabs principais */}
        <S.TabsContainer>
          {mainTabs.map((tab) => (
            <S.Tab
              key={tab.id}
              $active={activeTab === tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setActiveSubTab(null);
                setResult(null);
                setError(null);
              }}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </S.Tab>
          ))}
        </S.TabsContainer>

        {/* Sub-tabs (cards de opção) */}
        <S.SubTabsContainer>
          {subOptions[activeTab]?.map((option) => (
            <S.SubTabCard
              key={option.id}
              $active={activeSubTab === option.id}
              onClick={() => {
                if (option.isExternal) {
                  navigate(option.path);
                } else {
                  setActiveSubTab(option.id);
                  setResult(null);
                  setError(null);
                  setMassConsultaMessage("");
                }
              }}
            >
              <S.SubTabIcon>{option.icon}</S.SubTabIcon>
              <span>{option.label}</span>
            </S.SubTabCard>
          ))}
        </S.SubTabsContainer>

        {/* Conteúdo baseado na sub-tab selecionada */}
        {activeSubTab === "cnpj" && (
          <S.FormContainer>
            <S.FormLabel>Digite o CNPJ:</S.FormLabel>
            <S.FormInput
              type="text"
              placeholder="Digite apenas os 14 dígitos do CNPJ"
              value={form.cnpj}
              onChange={handleCnpjChange}
            />
            <S.FormButton onClick={handleSearch} disabled={loading}>
              {loading ? <FaSpinner className="spinner" /> : <FaSearch />}
              {loading ? "Consultando..." : "Consultar"}
            </S.FormButton>
            {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
          </S.FormContainer>
        )}

        {activeSubTab === "massa" && (
          <S.MassContainer>
            <S.MassLabel>Consulta em massa:</S.MassLabel>
            <input
              type="file"
              id="input-massa-cnpj"
              accept=".xlsx, .xls"
              style={{ display: "none" }}
              onChange={handleImportFile}
              disabled={massLoading}
            />
            <S.MassButtonGroup>
              <S.MassButton onClick={() => document.getElementById("input-massa-cnpj").click()} disabled={massLoading}>
                <FaFileExcel /> Importar Planilha de CNPJs
              </S.MassButton>
              <S.MassButtonOutline onClick={handleDownloadModel} disabled={massLoading}>
                <FaFileExcel /> Baixar Planilha Modelo
              </S.MassButtonOutline>
            </S.MassButtonGroup>

            {massLoading && (
              <S.LoadingMessage>
                <FaSpinner className="spinner" />
                <p>{massConsultaMessage || "Processando..."}</p>
              </S.LoadingMessage>
            )}

            {!massLoading && massConsultaMessage && (
              <S.InfoMessage $isError={massConsultaMessage.toLowerCase().includes("erro") || massConsultaMessage.toLowerCase().includes("falha")}>
                {massConsultaMessage}
              </S.InfoMessage>
            )}
          </S.MassContainer>
        )}

        {/* Resultados */}
        {result && activeSubTab === "cnpj" && (
          <S.ResultCard ref={resultadoRef}>
            <S.CardBody>
              {renderFilteredRelationships(result.Relationships?.CurrentRelationships)}
              {!result.Relationships?.CurrentRelationships?.length && (
                <S.NoResultsMessage>
                  Nenhum sócio, administrador ou representante legal encontrado para este CNPJ.
                </S.NoResultsMessage>
              )}
            </S.CardBody>
          </S.ResultCard>
        )}

        {/* Modal */}
        {showModal && (
          <S.ModalOverlay onClick={() => setShowModal(false)}>
            <S.ModalContent onClick={(e) => e.stopPropagation()}>
              <S.ModalClose onClick={() => setShowModal(false)}>
                <FaTimes />
              </S.ModalClose>
              <S.ModalTitle>Informações Básicas</S.ModalTitle>
              
              {modalLoading && (
                <S.ModalLoading>
                  <FaSpinner className="spinner" />
                  <p>Buscando detalhes de contato...</p>
                </S.ModalLoading>
              )}
              
              {modalError && <S.ErrorMessage>{modalError}</S.ErrorMessage>}

              {modalPersonData && !modalLoading && !modalError && (
                <S.ModalGrid>
                  <S.ModalColumn>
                    <p><strong>Nome:</strong> {exibirValor(modalPersonData.BasicData?.Name)}</p>
                    <p><strong>CPF:</strong> {exibirValor(modalPersonData.BasicData?.TaxIdNumber)}</p>
                    <p><strong>Gênero:</strong> {exibirValor(modalPersonData.BasicData?.Gender)}</p>
                    <p><strong>Data de Nascimento:</strong> {modalPersonData.BasicData?.BirthDate ? formatarData(modalPersonData.BasicData.BirthDate) : "Não localizado"}</p>
                    <p><strong>Nome da Mãe:</strong> {exibirValor(modalPersonData.BasicData?.MotherName)}</p>
                    <p><strong>Status do CPF:</strong> {exibirValor(modalPersonData.BasicData?.TaxIdStatus)}</p>
                  </S.ModalColumn>
                  <S.ModalColumn>
                    <p><strong>E-mail Principal:</strong> <span style={{ wordBreak: "break-all" }}>{exibirValor(modalPersonData.Emails?.Primary?.EmailAddress)}</span></p>
                    <p><strong>E-mail Secundário:</strong> <span style={{ wordBreak: "break-all" }}>{exibirValor(modalPersonData.Emails?.Secondary?.EmailAddress)}</span></p>
                    <p><strong>Endereço Principal:</strong> {modalPersonData.Addresses?.Primary?.AddressMain ? `${exibirValor(modalPersonData.Addresses.Primary.AddressMain)}${modalPersonData.Addresses.Primary.Number ? ", " + exibirValor(modalPersonData.Addresses.Primary.Number) : ""}` : "Não localizado"}</p>
                    <p><strong>Telefone Principal:</strong> {modalPersonData.Phones?.Primary?.Number ? `${exibirValor(modalPersonData.Phones.Primary.AreaCode)} ${exibirValor(modalPersonData.Phones.Primary.Number)}` : "Não localizado"}</p>
                    <p><strong>Telefone Secundário:</strong> {modalPersonData.Phones?.Secondary?.Number ? `${exibirValor(modalPersonData.Phones.Secondary.AreaCode)} ${exibirValor(modalPersonData.Phones.Secondary.Number)}` : "Não localizado"}</p>
                  </S.ModalColumn>
                </S.ModalGrid>
              )}

              <S.ModalActions>
                <S.ModalButton onClick={() => setShowModal(false)}>Fechar</S.ModalButton>
              </S.ModalActions>
            </S.ModalContent>
          </S.ModalOverlay>
        )}
      </S.Container>
    </PageTemplate>
  );
};

export default ConsultaComercial;