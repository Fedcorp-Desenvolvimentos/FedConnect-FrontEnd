// src/pages/CadastroPessoas/AtualizarPessoas.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser, FaPen, FaTimes, FaFileAlt, FaSearch } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import PessoaTable from './components/PessoaTable';
import { usePessoas } from './hooks/usePessoas';

const TAB_SECTIONS = [
  { key: 'identificacao', label: 'Identificação', icon: <FaFileAlt /> },
  { key: 'endereco', label: 'Endereço', icon: <FaFileAlt /> },
  { key: 'bancario', label: 'Dados Bancários', icon: <FaFileAlt /> },
  { key: 'contato', label: 'Contato', icon: <FaFileAlt /> },
  { key: 'configuracoes', label: 'Configurações', icon: <FaFileAlt /> },
  { key: 'agenciamento', label: 'Agenciamento', icon: <FaFileAlt /> },
];

const AtualizarPessoas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identificacao');
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef(null);

  const {
    pessoas,
    formData,
    errors,
    mode,
    isReadOnly,
    isSubmitting,
    loading,
    selectedCodigo,
    canAlterar,
    canCancelar,
    canLimpar,
    pagination,
    updateField,
    preencherEndereco,
    startEdit,
    cancelAction,
    clearForm,
    selectPessoa,
    save,
    goToPage,
    searchPessoas,
    produtos,
    gerentes,
  } = usePessoas(false);

  const handleSearchInput = useCallback((value) => {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2 || value.trim().length === 0) {
        searchPessoas(value.trim());
      }
    }, 400);
  }, [searchPessoas]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // ===== HANDLERS =====
  const handleVoltar = () => {
    if (mode !== 'view' && !window.confirm('Existem alterações não salvas. Deseja realmente sair?')) {
      return;
    }
    navigate('/cadastro-pessoas');
  };

  const handleAlterar = () => {
    if (!selectedCodigo) {
      enqueueSnackbar('Selecione uma pessoa primeiro', { variant: 'warning' });
      return;
    }
    startEdit();
    enqueueSnackbar('Modo de edição ativado', { variant: 'info' });
    setActiveTab('identificacao');
  };

  const handleCancelar = () => {
    cancelAction();
    enqueueSnackbar('Alterações descartadas', { variant: 'info' });
  };

  const handleLimpar = () => {
    if (window.confirm('Tem certeza que deseja limpar os campos?')) {
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

    const result = await save();

    if (!result.success) {
      enqueueSnackbar('Erro ao salvar. Verifique os campos obrigatórios.', { variant: 'error' });
      return;
    }

    enqueueSnackbar('✅ Pessoa atualizada com sucesso!', { variant: 'success' });
  };

  const handleSelectPessoa = (codigo) => {
    selectPessoa(codigo);
    enqueueSnackbar('Pessoa selecionada para edição', { variant: 'info' });
    setActiveTab('identificacao');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const term = searchInput.trim();
    if (term.length >= 2 || term.length === 0) {
      await searchPessoas(term);
      enqueueSnackbar(
        term.length > 0 ? `Buscando por: ${term}` : 'Lista atualizada',
        { variant: 'info' }
      );
    } else {
      enqueueSnackbar('Digite pelo menos 2 caracteres para buscar', { variant: 'warning' });
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    searchPessoas('');
    enqueueSnackbar('Busca limpa', { variant: 'info' });
  };

  // ===== RENDER: CARREGANDO =====
  if (loading && pessoas.length === 0) {
    return (
      <PageLayout title="Carregando...">
        <S.Container>
          <S.Card>
            <S.CardHeader>
              <S.Title>
                <FaUsers /> Carregando cadastros...
              </S.Title>
            </S.CardHeader>
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>⏳ Aguarde, carregando lista de pessoas...</p>
            </div>
          </S.Card>
        </S.Container>
      </PageLayout>
    );
  }

  // ===== RENDER: SELEÇÃO DE PESSOA =====
  if (!selectedCodigo || mode === 'view') {
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

            {/* 🔍 Barra de busca */}
            <S.SearchContainer>
              <S.SearchForm onSubmit={handleSearch}>
                <S.SearchInput
                  type="text"
                  placeholder="Buscar por nome, CPF/CNPJ ou código..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                />
                <S.SearchButton type="submit">
                  <FaSearch /> Buscar
                </S.SearchButton>
                {searchInput && (
                  <S.ClearButton type="button" onClick={handleClearSearch}>
                    ✕ Limpar
                  </S.ClearButton>
                )}
              </S.SearchForm>
              <S.ResultInfo>
                {pagination.total > 0 && (
                  <span>
                    Mostrando {pessoas.length} de {pagination.total} registros
                    {searchInput && ` (filtrado por: "${searchInput}")`}
                  </span>
                )}
              </S.ResultInfo>
            </S.SearchContainer>

            <S.SectionTitle as="h3" style={{ margin: '0 0 0.75rem 0', padding: 0 }}>
              Selecione uma pessoa para editar
            </S.SectionTitle>
            
            <PessoaTable
              pessoas={pessoas}
              selectedCodigo={selectedCodigo}
              onSelect={handleSelectPessoa}
              disabled={mode !== 'view'}
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              total={pagination.total}
              onPageChange={goToPage}
              loading={loading}
            />
          </S.Card>
        </S.Container>
      </PageLayout>
    );
  }

  // ===== RENDER: EDIÇÃO =====
  return (
    <PageLayout
      title="Atualizar Cadastro"
      subtitle={`Editando: ${formData.nome || 'Selecionado'}`}
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <FaUsers /> Atualizar Cadastro
            </S.Title>
            <S.HeaderActions>
              <S.SecondaryButton 
                type="button" 
                onClick={handleAlterar} 
                disabled={!canAlterar}
              >
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
              onBuscarCep={handleBuscarCep}
              activeTab={activeTab}
              produtos={produtos}
              gerentes={gerentes}
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

export default AtualizarPessoas;