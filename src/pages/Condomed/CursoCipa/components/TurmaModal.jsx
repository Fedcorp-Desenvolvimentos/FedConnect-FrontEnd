import { useEffect, useState } from "react";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTimes } from "react-icons/fa";
import { ORDEM_LOCAIS, STATUS_TURMA } from "../hooks/useCursoCipa";
import { useInstrutores } from "../hooks/useInstrutores";
import * as S from "../CursoCipaStyles";

const VAZIA = {
  local: "",
  data: "",
  instrutor: "",
  observacao: "",
  status: "agendada",
};

/**
 * Formulário da turma: local, data, situação e observação. O horário é fixo
 * (09:00–17:30, uma turma por dia em cada local), então não há campo de hora.
 *
 * A turma não tem cliente (ADR-0005): administradora e condomínio são de cada
 * participante e ficam no painel de inscritos, porque um mesmo dia recebe
 * gente de várias administradoras.
 */
export default function TurmaModal({
  aberto,
  dataInicial,
  localInicial,
  turma,
  locais,
  salvando,
  onSalvar,
  onExcluir,
  onFechar,
}) {
  const [form, setForm] = useState(VAZIA);
  const [erros, setErros] = useState({});
  const instrutores = useInstrutores(aberto);

  useEffect(() => {
    if (!aberto) return;
    setErros({});
    setForm(
      turma
        ? {
            local: turma.local,
            data: turma.data,
            instrutor: turma.instrutor || "",
            observacao: turma.observacao || "",
            status: turma.status || "agendada",
          }
        : {
            ...VAZIA,
            data: dataInicial || "",
            local: localInicial || ORDEM_LOCAIS[0],
          }
    );
  }, [aberto, turma, dataInicial, localInicial]);

  if (!aberto) return null;

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const capacidade = locais.find((item) => item.codigo === form.local)?.capacidade;

  const submeter = (evento) => {
    evento.preventDefault();
    const novos = {};
    if (!form.local) novos.local = "Escolha o local.";
    if (!form.data) novos.data = "Escolha a data.";
    setErros(novos);
    if (Object.keys(novos).length) return;

    onSalvar({ ...form });
  };

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>{turma ? "Editar turma" : "Nova turma"}</h2>
            <p>
              Curso de dia inteiro, das 09:00 às 17:30
              {form.data &&
                ` · ${format(parseISO(form.data), "EEEE, d 'de' MMMM", { locale: ptBR })}`}
            </p>
          </div>
          <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
            <FaTimes />
          </S.FecharButton>
        </S.ModalHeader>

        <form onSubmit={submeter}>
          <S.Linha>
            <S.Campo $erro={Boolean(erros.local)}>
              Local
              <select
                value={form.local}
                onChange={(evento) => alterar("local", evento.target.value)}
              >
                {ORDEM_LOCAIS.map((codigo) => {
                  const local = locais.find((item) => item.codigo === codigo);
                  return (
                    <option key={codigo} value={codigo}>
                      {local ? `${local.nome} · ${local.capacidade} lugares` : codigo}
                    </option>
                  );
                })}
              </select>
              {erros.local && <span className="erro">{erros.local}</span>}
            </S.Campo>

            <S.Campo $erro={Boolean(erros.data)}>
              Data
              <input
                type="date"
                value={form.data}
                onChange={(evento) => alterar("data", evento.target.value)}
              />
              {erros.data && <span className="erro">{erros.data}</span>}
            </S.Campo>
          </S.Linha>

          <S.Campo>
            Instrutor
            <select
              value={form.instrutor}
              onChange={(evento) => alterar("instrutor", evento.target.value)}
            >
              <option value="">A definir</option>
              {instrutores.map((item) => (
                <option key={item.codigo} value={item.codigo}>
                  {item.nome} · {item.registro}
                </option>
              ))}
            </select>
            <span className="ajuda">
              Quem assina o certificado. Pode ficar em branco até o dia; é obrigatório para
              emitir.
            </span>
          </S.Campo>

          <S.Linha>
            <S.Campo>
              Situação
              <select
                value={form.status}
                onChange={(evento) => alterar("status", evento.target.value)}
              >
                {STATUS_TURMA.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.rotulo}
                  </option>
                ))}
              </select>
            </S.Campo>
            <S.Campo>
              Observação
              <input
                value={form.observacao}
                onChange={(evento) => alterar("observacao", evento.target.value)}
                placeholder="Opcional"
              />
            </S.Campo>
          </S.Linha>

          {capacidade && (
            <S.MedidaNota>
              O local comporta {capacidade} participantes. A administradora e o
              condomínio de cada um são informados na lista de inscritos, depois de
              salvar — a turma pode receber gente de administradoras diferentes.
            </S.MedidaNota>
          )}

          <S.Acoes>
            {turma && (
              <S.Botao type="button" $variante="perigo" onClick={() => onExcluir(turma)}>
                Excluir turma
              </S.Botao>
            )}
            <S.Botao type="button" $variante="secundario" onClick={onFechar}>
              Cancelar
            </S.Botao>
            <S.Botao type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar turma"}
            </S.Botao>
          </S.Acoes>
        </form>
      </S.Modal>
    </S.Overlay>
  );
}
