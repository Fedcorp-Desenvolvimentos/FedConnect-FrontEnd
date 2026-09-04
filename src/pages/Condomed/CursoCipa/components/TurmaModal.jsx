import { useEffect, useMemo, useState } from "react";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { FaTimes } from "react-icons/fa";
import { listarAdministradoras } from "../../../../services/vistoriasService";
import { ORDEM_LOCAIS, STATUS_TURMA } from "../hooks/useCursoCipa";
import * as S from "../CursoCipaStyles";

const VAZIA = {
  local: "",
  data: "",
  administradora_nome: "",
  condominio_nome: "",
  observacao: "",
  status: "agendada",
};

/**
 * Formulário da turma. O horário é fixo (09:00–17:30, uma turma por dia em
 * cada local), então não há campo de hora.
 *
 * O condomínio é digitado: não existe fonte de condomínios por administradora
 * (PA-003 no registro de questões).
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
  const [administradoras, setAdministradoras] = useState([]);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (!aberto) return;
    setErros({});
    setForm(
      turma
        ? {
            local: turma.local,
            data: turma.data,
            administradora_nome: turma.administradora_nome || "",
            condominio_nome: turma.condominio_nome || "",
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

  useEffect(() => {
    if (!aberto || administradoras.length) return;
    listarAdministradoras()
      .then((resposta) => {
        if (resposta?.sucesso) setAdministradoras(resposta.data || []);
      })
      .catch(() => setAdministradoras([]));
  }, [aberto, administradoras.length]);

  // Select digitável: o operador filtra pelo nome; o código vem da opção casada.
  const opcoes = useMemo(
    () => administradoras.map((item) => ({ nome: item.nome, codigo: String(item.pessoa) })),
    [administradoras]
  );

  const casada = useMemo(
    () =>
      opcoes.find(
        (opcao) =>
          opcao.nome.trim().toLowerCase() === form.administradora_nome.trim().toLowerCase()
      ),
    [opcoes, form.administradora_nome]
  );

  if (!aberto) return null;

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));
  const capacidade = locais.find((item) => item.codigo === form.local)?.capacidade;

  const submeter = (evento) => {
    evento.preventDefault();
    const novos = {};
    if (!form.local) novos.local = "Escolha o local.";
    if (!form.data) novos.data = "Escolha a data.";
    if (!form.administradora_nome.trim()) {
      novos.administradora_nome = "Informe a administradora.";
    } else if (!casada) {
      novos.administradora_nome = "Escolha uma administradora da lista.";
    }
    if (!form.condominio_nome.trim()) novos.condominio_nome = "Informe o condomínio.";
    setErros(novos);
    if (Object.keys(novos).length) return;

    onSalvar({
      ...form,
      administradora_nome: casada.nome,
      administradora_codigo: casada.codigo,
    });
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

          <S.Campo $erro={Boolean(erros.administradora_nome)}>
            Administradora
            <input
              list="cipa-administradoras"
              value={form.administradora_nome}
              onChange={(evento) => alterar("administradora_nome", evento.target.value)}
              placeholder="Digite para buscar..."
              autoComplete="off"
            />
            <datalist id="cipa-administradoras">
              {opcoes.map((opcao) => (
                <option key={opcao.codigo} value={opcao.nome} />
              ))}
            </datalist>
            {erros.administradora_nome && (
              <span className="erro">{erros.administradora_nome}</span>
            )}
          </S.Campo>

          <S.Campo $erro={Boolean(erros.condominio_nome)}>
            Condomínio
            <input
              value={form.condominio_nome}
              onChange={(evento) => alterar("condominio_nome", evento.target.value)}
              placeholder="Ex.: Residencial Aurora"
            />
            {erros.condominio_nome && (
              <span className="erro">{erros.condominio_nome}</span>
            )}
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
              O local comporta {capacidade} participantes; a lista de inscritos é
              preenchida depois de salvar.
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
