import React from 'react';
import { FaSearch, FaUser, FaBuilding, FaMapMarkerAlt, FaShieldAlt, FaFileInvoiceDollar, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

export const ConsultasHelp = () => {
  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D' }}>
          <FaSearch /> Consultas Disponíveis
        </h2>
        <p>Nesta página você pode realizar consultas aos principais cadastros do sistema.</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Tipos de Consulta</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaUser /> Dados Pessoais</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Consulta completa de CPF com informações cadastrais, situação e dados de contato.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaBuilding /> Dados Empresariais</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Informações completas de CNPJ, incluindo sócios, CNAE e situação fiscal.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaMapMarkerAlt /> Endereços</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Busca por CEP e logradouros, com informações detalhadas de endereço.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaShieldAlt /> Segurados</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Verificação de status e informações de segurados.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFileInvoiceDollar /> Faturamento</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Relatórios financeiros detalhados e consulta de faturas.</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Utilize os filtros disponíveis em cada consulta para refinar sua busca</li>
          <li>Resultados podem ser exportados em formato Excel</li>
          <li>Use o campo de busca local para filtrar resultados já carregados</li>
        </ul>
      </div>

      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
          <li>Todas as consultas são registradas para fins de auditoria</li>
          <li>Limite de 250 CPFs por consulta em massa</li>
          <li>Verifique os dados antes de confirmar a consulta</li>
        </ul>
      </div>
    </>
  );
};

export default ConsultasHelp;