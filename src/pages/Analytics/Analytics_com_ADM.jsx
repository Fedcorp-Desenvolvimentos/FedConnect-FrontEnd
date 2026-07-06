// src/pages/Analytics/Analytics.jsx

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import { useAuth } from '../../context/AuthContext';
import analyticsService from '../../services/analyticsService';
import {
  Container,
  FiltersBar,
  FilterGroup,
  SearchInput,
  Button,
  CardsGrid,
  Card,
  CardHeader,
  CardValue,
  CardSubValue,
  Section,
  SectionHeader,
  SectionTitle,
  Table,
  ScrollableTable,
  ChartContainer,
  LoadingOverlay,
  ErrorMessage,
  RadioGroup,
  RadioLabel
} from './AnalyticsStyles';

import { useLoading } from "../../hooks/useLoading";
import api from '../../services/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

// Modos de filtro
const FILTER_MODES = {
  FREE: 'free',      // Calendário livre
  YEAR: 'year',      // Ano inteiro
  MONTH: 'month'     // Ano + mês específico
};

export const Analytics = () => {
  const { loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const { startLoading, stopLoading, withLoading } = useLoading();
  
  // Estado do filtro
  const [filterMode, setFilterMode] = useState(FILTER_MODES.MONTH); // Padrão: mês atual
  
  // Modo LIVRE (calendário)
  const [periodoLivre, setPeriodoLivre] = useState({
    data_ini: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    data_fim: new Date().toISOString().split('T')[0]
  });
  
  // Modo ANO
  const [anoSelecionado, setAnoSelecionado] = useState(new Date().getFullYear());
  
  // Modo MÊS
  const [anoMesSelecionado, setAnoMesSelecionado] = useState(new Date().getFullYear());
  const [mesSelecionado, setMesSelecionado] = useState(new Date().getMonth() + 1);
  
  // Busca e filtros
  const [searchAdm, setSearchAdm] = useState('');
  const [filtroAdministradora, setFiltroAdministradora] = useState('');
  const [administradoras, setAdministradoras] = useState([]);
  
  // Anos disponíveis (últimos 5 anos + próximo)
  const anosDisponiveis = useMemo(() => {
    const anoAtual = new Date().getFullYear();
    const anos = [];
    for (let i = anoAtual - 4; i <= anoAtual + 1; i++) {
      anos.push(i);
    }
    return anos;
  }, []);
  
  const meses = [
    { value: 1, label: 'Janeiro' }, { value: 2, label: 'Fevereiro' },
    { value: 3, label: 'Março' }, { value: 4, label: 'Abril' },
    { value: 5, label: 'Maio' }, { value: 6, label: 'Junho' },
    { value: 7, label: 'Julho' }, { value: 8, label: 'Agosto' },
    { value: 9, label: 'Setembro' }, { value: 10, label: 'Outubro' },
    { value: 11, label: 'Novembro' }, { value: 12, label: 'Dezembro' }
  ];
  
  // Calcula as datas baseado no modo selecionado
  const getPeriodoParams = useCallback(() => {
    switch (filterMode) {
      case FILTER_MODES.FREE:
        return {
          data_ini: periodoLivre.data_ini,
          data_fim: periodoLivre.data_fim,
          label: `${periodoLivre.data_ini} a ${periodoLivre.data_fim}`
        };
      
      case FILTER_MODES.YEAR:
        return {
          data_ini: `${anoSelecionado}-01-01`,
          data_fim: `${anoSelecionado}-12-31`,
          label: `Ano ${anoSelecionado}`
        };
      
      case FILTER_MODES.MONTH:
        const ultimoDia = new Date(anoMesSelecionado, mesSelecionado, 0).getDate();
        return {
          data_ini: `${anoMesSelecionado}-${String(mesSelecionado).padStart(2, '0')}-01`,
          data_fim: `${anoMesSelecionado}-${String(mesSelecionado).padStart(2, '0')}-${ultimoDia}`,
          label: `${meses.find(m => m.value === mesSelecionado)?.label} ${anoMesSelecionado}`
        };
      
      default:
        return periodoLivre;
    }
  }, [filterMode, periodoLivre, anoSelecionado, anoMesSelecionado, mesSelecionado]);
  
  // Carregar lista de administradoras
  const carregarAdministradoras = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const headers = { "Authorization": `Bearer ${token}` };
      
      const response = await api.get('consultas/administradoras', { headers });

      // console.log("response", response)
      
      if (response.ok) {
        const data = await response.json();
        // Ajuste conforme a resposta real
        const listaAdms = data.data || data.administradoras || [];
        setAdministradoras(listaAdms);
        // console.log('Administradoras carregadas:', listaAdms); // Debug
      }
    } catch (err) {
      console.error('Erro ao carregar administradoras:', err);
    }
  }, []);

  // Carregar dashboard
  const carregarDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = getPeriodoParams();
      const data = await analyticsService.getDashboardCompleto({
        data_ini: params.data_ini,
        data_fim: params.data_fim
      });
      setDashboardData(data);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);
      setError(err.response?.data?.message || 'Erro ao carregar dados.');
    } finally {
      setLoading(false);
    }
  }, [getPeriodoParams]);

  useEffect(() => {
    carregarAdministradoras();
  }, [carregarAdministradoras]);

  useEffect(() => {
    carregarDashboard();
  }, [carregarDashboard]);

  // Filtrar dados
  const dadosFiltrados = useMemo(() => {
    if (!dashboardData) return null;

    let faturamentoPorAdm = [...(dashboardData.faturamento_por_administradora?.data || [])];
    
    if (filtroAdministradora) {
      faturamentoPorAdm = faturamentoPorAdm.filter(item =>
        item.administradora === filtroAdministradora
      );
    }
    
    if (searchAdm) {
      faturamentoPorAdm = faturamentoPorAdm.filter(item =>
        item.nome_administradora?.toLowerCase().includes(searchAdm.toLowerCase()) ||
        item.administradora?.toLowerCase().includes(searchAdm.toLowerCase())
      );
    }

    return {
      ...dashboardData,
      faturamento_por_administradora: { 
        ...dashboardData.faturamento_por_administradora, 
        data: faturamentoPorAdm 
      }
    };
  }, [dashboardData, searchAdm, filtroAdministradora]);

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency', currency: 'BRL'
    }).format(valor || 0);
  };

  const formatarNumero = (numero) => {
    return new Intl.NumberFormat('pt-BR').format(numero || 0);
  };

  const periodoParams = getPeriodoParams();

  const cards = [
    {
      titulo: 'Faturamento Total',
      icone: 'bi-cash-stack',
      valor: formatarMoeda(dadosFiltrados?.faturamento?.resumo?.total_faturado_periodo),
      subtitulo: `Ticket médio: ${formatarMoeda(dadosFiltrados?.faturamento?.resumo?.ticket_medio)}`,
    },
    {
      titulo: 'Total de Faturas',
      icone: 'bi-receipt',
      valor: formatarNumero(dadosFiltrados?.faturamento?.resumo?.total_faturas_periodo),
      subtitulo: periodoParams.label,
    },
    {
      titulo: 'Administradoras',
      icone: 'bi-building',
      valor: formatarNumero(dadosFiltrados?.faturamento_por_administradora?.total_administradoras),
      subtitulo: 'Com faturamento no período',
    },
    {
      titulo: 'Top Adm',
      icone: 'bi-trophy',
      valor: dadosFiltrados?.ranking_administradoras?.data?.[0]?.nome_administradora?.substring(0, 25) || '-',
      subtitulo: 'Maior faturamento histórico',
    }
  ];

  const graficoMensal = useMemo(() => {
    if (!dadosFiltrados?.faturamento?.data) return [];
    return [...dadosFiltrados.faturamento.data].reverse().map(item => ({
      mes: `${item.mes}/${item.ano}`,
      faturado: item.total_faturado,
      bruto: item.total_bruto,
    }));
  }, [dadosFiltrados]);

  const pizzaData = useMemo(() => {
    if (!dadosFiltrados?.faturamento_por_administradora?.data) return [];
    return dadosFiltrados.faturamento_por_administradora.data
      .slice(0, 5)
      .map(item => ({
        name: item.nome_administradora?.substring(0, 20) || item.administradora,
        value: item.total_faturado
      }));
  }, [dadosFiltrados]);

  if (authLoading) {
    return (
      <PageLayout
        title="Análise de Dados"
        subtitle="Visualize e interprete seus dados"
        icon={<i className="bi bi-bar-chart-fill"></i>}
        loading={true}
      />
    );
  }

  return (
    <PageLayout
      title="Dashboard Analytics"
      subtitle="Métricas e análises de faturamento"
      icon={<i className="bi bi-bar-chart-fill"></i>}
      loading={loading}
      emptyMessage="Nenhum dado disponível"
    >
      <Container>
        {/* Filtro de período - Híbrido */}
        <FiltersBar>
          <FilterGroup>
            <label>Tipo de Período</label>
            <select 
              value={filterMode} 
              onChange={(e) => setFilterMode(e.target.value)}
              style={{ padding: '0.5rem' }}
            >
              <option value={FILTER_MODES.YEAR}>Por Ano</option>
              <option value={FILTER_MODES.MONTH}>Por Mês</option>
              <option value={FILTER_MODES.FREE}>Período livre</option>
            </select>
          </FilterGroup>

          {/* Modo: Período Livre */}
          {filterMode === FILTER_MODES.FREE && (
            <>
              <FilterGroup>
                <label>Data Inicial</label>
                <input
                  type="date"
                  value={periodoLivre.data_ini}
                  onChange={(e) => setPeriodoLivre({ ...periodoLivre, data_ini: e.target.value })}
                />
              </FilterGroup>
              <FilterGroup>
                <label>Data Final</label>
                <input
                  type="date"
                  value={periodoLivre.data_fim}
                  onChange={(e) => setPeriodoLivre({ ...periodoLivre, data_fim: e.target.value })}
                />
              </FilterGroup>
            </>
          )}

          {/* Modo: Ano inteiro */}
          {filterMode === FILTER_MODES.YEAR && (
            <FilterGroup>
              <label>Ano</label>
              <select value={anoSelecionado} onChange={(e) => setAnoSelecionado(parseInt(e.target.value))}>
                {anosDisponiveis.map(ano => (
                  <option key={ano} value={ano}>{ano}</option>
                ))}
              </select>
            </FilterGroup>
          )}

          {/* Modo: Mês específico */}
          {filterMode === FILTER_MODES.MONTH && (
              <>
              <FilterGroup>
                <label>Ano</label>
                <select value={anoMesSelecionado} onChange={(e) => setAnoMesSelecionado(parseInt(e.target.value))}>
                  {anosDisponiveis.map(ano => (
                    <option key={ano} value={ano}>{ano}</option>
                  ))}
                </select>
              </FilterGroup>
              <FilterGroup>
                <label>Mês</label>
                <select value={mesSelecionado} onChange={(e) => setMesSelecionado(parseInt(e.target.value))}>
                  {meses.map(mes => (
                    <option key={mes.value} value={mes.value}>{mes.label}</option>
                  ))}
                </select>
              </FilterGroup>
            </>
          )}

          <FilterGroup>
            <label>Administradora</label>
            <select value={filtroAdministradora} onChange={(e) => setFiltroAdministradora(e.target.value)}>
              <option value="">Todas</option>
              {administradoras.map(adm => (
                <option key={adm.cod_adm || adm.codigo} value={adm.cod_adm || adm.codigo}>
                  {adm.nome_adm || adm.nome_administradora || adm.cedente}
                </option>
              ))}
            </select>
          </FilterGroup>

          <Button onClick={carregarDashboard} disabled={loading}>
            {loading ? 'Carregando...' : 'Aplicar'}
          </Button>
        </FiltersBar>

        {error && (
          <ErrorMessage>
            <i className="bi bi-exclamation-circle"></i> {error}
          </ErrorMessage>
        )}

        {!loading && dadosFiltrados && (
          <>
            <CardsGrid>
              {cards.map((card, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <h3>{card.titulo}</h3>
                    <i className={`bi ${card.icone}`}></i>
                  </CardHeader>
                  <CardValue>{card.valor}</CardValue>
                  <CardSubValue>{card.subtitulo}</CardSubValue>
                </Card>
              ))}
            </CardsGrid>

            {/* Gráfico */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <i className="bi bi-graph-up"></i> Evolução do Faturamento (Últimos Meses)
                </SectionTitle>
              </SectionHeader>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={graficoMensal}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v) => formatarMoeda(v)} />
                    <Legend />
                    <Bar dataKey="faturado" name="Faturamento Líquido" fill="#3b82f6" />
                    <Bar dataKey="bruto" name="Faturamento Bruto" fill="#93c5fd" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Section>

            {/* Pizza */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <i className="bi bi-pie-chart"></i> Top 5 Administradoras do Período
                </SectionTitle>
              </SectionHeader>
              <ChartContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pizzaData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      dataKey="value"
                    >
                      {pizzaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => formatarMoeda(v)} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </Section>

            {/* Ranking Top 10 */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <i className="bi bi-trophy"></i> Top 10 Administradoras (Histórico Geral)
                </SectionTitle>
              </SectionHeader>
              <ScrollableTable>
                <Table>
                  <thead>
                    <tr><th>#</th><th>Administradora</th><th>Código</th><th>Faturas</th><th>Total Faturado</th></tr>
                  </thead>
                  <tbody>
                    {dadosFiltrados.ranking_administradoras?.data?.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}º`}</td>
                        <td><strong>{item.nome_administradora || '-'}</strong></td>
                        <td>{item.administradora}</td>
                        <td>{formatarNumero(item.qtd_faturas)}</td>
                        <td>{formatarMoeda(item.total_faturado)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </ScrollableTable>
            </Section>

            {/* Tabela com scroll e search */}
            <Section>
              <SectionHeader>
                <SectionTitle>
                  <i className="bi bi-building"></i> Faturamento por Administradora
                </SectionTitle>
                <SearchInput
                  type="text"
                  placeholder="🔍 Buscar administradora..."
                  value={searchAdm}
                  onChange={(e) => setSearchAdm(e.target.value)}
                  style={{ width: '280px' }}
                />
              </SectionHeader>
              <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                Total: {dadosFiltrados.faturamento_por_administradora?.total_administradoras || 0} administradoras
                {searchAdm && ` - Filtrado por: "${searchAdm}"`}
              </div>
              <ScrollableTable>
                <Table>
                  <thead>
                    <tr>
                      <th>Administradora</th>
                      <th>Código</th>
                      <th>Faturas</th>
                      <th>Total Faturado</th>
                      <th>Ticket Médio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dadosFiltrados.faturamento_por_administradora?.data?.length > 0 ? (
                      dadosFiltrados.faturamento_por_administradora.data.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.nome_administradora || '-'}</strong></td>
                          <td>{item.administradora}</td>
                          <td>{formatarNumero(item.qtd_faturas)}</td>
                          <td>{formatarMoeda(item.total_faturado)}</td>
                          <td>{formatarMoeda(item.ticket_medio)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma administradora encontrada</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </ScrollableTable>
            </Section>
          </>
        )}

        {loading && (
          <LoadingOverlay>
            <i className="bi bi-arrow-repeat spin"></i> Carregando...
          </LoadingOverlay>
        )}
      </Container>
    </PageLayout>
  );
};