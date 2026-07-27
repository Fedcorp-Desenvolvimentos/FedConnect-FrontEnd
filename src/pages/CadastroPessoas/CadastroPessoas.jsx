// src/pages/CadastroPessoas/CadastroPessoas.jsx

import React, { useState, useMemo } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser, FaFileAlt } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import { TAB_SECTIONS } from './constants/pessoaConstants';
import { usePessoas } from '../../hooks/usePessoas';

const CadastroPessoas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identificacao');

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

  const handleVoltar = () => {
    if (!window.confirm('Deseja realmente sair? Os dados não salvos serão perdidos.')) {
      return;
    }
    navigate('/cadastro-pessoas');
  };

  const handleLimpar = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os campos?')) {
      clearForm();
      enqueueSnackbar('Campos limpos', { variant: 'info' });
    }
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

    // console.log('Dados do formulário:', formData);
    const result = await save();
    // console.log('Resultado do save():', result);

    if (!result.success) {
      const errorMessages = Object.values(errors).join(', ');
      enqueueSnackbar(`❌ ${errorMessages}`, { variant: 'error' });
      return;
    }

    enqueueSnackbar('✅ Pessoa cadastrada com sucesso!', { variant: 'success' });
    navigate('/cadastro-pessoas');
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
              <S.SecondaryButton type="button" onClick={handleLimpar} disabled={!canLimpar}>
                <FaEraser /> Limpar
              </S.SecondaryButton>
              <S.DangerButton type="button" onClick={handleVoltar}>
                <FaSignOutAlt /> Voltar
              </S.DangerButton>
            </S.HeaderActions>
          </S.CardHeader>

          <S.Form onSubmit={handleSubmit}>
            <PessoaFormTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={TAB_SECTIONS} />

            <PessoaFormFields
              data={formData}
              errors={errors}
              disabled={false}
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
    </PageLayout>
  );
};

export default CadastroPessoas;