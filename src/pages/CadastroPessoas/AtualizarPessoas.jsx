// src/pages/CadastroPessoas/AtualizarPessoas.jsx

import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { FaUsers, FaSignOutAlt, FaSave, FaEraser, FaPen, FaTimes, FaSearch } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import * as S from './CadastroPessoasStyles';
import PessoaFormFields from './components/PessoaFormFields';
import PessoaFormTabs from './components/PessoaFormTabs';
import PessoaTable from './components/PessoaTable';
import ConfirmModal from './components/ConfirmModal';
import { TAB_SECTIONS } from './constants/pessoaConstants';
import { usePessoas } from '../../hooks/usePessoas';

const AtualizarPessoas = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('identificacao');
  const [searchInput, setSearchInput] = useState('');
  const debounceRef = useRef(null);

  const [showVoltarModal, setShowVoltarModal] = useState(false);
  const [showLimparModal, setShowLimparModal] = useState(false);
  const [showCancelarModal, setShowCancelarModal] = useState(false);
  const [showSalvarModal, setShowSalvarModal] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

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
    gerentes,
  } = usePessoas(false);

  const isFormValid = useMemo(() => {
    if (isReadOnly) return false;
    if (!formData.nome?.trim()) return false;
    if (!formData.cpf_cnpj?.trim()) return false;
    return true;
  }, [formData.nome, formData.cpf_cnpj, isReadOnly]);

  // ==================== BUSCA ====================
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

  // ==================== MODAIS ====================
  const handleVoltarClick = () => {
    if (mode !== 'view') {
      setShowVoltarModal(true);
    } else {
      navigate('/cadastro-pessoas');
    }
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

  const handleCancelarClick = () => {
    if (canCancelar) {
      setShowCancelarModal(true);
    }
  };

  const handleCancelarConfirm = () => {
    setIsConfirming(true);
    setTimeout(() => {
      cancelAction();
      setIsConfirming(false);
      setShowCancelarModal(false);
      enqueueSnackbar('Alterações descartadas', { variant: 'info' });
      setActiveTab('identificacao');
    }, 300);
  };

  const handleCancelarCancel = () => {
    setShowCancelarModal(false);
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

  const handleSelectPessoa = (codigo) => {
    selectPessoa(codigo);
    enqueueSnackbar('Pessoa selecionada para edição', { variant: 'info' });
    setActiveTab('identificacao');
  };

  // ==================== SALVAR ====================
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
    
    try {
      const result = await save();

      if (!result.success) {
        enqueueSnackbar(result.error || 'Erro ao salvar. Verifique os campos obrigatórios.', { variant: 'error' });
        setIsConfirming(false);
        setShowSalvarModal(false);
        return;
      }

      enqueueSnackbar('✅ Pessoa atualizada com sucesso!', { variant: 'success' });
      setIsConfirming(false);
      setShowSalvarModal(false);
      navigate('/cadastro-pessoas');
      
    } catch (error) {
      console.error('Erro inesperado:', error);
      enqueueSnackbar('❌ Erro inesperado ao salvar.', { variant: 'error' });
      setIsConfirming(false);
      setShowSalvarModal(false);
    }
  };

  const handleSalvarCancel = () => {
    setShowSalvarModal(false);
  };

  // ==================== CEP ====================
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

  // ==================== BUSCA NA TABELA ====================
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

  // ==================== RENDER ====================
  
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

  // TELA DE SELEÇÃO
  if (!selectedCodigo || mode === 'view') {
    return (
      <PageLayout title="Atualizar Cadastro" subtitle="Selecione uma pessoa para editar">
        <S.Container>
          <S.Card>
            <S.CardHeader>
              <S.Title>
                <FaUsers /> Atualizar Cadastro
              </S.Title>
              <S.HeaderActions>
                <S.DangerButton type="button" onClick={handleVoltarClick}>
                  <FaSignOutAlt /> Voltar
                </S.DangerButton>
              </S.HeaderActions>
            </S.CardHeader>

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

  // TELA DE EDIÇÃO
  return (
    <PageLayout title="Atualizar Cadastro" subtitle={`Editando: ${formData.nome || 'Selecionado'}`}>
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
              <S.SecondaryButton type="button" onClick={handleCancelarClick} disabled={!canCancelar}>
                <FaTimes /> Cancelar
              </S.SecondaryButton>
              <S.SecondaryButton type="button" onClick={handleLimparClick} disabled={!canLimpar}>
                <FaEraser /> Limpar
              </S.SecondaryButton>
              <S.DangerButton type="button" onClick={handleVoltarClick}>
                <FaSignOutAlt /> Voltar
              </S.DangerButton>
            </S.HeaderActions>
          </S.CardHeader>

          <S.Form onSubmit={handleSubmit}>
            <PessoaFormTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={TAB_SECTIONS} />

            <PessoaFormFields
              data={formData}
              errors={errors}
              disabled={isReadOnly}
              onChange={updateField}
              onBuscarCep={handleBuscarCep}
              activeTab={activeTab}
              gerentes={gerentes}
            />

            {!isReadOnly && (
              <S.FormActions>
                <S.SuccessButton type="submit" disabled={isSubmitting || !isFormValid}>
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

      {/* ==================== MODAIS ==================== */}
      <ConfirmModal
        isOpen={showVoltarModal}
        onConfirm={handleVoltarConfirm}
        onCancel={handleVoltarCancel}
        title="Sair da edição"
        message={
          <>
            <p>Existem alterações não salvas.</p>
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
        message={
          <>
            <p>Tem certeza que deseja limpar todos os campos?</p>
            <p style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
              <strong>Atenção:</strong> Esta ação não pode ser desfeita.
            </p>
          </>
        }
        confirmText="Limpar"
        cancelText="Cancelar"
        danger={false}
        loading={isConfirming}
      />

      <ConfirmModal
        isOpen={showCancelarModal}
        onConfirm={handleCancelarConfirm}
        onCancel={handleCancelarCancel}
        title="Cancelar edição"
        message="Deseja cancelar as alterações e voltar à visualização?"
        confirmText="Cancelar alterações"
        cancelText="Continuar editando"
        danger={false}
        loading={isConfirming}
      />

      <ConfirmModal
        isOpen={showSalvarModal}
        onConfirm={handleSalvarConfirm}
        onCancel={handleSalvarCancel}
        title="Confirmar atualização"
        message={
          <>
            <p>Deseja realmente atualizar os dados desta pessoa?</p>
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
        confirmText="Salvar"
        cancelText="Revisar dados"
        danger={false}
        loading={isConfirming}
      />
    </PageLayout>
  );
};

export default AtualizarPessoas;