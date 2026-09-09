import { useEffect, useRef, useState } from "react";
import { FaFileSignature, FaTimes } from "react-icons/fa";
import * as S from "../CursoCipa/CursoCipaStyles";

const TITULO_PADRAO = "Técnico em Segurança no Trabalho";
const LIMITE_KB = 500;

const VAZIO = { nome: "", titulo: TITULO_PADRAO, registro_mte: "", registro_uf: "RJ" };

/**
 * Formulário do palestrante (RF-CIP-006). A assinatura é opcional no cadastro
 * e obrigatória para emitir certificado — a lista sinaliza quem está sem.
 * O arquivo nunca volta do backend: a prévia é só do que acabou de ser escolhido.
 */
export default function PalestranteModal({ aberto, item, salvando, erros = {}, onSalvar, onFechar }) {
  const [form, setForm] = useState(VAZIO);
  const [assinatura, setAssinatura] = useState(null);
  const [previa, setPrevia] = useState("");
  const [erroLocal, setErroLocal] = useState("");
  const inputArquivo = useRef(null);

  useEffect(() => {
    if (!aberto) return;
    setForm(
      item
        ? {
            nome: item.nome || "",
            titulo: item.titulo || TITULO_PADRAO,
            registro_mte: item.registro_mte || "",
            registro_uf: item.registro_uf || "RJ",
          }
        : VAZIO
    );
    setAssinatura(null);
    setPrevia("");
    setErroLocal("");
  }, [aberto, item]);

  useEffect(() => {
    if (!assinatura) {
      setPrevia("");
      return undefined;
    }
    const url = URL.createObjectURL(assinatura);
    setPrevia(url);
    return () => URL.revokeObjectURL(url);
  }, [assinatura]);

  if (!aberto) return null;

  const alterar = (campo, valor) => setForm((atual) => ({ ...atual, [campo]: valor }));

  const escolherArquivo = (evento) => {
    const arquivo = evento.target.files?.[0];
    if (!arquivo) return;
    if (!["image/png", "image/jpeg"].includes(arquivo.type)) {
      setErroLocal("A assinatura deve ser PNG ou JPEG.");
      return;
    }
    if (arquivo.size > LIMITE_KB * 1024) {
      setErroLocal(`A assinatura deve ter até ${LIMITE_KB} KB.`);
      return;
    }
    setErroLocal("");
    setAssinatura(arquivo);
  };

  const submeter = (evento) => {
    evento.preventDefault();
    const dados = { ...form, registro_uf: form.registro_uf.toUpperCase() };
    if (assinatura) dados.assinatura = assinatura;
    onSalvar(dados);
  };

  return (
    <S.Overlay onClick={onFechar}>
      <S.Modal onClick={(evento) => evento.stopPropagation()}>
        <S.ModalHeader>
          <div>
            <h2>{item ? "Editar palestrante" : "Novo palestrante"}</h2>
            <p>Quem ministra o curso e assina o certificado</p>
          </div>
          <S.FecharButton type="button" onClick={onFechar} aria-label="Fechar">
            <FaTimes />
          </S.FecharButton>
        </S.ModalHeader>

        <form onSubmit={submeter}>
          <S.Linha>
            <S.Campo $erro={Boolean(erros.nome)}>
              Nome completo
              <input
                value={form.nome}
                onChange={(e) => alterar("nome", e.target.value)}
                placeholder="Como sai no certificado"
                autoFocus
              />
              {erros.nome && <span className="erro">{erros.nome}</span>}
            </S.Campo>
            <S.Campo $erro={Boolean(erros.titulo)}>
              Título
              <input value={form.titulo} onChange={(e) => alterar("titulo", e.target.value)} />
              {erros.titulo && <span className="erro">{erros.titulo}</span>}
            </S.Campo>
          </S.Linha>

          <S.Linha>
            <S.Campo $erro={Boolean(erros.registro_mte)}>
              Registro MTE (número)
              <input
                value={form.registro_mte}
                onChange={(e) => alterar("registro_mte", e.target.value)}
                placeholder="0060169"
              />
              {erros.registro_mte && <span className="erro">{erros.registro_mte}</span>}
            </S.Campo>
            <S.Campo $erro={Boolean(erros.registro_uf)}>
              UF do registro
              <input
                value={form.registro_uf}
                onChange={(e) => alterar("registro_uf", e.target.value.toUpperCase().slice(0, 2))}
                placeholder="RJ"
                maxLength={2}
              />
              {erros.registro_uf && <span className="erro">{erros.registro_uf}</span>}
            </S.Campo>
          </S.Linha>

          <S.Campo $erro={Boolean(erros.assinatura || erroLocal)}>
            Assinatura digitalizada {item?.tem_assinatura ? "(já cadastrada — envie só para trocar)" : "(opcional)"}
            <input
              ref={inputArquivo}
              type="file"
              accept="image/png,image/jpeg"
              onChange={escolherArquivo}
            />
            <span className="ajuda">
              PNG ou JPEG até {LIMITE_KB} KB, fundo branco. Sem assinatura o palestrante existe, mas o
              certificado não sai.
            </span>
            {(erros.assinatura || erroLocal) && (
              <span className="erro">{erros.assinatura || erroLocal}</span>
            )}
          </S.Campo>

          {previa && (
            <S.MedidaNota style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <FaFileSignature />
              <img
                src={previa}
                alt="Prévia da assinatura"
                style={{ maxHeight: 60, maxWidth: 220, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 6 }}
              />
              <span>{assinatura.name} · {Math.round(assinatura.size / 1024)} KB</span>
            </S.MedidaNota>
          )}

          <S.Acoes>
            <S.Botao type="button" $variante="secundario" onClick={onFechar}>
              Cancelar
            </S.Botao>
            <S.Botao type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : item ? "Salvar palestrante" : "Cadastrar palestrante"}
            </S.Botao>
          </S.Acoes>
        </form>
      </S.Modal>
    </S.Overlay>
  );
}
