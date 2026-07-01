import React from 'react';
import { FaCheck } from 'react-icons/fa';
import * as S from '../CadastroEmpresaStyles';

const Stepper = ({ currentStep, totalSteps, onStepClick }) => {
  const steps = [
    { number: 1, label: 'Empresa' },
    { number: 2, label: 'Endereço' },
    { number: 3, label: 'Contato' },
    { number: 4, label: 'Documentos' }
  ];

  return (
    <S.StepperContainer>
      {steps.map((step, index) => {
        const isCompleted = step.number < currentStep;
        const isActive = step.number === currentStep;
        const isClickable = isCompleted || isActive;

        return (
          <S.StepItem 
            key={step.number}
            $clickable={isClickable}
            onClick={() => isClickable && onStepClick(step.number)}
          >
            <S.StepNumber 
              $completed={isCompleted}
              $active={isActive}
              $clickable={isClickable}
            >
              {isCompleted ? <FaCheck size={14} /> : step.number}
            </S.StepNumber>
            <S.StepLabel $active={isActive} $hideOnMobile={index > 0}>
              {step.label}
            </S.StepLabel>
          </S.StepItem>
        );
      })}
    </S.StepperContainer>
  );
};

export default Stepper;