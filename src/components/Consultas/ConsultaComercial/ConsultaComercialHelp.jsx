import React from 'react';
import { 
  FaSearch, 
  FaBuilding, 
  FaFileExcel, 
  FaMapMarkerAlt, 
  FaFilm, 
  FaUsers, 
  FaLightbulb, 
  FaExclamationTriangle,
  FaBriefcase,
  FaUserFriends
} from 'react-icons/fa';

export const ConsultaComercialHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaSearch /> Consultas Comerciais
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Realize consultas comerciais para obter informações sobre empresas, sócios e relacionamentos comerciais.
        </p>
      </div>

      {/* Seção: Relacionamentos */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaUserFriends /> Relacionamentos
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaBriefcase /> Consulta CNPJ</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Informações completas de CNPJ, incluindo sócios, CNAE e situação fiscal.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFileExcel /> Consulta em Massa</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Importe uma planilha com múltiplos CNPJs e realize consultas em lote.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaMapMarkerAlt /> Consulta por Região</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Busque empresas por estado, município e bairro.</p>
          </div>
        </div>
      </div>

      {/* Seção: Operacional */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaUsers /> Operacional
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaSearch /> Estudo Conteúdo</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Ferramenta para estudo e análise de conteúdo comercial.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFilm /> Apresentação Comercial</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Materiais e apresentações para uso comercial.</p>
          </div>
        </div>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize a consulta por CNPJ para obter informações detalhadas da empresa</li>
          <li>A consulta em massa permite processar até 250 CNPJs por vez</li>
          <li>Os resultados podem ser baixados em formato Excel</li>
          <li>Clique em "Ver Detalhes" nos sócios para mais informações de contato</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Certifique-se de que o CNPJ seja válido</li>
          <li>As consultas em massa podem levar alguns minutos dependendo da quantidade</li>
          <li>O acesso a alguns dados pode ser restrito conforme nível de permissão</li>
          <li>Todas as consultas são registradas para fins de auditoria</li>
        </ul>
      </div>
    </>
  );
};

export default ConsultaComercialHelp;