import * as S from "../CursoCipaStyles";

/**
 * As quatro medidas do mês em exibição. Sem comparação com o mês anterior: o
 * backend devolve um mês por vez, e uma variação que ninguém calculou seria
 * número inventado.
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
        <S.MedidaRotulo>Ocupação</S.MedidaRotulo>
        <S.MedidaValor>{total.ocupacao}%</S.MedidaValor>
        <S.MedidaNota>
          {total.inscritos} de {total.vagas}
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
