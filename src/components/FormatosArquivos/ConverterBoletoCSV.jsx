// src/pages/FormatosArquivos/ConverterBoletoCSV.jsx
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileInvoice, 
  FaDownload, 
  FaArrowLeft,
  FaSpinner,
  FaInfoCircle,
  FaHashtag
} from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useAuth } from '../../context/AuthContext';
import { downloadBoletosCSV } from '../../services/arquivosService';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './ConverterBoletoCSVStyles';

const ConverterBoletoCSV = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [numeroFatura, setNumeroFatura] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!numeroFatura) {
      enqueueSnackbar('Por favor, informe o número da fatura', { variant: 'warning' });
      return;
    }
    
    const faturaNum = parseInt(numeroFatura, 10);
    if (isNaN(faturaNum) || faturaNum <= 0) {
      enqueueSnackbar('Por favor, informe um número de fatura válido', { variant: 'error' });
      return;
    }
    
    setLoading(true);
    
    try {
      await downloadBoletosCSV(faturaNum);
      enqueueSnackbar(`Arquivo CSV da fatura ${faturaNum} baixado com sucesso!`, { 
        variant: 'success',
        autoHideDuration: 4000
      });
      setNumeroFatura('');
    } catch (error) {
      console.error('Erro no download:', error);
      
      let errorMessage = 'Erro ao converter boletos para CSV';
      
      if (error.response?.data) {
        if (error.response.data instanceof Blob) {
          try {
            const text = await error.response.data.text();
            const errorData = JSON.parse(text);
            errorMessage = errorData.erro || errorData.message || errorMessage;
          } catch {
            errorMessage = 'Erro ao processar resposta do servidor';
          }
        } else if (typeof error.response.data === 'object') {
          errorMessage = error.response.data.erro || error.response.data.message || errorMessage;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      enqueueSnackbar(errorMessage, { variant: 'error', autoHideDuration: 6000 });
    } finally {
      setLoading(false);
    }
  }, [numeroFatura, enqueueSnackbar]);

  const handleBack = useCallback(() => {
    navigate('/formatos-arquivos');
  }, [navigate]);

  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    // Permite apenas números
    if (value === '' || /^\d+$/.test(value)) {
      setNumeroFatura(value);
    }
  }, []);

  // Verifica permissão
  const niveisPermitidos = ['admin', 'faturamento', 'ti'];
  if (!niveisPermitidos.includes(user?.nivel_acesso)) {
    return (
      <PageLayout
        title="Acesso Negado"
        subtitle="Você não tem permissão para acessar esta página"
        icon={<FaInfoCircle />}
      >
        <S.Container>
          <S.Card>
            <S.Form>
              <S.InfoBox style={{ textAlign: 'center', borderLeftColor: '#dc3545' }}>
                <p>⚠️ Você não tem permissão para acessar esta página.</p>
                <S.BackButton onClick={handleBack} style={{ marginTop: '1rem' }}>
                  <FaArrowLeft />
                  Voltar para Formatos de Arquivos
                </S.BackButton>
              </S.InfoBox>
            </S.Form>
          </S.Card>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Converter Boleto para CSV"
      subtitle="Converta os boletos de uma fatura para o formato CSV e faça o download"
      icon={<FaFileInvoice />}
    >
      <S.Container>
        <S.Card>
          <S.Form onSubmit={handleSubmit}>
            <S.BackButton type="button" onClick={handleBack}>
              <FaArrowLeft />
              Voltar para Formatos de Arquivos
            </S.BackButton>
            
            <S.FormGroup>
              <S.Label>
                <FaHashtag color="#2463eb" size={14} />
                Número da Fatura *
              </S.Label>
              <S.Input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                placeholder="Ex: 169777"
                value={numeroFatura}
                onChange={handleInputChange}
                disabled={loading}
                autoFocus
                maxLength={10}
              />
            </S.FormGroup>
            
            <S.Button type="submit" $loading={loading} disabled={loading}>
              {loading ? (
                <>
                  <S.SpinAnimation>
                    <FaSpinner />
                  </S.SpinAnimation>
                  Convertendo...
                </>
              ) : (
                <>
                  <FaDownload />
                  Converter e Baixar CSV
                </>
              )}
            </S.Button>
            
            <S.InfoBox>
              <p>
                <strong>📋 Informações importantes:</strong>
              </p>
              <p>
                • O arquivo CSV será gerado com os dados dos boletos da fatura informada.<br />
                • O arquivo será baixado automaticamente após a conversão.<br />
                • O formato CSV é compatível com Excel, Google Sheets e outros softwares de planilha.<br />
                • Apenas boletos com status ativo serão incluídos na exportação.<br />
                • O separador utilizado é o ponto e vírgula (;) para compatibilidade com sistemas brasileiros.
              </p>
            </S.InfoBox>
          </S.Form>
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default ConverterBoletoCSV;