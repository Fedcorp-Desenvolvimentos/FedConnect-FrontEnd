// pages/MinhaConta/MinhaConta.jsx
import { useState } from 'react';
import Tabs from './Tabs';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Messages from './Messages';
import { useUserData } from './hooks/useUserData';
import { usePasswordChange } from './hooks/usePasswordChange';
import { IoIosBusiness } from 'react-icons/io';
import './styles/MinhaConta.css';
import PageTemplate from '../../../PageTemplate/PageTemplate';
import { UserService } from '../../../../services/userService';

const MinhaConta = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [editandoPerfil, setEditandoPerfil] = useState(false);
  const [editandoSenha, setEditandoSenha] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { userData, updateUserData, loading: userLoading } = useUserData();
  const { 
    passwordData, 
    updatePasswordField, 
    changePassword, 
    loading: passwordLoading,
    error: passwordError,
    setError: setPasswordError
  } = usePasswordChange(userData.userId);

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
    setPasswordError(null);
  };

  // Funções para ativar modo de edição
  const handleEditPerfil = () => {
    setEditandoPerfil(true);
    clearMessages();
  };

  const handleEditSenha = () => {
    setEditandoSenha(true);
    clearMessages();
  };

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    clearMessages();

    if (!userData.userId) {
      setErrorMessage('Usuário não identificado');
      return;
    }

    try {
      const updatedData = {
        nome_completo: userData.nomeCompleto,
        cpf: userData.cpf,
        email: userData.email,
      };
      
      await UserService.updateUser(userData.userId, updatedData);
      setSuccessMessage('Perfil atualizado com sucesso!');
      setEditandoPerfil(false);
      
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err.response?.data?.detail || 'Erro ao atualizar perfil');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleSalvarSenha = async (e) => {
    e.preventDefault();
    clearMessages();

    const success = await changePassword();
    if (success) {
      setSuccessMessage('Senha alterada com sucesso!');
      setEditandoSenha(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    } else if (passwordError) {
      setErrorMessage(passwordError);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  // Função para cancelar edição (opcional, mas útil)
  const handleCancelarPerfil = () => {
    // Recarregar dados originais
    window.location.reload(); // Ou recarregar os dados via API
  };

  if (userLoading) {
    return (
      <PageTemplate
        title="Minha Conta"
        subtitle="Gerencie suas informações"
        icon={<IoIosBusiness />}
      >
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando seus dados...</p>
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate
      title="Configurações da Conta"
      subtitle="Gerencie suas informações pessoais e segurança"
      icon={<IoIosBusiness />}
      className="minha-conta-page"
    >
      <div className="account-container">
        <div className="account-card">
          <div className="account-header">
            <h1>
              <i className="bi bi-sliders2"></i>
              Preferências da Conta
            </h1>
            <p className="account-subtitle">
              Mantenha seus dados sempre atualizados
            </p>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <Messages 
            success={successMessage} 
            error={errorMessage} 
            onClose={clearMessages}
          />

          <div className="account-content">
            {activeTab === 'perfil' ? (
              <ProfileForm
                nomeCompleto={userData.nomeCompleto}
                setNomeCompleto={(value) => updateUserData('nomeCompleto', value)}
                cpf={userData.cpf}
                setCpf={(value) => updateUserData('cpf', value)}
                email={userData.email}
                setEmail={(value) => updateUserData('email', value)}
                editandoPerfil={editandoPerfil}
                onEditClick={handleEditPerfil} 
                onSubmit={handleSalvarPerfil}
              />
            ) : (
              <PasswordForm
                senhaAtual={passwordData.senhaAtual}
                setSenhaAtual={(value) => updatePasswordField('senhaAtual', value)}
                novaSenha={passwordData.novaSenha}
                setNovaSenha={(value) => updatePasswordField('novaSenha', value)}
                confirmarSenha={passwordData.confirmarSenha}
                setConfirmarSenha={(value) => updatePasswordField('confirmarSenha', value)}
                editandoSenha={editandoSenha}
                onEditClick={handleEditSenha} 
                onSubmit={handleSalvarSenha}
              />
            )}
          </div>
        </div>
      </div>
    </PageTemplate>
  );
};

export default MinhaConta;