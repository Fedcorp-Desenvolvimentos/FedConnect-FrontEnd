import React from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUsers, 
  FaVideo, 
  FaLaptop,
  FaLightbulb, 
  FaExclamationTriangle,
  FaPlusCircle,
  FaTrashAlt,
  FaEye
} from 'react-icons/fa';

export const AgendaHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaCalendarAlt /> Agenda de Salas
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Gerencie as reservas da sala de reunião de forma fácil e rápida.
        </p>
      </div>

      {/* Seção: Funcionalidades */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaClock /> Funcionalidades
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaPlusCircle /> Nova Reserva</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Crie reservas clicando em um horário disponível ou no botão "Nova Reserva".</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaEye /> Visualizar Detalhes</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Clique em "Reservado" para ver informações detalhadas da reserva.</p>
          </div>
          <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <strong style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}><FaTrashAlt /> Cancelar Reserva</strong>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#475569' }}>Exclua reservas através do modal de detalhes (apenas administradores).</p>
          </div>
        </div>
      </div>

      {/* Seção: Horários Disponíveis */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaClock /> Horários
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Horários disponíveis: <strong>09:00 às 18:00</strong> (em intervalos de 1 hora)</li>
          <li>Reservas podem ter duração de <strong>1 a 4 horas</strong></li>
          <li>A reserva <strong>ocupa todos os horários do período, inclusive o horário final</strong>. Ex: uma reunião das <strong>10:00 às 12:00</strong> marca 10:00, 11:00 e 12:00 como reservados, e o próximo horário livre é 13:00</li>
          <li>Slots em <strong>verde</strong> estão disponíveis para reserva</li>
          <li>Slots em <strong>azul (Reservado)</strong> estão ocupados e não aceitam nova reunião. Passe o mouse para ver o tema e o intervalo completo</li>
          <li>A duração oferecida é limitada pelos horários livres seguintes e pelo fim do expediente (19:00)</li>
        </ul>
      </div>

      {/* Seção: Como Usar */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaLaptop /> Navegação
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Use as setas <strong>‹ e ›</strong> para navegar entre semanas</li>
          <li>Clique no ícone de <strong>calendário</strong> para selecionar um mês específico</li>
          <li>A grade exibe os horários da semana atual (Segunda a Sexta)</li>
          <li>Apenas dias <strong>futuros</strong> permitem novas reservas</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Preencha todos os campos ao criar uma reserva para evitar erros</li>
          <li>Informe os participantes para facilitar a organização da reunião</li>
          <li>Reservas podem ser visualizadas por qualquer usuário</li>
          <li>Utilize o tema da reunião para identificar facilmente o propósito</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Conflitos de horário são verificados automaticamente</li>
          <li>Em caso de erro, entre em contato com o suporte</li>
        </ul>
      </div>
    </>
  );
};

export default AgendaHelp;