import React from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaFilter,
  FaCalendarAlt,
  FaBuilding,
  FaTrophy,
  FaDownload,
  FaLightbulb, 
  FaExclamationTriangle,
  FaDatabase,
  FaTachometerAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';

export const AnalyticsHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaChartLine /> Dashboard Analytics
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Métricas e análises de faturamento para tomada de decisão.
        </p>
      </div>

      {/* Seção: Métricas Disponíveis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaTachometerAlt /> Indicadores
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaChartLine /> Faturamento Total</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Valor total faturado no período selecionado.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaChartBar /> Total de Faturas</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Quantidade de faturas emitidas no período.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaBuilding /> Administradoras</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Número de administradoras com faturamento.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaTrophy /> Top Administradora</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Administradora com maior faturamento histórico.</p>
          </div>
        </div>
      </div>

      {/* Seção: Filtros */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaFilter /> Opções de Filtro
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Por Ano:</strong> Visualize dados de um ano completo</li>
          <li><strong>Por Mês:</strong> Filtre por um mês específico de qualquer ano</li>
          <li><strong>Período Livre:</strong> Selecione um intervalo de datas personalizado</li>
          <li><strong>Administradora:</strong> Filtre por uma administradora específica</li>
        </ul>
      </div>

      {/* Seção: Visualizações */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaChartPie /> Gráficos
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Evolução Mensal:</strong> Acompanhe a evolução do faturamento mês a mês</li>
          <li><strong>Top 5 Administradoras:</strong> Ranking das maiores administradoras do período</li>
          <li><strong>Ranking Top 10:</strong> Histórico geral das maiores administradoras</li>
          <li><strong>Detalhamento:</strong> Tabela completa com todos os dados por administradora</li>
        </ul>
      </div>

      {/* Seção: Como Usar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaDatabase /> Como Utilizar
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Selecione o período desejado nos filtros superiores</li>
          <li>Escolha uma administradora específica para análise focada</li>
          <li>Clique em <strong>"Aplicar"</strong> para atualizar os dados</li>
          <li>Use a busca para encontrar administradoras na tabela</li>
          <li>Os gráficos são interativos – passe o mouse para ver detalhes</li>
        </ul>
      </div>

      {/* Seção: Exportação */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaDownload /> Exportação
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Os dados da tabela podem ser copiados para Excel</li>
          <li>Gráficos podem ser exportados como imagem</li>
          <li>Não há limite para quantidade de registros exibidos</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize a busca para encontrar rapidamente uma administradora</li>
          <li>Compare períodos diferentes aplicando novos filtros</li>
          <li>Os dados são atualizados automaticamente ao alterar filtros</li>
          <li>Use o período livre para análises personalizadas</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Os dados são atualizados conforme fonte de informação</li>
          <li>Valores são exibidos em moeda brasileira (R$)</li>
          <li>Períodos muito longos podem impactar o tempo de carregamento</li>
          <li>Em caso de erro, atualize a página e tente novamente</li>
        </ul>
      </div>
    </>
  );
};

export default AnalyticsHelp;