import React, { useState } from "react";
import { FaHome, FaCalculator, FaBuilding, FaShieldAlt, FaSpinner } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { useLoading } from "../../hooks/useLoading";
import * as S from "./CotacaoConteudoStyles";
import PageLayout from "../../Layouts/PageLayout/PageLayout";
import { CotacaoConteudoHelp } from "./CotacaoConteudoHelp";
import cotacaoService from "../../services/cotacaoService";

const CotacaoConteudo = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { startLoading, stopLoading, withLoading } = useLoading();
  const [tipoImovel, setTipoImovel] = useState("residencial");
  const [assistencia, setAssistencia] = useState("basica");

  const [incendio, setIncendio] = useState("");
  const [aluguel, setAluguel] = useState("");
  const [premioProposto, setPremioProposto] = useState("");
  const [repasse, setRepasse] = useState("");

  const [premioLiquido, setPremioLiquido] = useState(0);
  const [comissaoAdministradora, setComissaoAdministradora] = useState(0);
  const [assistenciaBasica, setAssistenciaBasica] = useState(0);
  const [premioLiquidoSeguradora, setPremioLiquidoSeguradora] = useState(0);
  const [premioBrutoSeguradora, setPremioBrutoSeguradora] = useState(0);
  const [repasseSeguradoraBruto, setRepasseSeguradoraBruto] = useState(0);
  const [imposto, setImposto] = useState(0);
  const [repasseLiquido, setRepasseLiquido] = useState(0);
  const [entradas, setEntradas] = useState(0);
  const [saidas, setSaidas] = useState(0);
  const [resultado, setResultado] = useState(0);
  const [percentual, setPercentual] = useState(0);
  const [showResultado, setShowResultado] = useState(false);

  const desformatarMoeda = (valor) => Number(String(valor).replace(/\D/g, "")) / 100;

  const formatarMoeda = (valor) => {
    if (!valor) return "";
    const num = Number(String(valor).replace(/\D/g, "")) / 100;
    if (isNaN(num)) return "";
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const formatarPorcentagem = (valor) => {
    let num = String(valor).replace(/[^0-9.,]/g, "").replace(",", ".");
    if (num === "") return "";
    num = parseFloat(num);
    if (isNaN(num)) return "";
    return num.toString().replace(".", ",") + "%";
  };

  const formatarValorParaMoeda = (valor) => {
    if (typeof valor !== "number") return "R$ 0,00";
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatarValorParaPorcentagem = (valor) => {
    if (valor === null || valor === undefined) return "0%";
    const n = Number(valor);
    if (Number.isNaN(n)) return "0%";
    return `${n.toFixed(2).replace(".", ",")}%`;
  };

  const handleChange = (setter, type = "money") => (e) => {
    const valor = e.target.value;
    if (type === "percent") setter(formatarPorcentagem(valor));
    else setter(formatarMoeda(valor));
    setShowResultado(false);
  };

  const handleGerarResultado = async () => {
    try {
      const dadosParaEnvio = {
        tipo_imovel: tipoImovel,
        assistencia_tipo: assistencia,
        incendio_conteudo: desformatarMoeda(incendio),
        perda_aluguel: desformatarMoeda(aluguel),
        premio_proposto: desformatarMoeda(premioProposto),
        repasse_percentual: Number(
          String(repasse).replace("%", "").replace(",", ".") || 0
        ),
      };

      const response = await withLoading(
        () => cotacaoService.cotacaoIncendio(dadosParaEnvio),
        "Calculando cotação..."
      );

      setPremioLiquido(response.premio_liquido);
      setComissaoAdministradora(response.comissao_administradora);
      setAssistenciaBasica(response.assistencia_basica);
      setPremioLiquidoSeguradora(response.premio_liquido_seguradora);
      setPremioBrutoSeguradora(response.premio_bruto_seguradora);
      setRepasseSeguradoraBruto(response.repasse_seguradora_bruto);
      setImposto(response.imposto);
      setRepasseLiquido(response.repasse_liquido);
      setEntradas(response.entradas);
      setSaidas(response.saidas);
      setResultado(response.resultado);

      const bruto = Number(response.percentual ?? 0);
      const percentualAjustado = bruto <= 1 ? bruto * 100 : bruto;
      setPercentual(percentualAjustado);

      setShowResultado(true);
      enqueueSnackbar("Cotação calculada com sucesso!", { variant: "success" });
    } catch (error) {
      console.error("Erro ao calcular a cotação:", error);
      enqueueSnackbar("Erro ao calcular a cotação. Verifique os dados.", { variant: "error" });
    }
  };

  const isTotal = desformatarMoeda(incendio) + desformatarMoeda(aluguel);
  const repasseAdministradora =
    desformatarMoeda(premioProposto) *
    (Number(String(repasse).replace("%", "").replace(",", ".")) / 100);

  return (
    <PageLayout
      title="Estudo – Incêndio Conteúdo"
      subtitle="Calcule o valor do seguro incêndio para seu imóvel"
      icon={<FaHome />}
      helpContent={<CotacaoConteudoHelp />}
    >
      <S.Container>
        {/* Flags lado a lado */}
        <S.FlagsGrid>
          <S.FormGroup>
            <S.Label>Tipo do Imóvel</S.Label>
            <S.RadioGroup>
              <S.RadioLabel $active={tipoImovel === "residencial"}>
                <input
                  type="radio"
                  name="tipoImovel"
                  value="residencial"
                  checked={tipoImovel === "residencial"}
                  onChange={() => {
                    setTipoImovel("residencial");
                    setShowResultado(false);
                  }}
                />
                <FaBuilding /> Residencial
              </S.RadioLabel>
              <S.RadioLabel $active={tipoImovel === "comercial"}>
                <input
                  type="radio"
                  name="tipoImovel"
                  value="comercial"
                  checked={tipoImovel === "comercial"}
                  onChange={() => {
                    setTipoImovel("comercial");
                    setShowResultado(false);
                  }}
                />
                <FaBuilding /> Comercial
              </S.RadioLabel>
            </S.RadioGroup>
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Assistência</S.Label>
            <S.RadioGroup>
              <S.RadioLabel $active={assistencia === "basica"}>
                <input
                  type="radio"
                  name="assistencia"
                  value="basica"
                  checked={assistencia === "basica"}
                  onChange={() => {
                    setAssistencia("basica");
                    setShowResultado(false);
                  }}
                />
                <FaShieldAlt /> Básica
              </S.RadioLabel>
              <S.RadioLabel $active={assistencia === "faz_tudo_lar"}>
                <input
                  type="radio"
                  name="assistencia"
                  value="faz_tudo_lar"
                  checked={assistencia === "faz_tudo_lar"}
                  onChange={() => {
                    setAssistencia("faz_tudo_lar");
                    setShowResultado(false);
                  }}
                />
                <FaShieldAlt /> Faz Tudo Lar
              </S.RadioLabel>
            </S.RadioGroup>
          </S.FormGroup>
        </S.FlagsGrid>

        {/* Input Grid */}
        <S.InputGrid>
          <S.FormGroup>
            <S.Label>Incêndio Conteúdo</S.Label>
            <S.Input
              type="text"
              value={incendio}
              onChange={handleChange(setIncendio)}
              placeholder="R$ 0,00"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Perda de Aluguel</S.Label>
            <S.Input
              type="text"
              value={aluguel}
              onChange={handleChange(setAluguel)}
              placeholder="R$ 0,00"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>IS Total</S.Label>
            <S.ReadonlyInput value={formatarValorParaMoeda(isTotal)} readOnly />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Prêmio Proposto</S.Label>
            <S.Input
              type="text"
              value={premioProposto}
              onChange={handleChange(setPremioProposto)}
              placeholder="R$ 0,00"
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Repasse</S.Label>
            <S.Input
              type="text"
              value={repasse}
              onChange={handleChange(setRepasse, "percent")}
              placeholder="Ex: 20%"
              maxLength={6}
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>Repasse Administradora</S.Label>
            <S.ReadonlyInput value={formatarValorParaMoeda(repasseAdministradora)} readOnly />
          </S.FormGroup>
        </S.InputGrid>

        <S.ButtonWrapper>
          <S.ResultButton onClick={handleGerarResultado}>
            <FaCalculator /> Gerar Resultado
          </S.ResultButton>
        </S.ButtonWrapper>

        {showResultado && (
          <S.ResultContainer>
            <S.ResultRow>
              <S.FormGroup>
                <S.Label>Resultado</S.Label>
                <S.ResultInput value={formatarValorParaMoeda(resultado)} readOnly $highlight />
              </S.FormGroup>
              <S.FormGroup>
                <S.Label>Resultado Final (%)</S.Label>
                <S.ResultInput value={formatarValorParaPorcentagem(percentual)} readOnly $highlight />
              </S.FormGroup>
            </S.ResultRow>
          </S.ResultContainer>
        )}
      </S.Container>
    </PageLayout>
  );
};

export default CotacaoConteudo;