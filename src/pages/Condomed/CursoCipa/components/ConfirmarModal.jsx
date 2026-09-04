import { FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import * as S from "../CursoCipaStyles";

/**
 * Confirmação de ação destrutiva. Fica acima do painel que a abriu e para a
 * propagação do clique, para o overlay de baixo não fechar junto.
 */
export default function ConfirmarModal({
  aberto,
  titulo,
  mensagem,
  itens = [],
  tom = "perigo",
  textoConfirmar = "Excluir",
  onConfirmar,
  onCancelar,
}) {
  if (!aberto) return null;

  return (
    <S.Overlay
      $acima
      onClick={(evento) => {
        evento.stopPropagation();
        onCancelar();
      }}
    >
      <S.ModalConfirmacao onClick={(evento) => evento.stopPropagation()}>
        <S.IconeAviso $tom={tom}>
          {tom === "aviso" ? <FaInfoCircle /> : <FaExclamationTriangle />}
        </S.IconeAviso>
        <h2>{titulo}</h2>
        <p>{mensagem}</p>
        {itens.length > 0 && (
          <S.ListaConfirmacao>
            {itens.map((item) => (
              <li key={item.chave}>
                <strong>{item.titulo}</strong>
                <span>{item.detalhe}</span>
              </li>
            ))}
          </S.ListaConfirmacao>
        )}
        <S.AcoesConfirmacao>
          <S.Botao type="button" $variante="secundario" onClick={onCancelar} autoFocus>
            Cancelar
          </S.Botao>
          <S.Botao
            type="button"
            $variante={tom === "aviso" ? undefined : "perigoSolido"}
            onClick={onConfirmar}
          >
            {textoConfirmar}
          </S.Botao>
        </S.AcoesConfirmacao>
      </S.ModalConfirmacao>
    </S.Overlay>
  );
}
