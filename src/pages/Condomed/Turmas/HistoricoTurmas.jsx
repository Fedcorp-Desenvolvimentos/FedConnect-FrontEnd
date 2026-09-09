import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaChevronLeft,
  FaChevronRight,
  FaChevronUp,
  FaFilter,
  FaHistory,
  FaListUl,
  FaSearch,
  FaUsers,
} from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { formatCPF, formatDateBR } from "../../../utils/formatters";
import { STATUS_TURMA } from "../CursoCipa/hooks/useCursoCipa";
import { useLocaisCipa } from "../CursoCipa/hooks/useLocaisCipa";
import { useHistoricoTurmas, PAGINA } from "./hooks/useHistoricoTurmas";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "./TurmasStyles";

const ROTULO_STATUS = Object.fromEntries(STATUS_TURMA.map((s) => [s.valor, s.rotulo]));

function Paginacao({ pagina, total, count, onMudar }) {
  if (count === 0) return null;
  const de = (pagina - 1) * PAGINA + 1;
  const ate = Math.min(pagina * PAGINA, count);
  return (
    <S.Paginacao>
      <span>
        {de}–{ate} de {count}
      </span>
      <div>
        <C.Botao
          type="button"
          $variante="secundario"
          disabled={pagina <= 1}
          onClick={() => onMudar(pagina - 1)}
          aria-label="Página anterior"
        >
          <FaChevronLeft size={10} /> Anterior
        </C.Botao>
        <C.Botao
          type="button"
          $variante="secundario"
          disabled={pagina >= total}
          onClick={() => onMudar(pagina + 1)}
          aria-label="Próxima página"
        >
          Próxima <FaChevronRight size={10} />
        </C.Botao>
      </div>
    </S.Paginacao>
  );
}

function SeloStatus({ status }) {
  return <S.SeloPonto $status={status}>{ROTULO_STATUS[status] || status}</S.SeloPonto>;
}

/** Realizada com presentes aptos sem certificado: falta emitir (contagem do backend). */
function CertificadosPendentes({ turma }) {
  if (turma.status !== "realizada" || !(turma.aptos_sem_certificado > 0)) return null;
  return (
    <S.SeloContagem
      $tom="erro"
      title={`${turma.aptos_sem_certificado} ${turma.aptos_sem_certificado === 1 ? "presente apto" : "presentes aptos"} sem certificado`}
      style={{ marginLeft: "0.4rem" }}
    >
      {turma.aptos_sem_certificado} sem certificado
    </S.SeloContagem>
  );
}

/** Cabeçalho de cartão: ícone, título, subtítulo e um espaço à direita. */
function CabecalhoCartao({ icone, titulo, subtitulo, direita }) {
  return (
    <C.CartaoCabecalho>
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
        <C.MedidaIcone>{icone}</C.MedidaIcone>
        <div>
          <C.CartaoTitulo>
            <h2>{titulo}</h2>
          </C.CartaoTitulo>
          <C.CartaoSubtitulo>{subtitulo}</C.CartaoSubtitulo>
        </div>
      </div>
      {direita}
    </C.CartaoCabecalho>
  );
}

const Ajuda = () => (
  <>
    <p style={{ margin: 0, color: "#475569", fontSize: "0.9rem", lineHeight: 1.55 }}>
      <strong>Turmas</strong> lista o que já aconteceu e o que está marcado, da mais
      recente para a mais antiga — por padrão os últimos seis meses. Filtre por local,
      situação, ou busque por condomínio, administradora, nome ou CPF de quem
      participou. Clique na linha para abrir a turma.
    </p>
    <p style={{ margin: "0.75rem 0 0", color: "#475569", fontSize: "0.9rem", lineHeight: 1.55 }}>
      <strong>Participantes</strong> responde "onde esta pessoa esteve": uma linha por
      inscrição. A mesma pessoa em três turmas aparece três vezes, porque presença e
      certificado (em breve) são por turma.
    </p>
  </>
);

/**
 * Histórico e consulta (RF-HIS-001, RF-HIS-002). A agenda mostra um mês; esta
 * página mostra um período, paginado, e leva ao detalhe da turma.
 */
export default function HistoricoTurmas() {
  const navigate = useNavigate();
  const h = useHistoricoTurmas();
  // Inclui inativos: o histórico filtra turmas de locais que já não existem nas opções.
  const locais = useLocaisCipa({ todos: true });
  // Filtros recolhíveis: quem já achou o que queria ganha a tela para a tabela.
  const [filtrosAbertos, setFiltrosAbertos] = useState({ turmas: true, participantes: true });
  const alternarFiltros = (aba) =>
    setFiltrosAbertos((atual) => ({ ...atual, [aba]: !atual[aba] }));

  const abrirTurma = (id) => navigate(`/condomed/turmas/${id}`);

  const submeterTurmas = (evento) => {
    evento.preventDefault();
    h.aplicarTurmas();
  };
  const submeterParticipantes = (evento) => {
    evento.preventDefault();
    h.aplicarParticipantes();
  };

  return (
    <PageLayout
      title="Turmas e participantes"
      subtitle="Histórico das turmas CIPA e consulta de quem participou"
      icon={<FaHistory />}
      helpContent={<Ajuda />}
      helpTitle="Guia rápido — Turmas e participantes"
      actions={
        <C.Botao
          type="button"
          $variante="secundario"
          onClick={() => navigate("/condomed/cursos-cipa")}
        >
          <FaCalendarAlt size={11} /> Ir para a agenda
        </C.Botao>
      }
    >
      <C.Container>
        <S.Abas role="tablist">
          <S.Aba
            type="button"
            role="tab"
            $ativa={h.aba === "turmas"}
            aria-selected={h.aba === "turmas"}
            onClick={() => h.setAba("turmas")}
          >
            <FaHistory size={12} /> Turmas
            {h.aba === "turmas" && <small>{h.turmas.count}</small>}
          </S.Aba>
          <S.Aba
            type="button"
            role="tab"
            $ativa={h.aba === "participantes"}
            aria-selected={h.aba === "participantes"}
            onClick={() => h.setAba("participantes")}
          >
            <FaUsers size={12} /> Participantes
            {h.aba === "participantes" && <small>{h.participantes.count}</small>}
          </S.Aba>
        </S.Abas>

        {h.aba === "turmas" && (
          <>
          <C.CartaoDetalhe>
            <CabecalhoCartao
              icone={<FaFilter />}
              titulo="Filtros de busca"
              subtitulo="Refine os dados para encontrar as turmas desejadas"
              direita={
                <S.BotaoRecolher
                  type="button"
                  $aberto={filtrosAbertos.turmas}
                  onClick={() => alternarFiltros("turmas")}
                  aria-label={filtrosAbertos.turmas ? "Recolher filtros" : "Expandir filtros"}
                >
                  <FaChevronUp size={13} />
                </S.BotaoRecolher>
              }
            />
            <form onSubmit={submeterTurmas} hidden={!filtrosAbertos.turmas}>
              <S.FiltrosLinha>
                <C.Campo>
                  De
                  <input
                    type="date"
                    value={h.filtrosTurmas.data_inicio}
                    onChange={(e) =>
                      h.setFiltrosTurmas({ ...h.filtrosTurmas, data_inicio: e.target.value })
                    }
                  />
                </C.Campo>
                <C.Campo>
                  Até
                  <input
                    type="date"
                    value={h.filtrosTurmas.data_fim}
                    onChange={(e) =>
                      h.setFiltrosTurmas({ ...h.filtrosTurmas, data_fim: e.target.value })
                    }
                  />
                </C.Campo>
                <C.Campo>
                  Local
                  <select
                    value={h.filtrosTurmas.local}
                    onChange={(e) =>
                      h.setFiltrosTurmas({ ...h.filtrosTurmas, local: e.target.value })
                    }
                  >
                    <option value="">Todos os locais</option>
                    {locais.map((local) => (
                      <option key={local.codigo} value={local.codigo}>
                        {local.nome}
                      </option>
                    ))}
                  </select>
                </C.Campo>
                <C.Campo>
                  Situação
                  <select
                    value={h.filtrosTurmas.status}
                    onChange={(e) =>
                      h.setFiltrosTurmas({ ...h.filtrosTurmas, status: e.target.value })
                    }
                  >
                    <option value="">Todas as situações</option>
                    {STATUS_TURMA.map((item) => (
                      <option key={item.valor} value={item.valor}>
                        {item.rotulo}
                      </option>
                    ))}
                  </select>
                </C.Campo>
                <C.Campo style={{ gridColumn: "span 2" }}>
                  Buscar
                  <S.EntradaComIcone>
                    <FaSearch size={12} />
                    <input
                      value={h.filtrosTurmas.busca}
                      onChange={(e) =>
                        h.setFiltrosTurmas({ ...h.filtrosTurmas, busca: e.target.value })
                      }
                      placeholder="Condomínio, administradora, nome ou CPF"
                    />
                  </S.EntradaComIcone>
                </C.Campo>
              </S.FiltrosLinha>
              <C.Acoes>
                <C.Botao type="button" $variante="secundario" onClick={h.limparTurmas}>
                  Limpar
                </C.Botao>
                <C.Botao type="submit" disabled={h.carregando}>
                  <FaSearch size={11} /> {h.carregando ? "Buscando..." : "Buscar"}
                </C.Botao>
              </C.Acoes>
            </form>
          </C.CartaoDetalhe>

          <C.CartaoDetalhe>
            <CabecalhoCartao
              icone={<FaListUl />}
              titulo="Resultado das turmas"
              subtitulo="Lista de turmas encontradas de acordo com os filtros aplicados"
            />
            {h.turmas.results.length === 0 ? (
              <C.Vazio>
                {h.carregando ? "Carregando..." : "Nenhuma turma no período com esses filtros."}
              </C.Vazio>
            ) : (
              <C.Tabela>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Situação</th>
                    <th>Inscritos</th>
                    <th>Instrutor</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {h.turmas.results.map((turma) => (
                    <S.LinhaClicavel
                      key={turma.id}
                      onClick={() => abrirTurma(turma.id)}
                      title="Abrir a turma"
                    >
                      <td className="numero">
                        <strong style={{ color: "#0f3d5d" }}>{turma.codigo}</strong>
                      </td>
                      <td className="numero">{formatDateBR(turma.data, "-")}</td>
                      <td>{turma.local_nome}</td>
                      <td>
                        <SeloStatus status={turma.status} />
                        <CertificadosPendentes turma={turma} />
                      </td>
                      <td className="numero">
                        {turma.total_inscritos}/{turma.capacidade}
                        {turma.acima_da_capacidade > 0 && (
                          <>
                            {" "}
                            <C.Selo $tom="erro" title="Acima da capacidade do local">
                              +{turma.acima_da_capacidade}
                            </C.Selo>
                          </>
                        )}
                      </td>
                      <td>{turma.instrutor_nome || <span style={{ color: "#b45309" }}>a definir</span>}</td>
                      <td className="acao">
                        <S.LinkAbrir>
                          Abrir <FaChevronRight size={10} />
                        </S.LinkAbrir>
                      </td>
                    </S.LinhaClicavel>
                  ))}
                </tbody>
              </C.Tabela>
            )}
            <Paginacao
              pagina={h.paginaTurmas}
              total={h.totalPaginasTurmas}
              count={h.turmas.count}
              onMudar={h.setPaginaTurmas}
            />
          </C.CartaoDetalhe>
          </>
        )}

        {h.aba === "participantes" && (
          <>
          <C.CartaoDetalhe>
            <CabecalhoCartao
              icone={<FaFilter />}
              titulo="Filtros de busca"
              subtitulo="Procure uma pessoa, um condomínio ou uma administradora"
              direita={
                <S.BotaoRecolher
                  type="button"
                  $aberto={filtrosAbertos.participantes}
                  onClick={() => alternarFiltros("participantes")}
                  aria-label={filtrosAbertos.participantes ? "Recolher filtros" : "Expandir filtros"}
                >
                  <FaChevronUp size={13} />
                </S.BotaoRecolher>
              }
            />
            <form onSubmit={submeterParticipantes} hidden={!filtrosAbertos.participantes}>
              <S.FiltrosLinha>
                <C.Campo style={{ gridColumn: "span 2" }}>
                  Buscar
                  <S.EntradaComIcone>
                    <FaSearch size={12} />
                    <input
                      value={h.filtrosParticipantes.busca}
                      onChange={(e) =>
                        h.setFiltrosParticipantes({
                          ...h.filtrosParticipantes,
                          busca: e.target.value,
                        })
                      }
                      placeholder="Nome, CPF, condomínio ou administradora"
                      autoFocus
                    />
                  </S.EntradaComIcone>
                </C.Campo>
                <C.Campo>
                  Turmas de
                  <input
                    type="date"
                    value={h.filtrosParticipantes.data_inicio}
                    onChange={(e) =>
                      h.setFiltrosParticipantes({
                        ...h.filtrosParticipantes,
                        data_inicio: e.target.value,
                      })
                    }
                  />
                </C.Campo>
                <C.Campo>
                  até
                  <input
                    type="date"
                    value={h.filtrosParticipantes.data_fim}
                    onChange={(e) =>
                      h.setFiltrosParticipantes({
                        ...h.filtrosParticipantes,
                        data_fim: e.target.value,
                      })
                    }
                  />
                </C.Campo>
              </S.FiltrosLinha>
              <C.Acoes>
                <C.Botao
                  type="button"
                  $variante="secundario"
                  onClick={h.limparParticipantes}
                >
                  Limpar
                </C.Botao>
                <C.Botao type="submit" disabled={h.carregando}>
                  <FaSearch size={11} /> {h.carregando ? "Buscando..." : "Buscar"}
                </C.Botao>
              </C.Acoes>
            </form>
          </C.CartaoDetalhe>

          <C.CartaoDetalhe>
            <CabecalhoCartao
              icone={<FaUsers />}
              titulo="Resultado dos participantes"
              subtitulo="Uma linha por inscrição: a mesma pessoa pode aparecer em mais de uma turma"
            />
            {h.participantes.results.length === 0 ? (
              <C.Vazio>
                {h.carregando ? "Carregando..." : "Nenhuma inscrição encontrada."}
              </C.Vazio>
            ) : (
              <C.Tabela>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Condomínio</th>
                    <th>Administradora</th>
                    <th>Turma</th>
                    <th>Situação</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {h.participantes.results.map((inscricao) => (
                    <S.LinhaClicavel
                      key={inscricao.id}
                      onClick={() => abrirTurma(inscricao.turma.id)}
                      title="Abrir a turma desta inscrição"
                    >
                      <td>{inscricao.nome}</td>
                      <td className="numero">{formatCPF(inscricao.cpf)}</td>
                      <td>{inscricao.condominio_nome}</td>
                      <td>{inscricao.administradora_nome || "—"}</td>
                      <td>
                        <strong style={{ color: "#0f3d5d" }}>{inscricao.turma.codigo}</strong>
                        <C.Secundario>
                          {formatDateBR(inscricao.turma.data, "-")} · {inscricao.turma.local_nome}
                        </C.Secundario>
                      </td>
                      <td>
                        <SeloStatus status={inscricao.turma.status} />
                      </td>
                      <td className="acao">
                        <S.LinkAbrir>
                          Abrir <FaChevronRight size={10} />
                        </S.LinkAbrir>
                      </td>
                    </S.LinhaClicavel>
                  ))}
                </tbody>
              </C.Tabela>
            )}
            <Paginacao
              pagina={h.paginaParticipantes}
              total={h.totalPaginasParticipantes}
              count={h.participantes.count}
              onMudar={h.setPaginaParticipantes}
            />
          </C.CartaoDetalhe>
          </>
        )}
      </C.Container>
    </PageLayout>
  );
}
