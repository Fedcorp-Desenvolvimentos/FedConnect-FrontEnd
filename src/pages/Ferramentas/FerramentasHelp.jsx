import React from 'react';
import { 
  FaTools, 
  FaFire, 
  FaHandshake, 
  FaFileContract, 
  FaBuilding, 
  FaBoxes, 
  FaLightbulb, 
  FaExclamationTriangle,
  FaExternalLinkAlt,
  FaDownload
} from 'react-icons/fa';

export const FerramentasHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaTools /> Ferramentas da FedCorp
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Acesse rapidamente as principais plataformas e soluções digitais da FedCorp para gestão de seguros, fianças e negócios.
        </p>
      </div>

      {/* Seção: Plataformas Disponíveis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaExternalLinkAlt /> Plataformas Disponíveis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFire /> Incêndio Locação</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Plataforma exclusiva para gestão do seguro incêndio locação.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaHandshake /> Fiança</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Sistema de fiança locatícia para análise e administração de garantias.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFileContract /> Esteira Locação</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Gerencie contratos de locação em uma plataforma completa.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaBuilding /> Seguro Condomínio</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Portal para cálculo e contratação de seguro condomínio.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaBoxes /> Produtos ADM</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Produtos da administradora integrados na plataforma (em breve).</p>
          </div>
        </div>
      </div>

      {/* Seção: Como Usar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaExternalLinkAlt /> Como Utilizar
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Clique em <strong>"Acessar"</strong> para abrir a ferramenta desejada em uma nova aba</li>
          <li>As ferramentas com status <strong>"Em breve"</strong> estarão disponíveis em atualizações futuras</li>
          <li>Algumas plataformas podem exigir credenciais específicas de acesso</li>
          <li>Utilize as teclas de atalho do navegador para navegar entre as abas abertas</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Adicione as ferramentas aos favoritos do navegador para acesso rápido</li>
          <li>Mantenha suas credenciais de acesso atualizadas em cada plataforma</li>
          <li>Utilize o gerenciador de senhas do navegador para facilitar o acesso</li>
          <li>Em caso de erro, tente limpar o cache do navegador ou usar modo anônimo</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Não compartilhe suas credenciais de acesso com terceiros</li>
          <li>Algumas plataformas podem ter horários de manutenção programada</li>
          <li>As ferramentas externas possuem políticas de segurança independentes</li>
          <li>Em caso de dificuldades, entre em contato com o suporte técnico</li>
        </ul>
      </div>
    </>
  );
};

export default FerramentasHelp;