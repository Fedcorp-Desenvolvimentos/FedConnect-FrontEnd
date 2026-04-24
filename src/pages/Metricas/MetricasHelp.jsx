import React from 'react';
import { 
  FaChartLine, 
  FaChartBar, 
  FaChartPie, 
  FaLightbulb, 
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaDatabase,
  FaTachometerAlt
} from 'react-icons/fa';

export const MetricasHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaChartLine /> Métricas da FedCorp
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Acompanhe as principais métricas e resultados do Grupo FedCorp através de dashboards interativos do Power BI.
        </p>
      </div>

      {/* Seção: Dashboards Disponíveis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaTachometerAlt /> Dashboards Disponíveis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>📊 Dashboard Peaga</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Métricas e indicadores específicos da Peaga.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>📊 Dashboard FedCorp Adm</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Visão geral das métricas administrativas do Grupo FedCorp.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>📊 Dashboard Condomed</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Métricas e indicadores da Condomed.</p>
          </div>
        </div>
      </div>

      {/* Seção: Funcionalidades */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaChartBar /> Funcionalidades
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Dashboards Interativos:</strong> Explore os dados com gráficos dinâmicos</li>
          <li><strong>Filtros Avançados:</strong> Segmente dados por período, categoria e mais</li>
          <li><strong>Exportação:</strong> Baixe relatórios em PDF, Excel ou PowerPoint</li>
          <li><strong>Compartilhamento:</strong> Compartilhe dashboards com outros usuários</li>
          <li><strong>Atualização em Tempo Real:</strong> Dados sincronizados automaticamente</li>
        </ul>
      </div>

      {/* Seção: Como Usar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaExternalLinkAlt /> Como Utilizar
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Clique em <strong>"Acessar Dashboard"</strong> para abrir o dashboard em uma nova aba</li>
          <li>Os dashboards são hospedados no Power BI e requerem conexão com internet</li>
          <li>Utilize os filtros disponíveis para refinar sua análise</li>
          <li>Passe o mouse sobre os gráficos para ver detalhes dos dados</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize o modo tela cheia para melhor visualização dos dashboards</li>
          <li>Favoritar os dashboards mais acessados no navegador</li>
          <li>Os dados são atualizados automaticamente conforme a fonte de dados</li>
          <li>Consulte a documentação do Power BI para funcionalidades avançadas</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Os dashboards exigem conexão estável com a internet</li>
          <li>Caso o dashboard não carregue, tente atualizar a página</li>
          <li>Alguns dados podem ter latência de até 24 horas</li>
          <li>Em caso de erro, entre em contato com o administrador do sistema</li>
        </ul>
      </div>
    </>
  );
};

export default MetricasHelp;