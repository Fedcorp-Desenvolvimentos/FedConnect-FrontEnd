import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBroom,
  FaExclamationTriangle,
  FaFileExcel,
  FaFileInvoiceDollar,
  FaFilePdf,
  FaFilter,
  FaListUl,
  FaSearch,
  FaSpinner,
} from "react-icons/fa";
import {
  Actions,
  BackButton,
  Button,
  Card,
  CardHeader,
  Container,
  EmptyStateContainer,
  EmptyStateIcon,
  EmptyStateText,
  EmptyStateTitle,
  FormGrid,
  FormGroup,
  Header,
  SingleColumnGrid,
  Title,
  TotalsBar,
} from "../comissoes/ComissoesStyles";
import * as S from "./FaturasPendentesStyles";
import {
  CLASSIFICACOES,
  ORDENACOES,
  SITUACOES,
  useFaturasPendentes,
} from "./hooks/useFaturasPendentes";

const TETO_FEDHUB = 5000;

const moeda = (v) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const dataBr = (iso) => {
  if (!iso) return "";
  const [a, m, d] = String(iso).slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
};

const ROTULO_SITUACAO = Object.fromEntries(SITUACOES.map((s) => [s.valor, s.rotulo]));

/**
 * Relatório de faturas pendentes (spec relatorio-faturas-pendentes, RF-FIN-001/002).
 * Um documento (boleto) por linha, como no PDF do legado. Filtros só consultam
 * ao confirmar; planilha e PDF saem com os filtros aplicados.
 */
export default function FaturasPendentes() {
  const navigate = useNavigate();
  const h = useFaturasPendentes();
  const totais = h.resultado?.totais;
  const linhas = h.resultado?.data || [];
  const agrupado = h.aplicados?.ordenar_por === "administradora";

  const submeter = (evento) => {
    evento.preventDefault();
    h.buscar();
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/financeiro")}>
          <FaArrowLeft />
          Voltar
        </BackButton>
        <Title>
          <span>Financeiro / Relatórios</span>
          <h1>Faturas pendentes</h1>
          <p>
            Documentos sem pagamento das faturas ativas, com os filtros do relatório do sistema
            legado. Gere a planilha ou o PDF com os filtros aplicados.
          </p>
        </Title>
      </Header>

      <SingleColumnGrid>
        <div>
          <Card as="form" onSubmit={submeter}>
            <CardHeader>
              <div>
                <FaFilter />
                <h2>Filtros</h2>
                <span>Padrões do legado: vencidas, sem OBS e sem depósito, por vencimento</span>
              </div>
            </CardHeader>

            <FormGrid>
              <FormGroup>
                <label htmlFor="fp-situacao">Situação</label>
                <select id="fp-situacao" value={h.filtros.situacao} onChange={(e) => h.alterar("situacao", e.target.value)}>
                  {SITUACOES.map((o) => (
                    <option key={o.valor} value={o.valor}>{o.rotulo}</option>
                  ))}
                </select>
                <small>Vencidas: passou 1 dia do vencimento e não há baixa.</small>
              </FormGroup>
              <FormGroup $span={2}>
                <label htmlFor="fp-classificacao">Busca de faturas</label>
                <select id="fp-classificacao" value={h.filtros.classificacao} onChange={(e) => h.alterar("classificacao", e.target.value)}>
                  {CLASSIFICACOES.map((o) => (
                    <option key={o.valor} value={o.valor}>{o.rotulo}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-ordenar">Organização</label>
                <select id="fp-ordenar" value={h.filtros.ordenar_por} onChange={(e) => h.alterar("ordenar_por", e.target.value)}>
                  {ORDENACOES.map((o) => (
                    <option key={o.valor} value={o.valor}>{o.rotulo}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label htmlFor="fp-fatura">Fatura</label>
                <input id="fp-fatura" inputMode="numeric" value={h.filtros.fatura} onChange={(e) => h.alterar("fatura", e.target.value.replace(/\D/g, ""))} placeholder="Nº da fatura" />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-adm">Administradora (código)</label>
                <input id="fp-adm" value={h.filtros.administradora} onChange={(e) => h.alterar("administradora", e.target.value)} placeholder="Co-estipulante, ex.: 4392" />
                <small>Pode digitar o número curto; o sistema completa os zeros.</small>
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-seguradora">Seguradora (código)</label>
                <input id="fp-seguradora" value={h.filtros.seguradora} onChange={(e) => h.alterar("seguradora", e.target.value)} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-cedente">Cedente (código)</label>
                <input id="fp-cedente" value={h.filtros.cedente} onChange={(e) => h.alterar("cedente", e.target.value)} />
              </FormGroup>

              <FormGroup>
                <label htmlFor="fp-apolice">Apólice</label>
                <input id="fp-apolice" value={h.filtros.apolice} onChange={(e) => h.alterar("apolice", e.target.value)} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-venc-ini">Vencimento de</label>
                <input id="fp-venc-ini" type="date" value={h.filtros.vencimento_ini} onChange={(e) => h.alterar("vencimento_ini", e.target.value)} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-venc-fim">Vencimento até</label>
                <input id="fp-venc-fim" type="date" value={h.filtros.vencimento_fim} onChange={(e) => h.alterar("vencimento_fim", e.target.value)} />
              </FormGroup>
              <FormGroup>
                <label htmlFor="fp-vig">Início de vigência a partir de</label>
                <input id="fp-vig" type="date" value={h.filtros.vigencia_ini} onChange={(e) => h.alterar("vigencia_ini", e.target.value)} />
              </FormGroup>
            </FormGrid>

            <Actions style={{ marginTop: 14, justifyContent: "flex-end" }}>
              <Button type="button" className="ghost" onClick={h.limpar} disabled={h.carregando}>
                <FaBroom /> Limpar
              </Button>
              <Button type="submit" className="primary" disabled={h.carregando}>
                {h.carregando ? <FaSpinner className="spin" /> : <FaSearch />} Buscar
              </Button>
            </Actions>
          </Card>

          <Card style={{ marginTop: 16 }}>
            <CardHeader>
              <div>
                <FaListUl />
                <h2>Documentos pendentes</h2>
                {totais && (
                  <span className="badge">
                    {totais.documentos} documento(s) · {totais.faturas} fatura(s)
                  </span>
                )}
                {h.aplicados && <span>Situação: {ROTULO_SITUACAO[h.aplicados.situacao]}</span>}
              </div>
              <Actions>
                <Button
                  type="button"
                  className="secondary"
                  onClick={() => h.baixar("xlsx")}
                  disabled={!h.aplicados || Boolean(h.gerando)}
                  title="Planilha com os filtros aplicados"
                >
                  {h.gerando === "xlsx" ? <FaSpinner className="spin" /> : <FaFileExcel />}
                  {h.gerando === "xlsx" ? "Gerando..." : "Gerar planilha"}
                </Button>
                <Button
                  type="button"
                  className="success"
                  onClick={() => h.baixar("pdf")}
                  disabled={!h.aplicados || Boolean(h.gerando)}
                  title="PDF no layout do relatório do legado"
                >
                  {h.gerando === "pdf" ? <FaSpinner className="spin" /> : <FaFilePdf />}
                  {h.gerando === "pdf" ? "Gerando..." : "Gerar PDF"}
                </Button>
              </Actions>
            </CardHeader>

            {h.filtrosMudaram && (
              <S.Aviso>
                Os filtros mudaram depois da busca. A lista e as exportações usam os filtros aplicados;
                clique em Buscar para atualizar.
              </S.Aviso>
            )}
            {totais?.documentos >= TETO_FEDHUB && (
              <S.Aviso>
                <FaExclamationTriangle /> O relatório atingiu o teto de {TETO_FEDHUB} documentos. Refine os
                filtros para ver o restante.
              </S.Aviso>
            )}

            {!h.aplicados ? (
              <EmptyStateContainer>
                <EmptyStateIcon><FaSearch /></EmptyStateIcon>
                <EmptyStateTitle>Nenhuma consulta ainda</EmptyStateTitle>
                <EmptyStateText>Ajuste os filtros e clique em Buscar.</EmptyStateText>
              </EmptyStateContainer>
            ) : linhas.length === 0 ? (
              <EmptyStateContainer>
                <EmptyStateIcon><FaFileInvoiceDollar /></EmptyStateIcon>
                <EmptyStateTitle>Nenhuma fatura pendente para estes filtros</EmptyStateTitle>
                <EmptyStateText>A planilha e o PDF podem ser gerados mesmo assim: o relatório vazio é um resultado.</EmptyStateText>
              </EmptyStateContainer>
            ) : (
              <S.Rolagem>
                <S.Tabela>
                  <thead>
                    <tr>
                      <th>Fatura</th>
                      <th>Documento</th>
                      <th>Sacado / Produto</th>
                      <th>Vigência</th>
                      <th>Vencimento</th>
                      <th className="num">Dias</th>
                      <th className="num">Valor</th>
                      <th>Parcela</th>
                      {!agrupado && <th>Administradora</th>}
                      <th>OBS / Depósito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {h.grupos.map((grupo) => (
                      <React.Fragment key={grupo.chave ?? "todos"}>
                        {agrupado && (
                          <S.LinhaGrupo>
                            <td colSpan={9}>{grupo.nome || grupo.chave}</td>
                          </S.LinhaGrupo>
                        )}
                        {grupo.linhas.map((l) => (
                          <tr key={`${l.origem}-${l.documento}`}>
                            <td className="mono">{l.fatura}</td>
                            <td className="mono">{l.documento}</td>
                            <td>
                              {l.sacado}
                              <small>{l.produto}</small>
                            </td>
                            <td className="mono">{l.vigencia}</td>
                            <td className="mono">{dataBr(l.vencimento)}</td>
                            <td className="num">{l.dias_atraso > 0 ? l.dias_atraso : "—"}</td>
                            <td className="num">{moeda(l.valor)}</td>
                            <td className="mono">{l.parcela}</td>
                            {!agrupado && <td>{l.administradora_nome || l.administradora}</td>}
                            <td>
                              {l.obs && <small>{l.obs}</small>}
                              {l.tem_deposito_cc && <S.Selo $tom="aviso">depósito em C/C</S.Selo>}
                            </td>
                          </tr>
                        ))}
                        {agrupado && grupo.subtotal && (
                          <S.LinhaSubtotal>
                            <td colSpan={6}>Subtotal · {grupo.subtotal.documentos} documento(s)</td>
                            <td className="num">{moeda(grupo.subtotal.valor)}</td>
                            <td colSpan={2} />
                          </S.LinhaSubtotal>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </S.Tabela>
              </S.Rolagem>
            )}

            {totais && (
              <TotalsBar>
                <span>Documentos: <strong>{totais.documentos}</strong></span>
                <span>Faturas: <strong>{totais.faturas}</strong></span>
                <span className="net">Total geral: <strong>{moeda(totais.valor_total)}</strong></span>
                <span>Pago: <strong>{moeda(totais.valor_pago)}</strong></span>
              </TotalsBar>
            )}
          </Card>
        </div>
      </SingleColumnGrid>
    </Container>
  );
}
