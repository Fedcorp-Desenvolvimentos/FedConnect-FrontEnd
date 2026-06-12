// src/components/Loading/Loading.jsx
import { useState, useEffect, useRef } from 'react';
import * as S from './LoadingStyles'; 
import LOGO from './LOGO.png';

const Loading = ({
  fullScreen = false,
  message = 'Carregando...',
  progress = 0,
  isVisible = true,
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isExiting, setIsExiting] = useState(false);
  const svgRef = useRef(null);
  const animRef = useRef(null);
  const t0Ref = useRef(performance.now());

  const SIZE = 220;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 96;
  const R_MID = 80;
  const R_INNER = 62;
  const CIRC_OUTER = 2 * Math.PI * R_OUTER;
  const CIRC_MID = 2 * Math.PI * R_MID;

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

  // Animate orbiting dots
  useEffect(() => {
    if (!shouldRender || !svgRef.current) return;

    const dot1 = svgRef.current.getElementById('orbital-dot1');
    const dot2 = svgRef.current.getElementById('orbital-dot2');
    const dot3 = svgRef.current.getElementById('orbital-dot3');

    if (!dot1 || !dot2 || !dot3) return;

    t0Ref.current = performance.now();

    const loop = (ts) => {
      const dt = (ts - t0Ref.current) * 0.001;
      const a1 = dt * 1.4;
      const a2 = dt * -0.9;
      const a3 = dt * 0.6;

      dot1.setAttribute('cx', CX + R_OUTER * Math.cos(a1));
      dot1.setAttribute('cy', CY + R_OUTER * Math.sin(a1));
      dot2.setAttribute('cx', CX + R_MID * Math.cos(a2));
      dot2.setAttribute('cy', CY + R_MID * Math.sin(a2));
      dot3.setAttribute('cx', CX + R_INNER * Math.cos(a3));
      dot3.setAttribute('cy', CY + R_INNER * Math.sin(a3));

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  const outerOffset = CIRC_OUTER - (progress / 100) * CIRC_OUTER;
  const midOffset = CIRC_MID - (Math.min(100, progress * 1.3) / 100) * CIRC_MID;

  const LoadingContent = () => (
    <S.Container $isExiting={isExiting}>
      <S.LogoWrapper>
        {/* SVG overlay with orbital rings + dots */}
        <S.OrbitalSvg
          ref={svgRef}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background rings */}
          <circle cx={CX} cy={CY} r={R_OUTER} fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r={R_MID}   fill="none" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Progress arcs */}
          <circle
            cx={CX} cy={CY} r={R_OUTER}
            fill="none"
            stroke="#185FA5"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={CIRC_OUTER}
            strokeDashoffset={outerOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'stroke-dashoffset 0.15s linear' }}
          />
          <circle
            cx={CX} cy={CY} r={R_MID}
            fill="none"
            stroke="#1D9E75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC_MID}
            strokeDashoffset={midOffset}
            style={{ transform: 'rotate(-90deg)', transformOrigin: `${CX}px ${CY}px`, transition: 'stroke-dashoffset 0.15s linear' }}
          />

          {/* Orbiting dots — positions updated via JS */}
          <circle id="orbital-dot1" r="4"   fill="#185FA5" />
          <circle id="orbital-dot2" r="3"   fill="#1D9E75" />
          <circle id="orbital-dot3" r="2.5" fill="#AFA9EC" />
        </S.OrbitalSvg>

        <S.LogoImg
          src={LOGO}
          alt="Logo"
          onError={(e) => {
            console.error('Erro ao carregar logo:', LOGO);
            e.target.style.display = 'none';
          }}
        />

        {progress > 0 && (
          <S.PercentageBadge>{Math.round(progress)}%</S.PercentageBadge>
        )}
      </S.LogoWrapper>

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