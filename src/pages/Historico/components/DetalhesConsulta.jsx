import React from 'react';
import { FaInfoCircle, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import * as S from '../HistoricoStyles';
import { formatDateTime, getParametroDisplay } from '../utils/historicoUtils';

const DetalhesConsulta = ({ consulta, detalhes, loading, error }) => {
  if (loading) {
    return (
      <S.DetalhesLoading>
        <FaSpinner className="spinner" />
        <p>Carregando detalhes...</p>
      </S.DetalhesLoading>
    );
  }

  if (error) {
    return (
      <S.DetalhesError>
        <FaExclamationTriangle />
        <p>{error}</p>
      </S.DetalhesError>
    );
  }

  if (!detalhes || !detalhes.resultado) {
    return (
      <S.DetalhesEmpty>
        <FaInfoCircle />
        <p>Nenhum resultado detalhado disponível para esta consulta.</p>
      </S.DetalhesEmpty>
    );
  }

  const resultado = detalhes.resultado;
  const hasResultData = resultado.Result && resultado.Result.length > 0;
  const basicData = hasResultData ? resultado.Result[0].BasicData : null;

  return (
    <>
      <S.DetalhesTitle>
        <FaInfoCircle />
        Detalhes da Consulta #{detalhes.id}
      </S.DetalhesTitle>
      
      <S.DetalhesGrid>
        <S.DetalhesItem>
          <strong>Tipo:</strong>
          <span>{detalhes.tipo_consulta_display || detalhes.tipo_consulta}</span>
        </S.DetalhesItem>
        
        <S.DetalhesItem>
          <strong>Parâmetro:</strong>
          <span>{getParametroDisplay(consulta, detalhes)}</span>
        </S.DetalhesItem>
        
        <S.DetalhesItem>
          <strong>Data/Hora:</strong>
          <span>{formatDateTime(detalhes.data_consulta)}</span>
        </S.DetalhesItem>
        
        <S.DetalhesItem>
          <strong>Realizada por:</strong>
          <span>{detalhes.usuario_email || 'N/A'}</span>
        </S.DetalhesItem>
        
        <S.DetalhesItem>
          <strong>Origem:</strong>
          <span>{detalhes.origem || 'N/A'}</span>
        </S.DetalhesItem>
        
        <S.DetalhesItem>
          <strong>Tempo de Resposta:</strong>
          <span>{resultado.ElapsedMilliseconds || 'N/A'} ms</span>
        </S.DetalhesItem>
      </S.DetalhesGrid>

      {hasResultData && basicData && (
        <S.ResultadoBox>
          <h5>
            <FaInfoCircle />
            Resultado da Consulta
          </h5>
          
          <S.ResultadoGrid>
            {basicData.Name && (
              <S.ResultadoItem>
                <strong>Nome:</strong>
                <span>{basicData.Name}</span>
              </S.ResultadoItem>
            )}
            
            {basicData.TaxIdStatus && (
              <S.ResultadoItem>
                <strong>Situação Cadastral:</strong>
                <S.StatusBadge>{basicData.TaxIdStatus}</S.StatusBadge>
              </S.ResultadoItem>
            )}
            
            {basicData.CapturedBirthDateFromRFSource && (
              <S.ResultadoItem>
                <strong>Data de Nascimento:</strong>
                <span>{basicData.CapturedBirthDateFromRFSource}</span>
              </S.ResultadoItem>
            )}
            
            {basicData.MotherName && (
              <S.ResultadoItem>
                <strong>Nome da Mãe:</strong>
                <span>{basicData.MotherName}</span>
              </S.ResultadoItem>
            )}
            
            {resultado.Result[0].MatchKeys && (
              <S.ResultadoItem>
                <strong>Chave de Correspondência:</strong>
                <S.MatchKeys>{resultado.Result[0].MatchKeys}</S.MatchKeys>
              </S.ResultadoItem>
            )}
          </S.ResultadoGrid>
        </S.ResultadoBox>
      )}
    </>
  );
};

export default DetalhesConsulta;