import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import * as S from "../CursoCipa/CursoCipaStyles";

const VAZIO = { nome: "", predio: "", capacidade: 10, unidade_codigo: "RIO", compartilha_sala_reuniao: false };

/**
 * Formulário do local (RF-CIP-007). A capacidade é referência, não trava
 * (ADR-0008); a marca "sala de reunião da agenda" só pode estar em um local
 * ativo — quem valida é o backend, a tela explica.
 */
export default function LocalModal({ aberto, item, unidades, salvando, erros = {}, onSalvar, onFechar }) {
  const [form, setForm] = useState(VAZIO);

  useEffect(() => {
    if (!aberto) return;
    setForm(
      item
        ? {
            nome: item.nome || "",
            predio: item.predio || "",
            capacidade: item.capacidade ?? 10,
            unidade_codigo: item.unidade_codigo || "RIO",
            compartilha_sala_reuniao: Boolean(item.compartilha_sala_reuniao),
          }
        : VAZIO
    );
  }, [aberto, item]);

  if (!aberto) return null;

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const submeter = (evento) => {
    evento.preventDefault();
    onSalvar({ ...form, capacidade: Number(form.capacidade) });
  };

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>{item ? "Editar local" : "Novo local"}</h2>
            <p>Onde o curso acontece e quantas pessoas cabem</p>
          </div>
          <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
            <FaTimes />
          </S.FecharButton>
        </S.ModalHeader>

        <form onSubmit={submeter}>
          <S.Linha>
            <S.Campo $erro={Boolean(erros.nome)}>
              Nome
              <input
                value={form.nome}
                onChange={(e) => alterar("nome", e.target.value)}
                placeholder="Ex.: Sala 2"
                autoFocus
              />
              {erros.nome && <span className="erro">{erros.nome}</span>}
            </S.Campo>
            <S.Campo $erro={Boolean(erros.predio)}>
              Prédio
              <input
                value={form.predio}
                onChange={(e) => alterar("predio", e.target.value)}
                placeholder="Ex.: Matriz, Anexo"
              />
              {erros.predio && <span className="erro">{erros.predio}</span>}
            </S.Campo>
          </S.Linha>

          <S.Linha>
            <S.Campo $erro={Boolean(erros.capacidade)}>
              Capacidade (lugares)
              <input
                type="number"
                min={1}
                value={form.capacidade}
                onChange={(e) => alterar("capacidade", e.target.value)}
              />
              <span className="ajuda">Referência para a tela sinalizar o excesso; não impede inscrever.</span>
              {erros.capacidade && <span className="erro">{erros.capacidade}</span>}
            </S.Campo>
            <S.Campo $erro={Boolean(erros.unidade_codigo)}>
              Unidade emissora
              <select
                value={form.unidade_codigo}
                onChange={(e) => alterar("unidade_codigo", e.target.value)}
              >
                {unidades.map((u) => (
                  <option key={u.codigo} value={u.codigo}>
                    {u.nome}
                  </option>
                ))}
              </select>
              <span className="ajuda">Cabeçalho da lista de presença e do certificado.</span>
              {erros.unidade_codigo && <span className="erro">{erros.unidade_codigo}</span>}
            </S.Campo>
          </S.Linha>

          <S.Campo $erro={Boolean(erros.compartilha_sala_reuniao)} style={{ flexDirection: "row", alignItems: "center", gap: "0.6rem" }}>
            <input
              type="checkbox"
              checked={form.compartilha_sala_reuniao}
              onChange={(e) => alterar("compartilha_sala_reuniao", e.target.checked)}
              style={{ width: "auto" }}
            />
            É a sala de reunião da Agenda geral
          </S.Campo>
          <S.MedidaNota>
            Turma num local com esta marca bloqueia a sala na Agenda do FedConnect, e uma reunião
            marcada lá bloqueia o curso. Só um local ativo pode ter a marca.
          </S.MedidaNota>
          {erros.compartilha_sala_reuniao && (
            <S.AvisoBloco $tom="erro">{erros.compartilha_sala_reuniao}</S.AvisoBloco>
          )}

          <S.Acoes>
            <S.Botao type="button" $variante="secundario" onClick={onFechar}>
              Cancelar
            </S.Botao>
            <S.Botao type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : item ? "Salvar local" : "Cadastrar local"}
            </S.Botao>
          </S.Acoes>
        </form>
      </S.Modal>
    </S.Overlay>
  );
}
