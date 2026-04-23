import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import * as S from './CadastroStyles';
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import CadastroForm from './components/CadastroForm';
import { useEmpresas } from './hooks/useEmpresas';
import { useCadastro } from './hooks/useCadastro';
import { useFormValidation } from './hooks/useFormValidation';

const Cadastro = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { empresas, loading: loadingEmpresas, error: empresasError } = useEmpresas();
  const {
    formData,
    loading: loadingSubmit,
    handleChange,
    handleSubmit,
    resetForm
  } = useCadastro(empresas, enqueueSnackbar);

  const {
    errors,
    validateForm,
    clearErrors,
    getFieldError
  } = useFormValidation();

  useEffect(() => {
    if (empresas.length > 0 && !formData.empresa && formData.empresa !== 0) {
      handleChange({
        target: { name: 'empresa', value: 0 }
      });
    }
  }, [empresas, formData.empresa, handleChange]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
    const isValid = validateForm(formData, empresas);
    if (!isValid) {
      enqueueSnackbar('Preencha todos os campos corretamente', { variant: 'warning' });
      return;
    }
    
    await handleSubmit(e);
  };

  if (loadingEmpresas) {
    return (
      <PageTemplate title="Cadastro de Usuário" subtitle="Crie uma nova conta para acessar o sistema">
        <S.LoadingContainer>
          <FaSpinner className="spinner" />
          <p>Carregando dados...</p>
        </S.LoadingContainer>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Cadastro de Usuário"
      subtitle="Crie uma nova conta para acessar o sistema"
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <i className="bi bi-person-plus-fill"></i> Cadastrar Usuário
            </S.Title>
            <S.ResetButton onClick={resetForm} title="Limpar formulário">
              <i className="bi bi-arrow-counterclockwise"></i>
            </S.ResetButton>
          </S.CardHeader>

          <CadastroForm
            formData={formData}
            empresas={empresas}
            loadingEmpresas={loadingEmpresas}
            loadingSubmit={loadingSubmit}
            errors={errors}
            onSubmit={onSubmit}
            onChange={handleChange}
            getFieldError={getFieldError}
          />
        </S.Card>
      </S.Container>
    </PageTemplate>
  );
};

export default Cadastro;