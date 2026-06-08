// src/pages/Consultas/TratamentoErros.jsx (ou onde você organiza suas páginas)

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { rodar_procedure_tratamento_erros } from '../../services/consultaFatura';
import {
  FaPlay,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaTimesCircle
} from 'react-icons/fa';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #666;
    font-size: 1rem;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.variant === 'primary' && `
    background: #2463eb;
    color: white;
    
    &:hover:not(:disabled) {
      background: #1a4fc4;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background: #dc3545;
    color: white;
    
    &:hover:not(:disabled) {
      background: #c82333;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MessageContainer = styled.div`
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  ${props => props.type === 'success' && `
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  `}
  
  ${props => props.type === 'error' && `
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  `}
  
  ${props => props.type === 'info' && `
    background: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
  `}
`;

const LoadingSpinner = styled(FaSpinner)`
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ResultCard = styled.div`
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  
  h3 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.1rem;
  }
  
  pre {
    background: #fff;
    padding: 1rem;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 0.85rem;
    border: 1px solid #dee2e6;
  }
`;

const TratamentoErros = () => {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [messageType, setMessageType] = useState(null);

  if (!isAuthenticated) {
    return (
      <Container>
        <MessageContainer type="error">
          <FaExclamationTriangle />
          <span>Você precisa estar logado para acessar esta página.</span>
        </MessageContainer>
      </Container>
    );
  }

  // Verificar permissões
  const niveisPermitidos = ["admin", "faturamento", "ti"];
  if (!niveisPermitidos.includes(user?.nivel_acesso)) {
    return (
      <Container>
        <MessageContainer type="error">
          <FaExclamationTriangle />
          <span>Você não tem permissão para acessar esta página.</span>
        </MessageContainer>
      </Container>
    );
  }

  const handleRodarProcedure = async () => {
    setLoading(true);
    setMessage(null);
    setResultado(null);
    setMessageType(null);

    try {
      const response = await rodar_procedure_tratamento_erros();
      
      if (response.sucesso) {
        setMessageType('success');
        setMessage(response.mensagem || 'Procedure executada com sucesso!');
        setResultado(response.resultado);
      } else {
        setMessageType('error');
        setMessage(response.erro || 'Erro ao executar procedure');
      }
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.erro || error.message || 'Erro na comunicação com o servidor');
      console.error('Erro detalhado:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <h1>
          <FaTimesCircle style={{ marginRight: '0.5rem', color: '#2463eb' }} />
          Tratamento de Erros
        </h1>
        <p>
          Execute a procedure para tratar erros de faturamento de forma automática.
          Esta ação pode afetar múltiplos registros no banco de dados.
        </p>
      </Header>

      <Card>
        <ButtonContainer>
          <Button 
            variant="primary" 
            onClick={handleRodarProcedure}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoadingSpinner />
                Processando...
              </>
            ) : (
              <>
                <FaPlay />
                Executar Tratamento de Erros
              </>
            )}
          </Button>
        </ButtonContainer>

        {message && (
          <MessageContainer type={messageType}>
            {messageType === 'success' ? (
              <FaCheckCircle size={20} />
            ) : (
              <FaExclamationTriangle size={20} />
            )}
            <span>{message}</span>
          </MessageContainer>
        )}

        {resultado && (
          <ResultCard>
            <h3>Detalhes da Execução:</h3>
            <pre>{JSON.stringify(resultado, null, 2)}</pre>
          </ResultCard>
        )}

        {!loading && !message && (
          <MessageContainer type="info">
            <FaExclamationTriangle size={20} />
            <span>
              <strong>Atenção:</strong> Esta operação pode demorar alguns segundos.
              Não feche a página enquanto estiver processando.
            </span>
          </MessageContainer>
        )}
      </Card>
    </Container>
  );
};

export default TratamentoErros;