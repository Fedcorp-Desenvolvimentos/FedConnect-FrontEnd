import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaHistory, FaSearch, FaUsers } from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { formatCPF, formatDateBR } from "../../../utils/formatters";
import { ORDEM_LOCAIS, STATUS_TURMA } from "../CursoCipa/hooks/useCursoCipa";
import { useHistoricoTurmas, PAGINA } from "./hooks/useHistoricoTurmas";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "./TurmasStyles";

const NOME_LOCAL = { AUDITORIO: "Auditório", SALA_REUNIAO: "Sala de reunião" };
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
  const tom = status === "cancelada" ? "erro" : status === "realizada" ? "ok" : undefined;
  return tom ? (
    <C.Selo $tom={tom}>{ROTULO_STATUS[status] || status}</C.Selo>
  ) : (
    <span>{ROTULO_STATUS[status] || status}</span>
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
          <S.Superficie>
            <form onSubmit={submeterTurmas}>
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
                    {ORDEM_LOCAIS.map((codigo) => (
                      <option key={codigo} value={codigo}>
                        {NOME_LOCAL[codigo]}
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
                  <input
                    value={h.filtrosTurmas.busca}
                    onChange={(e) =>
                      h.setFiltrosTurmas({ ...h.filtrosTurmas, busca: e.target.value })
                    }
                    placeholder="Condomínio, administradora, nome ou CPF"
                  />
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

            {h.turmas.results.length === 0 ? (
              <C.Vazio>
                {h.carregando ? "Carregando..." : "Nenhuma turma no período com esses filtros."}
              </C.Vazio>
            ) : (
              <C.Tabela>
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Local</th>
                    <th>Situação</th>
                    <th>Inscritos</th>
                    <th>Condomínios</th>
                    <th>Administradoras</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {h.turmas.results.map((turma) => (
                    <S.LinhaClicavel
                      key={turma.id}
                      onClick={() => abrirTurma(turma.id)}
                      title="Abrir a turma"
                    >
                      <td className="numero">{formatDateBR(turma.data, "-")}</td>
                      <td>{turma.local_nome}</td>
                      <td>
                        <SeloStatus status={turma.status} />
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
                      <td>
                        {(turma.condominios || []).slice(0, 2).join(", ") || "—"}
                        {(turma.condominios || []).length > 2 &&
                          ` +${turma.condominios.length - 2}`}
                      </td>
                      <td className="numero">{(turma.administradoras || []).length}</td>
                      <td className="acao">Abrir ›</td>
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
          </S.Superficie>
        )}

        {h.aba === "participantes" && (
          <S.Superficie>
            <form onSubmit={submeterParticipantes}>
              <S.FiltrosLinha>
                <C.Campo style={{ gridColumn: "span 2" }}>
                  Buscar
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
                    <th />
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
                        {formatDateBR(inscricao.turma.data, "-")} · {inscricao.turma.local_nome}
                      </td>
                      <td>
                        <SeloStatus status={inscricao.turma.status} />
                      </td>
                      <td className="acao">Abrir ›</td>
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
          </S.Superficie>
        )}
      </C.Container>
    </PageLayout>
  );
}
