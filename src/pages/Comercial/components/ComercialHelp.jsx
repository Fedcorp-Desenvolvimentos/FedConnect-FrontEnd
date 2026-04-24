import React from 'react';
import { FaChartLine, FaCalendarAlt, FaFilter, FaFileExcel, FaLightbulb } from 'react-icons/fa';

export const DashboardComercialHelp = () => {
  return (
    <div>
      <div className="help-section">
        <div className="help-title">
          <FaChartLine /> Acompanhamento Comercial
        </div>
        <p>Gerencie e acompanhe todas as visitas comerciais realizadas pela equipe.</p>
      </div>

      <div className="help-section">
        <div className="help-title">📊 Métricas</div>
        <div className="help-grid">
          <div className="help-card">
            <strong>📅 Agendadas</strong>
            <p>Visitas programadas ainda não realizadas</p>
          </div>
          <div className="help-card">
            <strong>✅ Realizadas</strong>
            <p>Visitas concluídas com sucesso</p>
          </div>
          <div className="help-card">
            <strong>❌ Canceladas</strong>
            <p>Visitas canceladas com justificativa</p>
          </div>
        </div>
      </div>

      <div className="help-section">
        <div className="help-title">
          <FaLightbulb /> Funcionalidades
        </div>
        <ul>
          <li><strong>Filtros:</strong> Busque por empresa ou comercial responsável</li>
          <li><strong>Período:</strong> Selecione o mês desejado para análise</li>
          <li><strong>Kanban:</strong> Visualize as visitas por status</li>
          <li><strong>Exportação:</strong> Baixe relatório em Excel</li>
          <li><strong>Detalhes:</strong> Clique em qualquer card para ver informações completas</li>
        </ul>
      </div>
    </div>
  );
};