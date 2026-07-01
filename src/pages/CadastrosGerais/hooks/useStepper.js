// src/pages/CadastrosGerais/hooks/useStepper.js

import { useState, useCallback } from 'react';

export const useStepper = (totalSteps) => {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step) => {
    if (step >= 1 && step <= totalSteps) {
      setCurrentStep(step);
    }
  }, [totalSteps]);

  const resetStepper = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    resetStepper
  };
};