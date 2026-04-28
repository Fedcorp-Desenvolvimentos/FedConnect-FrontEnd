import { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import * as S from './CadastroStyles';
import CadastroForm from './components/CadastroForm';
import { useEmpresas } from './hooks/useEmpresas';
import { useCadastro } from './hooks/useCadastro';
import { useFormValidation } from './hooks/useFormValidation';
import PageLayout from './../../Layouts/PageLayout/PageLayout';

const Cadastro = () => {
  const { enqueueSnackbar } = useSnackbar();

  const { empresas } = useEmpresas();

  const {
    formData,
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
    if (empresas.length > 0 && formData.empresa === '') {
      handleChange({
        target: { name: 'empresa', value: 0 }
      });
    }
  }, [empresas]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearErrors();

    const isValid = validateForm(formData, empresas);
    if (!isValid) {
      enqueueSnackbar('Preencha todos os campos corretamente', { variant: 'warning' });
      return;
    }

    await handleSubmit();
  };

  return (
    <PageLayout
      title="Cadastro de Usuário"
      subtitle="Crie uma nova conta para acessar o sistema"
    >
      <S.Container>
        <S.Card>
          <S.CardHeader>
            <S.Title>
              <i className="bi bi-person-plus-fill"></i> Cadastrar Usuário
            </S.Title>

            <S.ResetButton onClick={resetForm}>
              <i className="bi bi-arrow-counterclockwise"></i>
            </S.ResetButton>
          </S.CardHeader>

          <CadastroForm
            formData={formData}
            empresas={empresas}
            errors={errors}
            onSubmit={onSubmit}
            onChange={handleChange}
            getFieldError={getFieldError}
          />
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default Cadastro;