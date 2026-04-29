// src/pages/Teste/TestePage.jsx
import React, { useState } from 'react';
import PageLayout from '../../../Layouts/PageLayout/PageLayout';
import * as S from "./TesteStyles";
import { Button, Card, CardBody } from "../../../Layouts/ui";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const TestePage = () => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <PageLayout
      title="Teste de Styled Components"
      subtitle="Exemplo prático: como usar props para criar componentes reativos"
    >
      
      {/* EXEMPLO ÚNICO: Card com Like usando props */}
      <h3>📌 Exemplo: Card Interativo com Props</h3>
      <p style={{ color: '#64748b', marginBottom: '16px' }}>
        O componente <strong>LikeCard</strong> e <strong>LikeButton</strong> mudam de estilo 
        baseado na prop <code>$isLiked</code> passada por estado.
      </p>
      
      <S.DemoCard>
        <S.LikeCard $isLiked={isLiked}>
          <CardBody>
            <S.FlexBetween>
              <span><strong>Postagem demonstrativa</strong></span>
              <S.LikeButton onClick={() => setIsLiked(!isLiked)} $isLiked={isLiked}>
                {isLiked ? <FaHeart /> : <FaRegHeart />}
                {isLiked ? 'Curtido' : 'Curtir'}
              </S.LikeButton>
            </S.FlexBetween>
            <p>
              {isLiked 
                ? '✨ Você curtiu este post! O card mudou de cor e o botão ficou vermelho.' 
                : '👆 Clique em "Curtir" para ver o componente reagir à mudança de estado.'}
            </p>
            <small style={{ color: '#94a3b8' }}>
              ✅ Prop $isLiked controla: borda, fundo do card, cor e fundo do botão
            </small>
          </CardBody>
        </S.LikeCard>
      </S.DemoCard>

      {/* Explicação adicional */}
      <S.ExplanationBox>
        <h4>🎯 Vantagem do Styled Components com Props:</h4>
        <ul>
          <li>✅ Um único componente que se adapta via <strong>props</strong></li>
          <li>✅ Sem classes CSS condicionais ou lógica no estilo global</li>
          <li>✅ Código mais limpo e manutenível</li>
        </ul>
      </S.ExplanationBox>

    </PageLayout>
  );
};

export default TestePage;