import React, { useState } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser, FaPen, FaTimes, FaFileAlt } from 'react-icons/fa';
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

const CadastroPessoas = ({ onExit }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { mode: routeMode } = useParams();
  const [activeTab, setActiveTab] = useState('identificacao');

  const isEditMode = routeMode === 'atualizar';
  const isNewMode = routeMode === 'cadastrar';

  const {
    pessoas,
    formData,
    errors,
    mode,
    isReadOnly,
    isSubmitting,
    selectedCodigo,
    canAlterar,
    canCancelar,
    canLimpar,
    updateField,
    toggleCategoria,
    applyCategorias,
    preencherEndereco,
    startEdit,
    cancelAction,
    clearForm,
    selectPessoa,
    save,
  } = usePessoaForm(isNewMode);

  // ===== HANDLERS =====
  const handleVoltar = () => {
    if (mode !== 'view' && !window.confirm('Existem alterações não salvas. Deseja realmente sair?')) {
      return;
    }
    navigate('/cadastro-pessoas');
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
      navigate('/cadastro-pessoas');
    }
  };

  const handleLimpar = () => {
    if (window.confirm('Tem certeza que deseja limpar os campos?')) {
      clearForm();
      enqueueSnackbar('Campos limpos', { variant: 'info' });
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

    enqueueSnackbar('✅ Pessoa salva com sucesso!', { variant: 'success' });

    if (isNewMode) {
      navigate('/cadastro-pessoas');
    }
  };

  const handleSelectPessoa = (codigo) => {
    selectPessoa(codigo);
    enqueueSnackbar('Pessoa selecionada para edição', { variant: 'info' });
    setActiveTab('identificacao');
  };

  // ===== RENDER: MODO ATUALIZAÇÃO (seleção) =====
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
                <S.DangerButton type="button" onClick={handleVoltar}>
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

  // ===== RENDER: MODO CADASTRAR =====
  if (isNewMode) {
    return (
      <PageLayout
        title="Cadastrar"
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
                onToggleCategoria={toggleCategoria}
                onAplicarCategorias={handleAplicarCategorias}
                onBuscarCep={handleBuscarCep}
                activeTab={activeTab}
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
  }

  // ===== RENDER: MODO ATUALIZAÇÃO (edição) =====
  return (
    <PageLayout
      title="Atualizar Cadastro"
      subtitle="Edite os dados da pessoa selecionada"
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <FaUsers /> Atualizar Cadastro
            </S.Title>
            <S.HeaderActions>
              <S.SecondaryButton type="button" onClick={handleAlterar} disabled={!canAlterar}>
                <FaPen /> Alterar
              </S.SecondaryButton>
              <S.SecondaryButton type="button" onClick={handleCancelar} disabled={!canCancelar}>
                <FaTimes /> Cancelar
              </S.SecondaryButton>
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
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default CadastroPessoas;