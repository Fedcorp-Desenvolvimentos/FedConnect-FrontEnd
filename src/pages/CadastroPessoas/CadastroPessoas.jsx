// src/pages/CadastroPessoas/CadastroPessoas.jsx

import React, { useState, useMemo } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import ConfirmModal from './components/ConfirmModal';
import { TAB_SECTIONS, MAPEAMENTO_CAMPOS } from './constants/pessoaConstants';
import { usePessoas } from '../../hooks/usePessoas';

const CadastroPessoas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identificacao');

  const [showVoltarModal, setShowVoltarModal] = useState(false);
  const [showLimparModal, setShowLimparModal] = useState(false);
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    canLimpar,
    updateField,
    preencherEndereco,
    clearForm,
    save,
    gerentes,
  } = usePessoas(true);

  const isFormValid = useMemo(() => {
    if (!formData.nome?.trim()) return false;
    if (!formData.cpf_cnpj?.trim()) return false;
    return true;
  }, [formData.nome, formData.cpf_cnpj]);

  // ==================== MODAIS ====================
  const handleVoltarClick = () => {
    setShowVoltarModal(true);
  };

  const handleVoltarConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      setIsConfirming(false);
      setShowVoltarModal(false);
      navigate('/cadastro-pessoas');
    }, 300);
  };

  const handleVoltarCancel = () => {
    setShowVoltarModal(false);
  };

  const handleLimparClick = () => {
    if (canLimpar) {
      setShowLimparModal(true);
    }
  };

  const handleLimparConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      clearForm();
      setIsConfirming(false);
      setShowLimparModal(false);
      enqueueSnackbar('Campos limpos com sucesso', { variant: 'info' });
    }, 300);
  };

  const handleLimparCancel = () => {
    setShowLimparModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nome?.trim()) {
      enqueueSnackbar('⚠️ Nome é obrigatório', { variant: 'warning' });
      return;
    }

    if (!formData.cpf_cnpj?.trim()) {
      enqueueSnackbar('⚠️ CPF/CNPJ é obrigatório', { variant: 'warning' });
      return;
    }

    setShowSalvarModal(true);
  };

  const handleSalvarConfirm = async () => {
    setIsConfirming(true);
    const result = await save();

    if (!result.success) {
      if (result.existingData) {
        enqueueSnackbar(`❌ ${result.error}`, { 
          variant: 'error',
          autoHideDuration: 8000,
          anchorOrigin: { vertical: 'top', horizontal: 'center' }
        });
        setErrors(prev => ({
          ...prev,
          cpf_cnpj: 'Este CPF/CNPJ já está cadastrado'
        }));
        setIsConfirming(false);
        setShowSalvarModal(false);
        return;
      }
      
      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        const errorMessages = [];
        Object.entries(result.fieldErrors).forEach(([field, messages]) => {
          const fieldName = MAPEAMENTO_CAMPOS[field] || field;
          const msg = Array.isArray(messages) ? messages.join(', ') : messages;
          errorMessages.push(`${fieldName}: ${msg}`);
        });
        enqueueSnackbar(`❌ ${errorMessages.join('; ')}`, { variant: 'error', autoHideDuration: 8000 });
        setIsConfirming(false);
        setShowSalvarModal(false);
        return;
      }
      
      enqueueSnackbar(`❌ ${result.error || 'Erro ao salvar.'}`, { variant: 'error' });
      setIsConfirming(false);
      setShowSalvarModal(false);
      return;
    }

    enqueueSnackbar('✅ Pessoa cadastrada com sucesso!', { variant: 'success' });
    setIsConfirming(false);
    setShowSalvarModal(false);
    navigate('/cadastro-pessoas');
  };

  const handleSalvarCancel = () => {
    setShowSalvarModal(false);
  };

  const handleBuscarCep = async () => {
    const cep = formData.cep?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) {
      enqueueSnackbar('Informe um CEP válido', { variant: 'warning' });
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        enqueueSnackbar('CEP não encontrado', { variant: 'warning' });
        return;
      }

      preencherEndereco(data);
      enqueueSnackbar('Endereço preenchido automaticamente', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Não foi possível consultar o CEP agora', { variant: 'error' });
    }
  };

  return (
    <PageLayout title="Novo Cadastro" subtitle="Preencha os dados da nova pessoa">
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <FaUsers /> Novo Cadastro
            </S.Title>
            <S.HeaderActions>
              <S.SecondaryButton 
                type="button" 
                onClick={handleLimparClick} 
                disabled={!canLimpar || isSubmitting}
              >
                <FaEraser /> Limpar
              </S.SecondaryButton>
              <S.DangerButton 
                type="button" 
                onClick={handleVoltarClick}
                disabled={isSubmitting}
              >
                <FaSignOutAlt /> Voltar
              </S.DangerButton>
            </S.HeaderActions>
          </S.CardHeader>

          <S.Form onSubmit={handleSubmit}>
            <PessoaFormTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={TAB_SECTIONS} />

            <PessoaFormFields
              data={formData}
              errors={errors}
              disabled={isSubmitting}
              onChange={updateField}
              onBuscarCep={handleBuscarCep}
              activeTab={activeTab}
              gerentes={gerentes}
            />

            <S.FormActions>
              <S.SuccessButton type="submit" disabled={isSubmitting || !isFormValid}>
                {isSubmitting ? '⏳ Salvando...' : (
                  <>
                    <FaSave /> Salvar
                  </>
                )}
              </S.SuccessButton>
            </S.FormActions>
          </S.Form>
        </S.Card>
      </S.Container>

      {/* ==================== MODAIS ==================== */}
      <ConfirmModal
        isOpen={showVoltarModal}
        onConfirm={handleVoltarConfirm}
        onCancel={handleVoltarCancel}
        title="Sair do cadastro"
        message={
          <>
            <p>Deseja realmente sair?</p>
            <p style={{ color: '#ef4444', fontSize: '0.9rem' }}>
              <strong>Atenção:</strong> Os dados não salvos serão perdidos.
            </p>
          </>
        }
        confirmText="Sair"
        cancelText="Continuar editando"
        danger={true}
        loading={isConfirming}
      />

      <ConfirmModal
        isOpen={showLimparModal}
        onConfirm={handleLimparConfirm}
        onCancel={handleLimparCancel}
        title="Limpar formulário"
        message="Tem certeza que deseja limpar todos os campos?"
        confirmText="Limpar"
        cancelText="Cancelar"
        danger={false}
        loading={isConfirming}
      />

      <ConfirmModal
        isOpen={showSalvarModal}
        onConfirm={handleSalvarConfirm}
        onCancel={handleSalvarCancel}
        title="Confirmar cadastro"
        message={
          <>
            <p>Deseja realmente cadastrar esta pessoa?</p>
            <div style={{ 
              marginTop: '0.75rem', 
              padding: '0.75rem', 
              background: '#f8fafc', 
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <strong>Nome:</strong> {formData.nome || 'Não informado'}<br />
              <strong>CPF/CNPJ:</strong> {formData.cpf_cnpj || 'Não informado'}
            </div>
          </>
        }
        confirmText="Cadastrar"
        cancelText="Revisar dados"
        danger={false}
        loading={isConfirming}
      />
    </PageLayout>
  );
};

export default CadastroPessoas;