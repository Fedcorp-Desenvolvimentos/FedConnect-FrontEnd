// src/pages/CadastroPessoas/CadastroPessoas.jsx

import React, { useState, useEffect } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser, FaFileAlt } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import { usePessoas } from './hooks/usePessoas';
import { useProdutos } from './hooks/useProdutos';

const TAB_SECTIONS = [
  { key: 'identificacao', label: 'Identificação', icon: <FaFileAlt /> },
  { key: 'endereco', label: 'Endereço', icon: <FaFileAlt /> },
  { key: 'bancario', label: 'Dados Bancários', icon: <FaFileAlt /> },
  { key: 'contato', label: 'Contato', icon: <FaFileAlt /> },
  { key: 'configuracoes', label: 'Configurações', icon: <FaFileAlt /> },
];

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
    simulateSave,
    gerentes,
  } = usePessoas(true);

  const { produtos } = useProdutos();

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

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formData.categoria) {
      enqueueSnackbar('⚠️ Selecione uma categoria', { variant: 'warning' });
      return;
    }

    // console.log('Dados do formulário:', formData);

    // const result = await simulateSave();

    // if (!result.success) {
    //   enqueueSnackbar('Erro ao salvar. Verifique os campos obrigatórios.', { variant: 'error' });
    //   return;
    // }

    // enqueueSnackbar('✅ Pessoa cadastrada com sucesso!', { variant: 'success' });
    // navigate('/cadastro-pessoas');
  };

  return (
    <PageLayout
      title="Novo Cadastro"
      subtitle="Preencha os dados da nova pessoa"
    >
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
            <PessoaFormTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={TAB_SECTIONS}
            />

            <PessoaFormFields
              data={formData}
              errors={errors}
              disabled={false}
              onChange={updateField}
              onBuscarCep={handleBuscarCep}
              activeTab={activeTab}
              produtos={produtos}
              gerentes={gerentes}
            />

            <S.FormActions>
              <S.SuccessButton type="submit" disabled={isSubmitting}>
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