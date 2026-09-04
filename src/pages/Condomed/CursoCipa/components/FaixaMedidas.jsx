import * as S from "../CursoCipaStyles";

/**
 * As medidas do mês em exibição. Sem comparação com o mês anterior: o backend
 * devolve um mês por vez, e uma variação que ninguém calculou seria número
 * inventado.
 *
 * Não há medida de ocupação total: a média dos dois locais (2 de 40 = 5%) não
 * conversa com a ocupação por local do painel (3% e 10%) e só confundia. A
 * ocupação vive no painel lateral, por local, onde ela quer dizer algo.
 */
export default function FaixaMedidas({ resumo, mesPorExtenso }) {
  const { total, proximosSeteDias } = resumo;

  return (
    <S.Medidas>
      <S.Medida>
        <S.MedidaRotulo>Turmas no mês</S.MedidaRotulo>
        <S.MedidaValor>{total.turmas}</S.MedidaValor>
        <S.MedidaNota>{mesPorExtenso}</S.MedidaNota>
      </S.Medida>

      <S.Medida>
        <S.MedidaRotulo>Inscritos</S.MedidaRotulo>
        <S.MedidaValor>{total.inscritos}</S.MedidaValor>
        <S.MedidaNota>
          {total.vagas} {total.vagas === 1 ? "vaga aberta" : "vagas abertas"}
        </S.MedidaNota>
      </S.Medida>

      <S.Medida>
        <S.MedidaRotulo>Próximas turmas</S.MedidaRotulo>
        <S.MedidaValor>{proximosSeteDias}</S.MedidaValor>
        <S.MedidaNota>nos próximos 7 dias</S.MedidaNota>
      </S.Medida>
    </S.Medidas>
  );
}
