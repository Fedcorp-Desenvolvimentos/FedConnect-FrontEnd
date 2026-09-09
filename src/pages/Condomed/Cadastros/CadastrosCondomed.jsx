import { useMemo, useState } from "react";
import {
  FaChalkboardTeacher,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaPlus,
  FaToggleOff,
  FaToggleOn,
  FaTrashAlt,
  FaUserCog,
} from "react-icons/fa";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { useCadastrosCipa } from "./hooks/useCadastrosCipa";
import PalestranteModal from "./PalestranteModal";
import LocalModal from "./LocalModal";
import CadastrosHelp from "./CadastrosHelp";
import * as C from "../CursoCipa/CursoCipaStyles";
import * as S from "../Turmas/TurmasStyles";

const UNIDADE_PADRAO = [{ codigo: "RIO", nome: "CondoMed Rio" }];

/**
 * Cadastros da Condomed (RF-CIP-006/007): palestrantes e locais do curso CIPA.
 *
 * Duas abas com a mesma mecânica: lista (com filtro "mostrar inativos"),
 * Novo/Editar em modal, Desativar/Reativar e Excluir (só sem turma; o backend
 * recusa e a tela mostra o motivo). Quem valida é o backend.
 */
export default function CadastrosCondomed() {
  const c = useCadastrosCipa();
  const [aba, setAba] = useState("palestrantes");
  const [mostrarInativos, setMostrarInativos] = useState(false);
  const [modal, setModal] = useState(null); // { tipo: "palestrante"|"local", item }
  const [confirmando, setConfirmando] = useState(null); // { tipo, item }

  const unidades = useMemo(() => {
    const vistas = new Map(UNIDADE_PADRAO.map((u) => [u.codigo, u]));
    c.locais.forEach((l) => {
      if (l.unidade_codigo && l.unidade?.nome) vistas.set(l.unidade_codigo, { codigo: l.unidade_codigo, nome: l.unidade.nome });
    });
    return [...vistas.values()];
  }, [c.locais]);

  const instrutores = c.instrutores.filter((i) => mostrarInativos || i.ativo);
  const locais = c.locais.filter((l) => mostrarInativos || l.ativo);

  const abrir = (tipo, item = null) => {
    c.setErrosCampos({});
    setModal({ tipo, item });
  };
  const fechar = () => setModal(null);

  const salvar = async (dados) => {
    const ok =
      modal.tipo === "palestrante"
        ? await c.salvarInstrutor(modal.item?.id, dados)
        : await c.salvarLocal(modal.item?.id, dados);
    if (ok) fechar();
  };

  const confirmarExclusao = async () => {
    const { tipo, item } = confirmando;
    setConfirmando(null);
    if (tipo === "palestrante") await c.excluirInstrutor(item);
    else await c.excluirLocal(item);
  };

  const linhaInativa = (ativo) => (ativo ? undefined : { opacity: 0.55 });

  return (
    <PageLayout
      title="Cadastros da Condomed"
      subtitle="Palestrantes que assinam o certificado e locais onde o curso acontece"
      icon={<FaUserCog />}
      loading={c.carregando}
      helpContent={<CadastrosHelp />}
      actions={
        <C.AcoesCabecalho>
          <C.Botao
            type="button"
            onClick={() => abrir(aba === "palestrantes" ? "palestrante" : "local")}
          >
            <FaPlus size={11} /> {aba === "palestrantes" ? "Novo palestrante" : "Novo local"}
          </C.Botao>
        </C.AcoesCabecalho>
      }
    >
      <C.Container>
        <S.Abas role="tablist">
          <S.Aba
            type="button"
            role="tab"
            $ativa={aba === "palestrantes"}
            aria-selected={aba === "palestrantes"}
            onClick={() => setAba("palestrantes")}
          >
            <FaChalkboardTeacher size={12} /> Palestrantes <small>{instrutores.length}</small>
          </S.Aba>
          <S.Aba
            type="button"
            role="tab"
            $ativa={aba === "locais"}
            aria-selected={aba === "locais"}
            onClick={() => setAba("locais")}
          >
            <FaMapMarkerAlt size={12} /> Locais <small>{locais.length}</small>
          </S.Aba>
          <label
            style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#475569" }}
          >
            <input
              type="checkbox"
              checked={mostrarInativos}
              onChange={(e) => setMostrarInativos(e.target.checked)}
            />
            mostrar inativos
          </label>
        </S.Abas>

        {aba === "palestrantes" && (
          <C.CartaoDetalhe>
            <C.CartaoCabecalho>
              <div>
                <C.CartaoTitulo>
                  <FaChalkboardTeacher size={20} />
                  <h2>Palestrantes</h2>
                </C.CartaoTitulo>
                <C.CartaoSubtitulo>
                  Nome, título e registro MTE saem no certificado como estão aqui. Sem assinatura, o
                  certificado não é emitido.
                </C.CartaoSubtitulo>
              </div>
            </C.CartaoCabecalho>

            {instrutores.length === 0 ? (
              <C.Vazio>Nenhum palestrante {mostrarInativos ? "cadastrado" : "ativo"}.</C.Vazio>
            ) : (
              <C.Tabela>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Título</th>
                    <th>Registro</th>
                    <th>Assinatura</th>
                    <th>Turmas</th>
                    <th>Situação</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {instrutores.map((item) => (
                    <tr key={item.id} style={linhaInativa(item.ativo)}>
                      <td>{item.nome}</td>
                      <td>{item.titulo}</td>
                      <td style={{ fontFamily: "monospace" }}>{item.registro}</td>
                      <td>
                        {item.tem_assinatura ? (
                          <S.SeloContagem $tom="ok">
                            <FaCheckCircle size={10} />&nbsp;cadastrada
                          </S.SeloContagem>
                        ) : (
                          <S.SeloContagem $tom="erro" title="Sem assinatura o certificado não sai">
                            <FaExclamationTriangle size={10} />&nbsp;sem assinatura
                          </S.SeloContagem>
                        )}
                      </td>
                      <td>{item.turmas}</td>
                      <td>
                        <S.SeloContagem $tom={item.ativo ? "ok" : undefined}>
                          {item.ativo ? "ativo" : "inativo"}
                        </S.SeloContagem>
                      </td>
                      <td>
                        <C.AcoesLinha>
                          <C.BotaoIcone type="button" title="Editar" onClick={() => abrir("palestrante", item)}>
                            <FaPencilAlt />
                          </C.BotaoIcone>
                          <C.BotaoIcone
                            type="button"
                            title={item.ativo ? "Desativar (sai das opções, fica no histórico)" : "Reativar"}
                            onClick={() => c.alternarAtivoInstrutor(item)}
                            disabled={c.salvando}
                          >
                            {item.ativo ? <FaToggleOn /> : <FaToggleOff />}
                          </C.BotaoIcone>
                          <C.BotaoIcone
                            type="button"
                            $perigo
                            title={item.turmas ? "Tem turmas vinculadas: desative em vez de excluir" : "Excluir"}
                            onClick={() => setConfirmando({ tipo: "palestrante", item })}
                            disabled={c.salvando || item.turmas > 0}
                          >
                            <FaTrashAlt />
                          </C.BotaoIcone>
                        </C.AcoesLinha>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </C.Tabela>
            )}
          </C.CartaoDetalhe>
        )}

        {aba === "locais" && (
          <C.CartaoDetalhe>
            <C.CartaoCabecalho>
              <div>
                <C.CartaoTitulo>
                  <FaMapMarkerAlt size={20} />
                  <h2>Locais</h2>
                </C.CartaoTitulo>
                <C.CartaoSubtitulo>
                  Capacidade é referência, não trava. Só um local pode ser a sala de reunião da Agenda.
                </C.CartaoSubtitulo>
              </div>
            </C.CartaoCabecalho>

            {locais.length === 0 ? (
              <C.Vazio>Nenhum local {mostrarInativos ? "cadastrado" : "ativo"}.</C.Vazio>
            ) : (
              <C.Tabela>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Prédio</th>
                    <th>Capacidade</th>
                    <th>Unidade emissora</th>
                    <th>Agenda</th>
                    <th>Turmas</th>
                    <th>Situação</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {locais.map((item) => (
                    <tr key={item.id} style={linhaInativa(item.ativo)}>
                      <td>
                        <C.Etiqueta $local={item.codigo}>{item.nome}</C.Etiqueta>
                      </td>
                      <td>{item.predio || "—"}</td>
                      <td>{item.capacidade} lugares</td>
                      <td>{item.unidade?.nome}</td>
                      <td>{item.compartilha_sala_reuniao ? "sala de reunião da Agenda" : "—"}</td>
                      <td>{item.turmas}</td>
                      <td>
                        <S.SeloContagem $tom={item.ativo ? "ok" : undefined}>
                          {item.ativo ? "ativo" : "inativo"}
                        </S.SeloContagem>
                      </td>
                      <td>
                        <C.AcoesLinha>
                          <C.BotaoIcone type="button" title="Editar" onClick={() => abrir("local", item)}>
                            <FaPencilAlt />
                          </C.BotaoIcone>
                          <C.BotaoIcone
                            type="button"
                            title={item.ativo ? "Desativar (sai das opções, fica no histórico)" : "Reativar"}
                            onClick={() => c.alternarAtivoLocal(item)}
                            disabled={c.salvando}
                          >
                            {item.ativo ? <FaToggleOn /> : <FaToggleOff />}
                          </C.BotaoIcone>
                          <C.BotaoIcone
                            type="button"
                            $perigo
                            title={item.turmas ? "Tem turmas vinculadas: desative em vez de excluir" : "Excluir"}
                            onClick={() => setConfirmando({ tipo: "local", item })}
                            disabled={c.salvando || item.turmas > 0}
                          >
                            <FaTrashAlt />
                          </C.BotaoIcone>
                        </C.AcoesLinha>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </C.Tabela>
            )}
          </C.CartaoDetalhe>
        )}

        <PalestranteModal
          aberto={modal?.tipo === "palestrante"}
          item={modal?.item}
          salvando={c.salvando}
          erros={c.errosCampos}
          onSalvar={salvar}
          onFechar={fechar}
        />
        <LocalModal
          aberto={modal?.tipo === "local"}
          item={modal?.item}
          unidades={unidades}
          salvando={c.salvando}
          erros={c.errosCampos}
          onSalvar={salvar}
          onFechar={fechar}
        />

        {confirmando && (
          <C.Overlay $acima onClick={() => setConfirmando(null)}>
            <C.ModalConfirmacao onClick={(e) => e.stopPropagation()}>
              <h3>Excluir {confirmando.tipo === "palestrante" ? "palestrante" : "local"}?</h3>
              <p>
                <strong>{confirmando.item.nome}</strong> não tem turma vinculada e será removido do
                cadastro. Não dá para desfazer.
              </p>
              <C.AcoesConfirmacao>
                <C.Botao type="button" $variante="secundario" onClick={() => setConfirmando(null)}>
                  Cancelar
                </C.Botao>
                <C.Botao type="button" $variante="perigoSolido" onClick={confirmarExclusao}>
                  Excluir
                </C.Botao>
              </C.AcoesConfirmacao>
            </C.ModalConfirmacao>
          </C.Overlay>
        )}
      </C.Container>
    </PageLayout>
  );
}
