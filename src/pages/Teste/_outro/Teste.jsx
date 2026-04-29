// src/pages/Teste/_outro/TestePage.jsx
import React, { useState, useEffect, useRef } from 'react';
import PageLayout from '../../../Layouts/PageLayout/PageLayout';
import * as S from "./TesteStyles";
import { getHealth, sendChatMessage, testFedhubQuery } from '../../../services/chatService';

const TestePage = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [healthStatus, setHealthStatus] = useState(null);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Verificar saúde da API ao carregar
  useEffect(() => {
    checkHealth();
  }, []);

  // Scroll automático para a última mensagem
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const checkHealth = async () => {
    const result = await getHealth();
    setHealthStatus(result);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    
    // Adiciona mensagem do usuário
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    }]);
    
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      
      // Adiciona resposta da IA
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: response.text,
        sender: 'ai',
        timestamp: new Date(),
        metadata: response.metadata
      }]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: 'Desculpe, ocorreu um erro ao processar sua mensagem. Tente novamente.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTestQuery = async (type, value) => {
    setIsLoading(true);
    try {
      const result = await testFedhubQuery(
        type === 'fatura' ? value : null,
        type === 'apolice' ? value : null
      );
      
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: `🧪 **Teste de Consulta Direta ao Fedhub**\n\n` +
              `Parâmetros: ${type}=${value}\n\n` +
              `Resultado: ${result.success ? '✅ Sucesso' : '❌ Falha'}\n\n` +
              `Dados encontrados: ${result.data?.length || 0} itens\n\n` +
              `Resposta completa:\n${JSON.stringify(result, null, 2)}`,
        sender: 'ai',
        timestamp: new Date(),
        isTest: true
      }]);
    } catch (error) {
      console.error('Erro no teste:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <PageLayout
      title="Teste do Chat com IA"
      subtitle="Assistente Financeira Inteligente - Fedcorp"
    >
      <S.Container>
        <S.ChatHeader>
          <h2>Assistente</h2>
          <div className="health-status">
            <div className={`status-dot ${healthStatus?.status === 'API funcionando (texto)' ? 'healthy' : 'unhealthy'}`} />
            <span>
              {healthStatus?.status === 'API funcionando (texto)' 
                ? 'API Conectada' 
                : 'Verificando conexão...'}
            </span>
          </div>
        </S.ChatHeader>

        <S.MessagesContainer>
          {messages.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: '#9ca3af', 
              marginTop: '50px',
              padding: '20px'
            }}>
              <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                💬 Comece uma conversa!
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Pergunte sobre faturas, apólices ou informações financeiras.
              </p>
              <p style={{ fontSize: '0.85rem', marginTop: '20px' }}>
                Exemplos:<br/>
                • "Qual o status da fatura 162028?"<br/>
                • "Me mostre informações da apólice CD0010"<br/>
                • "Consulte a fatura 162028"
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <S.Message key={msg.id} isUser={msg.sender === 'user'}>
              <div className={`avatar ${msg.sender === 'user' ? 'user' : 'ai'}`}>
                {msg.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className="content">
                <div className="sender">
                  {msg.sender === 'user' ? 'Você' : 'Assistente Financeira'}
                  <span style={{ marginLeft: '10px', fontSize: '0.7rem' }}>
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </div>
                <div className="text">
                  {msg.text.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.text.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                {msg.metadata && (
                  <div className="metadata">
                    {msg.metadata.used_tool && (
                      <span className="badge">
                        🔧 Usou ferramenta: {msg.metadata.tool_name}
                      </span>
                    )}
                    {msg.metadata.model && (
                      <span className="badge">
                        🧠 Modelo: {msg.metadata.model}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </S.Message>
          ))}
          
          {isLoading && (
            <S.Message isUser={false}>
              <div className="avatar ai">🤖</div>
              <div className="content">
                <div className="sender">Assistente Financeira</div>
                <div className="text">
                  <S.LoadingSpinner />
                  <span style={{ marginLeft: '10px' }}>Pensando...</span>
                </div>
              </div>
            </S.Message>
          )}
          
          <div ref={messagesEndRef} />
        </S.MessagesContainer>

        <S.InputContainer>
          <textarea
            ref={textareaRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem... (Pressione Enter para enviar)"
            rows={3}
            disabled={isLoading}
          />
          <button onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
            {isLoading ? <S.LoadingSpinner /> : 'Enviar'}
          </button>
        </S.InputContainer>

        <S.TestPanel>
          <div className="panel-title">
            🧪 Ferramentas de Teste
            <button onClick={() => setIsTestPanelOpen(!isTestPanelOpen)}>
              {isTestPanelOpen ? '▼' : '▶'}
            </button>
            <button onClick={clearChat} style={{ marginLeft: 'auto' }}>
              🗑️ Limpar Chat
            </button>
          </div>
          
          {isTestPanelOpen && (
            <div className="test-buttons">
              <button onClick={() => handleTestQuery('fatura', 162028)}>
                Testar Fatura 162028
              </button>
              <button onClick={() => handleTestQuery('apolice', 'CD0010')}>
                Testar Apólice CD0010
              </button>
              <button onClick={checkHealth}>
                Verificar Saúde da API
              </button>
            </div>
          )}
        </S.TestPanel>
      </S.Container>
    </PageLayout>
  );
};

export default TestePage;