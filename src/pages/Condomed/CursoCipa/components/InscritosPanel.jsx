import { useEffect, useMemo, useState } from "react";
import { parseISO, format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import {
  FaExclamationTriangle,
  FaPencilAlt,
  FaTimes,
  FaTrashAlt,
  FaUserPlus,
} from "react-icons/fa";
import {
  apenasDigitos,
  formatCPF,
  formatDateBR,
  validarCPF,
} from "../../../../utils/formatters";
import { listarAdministradoras } from "../../../../services/vistoriasService";
import ConfirmarModal from "./ConfirmarModal";
import * as S from "../CursoCipaStyles";

const VAZIO = {
  nome: "",
  cpf: "",
  funcao: "",
  email: "",
  telefone: "",
  administradora_nome: "",
  administradora_codigo: "",
  condominio_nome: "",
};

/**
 * Painel de inscritos da turma. Capacidade e contagem vêm da resposta do
 * backend (RNF-CIP-002); o botão desabilita ao lotar (INV-CIP-001).
 *
 * O mesmo formulário adiciona e edita: `editando` guarda o inscrito em edição,
 * e nulo significa cadastro novo.
 *
 * Cada participante traz o próprio vínculo — administradora e condomínio
 * (ADR-0005) —, porque a turma recebe gente de administradoras diferentes. As
 * pessoas entram em blocos por condomínio, então o formulário repete o vínculo
 * do último inscrito adicionado na sessão.
 */
export default function InscritosPanel({
  turma,
  inscritos,
  autoFocoNome = false,
  onAdicionar,
  onVerificarCpf,
  onEditar,
  onRemover,
  onEditarTurma,
  onExcluirTurma,
  onFechar,
}) {
  const [form, setForm] = useState(VAZIO);
  const [administradoras, setAdministradoras] = useState([]);
  // Vínculo do último inscrito gravado nesta sessão, para repetir no próximo.
  const [ultimoVinculo, setUltimoVinculo] = useState(null);
  const [erros, setErros] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(null);
  // { dados, turmas } — CPF já inscrito em outra turma, aguardando confirmação.
  const [confirmandoDuplicidade, setConfirmandoDuplicidade] = useState(null);

  useEffect(() => {
    if (administradoras.length) return;
    listarAdministradoras()
      .then((resposta) => {
        if (resposta?.sucesso) setAdministradoras(resposta.data || []);
      })
      .catch(() => setAdministradoras([]));
  }, [administradoras.length]);

  // Select digitável: o operador filtra pelo nome; o código vem da opção casada.
  const opcoesAdm = useMemo(
    () =>
      administradoras.map((item) => ({
        nome: item.nome,
        codigo: String(item.pessoa),
      })),
    [administradoras]
  );

  const admCasada = useMemo(
    () =>
      opcoesAdm.find(
        (opcao) =>
          opcao.nome.trim().toLowerCase() ===
          (form.administradora_nome || "").trim().toLowerCase()
      ),
    [opcoesAdm, form.administradora_nome]
  );

  if (!turma) return null;

  const lotada = inscritos.length >= turma.capacidade;
  // Editar quem já está na lista não consome vaga: só o cadastro novo trava.
  const camposBloqueados = lotada && !editando;

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  /**
   * Quem já está nesta turma com o CPF digitado. A lista da turma já está em
   * memória, então o aviso aparece enquanto o operador digita — sem esperar o
   * 400 do servidor, que continua valendo como rede de segurança.
   */
  const cpfDigitado = apenasDigitos(form.cpf);
  const jaInscrito =
    cpfDigitado.length === 11
      ? inscritos.find(
          (i) => apenasDigitos(i.cpf) === cpfDigitado && i.id !== editando?.id
        )
      : null;

  const iniciarEdicao = (inscrito) => {
    setEditando(inscrito);
    setErros({});
    setForm({
      nome: inscrito.nome || "",
      cpf: inscrito.cpf || "",
      funcao: inscrito.funcao || "",
      email: inscrito.email || "",
      telefone: inscrito.telefone || "",
      administradora_nome: inscrito.administradora_nome || "",
      administradora_codigo: inscrito.administradora_codigo || "",
      condominio_nome: inscrito.condominio_nome || "",
    });
  };

  /** Formulário limpo, mantendo o vínculo do último inscrito da sessão. */
  const formNovo = () => ({ ...VAZIO, ...(ultimoVinculo || {}) });

  const cancelarEdicao = () => {
    setEditando(null);
    setErros({});
    setForm(formNovo());
  };

  const submeter = async (evento) => {
    evento.preventDefault();
    const novosErros = {};
    if (!form.nome.trim()) novosErros.nome = "Informe o nome.";
    if (!validarCPF(form.cpf)) novosErros.cpf = "CPF inválido.";
    else if (jaInscrito) novosErros.cpf = `Já inscrito nesta turma: ${jaInscrito.nome}.`;
    if (!form.funcao.trim()) novosErros.funcao = "Informe a função.";
    if (!(form.administradora_nome || "").trim()) {
      novosErros.administradora_nome = "Informe a administradora.";
    } else if (!admCasada) {
      novosErros.administradora_nome = "Escolha uma administradora da lista.";
    }
    if (!(form.condominio_nome || "").trim()) {
      novosErros.condominio_nome = "Informe o condomínio.";
    }
    setErros(novosErros);
    if (Object.keys(novosErros).length) return;

    const dados = {
      ...form,
      cpf: apenasDigitos(form.cpf),
      administradora_nome: admCasada.nome,
      administradora_codigo: admCasada.codigo,
      condominio_nome: form.condominio_nome.trim(),
    };
    const cpfMudou = !editando || editando.cpf !== dados.cpf;

    setEnviando(true);
    // Entre turmas a duplicidade é permitida, mas o operador precisa saber.
    const outrasTurmas = cpfMudou ? await onVerificarCpf(dados.cpf) : [];
    if (outrasTurmas.length > 0) {
      setEnviando(false);
      setConfirmandoDuplicidade({ dados, turmas: outrasTurmas });
      return;
    }

    await gravar(dados);
    setEnviando(false);
  };

  const gravar = async (dados) => {
    const ok = editando
      ? await onEditar(editando.id, dados)
      : await onAdicionar(dados);
    if (!ok) return false;
    const vinculo = {
      administradora_nome: dados.administradora_nome,
      administradora_codigo: dados.administradora_codigo,
      condominio_nome: dados.condominio_nome,
    };
    setUltimoVinculo(vinculo);
    setEditando(null);
    setForm({ ...VAZIO, ...vinculo });
    return true;
  };

  const confirmarDuplicidade = async () => {
    const { dados } = confirmandoDuplicidade;
    setConfirmandoDuplicidade(null);
    setEnviando(true);
    await gravar(dados);
    setEnviando(false);
  };

  const confirmarRemocao = async () => {
    const inscrito = confirmandoRemocao;
    setConfirmandoRemocao(null);
    if (editando?.id === inscrito.id) cancelarEdicao();
    await onRemover(inscrito.id);
  };

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal $largo onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>
              {turma.local_nome} · {inscritos.length}/{turma.capacidade}
            </h2>
            <p>
              {format(parseISO(turma.data), "EEEE, d 'de' MMMM", { locale: ptBR })} ·
              09:00 às 17:30
              {turma.administradoras?.length
                ? ` · ${turma.administradoras.length} ${
                    turma.administradoras.length === 1
                      ? "administradora"
                      : "administradoras"
                  }`
                : ""}
            </p>
          </div>
          <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
            <FaTimes />
          </S.FecharButton>
        </S.ModalHeader>

        <S.BarraTurma>
          <S.Contador $lotado={lotada}>
            {inscritos.length}/{turma.capacidade}
            <small>{lotada ? "turma lotada" : "inscritos"}</small>
          </S.Contador>
          <S.BarraTurmaAcoes>
            <S.Botao type="button" $variante="secundario" onClick={onEditarTurma}>
              Editar turma
            </S.Botao>
            {onExcluirTurma && (
              <S.Botao type="button" $variante="perigo" onClick={onExcluirTurma}>
                <FaTrashAlt size={11} /> Excluir turma
              </S.Botao>
            )}
          </S.BarraTurmaAcoes>
        </S.BarraTurma>

        {turma.tem_espelho === false && (
          <S.AvisoEspelho>
            <FaExclamationTriangle size={11} />
            Esta turma perdeu a reserva espelho na agenda — reabra e salve a turma para
            recriá-la.
          </S.AvisoEspelho>
        )}

        {inscritos.length === 0 ? (
          <S.Vazio>
            {autoFocoNome
              ? "Turma criada. Cadastre os participantes no formulário abaixo."
              : "Nenhum inscrito ainda."}
          </S.Vazio>
        ) : (
          <S.Tabela>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Condomínio</th>
                <th>Administradora</th>
                <th>Função</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {inscritos.map((inscrito) => (
                <tr
                  key={inscrito.id}
                  data-editando={editando?.id === inscrito.id}
                  data-duplicado={jaInscrito?.id === inscrito.id}
                >
                  <td>{inscrito.nome}</td>
                  <td className="numero">{formatCPF(inscrito.cpf)}</td>
                  <td>{inscrito.condominio_nome}</td>
                  <td>{inscrito.administradora_nome || "—"}</td>
                  <td>{inscrito.funcao}</td>
                  <td>
                    <S.AcoesLinha>
                      <S.BotaoIcone
                        type="button"
                        onClick={() => iniciarEdicao(inscrito)}
                        aria-label={`Editar ${inscrito.nome}`}
                        title="Editar inscrito"
                      >
                        <FaPencilAlt size={12} />
                      </S.BotaoIcone>
                      <S.BotaoIcone
                        type="button"
                        $perigo
                        onClick={() => setConfirmandoRemocao(inscrito)}
                        aria-label={`Remover ${inscrito.nome}`}
                        title="Remover inscrito"
                      >
                        <FaTrashAlt size={12} />
                      </S.BotaoIcone>
                    </S.AcoesLinha>
                  </td>
                </tr>
              ))}
            </tbody>
          </S.Tabela>
        )}

        <S.Secao>
          <S.SecaoTitulo>
            {editando ? `Editando ${editando.nome}` : "Adicionar inscrito"}
          </S.SecaoTitulo>
          <form onSubmit={submeter}>
            <S.Linha>
              <S.Campo $erro={Boolean(erros.administradora_nome)}>
                Administradora
                <input
                  list="cipa-administradoras"
                  value={form.administradora_nome}
                  onChange={(evento) =>
                    alterar("administradora_nome", evento.target.value)
                  }
                  placeholder="Digite para buscar..."
                  autoComplete="off"
                  disabled={camposBloqueados}
                />
                <datalist id="cipa-administradoras">
                  {opcoesAdm.map((opcao) => (
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
                  disabled={camposBloqueados}
                />
                {erros.condominio_nome && (
                  <span className="erro">{erros.condominio_nome}</span>
                )}
              </S.Campo>
            </S.Linha>

            <S.Linha>
              <S.Campo $erro={Boolean(erros.nome)}>
                Nome
                <input
                  value={form.nome}
                  onChange={(evento) => alterar("nome", evento.target.value)}
                  disabled={camposBloqueados}
                  autoFocus={autoFocoNome}
                />
                {erros.nome && <span className="erro">{erros.nome}</span>}
              </S.Campo>
              <S.Campo $erro={Boolean(erros.cpf)}>
                CPF
                <input
                  value={formatCPF(form.cpf)}
                  onChange={(evento) => alterar("cpf", evento.target.value)}
                  placeholder="000.000.000-00"
                  disabled={camposBloqueados}
                />
                {erros.cpf ? (
                  <span className="erro">{erros.cpf}</span>
                ) : (
                  jaInscrito && (
                    <S.AvisoCampo>
                      <FaExclamationTriangle size={10} />
                      {jaInscrito.nome} já está nesta turma
                      {jaInscrito.funcao ? ` (${jaInscrito.funcao})` : ""}.
                    </S.AvisoCampo>
                  )
                )}
              </S.Campo>
            </S.Linha>

            <S.Linha $colunas={3}>
              <S.Campo $erro={Boolean(erros.funcao)}>
                Função
                <input
                  value={form.funcao}
                  onChange={(evento) => alterar("funcao", evento.target.value)}
                  disabled={camposBloqueados}
                />
                {erros.funcao && <span className="erro">{erros.funcao}</span>}
              </S.Campo>
              <S.Campo>
                E-mail (opcional)
                <input
                  type="email"
                  value={form.email}
                  onChange={(evento) => alterar("email", evento.target.value)}
                  disabled={camposBloqueados}
                />
              </S.Campo>
              <S.Campo>
                Telefone (opcional)
                <input
                  value={form.telefone}
                  onChange={(evento) => alterar("telefone", evento.target.value)}
                  disabled={camposBloqueados}
                />
              </S.Campo>
            </S.Linha>

            <S.Acoes>
              {editando && (
                <S.Botao type="button" $variante="secundario" onClick={cancelarEdicao}>
                  Cancelar edição
                </S.Botao>
              )}
              <S.Botao
                type="submit"
                disabled={camposBloqueados || enviando || Boolean(jaInscrito)}
                title={
                  jaInscrito
                    ? "Este CPF já está nesta turma"
                    : camposBloqueados
                    ? "Turma lotada"
                    : undefined
                }
              >
                {editando ? <FaPencilAlt size={12} /> : <FaUserPlus />}
                {enviando
                  ? "Salvando..."
                  : editando
                  ? "Salvar alterações"
                  : "Adicionar inscrito"}
              </S.Botao>
            </S.Acoes>
          </form>
        </S.Secao>

        <ConfirmarModal
          aberto={Boolean(confirmandoRemocao)}
          titulo="Remover inscrito?"
          mensagem={
            confirmandoRemocao
              ? `${confirmandoRemocao.nome} sai da lista desta turma e a vaga volta a ficar livre. Não dá para desfazer.`
              : ""
          }
          textoConfirmar="Remover"
          onConfirmar={confirmarRemocao}
          onCancelar={() => setConfirmandoRemocao(null)}
        />

        <ConfirmarModal
          aberto={Boolean(confirmandoDuplicidade)}
          tom="aviso"
          titulo="Este CPF já está em outra turma"
          mensagem={
            confirmandoDuplicidade
              ? `${confirmandoDuplicidade.dados.nome} já consta ${
                  confirmandoDuplicidade.turmas.length === 1
                    ? "na turma abaixo"
                    : "nas turmas abaixo"
                }. Dá para inscrever mesmo assim.`
              : ""
          }
          itens={(confirmandoDuplicidade?.turmas || []).map((t) => ({
            chave: t.inscricao_id,
            titulo: `${t.condominio_nome}${
              t.administradora_nome ? ` — ${t.administradora_nome}` : ""
            }`,
            detalhe: `${t.local_nome} · ${formatDateBR(t.data, "-")}${
              t.status === "cancelada" ? " · turma cancelada" : ""
            }`,
          }))}
          textoConfirmar="Inscrever mesmo assim"
          onConfirmar={confirmarDuplicidade}
          onCancelar={() => setConfirmandoDuplicidade(null)}
        />
      </S.Modal>
    </S.Overlay>
  );
}
