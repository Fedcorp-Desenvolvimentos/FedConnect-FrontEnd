// src/pages/ChatPage/ChatPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { 
  FiMessageSquare, 
  FiSend, 
  FiAlertCircle, 
  FiWifi,
  FiWifiOff,
  FiCpu
} from 'react-icons/fi';
import { FaRobot, FaUser } from 'react-icons/fa';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import { sendChatMessage, getHealth } from '../../services/chatService';
import { S } from './ChatPageStyles';

const ChatPage = () => {
  // 1. HOOKS
  const { enqueueSnackbar } = useSnackbar();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // 2. FUNÇÕES DE TOAST
  const showToast = (message, options = {}) => {
    enqueueSnackbar(message, {
      variant: options.variant || 'info',
      anchorOrigin: { vertical: 'top', horizontal: 'right' },
      ...options,
    });
  };

  // 3. ROLAR PARA ÚLTIMA MENSAGEM
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 4. VERIFICAR SAÚDE DO BACKEND
  const checkHealth = async () => {
    try {
      const response = await getHealth();
      setIsOnline(true);
      if (response.status === 'API funcionando (texto)') {
        console.log('Backend online');
      }
    } catch (error) {
      setIsOnline(false);
      console.error('Backend offline:', error);
    }
  };

  // 5. ENVIAR MENSAGEM
  const sendMessage = async () => {
    const message = inputValue.trim();
    if (!message) return;
    if (!isOnline) {
      showToast('O servidor está offline. Tente novamente mais tarde.', { variant: 'error' });
      return;
    }

    // Adiciona mensagem do usuário
    const userMessage = {
      id: Date.now(),
      text: message,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    // Ajusta altura do textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const response = await sendChatMessage(message);
      
      // Adiciona resposta da IA
      const botMessage = {
        id: Date.now() + 1,
        text: response.text || 'Desculpe, não consegui processar sua mensagem.',
        isUser: false,
        timestamp: new Date(),
        metadata: response.metadata,
      };
      setMessages(prev => [...prev, botMessage]);
      
      if (response.success) {
        showToast('Mensagem enviada com sucesso!', { variant: 'success' });
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        isUser: false,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      showToast('Erro ao enviar mensagem', { variant: 'error' });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // 6. HANDLE KEY PRESS (Ctrl+Enter ou Cmd+Enter)
  const handleKeyPress = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  };

  // 7. AJUSTAR ALTURA DO TEXTAREA AUTOMATICAMENTE
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  // 8. EFECTS
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Verifica a cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  // 9. MENSAGEM DE BOAS-VINDAS
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage = {
        id: 0,
        text: 'Olá! 👋 Sou o assistente virtual. Como posso ajudar você hoje?',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // 10. RENDERIZAÇÃO DA MENSAGEM
  const renderMessage = (message) => {
    if (message.isUser) {
      return (
        <S.MessageWrapper key={message.id} $isUser={true}>
          <S.MessageBubble $isUser={true}>
            <S.MessageText>
              {message.text.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < message.text.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </S.MessageText>
            <S.MessageMeta $isUser={true}>
              <S.MessageTime>
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </S.MessageTime>
            </S.MessageMeta>
          </S.MessageBubble>
        </S.MessageWrapper>
      );
    }

    return (
      <S.MessageWrapper key={message.id} $isUser={false}>
        <S.MessageBubble $isUser={false}>
          <S.MessageText>
            {message.text.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < message.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))}
          </S.MessageText>
          <S.MessageMeta $isUser={false}>
            <S.MessageTime>
              {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </S.MessageTime>
          </S.MessageMeta>
        </S.MessageBubble>
      </S.MessageWrapper>
    );
  };

  // 11. RENDER
  return (
    <PageLayout 
      title="Chat IA" 
      subtitle="Assistente virtual para consultas"
      icon={<FiMessageSquare />}
    >
      <S.Container>
        <S.ChatHeader>
          <S.HeaderInfo>
            <S.HeaderIcon>
              <FiCpu />
            </S.HeaderIcon>
            <S.HeaderText>
              <h2>Assistente Virtual</h2>
              <p>Powered by AI • Responda em tempo real</p>
            </S.HeaderText>
          </S.HeaderInfo>
          <S.StatusBadge $online={isOnline}>
            {isOnline ? 'Online' : 'Offline'}
            {isOnline ? <FiWifi size={12} /> : <FiWifiOff size={12} />}
          </S.StatusBadge>
        </S.ChatHeader>

        <S.MessagesArea>
          {messages.length === 0 && !isLoading ? (
            <S.EmptyState>
              <FiMessageSquare />
              <h3>Nenhuma mensagem ainda</h3>
              <p>Comece uma conversa enviando uma mensagem abaixo.</p>
            </S.EmptyState>
          ) : (
            <>
              {messages.map(renderMessage)}
              {isTyping && (
                <S.MessageWrapper $isUser={false}>
                  <S.TypingIndicator>
                    <span></span>
                    <span></span>
                    <span></span>
                  </S.TypingIndicator>
                </S.MessageWrapper>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </S.MessagesArea>

        <S.InputArea>
          <S.InputContainer>
            <S.InputWrapper>
              <S.Input
                ref={textareaRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Digite sua mensagem... (Ctrl+Enter para enviar)"
                rows={1}
                disabled={isLoading || !isOnline}
              />
            </S.InputWrapper>
            <S.SendButton 
              onClick={sendMessage} 
              disabled={isLoading || !inputValue.trim() || !isOnline}
            >
              <FiSend />
            </S.SendButton>
          </S.InputContainer>
          {!isOnline && (
            <S.ErrorMessage>
              <FiAlertCircle />
              Servidor offline. Verifique a conexão com o backend.
            </S.ErrorMessage>
          )}
        </S.InputArea>
      </S.Container>
    </PageLayout>
  );
};

export default ChatPage;