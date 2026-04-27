import React from 'react';
import { FaCalculator, FaBuilding, FaShieldAlt, FaLightbulb, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';

export const CotacaoConteudoHelp = () => {
  return (
    <>
      {/* Seção principal */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F3D5D', marginBottom: '0.5rem' }}>
          <FaCalculator /> Estudo – Incêndio Conteúdo
        </h2>
        <p style={{ margin: 0, color: '#475569' }}>
          Calcule o valor do seguro incêndio para seu imóvel de forma rápida e prática.
        </p>
      </div>

      {/* Seção: Como Funciona */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaBuilding /> Como Funciona
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Incêndio Conteúdo:</strong> Valor total dos bens e conteúdos do imóvel</li>
          <li><strong>Perda de Aluguel:</strong> Cobertura para aluguel durante reparos</li>
          <li><strong>Prêmio Proposto:</strong> Valor da proposta de seguro</li>
          <li><strong>Repasse:</strong> Percentual de repasse da administradora</li>
        </ul>
      </div>

      {/* Seção: Campos */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', color: '#0F3D5D' }}>
          <FaMoneyBillWave /> Campos Obrigatórios
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li><strong>Incêndio Conteúdo:</strong> Informe o valor total (R$)</li>
          <li><strong>Perda de Aluguel:</strong> Informe o valor da cobertura (R$)</li>
          <li><strong>Prêmio Proposto:</strong> Informe o valor da proposta (R$)</li>
          <li><strong>Repasse:</strong> Informe o percentual (%)</li>
        </ul>
      </div>

      {/* Seção: Dicas */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaLightbulb style={{ color: '#f59e0b' }} /> Dicas
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Preencha todos os campos para obter o resultado mais preciso</li>
          <li>Utilize o formato de moeda (R$) para valores monetários</li>
          <li>O IS Total é calculado automaticamente</li>
          <li>O resultado mostrará o valor líquido e percentual final</li>
        </ul>
      </div>

      {/* Seção: Atenção */}
      <div>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <FaExclamationTriangle style={{ color: '#dc2626' }} /> Atenção
        </h3>
        <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#475569' }}>
          <li>Os valores devem ser informados corretamente para um cálculo preciso</li>
          <li>O repasse deve ser informado como percentual (%)</li>
          <li>O cálculo considera os impostos e encargos aplicáveis</li>
          <li>Em caso de erro, verifique os dados e tente novamente</li>
        </ul>
      </div>
    </>
  );
};

export default CotacaoConteudoHelp;