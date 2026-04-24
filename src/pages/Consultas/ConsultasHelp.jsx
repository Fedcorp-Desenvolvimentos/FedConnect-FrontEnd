import React from 'react';
import { FaSearch, FaUser, FaBuilding, FaMapMarkerAlt, FaShieldAlt, FaFileInvoiceDollar, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

export const ConsultasHelp = () => {
  return (
    <div>
      <div className="help-section">
        <div className="help-title">
          <FaSearch /> Consultas Disponíveis
        </div>
        <p>Nesta página você pode realizar consultas aos principais cadastros do sistema.</p>
      </div>

      <div className="help-section">
        <div className="help-title">📋 Tipos de Consulta</div>
        <div className="help-grid">
          <div className="help-card">
            <strong><FaUser /> Dados Pessoais</strong>
            <p>Consulta completa de CPF com informações cadastrais, situação e dados de contato.</p>
          </div>
          <div className="help-card">
            <strong><FaBuilding /> Dados Empresariais</strong>
            <p>Informações completas de CNPJ, incluindo sócios, CNAE e situação fiscal.</p>
          </div>
          <div className="help-card">
            <strong><FaMapMarkerAlt /> Endereços</strong>
            <p>Busca por CEP e logradouros, com informações detalhadas de endereço.</p>
          </div>
          <div className="help-card">
            <strong><FaShieldAlt /> Segurados</strong>
            <p>Verificação de status e informações de segurados.</p>
          </div>
          <div className="help-card">
            <strong><FaFileInvoiceDollar /> Faturamento</strong>
            <p>Relatórios financeiros detalhados e consulta de faturas.</p>
          </div>
        </div>
      </div>

      <div className="help-section">
        <div className="help-title">
          <FaLightbulb /> Dicas
        </div>
        <ul>
          <li>Utilize os filtros disponíveis em cada consulta para refinar sua busca</li>
          <li>Resultados podem ser exportados em formato Excel</li>
          <li>Use o campo de busca local para filtrar resultados já carregados</li>
        </ul>
      </div>

      <div className="help-section">
        <div className="help-title">
          <FaExclamationTriangle /> Atenção
        </div>
        <ul>
          <li>Todas as consultas são registradas para fins de auditoria</li>
          <li>Limite de 250 CPFs por consulta em massa</li>
          <li>Verifique os dados antes de confirmar a consulta</li>
        </ul>
      </div>
    </div>
  );
};

export default ConsultasHelp;