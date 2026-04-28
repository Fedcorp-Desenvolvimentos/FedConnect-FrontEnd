// src/components/Loading/Loading.jsx
import { useState, useEffect } from 'react';
import * as S from './LoadingStyles';
import LOGO from './LOGO.png';

const Loading = ({ 
  fullScreen = false, 
  message = 'Carregando...',
  progress = 0,
  isVisible = true
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);

  const size = 220;
  const radius = 95;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    if (!isVisible) {
      setIsExiting(true);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    } else {
      setShouldRender(true);
      setIsExiting(false);
    }
  }, [isVisible]);

  if (!shouldRender) return null;

  const LoadingContent = () => (
    <S.Container $isExiting={isExiting}>
      <S.LogoWrapper>
        <S.ProgressSvg viewBox={`0 0 ${size} ${size}`}>
          {/* Círculo de fundo */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="6"
          />
          {/* Círculo de progresso */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#2563eb"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.1s linear'
            }}
          />
        </S.ProgressSvg>
        
        <S.LogoImg 
          src={LOGO}
          alt="Logo" 
          onError={(e) => {
            console.error('Erro ao carregar logo:', LOGO);
            e.target.style.display = 'none';
          }}
        />
        
        {/* Porcentagem dentro do círculo abaixo da logo */}
        {progress > 0 && (
          <S.PercentageBadge>
            {Math.round(progress)}%
          </S.PercentageBadge>
        )}
      </S.LogoWrapper>
      
      {/* Apenas a mensagem de texto */}
      {message && (
        <S.MessageContainer $isExiting={isExiting}>
          <S.MessageText>{message}</S.MessageText>
        </S.MessageContainer>
      )}
    </S.Container>
  );

  if (fullScreen) {
    return (
      <S.Overlay $isExiting={isExiting}>
        <LoadingContent />
      </S.Overlay>
    );
  }

  return <LoadingContent />;
};

export default Loading;