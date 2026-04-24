import { useState, useEffect } from 'react';
import * as S from './LoadingStyles';
import LOGO from './LOGO.png';

const Loading = ({ 
  fullScreen = false, 
  message = 'Carregando...'
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const LoadingContent = () => (
    <S.Container>
      <S.LogoWrapper>
        <S.LogoImg 
          src={LOGO}
          alt="Logo" 
          onError={(e) => {
            console.error('Erro ao carregar logo:', LOGO);
            e.target.style.display = 'none';
          }}
        />
        
        <S.ProgressSvg viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#2463eb"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </S.ProgressSvg>
      </S.LogoWrapper>
      
      {message && (
        <S.MessageContainer>
          <S.MessageText>{message}</S.MessageText>
          {/* <S.PercentageText>{Math.round(progress)}%</S.PercentageText> */}
        </S.MessageContainer>
      )}
    </S.Container>
  );

  if (fullScreen) {
    return (
      <S.Overlay>
        <LoadingContent />
      </S.Overlay>
    );
  }

  return <LoadingContent />;
};

export default Loading;