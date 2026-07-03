import React, { useState } from 'react';
import { FaUsers, FaPlus, FaPen, FaTimes, FaEraser, FaSignOutAlt, FaSave, FaFileAlt } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import PessoaTable from './components/PessoaTable';
import { usePessoaForm } from './hooks/usePessoaForm';

const TAB_SECTIONS = [
  { key: 'identificacao', label: 'Identificação', icon: <FaFileAlt /> },
  { key: 'endereco', label: 'Endereço', icon: <FaFileAlt /> },
  { key: 'bancario', label: 'Dados Bancários', icon: <FaFileAlt /> },
  { key: 'contato', label: 'Contato', icon: <FaFileAlt /> },
  { key: 'configuracoes', label: 'Configurações', icon: <FaFileAlt /> },
  { key: 'agenciamento', label: 'Agenciamento', icon: <FaFileAlt /> },
];

const CadastroPessoas = ({ onExit, mode: propMode }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { mode: routeMode } = useParams();
  const [activeTab, setActiveTab] = useState('identificacao');

  const isEditMode = propMode === 'atualizar' || routeMode === 'atualizar';
  const isNewMode = propMode === 'novo' || routeMode === 'novo';

  const {
    pessoas,
    formData,
    errors,
    mode,
    isReadOnly,
    isSubmitting,
    selectedCodigo,
    canAlterar,
    canNovo,
    canCancelar,
    canLimpar,
    updateField,
    toggleCategoria,
    applyCategorias,
    preencherEndereco,
    startNew,
    startEdit,
    cancelAction,
    clearForm,
    selectPessoa,
    save,
    setFormData,
  } = usePessoaForm(isNewMode);

  const handleNovo = () => {
    startNew();
    enqueueSnackbar('Preencha os dados da nova pessoa', { variant: 'info' });
    setActiveTab('identificacao');
  };

  const handleAlterar = () => {
    startEdit();
    enqueueSnackbar('Modo de edição ativado', { variant: 'info' });
    setActiveTab('identificacao');
  };

  const handleCancelar = () => {
    cancelAction();
    enqueueSnackbar('Alterações descartadas', { variant: 'info' });
    if (isNewMode) {
      navigate('/cadastros/cadastro-pessoas');
    }
  };

  const handleLimpar = () => {
    if (window.confirm('Tem certeza que deseja limpar os campos?')) {
      clearForm();
      enqueueSnackbar('Campos limpos', { variant: 'info' });
    }
  };

  const handleSair = () => {
    if (mode !== 'view' && !window.confirm('Existem alterações não salvas. Deseja realmente sair?')) {
      return;
    }
    if (typeof onExit === 'function') {
      onExit();
    } else {
      navigate('/cadastros/cadastro-pessoas');
    }
  };

  const handleAplicarCategorias = () => {
    applyCategorias();
    enqueueSnackbar('Categorias aplicadas', { variant: 'success' });
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

    const { success } = await save();

    if (!success) {
      enqueueSnackbar('Preencha todos os campos obrigatórios', { variant: 'warning' });
      return;
    }

    enqueueSnackbar('✅ Pessoa cadastrada com sucesso!', { variant: 'success' });

    if (isNewMode) {
      navigate('/cadastros/cadastro-pessoas');
    }
  };

  const handleSelectPessoa = (codigo) => {
    selectPessoa(codigo);
    enqueueSnackbar('Pessoa selecionada para edição', { variant: 'info' });
  };

  // Se estiver no modo de atualização e não tiver uma pessoa selecionada, mostra a tabela
  if (isEditMode && !selectedCodigo && mode === 'view') {
    return (
      <PageLayout
        title="Atualizar Cadastro"
        subtitle="Selecione uma pessoa para editar"
      >
        <S.Container>
          <S.Card>
            <S.CardHeader>
              <S.Title>
                <FaUsers /> Atualizar Cadastro
              </S.Title>
              <S.HeaderActions>
                <S.PrimaryButton type="button" onClick={handleNovo} disabled={!canNovo}>
                  <FaPlus /> Novo
                </S.PrimaryButton>
                <S.DangerButton type="button" onClick={handleSair}>
                  <FaSignOutAlt /> Voltar
                </S.DangerButton>
              </S.HeaderActions>
            </S.CardHeader>

            <S.SectionTitle as="h3" style={{ margin: '0 0 0.75rem 0', padding: 0 }}>
              Selecione uma pessoa para editar
            </S.SectionTitle>
            <PessoaTable
              pessoas={pessoas}
              selectedCodigo={selectedCodigo}
              onSelect={handleSelectPessoa}
              disabled={mode !== 'view'}
            />
          </S.Card>
        </S.Container>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title={isNewMode ? 'Novo Cadastro' : isEditMode ? 'Atualizar Cadastro' : 'Cadastro de Pessoas'}
      subtitle={isNewMode ? 'Preencha os dados da nova pessoa' : isEditMode ? 'Edite os dados da pessoa selecionada' : 'Cadastre e gerencie as pessoas'}
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <FaUsers /> {isNewMode ? 'Novo Cadastro' : isEditMode ? 'Atualizar Cadastro' : 'Cadastro de Pessoas'}
            </S.Title>

            <S.HeaderActions>
              <S.PrimaryButton type="button" onClick={handleNovo} disabled={!canNovo}>
                <FaPlus /> Novo
              </S.PrimaryButton>
              <S.SecondaryButton type="button" onClick={handleAlterar} disabled={!canAlterar}>
                <FaPen /> Alterar
              </S.SecondaryButton>
              <S.SecondaryButton type="button" onClick={handleCancelar} disabled={!canCancelar}>
                <FaTimes /> Cancelar
              </S.SecondaryButton>
              <S.SecondaryButton type="button" onClick={handleLimpar} disabled={!canLimpar}>
                <FaEraser /> Limpar
              </S.SecondaryButton>
              <S.DangerButton type="button" onClick={handleSair}>
                <FaSignOutAlt /> Sair
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
              disabled={isReadOnly}
              onChange={updateField}
              onToggleCategoria={toggleCategoria}
              onAplicarCategorias={handleAplicarCategorias}
              onBuscarCep={handleBuscarCep}
              activeTab={activeTab}
            />

            {!isReadOnly && (
              <S.FormActions>
                <S.SuccessButton type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '⏳ Salvando...' : (
                    <>
                      <FaSave /> Salvar
                    </>
                  )}
                </S.SuccessButton>
              </S.FormActions>
            )}
          </S.Form>

          {!isNewMode && !isEditMode && (
            <>
              <S.SectionTitle as="h3" style={{ margin: '1.5rem 0 0.75rem 0', padding: 0 }}>
                Pessoas Cadastradas
              </S.SectionTitle>
              <PessoaTable
                pessoas={pessoas}
                selectedCodigo={selectedCodigo}
                onSelect={selectPessoa}
                disabled={mode !== 'view'}
              />
            </>
          )}
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default CadastroPessoas;