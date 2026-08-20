import React from 'react';
import { 
  FaHammer, 
  FaTimesCircle, 
  FaFileInvoice, 
  FaFileInvoiceDollar,
  FaLightbulb, 
  FaExclamationTriangle,
  FaChartLine,
  FaMoneyBillWave
} from 'react-icons/fa';

export const FaturamentoHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaHammer /> Faturamento
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Acesse ferramentas e sistemas para otimizar processos de faturamento, emissão de notas fiscais e consultas financeiras.
        </p>
      </div>

      {/* Seção: Ferramentas Disponíveis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaMoneyBillWave /> Ferramentas Disponíveis
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaTimesCircle /> Cancelamento/Reemissão FedBnk</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Cancele faturas ou boletos, ou corrija dados e reemita boletos com número novo.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFileInvoice /> Sistema de NF</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Solicite e acompanhe emissão e cancelamento de Nota Fiscal.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaFileInvoiceDollar /> Consultar Faturamento</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Consulte faturamento detalhado com parâmetros de pesquisa avançados.</p>
          </div>
        </div>
      </div>

      {/* Seção: Funcionalidades */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaChartLine /> Funcionalidades
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Cancelamento/Reemissão:</strong> Gerencie cancelamentos e reemissões de faturas e boletos</li>
          <li><strong>Notas Fiscais:</strong> Emissão e acompanhamento de NF</li>
          <li><strong>Consulta de Faturamento:</strong> Análise detalhada com filtros</li>
          <li><strong>Exportação:</strong> Resultados podem ser exportados em Excel</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Utilize a consulta de faturamento com filtros para resultados mais precisos</li>
          <li>Verifique o status dos boletos antes de solicitar cancelamento</li>
          <li>Notas fiscais emitidas ficam disponíveis para consulta imediata</li>
          <li>Mantenha os dados do cliente atualizados para evitar erros nas faturas</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Cancelamentos de faturas são irreversíveis</li>
          <li>Notas fiscais canceladas não podem ser reativadas</li>
          <li>Consulte sempre os dados antes de confirmar qualquer operação</li>
          <li>Em caso de erros, entre em contato com o suporte</li>
        </ul>
      </div>
    </>
  );
};

export default FaturamentoHelp;