import React, { useState } from 'react';
import { FaDesktop, FaPrint, FaNetworkWired, FaServer } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import { colaboradoresMock, layoutMapa } from '../../data/MapaRedes';
import * as S from './MapaRedesStyles';

// ─────────────────────────────────────────────
// Sub-componentes de equipamento
// ─────────────────────────────────────────────
const Switch = ({ rotulo }) => (
  <S.SwitchBox>
    <FaNetworkWired />
    {rotulo}
  </S.SwitchBox>
);

const Impressora = ({ rotulo }) => (
  <S.ImpBox>
    <FaPrint />
    {rotulo}
  </S.ImpBox>
);

const Servidor = ({ rotulo }) => (
  <S.ServidorBox>
    <FaServer />
    {rotulo}
  </S.ServidorBox>
);

// ─────────────────────────────────────────────
// Estação vazia / placeholder visual
// ─────────────────────────────────────────────
const EstacaoVazia = ({ rotulo }) => (
  <S.VazioCard>
    <FaDesktop style={{ color: '#cbd5e1', fontSize: 16 }} />
    {rotulo && <S.VazioLabel>{rotulo}</S.VazioLabel>}
  </S.VazioCard>
);

// ─────────────────────────────────────────────
// MapaRedes
// ─────────────────────────────────────────────
const MapaRedes = () => {
  const { user, loading } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [colaboradores, setColaboradores] = useState(colaboradoresMock);
  const [arrastando, setArrastando] = useState(null);
  const [sobreEstacao, setSobreEstacao] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('andar7');

  const podeEditar =
    user?.nivel_acesso === 'admin' || user?.nivel_acesso === 'comercial';

  const getColabPorEstacao = (id) => colaboradores.find((c) => c.estacao === id);
  const getColabPorId = (id) => colaboradores.find((c) => c.id === id);

  // ── Drag handlers ──────────────────────────
  const handleDragStart = (e, colab) => {
    if (!podeEditar) {
      enqueueSnackbar('Você não tem permissão para realocar funcionários.', {
        variant: 'warning',
      });
      e.preventDefault();
      return;
    }
    setArrastando(colab);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', colab.id);
  };

  const handleDragOver = (e, estacaoId) => {
    e.preventDefault();
    setSobreEstacao(estacaoId);
  };

  const handleDragLeave = () => setSobreEstacao(null);

  const handleDrop = (e, estacao) => {
    e.preventDefault();
    setSobreEstacao(null);

    if (!arrastando) return;

    if (estacao.tipo !== 'desktop') {
      enqueueSnackbar('Só é possível alocar colaboradores em estações Desktop.', {
        variant: 'error',
      });
      setArrastando(null);
      return;
    }

    const ocupante = getColabPorEstacao(estacao.id);
    const origemId = arrastando.estacao;

    setColaboradores((prev) =>
      prev.map((c) => {
        if (c.id === arrastando.id) return { ...c, estacao: estacao.id };
        if (ocupante && c.id === ocupante.id) return { ...c, estacao: origemId };
        return c;
      })
    );

    if (ocupante) {
      enqueueSnackbar(
        `${arrastando.nome} trocou de lugar com ${ocupante.nome} em ${estacao.rotulo}`,
        { variant: 'warning' }
      );
    } else {
      enqueueSnackbar(`${arrastando.nome} alocado em ${estacao.rotulo}`, {
        variant: 'success',
      });
    }

    setArrastando(null);
  };

  const handleDragEnd = () => {
    setArrastando(null);
    setSobreEstacao(null);
  };

  // ── Renderização de uma estação ────────────
  const renderEstacao = (estacao) => {
    if (!estacao?.id) return null;

    if (estacao.tipo === 'vazio') return <EstacaoVazia key={estacao.id} rotulo={estacao.rotulo} />;
    if (estacao.tipo === 'switch') return <Switch key={estacao.id} rotulo={estacao.rotulo} />;
    if (estacao.tipo === 'impressora') return <Impressora key={estacao.id} rotulo={estacao.rotulo} />;
    if (estacao.tipo === 'servidor') return <Servidor key={estacao.id} rotulo={estacao.rotulo} />;

    // desktop
    const colab = getColabPorEstacao(estacao.id);
    return (
      <S.MesaCard
        key={estacao.id}
        $isOver={sobreEstacao === estacao.id}
        onDragOver={(e) => handleDragOver(e, estacao.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, estacao)}
      >
        <S.MesaIconWrap>
          <FaDesktop />
          <S.Rotulo>{estacao.rotulo}</S.Rotulo>
        </S.MesaIconWrap>

        <S.PessoaSlot>
          {colab ? (
            <S.PessoaChip
              draggable
              $isDragging={arrastando?.id === colab.id}
              onDragStart={(e) => handleDragStart(e, colab)}
              onDragEnd={handleDragEnd}
            >
              {colab.nome}
            </S.PessoaChip>
          ) : (
            <S.VazioSlot>Vago</S.VazioSlot>
          )}
        </S.PessoaSlot>
      </S.MesaCard>
    );
  };

  // ── 7º Andar ──────────────────────────────
  const render7 = () => {
    const { blocoEsquerdo, blocoSuperior, blocoCentral } = layoutMapa.andar7;

    return (
      <S.FloorWrapper>
        {/* Linha principal */}
        <S.BlocosRow>
          {/* Bloco Esquerdo */}
          <S.Bloco $flex="0 0 280px">
            <S.BlocoTitle>{blocoEsquerdo.titulo}</S.BlocoTitle>
            <S.EstacaoGrid $cols={blocoEsquerdo.grid.cols}>
              {blocoEsquerdo.estacoes.map(renderEstacao)}
            </S.EstacaoGrid>
            <S.RodapeRow>
              {blocoEsquerdo.rodape.map(renderEstacao)}
            </S.RodapeRow>
          </S.Bloco>

          {/* Coluna direita */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Bloco Superior */}
            <S.Bloco>
              <S.BlocoTitle>{blocoSuperior.titulo}</S.BlocoTitle>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
                {blocoSuperior.topRow.map(renderEstacao)}
              </div>
              <S.EstacaoGrid $cols={blocoSuperior.grid.cols}>
                {blocoSuperior.estacoes.map(renderEstacao)}
              </S.EstacaoGrid>
            </S.Bloco>

            {/* Bloco Central */}
            <S.Bloco>
              <S.BlocoTitle>{blocoCentral.titulo}</S.BlocoTitle>
              <S.EstacaoGrid $cols={blocoCentral.grid.cols}>
                {blocoCentral.estacoes.map(renderEstacao)}
              </S.EstacaoGrid>
            </S.Bloco>
          </div>
        </S.BlocosRow>

        {/* Legenda */}
        <Legenda />
      </S.FloorWrapper>
    );
  };

  // ── 8º Andar ──────────────────────────────
  const render8 = () => {
    const { blocos, blocoInferior } = layoutMapa.andar8;
    const [a, b, c, d] = blocos;

    return (
      <S.FloorWrapper>
        {/* Linha superior: A+B / C+D */}
        <S.BlocosRow>
          <S.Bloco>
            <S.BlocoTitle>{a.titulo}</S.BlocoTitle>
            <S.EstacaoGrid $cols={a.grid.cols}>
              {a.estacoes.map(renderEstacao)}
            </S.EstacaoGrid>
            {a.rodape && <S.RodapeRow>{a.rodape.map(renderEstacao)}</S.RodapeRow>}
          </S.Bloco>

          <S.Bloco>
            <S.BlocoTitle>{b.titulo}</S.BlocoTitle>
            <S.EstacaoGrid $cols={b.grid.cols}>
              {b.estacoes.map(renderEstacao)}
            </S.EstacaoGrid>
          </S.Bloco>

          <S.Bloco>
            <S.BlocoTitle>{c.titulo}</S.BlocoTitle>
            <S.EstacaoGrid $cols={c.grid.cols}>
              {c.estacoes.map(renderEstacao)}
            </S.EstacaoGrid>
            {c.rodape && <S.RodapeRow>{c.rodape.map(renderEstacao)}</S.RodapeRow>}
          </S.Bloco>

          <S.Bloco>
            <S.BlocoTitle>{d.titulo}</S.BlocoTitle>
            <S.EstacaoGrid $cols={d.grid.cols}>
              {d.estacoes.map(renderEstacao)}
            </S.EstacaoGrid>
            {d.rodape && <S.RodapeRow>{d.rodape.map(renderEstacao)}</S.RodapeRow>}
          </S.Bloco>
        </S.BlocosRow>

        {/* Bloco Inferior */}
        <S.Bloco>
          <S.BlocoTitle>{blocoInferior.titulo}</S.BlocoTitle>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginBottom: 8 }}>
            {blocoInferior.topRow.map(renderEstacao)}
          </div>
          <S.EstacaoGrid $cols={blocoInferior.grid.cols}>
            {blocoInferior.estacoes.map(renderEstacao)}
          </S.EstacaoGrid>
        </S.Bloco>

        <Legenda />
      </S.FloorWrapper>
    );
  };

  // ── Legenda ───────────────────────────────
  const Legenda = () => (
    <S.LegendaContainer>
      <strong>LEGENDA:</strong>
      <S.LegendaItem><S.MesaLegend /> MESA</S.LegendaItem>
      <S.LegendaItem><S.DesktopLegend /> DESKTOP (ESTAÇÃO)</S.LegendaItem>
      <S.LegendaItem><S.ColabLegend /> COLABORADOR</S.LegendaItem>
      <S.LegendaItem><S.ImpLegend /> IMPRESSORA</S.LegendaItem>
      <S.LegendaItem><S.SwLegend /> SWITCHES</S.LegendaItem>
      <S.LegendaItem><S.ServLegend /> SERVIDOR (REDE)</S.LegendaItem>
      <S.LegendaNota>SE = Sem Estação · LX = Linux</S.LegendaNota>
    </S.LegendaContainer>
  );

  // ── Render ────────────────────────────────
  return (
    <PageLayout
      title="Mapa de Rede e Colaboradores"
      subtitle="Arraste os colaboradores para realocá-los nas estações de trabalho."
      icon={<FaDesktop />}
      loading={loading}
    >
      <S.Container>
        {/* Tabs */}
        <S.TabsWrapper>
          <S.TabBtn $active={abaAtiva === 'andar7'} onClick={() => setAbaAtiva('andar7')}>
            7º Andar
          </S.TabBtn>
          <S.TabBtn $active={abaAtiva === 'andar8'} onClick={() => setAbaAtiva('andar8')}>
            8º Andar
          </S.TabBtn>
        </S.TabsWrapper>

        {/* Conteúdo da aba */}
        {abaAtiva === 'andar7' ? render7() : render8()}
      </S.Container>
    </PageLayout>
  );
};

export default MapaRedes;