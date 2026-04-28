import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSnackbar } from "notistack";
import * as S from "./ConsultaSeguradosStyles";
import { 
  FiUsers, 
  FiHome, 
  FiSearch,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";
import { FaSpinner } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import PageLayout from "../../PageLayout/PageLayout";
import { ConsultaService } from "../../../services/consultaService";
import { resolveNomeApoliceFromRecord } from "../../../services/apoliceDePara";

function traduzirErroApi(mensagem) {
  if (!mensagem) return "Erro inesperado. Por favor, tente novamente.";
  if (typeof mensagem === "string" && mensagem.startsWith("<!DOCTYPE")) {
    return "Erro temporário de conexão com o servidor. Tente novamente em instantes.";
  }
  if (mensagem.toLowerCase().includes("proxy error")) {
    return "Serviço temporariamente indisponível. Tente novamente em alguns minutos.";
  }
  if (mensagem.toLowerCase().includes("502") || mensagem.toLowerCase().includes("bad gateway")) {
    return "Não foi possível se conectar ao servidor. Por favor, tente novamente mais tarde.";
  }
  if (mensagem.toLowerCase().includes("timeout")) {
    return "A requisição demorou muito. Verifique sua conexão e tente novamente.";
  }
  if (mensagem.toLowerCase().includes("network error")) {
    return "Falha de comunicação com a API. Verifique sua conexão de internet.";
  }
  return mensagem;
}

const ConsultaSegurados = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [activeForm, setActiveForm] = useState("vida");
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  
  // Administradora autocomplete
  const [allAdministradoras, setAllAdministradoras] = useState([]);
  const [loadingAdms, setLoadingAdms] = useState(false);
  const [administradoraSuggestions, setAdministradoraSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [selectedAdministradora, setSelectedAdministradora] = useState(null);
  const [administradoraInputValue, setAdministradoraInputValue] = useState("");
  
  const suggestionsRef = useRef(null);
  const resultadoRef = useRef(null);
  const debounceTimeout = useRef(null);

  const initialFormData = {
    cpf: "",
    nome: "",
    posto: "",
    endereco: "",
    cnpj: "",
    certificado: "",
    fatura: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchAllAdms = async () => {
      setLoadingAdms(true);
      try {
        const adms = await ConsultaService.getAdms();
        if (Array.isArray(adms)) {
          setAllAdministradoras(adms);
        }
      } catch (err) {
        console.error("Erro ao carregar administradoras:", err);
      } finally {
        setLoadingAdms(false);
      }
    };
    fetchAllAdms();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const resetFormAndState = useCallback(() => {
    setFormData(initialFormData);
    setSelectedAdministradora(null);
    setAdministradoraInputValue("");
    setError(null);
    setResultado(null);
    setAdministradoraSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    setExpandedIndex(null);
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "cpf" || name === "cnpj") {
      formattedValue = value.replace(/\D/g, "").substring(0, name === "cpf" ? 11 : 14);
    }

    setFormData((prev) => ({ ...prev, [name]: formattedValue }));
  };

  const handleAdmFormChange = useCallback((e) => {
    const { value } = e.target;
    setAdministradoraInputValue(value);
    setSelectedAdministradora(null);
    setActiveIndex(-1);

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (value.length > 0) {
      debounceTimeout.current = setTimeout(() => {
        const filteredSuggestions = allAdministradoras.filter((adm) =>
          adm.NOME.toLowerCase().includes(value.toLowerCase())
        );
        setAdministradoraSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      }, 300);
    } else {
      setAdministradoraSuggestions([]);
      setShowSuggestions(false);
    }
  }, [allAdministradoras]);

  const handleSuggestionClick = useCallback((suggestion) => {
    setAdministradoraInputValue(suggestion.NOME);
    setSelectedAdministradora(suggestion);
    setAdministradoraSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }, []);

  const formatAdministradoraId = (id) => {
    if (id === null || id === undefined) return null;
    return String(id).padStart(10, '0');
  };

  const performConsulta = async () => {
    setLoading(true);
    setError(null);
    setResultado(null);
    setExpandedIndex(null);

    let parametroConsultaObj = {};
    let isFormEmpty = true;

    if (activeForm === "vida") {
      if (formData.cpf) {
        parametroConsultaObj.cpf_cnpj = formData.cpf.replace(/\D/g, "");
        isFormEmpty = false;
      }
      if (formData.nome) {
        parametroConsultaObj.nome_segurado = formData.nome.toUpperCase();
        isFormEmpty = false;
      }
      if (formData.posto) {
        parametroConsultaObj.posto = formData.posto.toUpperCase();
        isFormEmpty = false;
      }
      if (selectedAdministradora) {
        parametroConsultaObj.administradora = formatAdministradoraId(selectedAdministradora.PESSOA);
        isFormEmpty = false;
      } else if (administradoraInputValue) {
        parametroConsultaObj.administradora_nome = administradoraInputValue.toUpperCase();
        isFormEmpty = false;
      }

      if (isFormEmpty) {
        enqueueSnackbar(
          "Pelo menos um dos campos (CPF, Nome, Posto ou Administradora) é obrigatório.",
          { variant: "error" }
        );
        setLoading(false);
        return;
      }
    } else {
      let hasCertificadoOrEndereco = false;
      let hasAdministradora = false;

      if (formData.cpf || formData.cnpj) {
        parametroConsultaObj.cpf_cnpj = (formData.cpf || formData.cnpj).replace(/\D/g, "");
        isFormEmpty = false;
      }
      if (formData.nome) {
        parametroConsultaObj.nome = formData.nome.toUpperCase();
        isFormEmpty = false;
      }
      if (formData.endereco) {
        parametroConsultaObj.endereco = formData.endereco.toUpperCase();
        isFormEmpty = false;
        hasCertificadoOrEndereco = true;
      }
      if (formData.certificado) {
        parametroConsultaObj.certificado = formData.certificado;
        isFormEmpty = false;
        hasCertificadoOrEndereco = true;
      }
      if (formData.fatura) {
        parametroConsultaObj.fatura = formData.fatura.replace(/\D/g, "");
        isFormEmpty = false;
      }
      if (selectedAdministradora) {
        parametroConsultaObj.administradora = formatAdministradoraId(selectedAdministradora.PESSOA);
        isFormEmpty = false;
        hasAdministradora = true;
      } else if (administradoraInputValue) {
        parametroConsultaObj.administradora_nome = administradoraInputValue.toUpperCase();
        isFormEmpty = false;
        hasAdministradora = true;
      }

      if (hasCertificadoOrEndereco && !hasAdministradora) {
        enqueueSnackbar("Para pesquisar por Certificado ou Endereço, a Administradora é obrigatória.", { variant: "error" });
        setLoading(false);
        return;
      }

      if (isFormEmpty) {
        enqueueSnackbar("Pelo menos um campo é obrigatório.", { variant: "error" });
        setLoading(false);
        return;
      }
    }

    try {
      const response = await ConsultaService.consultarSegurados({
        tipo_consulta: activeForm === "vida" ? "vida" : "incendio",
        parametro_consulta: JSON.stringify(parametroConsultaObj),
        origem: "manual",
      });
      
      const data = response?.resultado_api;
      
      if (!Array.isArray(data) || data.length === 0) {
        setResultado([]);
        enqueueSnackbar("Nenhum resultado encontrado.", { variant: "info" });
      } else {
        setResultado(data);
        setTimeout(() => {
          resultadoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } catch (err) {
      const mensagem = err.response?.data?.detail || err.message || "Erro ao realizar consulta.";
      enqueueSnackbar(traduzirErroApi(mensagem), { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await performConsulta();
  };

  const handleKeyDown = useCallback((e) => {
    if (!showSuggestions || administradoraSuggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < administradoraSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : administradoraSuggestions.length - 1));
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(administradoraSuggestions[activeIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  }, [showSuggestions, administradoraSuggestions, activeIndex, handleSuggestionClick]);

  const formatarDataBR = (data) => {
    if (!data) return "N/A";
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) return data;
    const match = data.match(/^(\d{4})[-\/](\d{2})[-\/](\d{2})/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
    return data;
  };

  const formataChave = (texto) => {
    return texto.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const traduzirStatus = (status) => {
    const map = { "N": "Novo", "R": "Renovado", "C": "Cancelado", "A": "Ativo" };
    return map[status] || status || "N/A";
  };

  const formatarMoedaBR = (valor) => {
    if (valor == null || valor === "") return <i>não informado</i>;
    let numero = typeof valor === "string" ? parseFloat(valor.replace(/[^\d,.-]/g, "").replace(",", ".")) : valor;
    if (isNaN(numero)) return valor;
    return numero.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const SeguradoItem = ({ segurado, index, isExpanded, onToggle }) => {
    const ignoreKeys = ["NOME_SEGURADO", "NOME", "CPF_CNPJ", "FUNCAO", "ADMINISTRADORA", "ADMINISTRADORA_NOME", "STATUS", "STATUS_SEG"];
    const dateKeys = ["NASCIMENTO", "INICIO_VIG", "FINAL_VIG", "DT_INCLUSAO", "DT_CANCEL"];
    const moedaKeys = ["PREMIO", "PREMIO_LIQ", "INC_PREDIO", "INC_CONTEUDO", "ALUGUEL"];
    const policyKeysToHide = ["APOLICE", "APÓLICE", "APOLICE_NUM", "APOLICE_ID", "NUM_APOLICE", "NUMERO_APOLICE", "APOLICECOD"];
    
    const nomeApolice = resolveNomeApoliceFromRecord(segurado);
    const nomeSegurado = segurado.NOME_SEGURADO || segurado.NOME || segurado.nome_segurado || "Nome não informado";
    const cpfCnpj = segurado.CPF_CNPJ;

    return (
      <S.SeguradoItem $expanded={isExpanded}>
        <S.SeguradoHeader onClick={() => onToggle()}>
          <S.SeguradoInfo>
            <S.SeguradoNome>{nomeSegurado}</S.SeguradoNome>
            {cpfCnpj && <S.SeguradoCpf>Cpf/Cnpj: {cpfCnpj}</S.SeguradoCpf>}
          </S.SeguradoInfo>
          <S.ExpandIcon>{isExpanded ? <FiChevronUp /> : <FiChevronDown />}</S.ExpandIcon>
        </S.SeguradoHeader>
        
        {isExpanded && (
          <S.SeguradoDetails>
            {(segurado.ADMINISTRADORA || segurado.ADMINISTRADORA_NOME) && (
              <S.DetailRow>
                <strong>Administradora:</strong> {segurado.ADMINISTRADORA_NOME || segurado.ADMINISTRADORA}
              </S.DetailRow>
            )}
            {(segurado.STATUS || segurado.STATUS_SEG) && (
              <S.DetailRow>
                <strong>Status:</strong> {traduzirStatus(segurado.STATUS_SEG || segurado.STATUS)}
              </S.DetailRow>
            )}
            {nomeApolice && (
              <S.DetailRow>
                <strong>Apólice:</strong> {nomeApolice}
              </S.DetailRow>
            )}
            {Object.entries(segurado).map(([chave, valor]) => {
              if (ignoreKeys.includes(chave) || policyKeysToHide.includes(chave)) return null;
              return (
                <S.DetailRow key={chave}>
                  <strong>{formataChave(chave)}:</strong>{" "}
                  {dateKeys.includes(chave) ? formatarDataBR(valor) :
                   moedaKeys.includes(chave) ? formatarMoedaBR(valor) :
                   valor || <i>não informado</i>}
                </S.DetailRow>
              );
            })}
          </S.SeguradoDetails>
        )}
      </S.SeguradoItem>
    );
  };

  const options = [
    { id: "vida", label: "Consulta Vida", icon: <FiUsers /> },
    { id: "imoveis", label: "Consulta Imóveis", icon: <FiHome /> },
  ];

  const isSubmitDisabled = loading || loadingAdms;

  return (
    <PageLayout
      title="Consulta de Segurados"
      subtitle="Consulte informações de segurados"
      icon={<IoShieldCheckmarkOutline />}
    >
      <S.Container>
        {/* Opções de consulta */}
        <S.OptionsContainer>
          {options.map((option) => (
            <S.OptionCard
              key={option.id}
              $active={activeForm === option.id}
              onClick={() => {
                setActiveForm(option.id);
                resetFormAndState();
              }}
            >
              <S.OptionIcon>{option.icon}</S.OptionIcon>
              <h5>{option.label}</h5>
            </S.OptionCard>
          ))}
        </S.OptionsContainer>

        {/* Formulário */}
        <S.Form onSubmit={handleSubmit}>
          {activeForm === "vida" ? (
            <>
              <S.FormGroup>
                <S.Label>CPF</S.Label>
                <S.Input
                  type="text"
                  name="cpf"
                  placeholder="Digite o CPF"
                  value={formData.cpf}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                  maxLength={14}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Posto</S.Label>
                <S.Input
                  type="text"
                  name="posto"
                  placeholder="Digite o posto"
                  value={formData.posto}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>
            </>
          ) : (
            <>
              <S.Row>
                <S.FormGroup>
                  <S.Label>CPF / CNPJ</S.Label>
                  <S.Input
                    type="text"
                    name="cpf"
                    placeholder="Digite o CPF"
                    value={formData.cpf}
                    onChange={handleFormChange}
                    disabled={isSubmitDisabled}
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>ou</S.Label>
                  <S.Input
                    type="text"
                    name="cnpj"
                    placeholder="Digite o CNPJ"
                    value={formData.cnpj}
                    onChange={handleFormChange}
                    disabled={isSubmitDisabled}
                  />
                </S.FormGroup>
              </S.Row>

              <S.FormGroup>
                <S.Label>Nome</S.Label>
                <S.Input
                  type="text"
                  name="nome"
                  placeholder="Digite o nome"
                  value={formData.nome}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Endereço</S.Label>
                <S.Input
                  type="text"
                  name="endereco"
                  placeholder="Digite o endereço"
                  value={formData.endereco}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Certificado</S.Label>
                <S.Input
                  type="text"
                  name="certificado"
                  placeholder="Digite o certificado"
                  value={formData.certificado}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>

              <S.FormGroup>
                <S.Label>Fatura</S.Label>
                <S.Input
                  type="text"
                  name="fatura"
                  placeholder="Digite a fatura"
                  value={formData.fatura}
                  onChange={handleFormChange}
                  disabled={isSubmitDisabled}
                />
              </S.FormGroup>
            </>
          )}

          {/* Administradora com autocomplete */}
          <S.FormGroup>
            <S.Label>Administradora</S.Label>
            <S.AutocompleteWrapper ref={suggestionsRef}>
              <S.Input
                type="text"
                name="administradora"
                value={administradoraInputValue}
                onChange={handleAdmFormChange}
                onKeyDown={handleKeyDown}
                placeholder={loadingAdms ? "Carregando administradoras..." : "Digite a administradora"}
                disabled={isSubmitDisabled}
                autoComplete="off"
              />
              {showSuggestions && administradoraSuggestions.length > 0 && (
                <S.SuggestionsList>
                  {administradoraSuggestions.map((suggestion, idx) => (
                    <S.SuggestionItem
                      key={suggestion.id || idx}
                      $active={idx === activeIndex}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.NOME}
                    </S.SuggestionItem>
                  ))}
                </S.SuggestionsList>
              )}
            </S.AutocompleteWrapper>
          </S.FormGroup>

          <S.Button type="submit" disabled={isSubmitDisabled}>
            {loading ? "Consultando..." : "Consultar"}
          </S.Button>
        </S.Form>

        {/* Resultados */}
        {resultado && Array.isArray(resultado) && resultado.length > 0 && (
          <S.ResultCard ref={resultadoRef}>
            <S.ResultTitle>
              Resultados Encontrados ({resultado.length})
            </S.ResultTitle>
            <S.SeguradosList>
              {resultado.slice(-10).reverse().map((seg, idx) => (
                <SeguradoItem
                  key={idx}
                  segurado={seg}
                  index={idx}
                  isExpanded={expandedIndex === idx}
                  onToggle={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                />
              ))}
            </S.SeguradosList>
            {resultado.length > 10 && (
              <S.InfoText>Exibindo os 10 resultados mais recentes de {resultado.length} encontrados.</S.InfoText>
            )}
          </S.ResultCard>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default ConsultaSegurados;