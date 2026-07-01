// src/pages/CadastrosGerais/CadastroEmpresa.jsx

import React from 'react';
import { FaBuilding, FaSave, FaTimes, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroEmpresaStyles';
import EmpresaForm from './components/EmpresaForm';
import EnderecoForm from './components/EnderecoForm';
import ContatoForm from './components/ContatoForm';
import DocumentosForm from './components/DocumentosForm';
import Stepper from './components/Stepper';
import { useEmpresaForm } from './hooks/useEmpresaForm';
import { useStepper } from './hooks/useStepper';

const CadastroEmpresa = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { 
    formData,
    errors,
    updateField,
    validateStep,
    resetForm,
    isSubmitting
  } = useEmpresaForm();

  const {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep
  } = useStepper(4);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida todos os passos
    let allValid = true;
    for (let step = 1; step <= totalSteps; step++) {
      const isValid = validateStep(step);
      if (!isValid) {
        allValid = false;
        goToStep(step);
        enqueueSnackbar(`Por favor, preencha todos os campos obrigatórios do passo ${step}`, { 
          variant: 'warning' 
        });
        break;
      }
    }

    if (!allValid) return;

    try {
      // Simula envio
      console.log('📦 Dados da Empresa:', JSON.stringify(formData, null, 2));
      
      enqueueSnackbar('✅ Empresa cadastrada com sucesso! (Simulação)', { 
        variant: 'success' 
      });
      
      // Reset após sucesso
      resetForm();
      goToStep(1);
    } catch (error) {
      enqueueSnackbar('❌ Erro ao cadastrar empresa', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    if (window.confirm('Tem certeza que deseja cancelar? Os dados não serão salvos.')) {
      resetForm();
      goToStep(1);
      enqueueSnackbar('Cadastro cancelado', { variant: 'info' });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EmpresaForm 
            data={formData} 
            errors={errors}
            onChange={updateField} 
          />
        );
      case 2:
        return (
          <EnderecoForm 
            data={formData} 
            errors={errors}
            onChange={updateField} 
          />
        );
      case 3:
        return (
          <ContatoForm 
            data={formData} 
            errors={errors}
            onChange={updateField} 
          />
        );
      case 4:
        return (
          <DocumentosForm 
            data={formData} 
            errors={errors}
            onChange={updateField} 
          />
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    const titles = [
      'Dados da Empresa',
      'Endereço',
      'Contato',
      'Documentos'
    ];
    return titles[currentStep - 1] || '';
  };

  return (
    <PageLayout
      title="Cadastro de Empresa"
      subtitle="Cadastre uma nova empresa no sistema com todas as informações necessárias"
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <FaBuilding /> Cadastro de Empresa
            </S.Title>
            <S.HeaderActions>
              <S.SecondaryButton type="button" onClick={handleCancel}>
                <FaTimes /> Cancelar
              </S.SecondaryButton>
            </S.HeaderActions>
          </S.CardHeader>

          <S.Form onSubmit={handleSubmit}>
            <Stepper 
              currentStep={currentStep}
              totalSteps={totalSteps}
              onStepClick={goToStep}
            />

            <S.StepContent>
              <S.StepTitle>
                Passo {currentStep} de {totalSteps}: {getStepTitle()}
              </S.StepTitle>
              {renderStep()}
            </S.StepContent>

            <S.FormActions>
              <S.ButtonGroup>
                <S.SecondaryButton 
                  type="button" 
                  onClick={goToPreviousStep}
                  disabled={isFirstStep}
                >
                  <FaArrowLeft /> Anterior
                </S.SecondaryButton>

                {isLastStep ? (
                  <S.PrimaryButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>⏳ Salvando...</>
                    ) : (
                      <>✅ Cadastrar Empresa</>
                    )}
                  </S.PrimaryButton>
                ) : (
                  <S.PrimaryButton type="button" onClick={goToNextStep}>
                    Próximo <FaArrowRight />
                  </S.PrimaryButton>
                )}
              </S.ButtonGroup>
            </S.FormActions>
          </S.Form>
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default CadastroEmpresa;