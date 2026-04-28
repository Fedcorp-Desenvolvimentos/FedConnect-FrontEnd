// pages/Cadastro/Cadastro.jsx
import{ useEffect } from 'react';
import { useEmpresas } from './hooks/useEmpresas';
import { useCadastro } from './hooks/useCadastro';
import { useFormValidation } from './hooks/useFormValidation';
import CadastroForm from './CadastroForm';
import './styles/Cadastro.css';
import PageLayout from '../../../PageLayout/PageLayout';

const Cadastro = () => {
  const { empresas, loading: loadingEmpresas, error: empresasError } = useEmpresas();
  const {
    formData,
    loading: loadingSubmit,
    success,
    error: submitError,
    handleChange,
    handleSubmit,
    resetForm
  } = useCadastro(empresas);

  const {
    errors,
    validateForm,
    clearErrors,
    getFieldError
  } = useFormValidation();

  // Validate form when empresa is selected
  useEffect(() => {
    if (empresas.length > 0 && !formData.empresa) {
      handleChange({
        target: { name: 'empresa', value: 0 }
      });
    }
  }, [empresas, formData.empresa, handleChange]);

  const onSubmit = async (e) => {
    e.preventDefault();
    clearErrors();
    
    const isValid = validateForm(formData, empresas);
    if (!isValid) return;
    
    await handleSubmit(e);
  };

  const displayError = submitError || empresasError;

  return (
    <PageLayout
        title="Cadastro de Usuário"
        subtitle="Crie uma nova conta para acessar o sistema"
    >
    <main className="cadastro-container">
     

      <div className="cadastro-layout">
        <section className="cadastro-card">
          <div className="card-header">
            <h2 className="section-title">
              <i className="bi bi-person-plus-fill"></i> Cadastrar Usuário
            </h2>
            <button 
              onClick={resetForm}
              className="btn-reset"
              title="Limpar formulário"
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </button>
          </div>

          <CadastroForm
            formData={formData}
            empresas={empresas}
            loadingEmpresas={loadingEmpresas}
            loadingSubmit={loadingSubmit}
            success={success}
            error={displayError}
            errors={errors}
            onSubmit={onSubmit}
            onChange={handleChange}
            getFieldError={getFieldError}
          />
        </section>
      </div>
    </main>
    </PageLayout>
  );
};

export default Cadastro;