import { FaChevronLeft, FaChevronRight, FaSearch, FaTimes } from "react-icons/fa";
import { ORDEM_LOCAIS, STATUS_TURMA } from "../hooks/useCursoCipa";
import * as S from "../CursoCipaStyles";

export default function BarraFiltros({
  mesPorExtenso,
  locais,
  filtros,
  temFiltro,
  onAlterarFiltro,
  onLimpar,
  onMesAnterior,
  onProximoMes,
  onHoje,
}) {
  return (
    <>
      <S.Filtros>
        <S.NavButton type="button" onClick={onMesAnterior} aria-label="Mês anterior">
          <FaChevronLeft size={12} />
        </S.NavButton>
        <S.NavButton type="button" onClick={onProximoMes} aria-label="Próximo mês">
          <FaChevronRight size={12} />
        </S.NavButton>
        <S.MesLabel>{mesPorExtenso}</S.MesLabel>
        <S.Botao type="button" $variante="secundario" onClick={onHoje}>
          Hoje
        </S.Botao>

        <S.Select
          value={filtros.local}
          onChange={(evento) => onAlterarFiltro("local", evento.target.value)}
          aria-label="Filtrar por local"
        >
          <option value="">Todos os locais</option>
          {ORDEM_LOCAIS.map((codigo) => (
            <option key={codigo} value={codigo}>
              {locais.find((item) => item.codigo === codigo)?.nome || codigo}
            </option>
          ))}
        </S.Select>

        <S.Select
          value={filtros.status}
          onChange={(evento) => onAlterarFiltro("status", evento.target.value)}
          aria-label="Filtrar por situação"
        >
          <option value="">Todas as situações</option>
          {STATUS_TURMA.map((item) => (
            <option key={item.valor} value={item.valor}>
              {item.rotulo}
            </option>
          ))}
        </S.Select>

        <S.Busca>
          <FaSearch size={12} />
          <input
            value={filtros.busca}
            onChange={(evento) => onAlterarFiltro("busca", evento.target.value)}
            placeholder="Buscar condomínio ou administradora"
            aria-label="Buscar turma"
          />
        </S.Busca>

        <S.Limpar type="button" onClick={onLimpar} disabled={!temFiltro}>
          <FaTimes size={11} /> Limpar filtros
        </S.Limpar>
      </S.Filtros>

      <S.Legenda>
        {ORDEM_LOCAIS.map((codigo) => {
          const local = locais.find((item) => item.codigo === codigo);
          return (
            <S.ItemLegenda key={codigo} $local={codigo}>
              {local?.nome || codigo}
              {local ? ` · ${local.capacidade} lugares` : ""}
            </S.ItemLegenda>
          );
        })}
      </S.Legenda>
    </>
  );
}
