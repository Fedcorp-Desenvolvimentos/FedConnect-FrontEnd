import React from 'react';
import { FaExclamationTriangle, FaLightbulb } from 'react-icons/fa';
import { 
  TbAutomation, 
  TbUpload, 
  TbRefresh, 
  TbFolder,
  TbCalendar,
  TbBuilding,
} from 'react-icons/tb';

export const BBZAutomacaoHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <TbAutomation /> Automação da BBZ
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Gerencie e monitore suas automações de forma eficiente.
        </p>
      </div>

      {/* Seção: Upload */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <TbUpload /> Upload de PDFs
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Selecione um ou mais arquivos PDF para enviar ao servidor</li>
          <li>Os arquivos são enviados para a pasta de origem no servidor</li>
          <li>PDFs com o mesmo nome serão substituídos</li>
          <li>Você pode remover arquivos da lista antes do envio</li>
        </ul>
      </div>

      {/* Seção: Processamento */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <TbRefresh /> Processar PDFs
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Processa os PDFs que estão na pasta de origem</li>
          <li>Organiza os arquivos automaticamente por condomínio</li>
          <li>Cria estrutura de pastas por <strong>ano/mês</strong></li>
          <li>Backup automático de arquivos existentes</li>
        </ul>
      </div>

      {/* Seção: Fluxo */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <TbBuilding /> Fluxo de Trabalho
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>1. Upload:</strong> Envie os PDFs para o servidor</li>
          <li><strong>2. Processamento:</strong> Clique em "Processar PDFs agora"</li>
          <li><strong>3. Organização:</strong> Arquivos são movidos para pastas corretas</li>
          <li><strong>4. Backup:</strong> Arquivos antigos são salvos na pasta "old"</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Envie múltiplos PDFs de uma só vez</li>
          <li>Processe todos os arquivos após o upload</li>
          <li>Verifique o resumo do processamento para conferir resultados</li>
          <li>Arquivos sem correspondência são reportados</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>O upload pode demorar conforme quantidade de arquivos</li>
          <li>O processamento move arquivos permanentemente</li>
          <li>Backups são criados automaticamente</li>
          <li>Certifique-se de que os nomes dos arquivos correspondem aos condomínios</li>
        </ul>
      </div>
    </>
  );
};

export default BBZAutomacaoHelp;