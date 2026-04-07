// pages/Historico/DetalhesConsulta.jsx
import React from 'react';
import { formatDateTime, getParametroDisplay } from './utils/historicoUtils';

const DetalhesConsulta = ({ consulta, detalhes, loading, error }) => {
  if (loading) {
    return (
      <div className="detalhes-loading">
        <div className="spinner"></div>
        <p>Carregando detalhes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detalhes-error">
        <i className="bi bi-exclamation-triangle-fill"></i>
        <p>{error}</p>
      </div>
    );
  }

  if (!detalhes || !detalhes.resultado) {
    return (
      <div className="detalhes-empty">
        <i className="bi bi-info-circle"></i>
        <p>Nenhum resultado detalhado disponível para esta consulta.</p>
      </div>
    );
  }

  const resultado = detalhes.resultado;
  const hasResultData = resultado.Result && resultado.Result.length > 0;
  const basicData = hasResultData ? resultado.Result[0].BasicData : null;

  return (
    <div className="detalhes-content">
      <h4>
        <i className="bi bi-info-circle-fill"></i>
        Detalhes da Consulta #{detalhes.id}
      </h4>
      
      <div className="detalhes-grid">
        <div className="detalhes-item">
          <strong>Tipo:</strong>
          <span>{detalhes.tipo_consulta_display || detalhes.tipo_consulta}</span>
        </div>
        
        <div className="detalhes-item">
          <strong>Parâmetro:</strong>
          <span>{getParametroDisplay(consulta, detalhes)}</span>
        </div>
        
        <div className="detalhes-item">
          <strong>Data/Hora:</strong>
          <span>{formatDateTime(detalhes.data_consulta)}</span>
        </div>
        
        <div className="detalhes-item">
          <strong>Realizada por:</strong>
          <span>{detalhes.usuario_email || 'N/A'}</span>
        </div>
        
        <div className="detalhes-item">
          <strong>Origem:</strong>
          <span>{detalhes.origem || 'N/A'}</span>
        </div>
        
        <div className="detalhes-item">
          <strong>Tempo de Resposta:</strong>
          <span>{resultado.ElapsedMilliseconds || 'N/A'} ms</span>
        </div>
      </div>

      {hasResultData && basicData && (
        <div className="resultado-box">
          <h5>
            <i className="bi bi-file-text-fill"></i>
            Resultado da Consulta
          </h5>
          
          <div className="resultado-grid">
            {basicData.Name && (
              <div className="resultado-item">
                <strong>Nome:</strong>
                <span>{basicData.Name}</span>
              </div>
            )}
            
            {basicData.TaxIdStatus && (
              <div className="resultado-item">
                <strong>Situação Cadastral:</strong>
                <span className="status-badge">{basicData.TaxIdStatus}</span>
              </div>
            )}
            
            {basicData.CapturedBirthDateFromRFSource && (
              <div className="resultado-item">
                <strong>Data de Nascimento:</strong>
                <span>{basicData.CapturedBirthDateFromRFSource}</span>
              </div>
            )}
            
            {basicData.MotherName && (
              <div className="resultado-item">
                <strong>Nome da Mãe:</strong>
                <span>{basicData.MotherName}</span>
              </div>
            )}
            
            {resultado.Result[0].MatchKeys && (
              <div className="resultado-item">
                <strong>Chave de Correspondência:</strong>
                <span className="match-keys">{resultado.Result[0].MatchKeys}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetalhesConsulta;