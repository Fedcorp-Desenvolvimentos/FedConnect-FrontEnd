// pages/MinhaConta/MinhaConta.jsx
import { useState } from 'react';
import Tabs from './Tabs';
import ProfileForm from './ProfileForm';
import PasswordForm from './PasswordForm';
import Messages from './Messages';
import { useUserData } from './hooks/useUserData';
import { usePasswordChange } from './hooks/usePasswordChange';
import { useEditMode } from './hooks/useEditMode';
import { IoIosBusiness } from 'react-icons/io';
import './styles/MinhaConta.css';
import PageTemplate from '../../../PageTemplate/PageTemplate';
import { UserService } from '../../../../services/userService';

const MinhaConta = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { userData, updateUserData, loading: userLoading, refreshUserData } = useUserData();
  const { 
    passwordData, 
    updatePasswordField, 
    changePassword, 
    loading: passwordLoading,
    error: passwordError,
    setError: setPasswordError
  } = usePasswordChange(userData.userId);

  // Configurar modo de edição para perfil
  const profileEdit = useEditMode(
    {
      nomeCompleto: userData.nomeCompleto,
      cpf: userData.cpf,
      email: userData.email
    },
    async (data) => {
      try {
        await UserService.updateUser(userData.userId, {
          nome_completo: data.nomeCompleto,
          cpf: data.cpf,
          email: data.email
        });
        setSuccessMessage('Perfil atualizado com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
        await refreshUserData(); // Recarregar dados atualizados
        return true;
      } catch (err) {
        setErrorMessage(err.response?.data?.detail || 'Erro ao atualizar perfil');
        setTimeout(() => setErrorMessage(''), 5000);
        return false;
      }
    },
    (originalData) => {
      // Resetar dados no componente pai se necessário
      updateUserData('nomeCompleto', originalData.nomeCompleto);
      updateUserData('cpf', originalData.cpf);
      updateUserData('email', originalData.email);
    }
  );

  // Configurar modo de edição para senha
  const passwordEdit = useEditMode(
    {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    },
    async (data) => {
      const success = await changePassword(
        data.senhaAtual,
        data.novaSenha,
        data.confirmarSenha
      );
      
      if (success) {
        setSuccessMessage('Senha alterada com sucesso!');
        setTimeout(() => setSuccessMessage(''), 3000);
        return true;
      } else if (passwordError) {
        setErrorMessage(passwordError);
        setTimeout(() => setErrorMessage(''), 5000);
        return false;
      }
      return false;
    },
    () => {
      // Limpar campos de senha ao cancelar
      updatePasswordField('senhaAtual', '');
      updatePasswordField('novaSenha', '');
      updatePasswordField('confirmarSenha', '');
      setPasswordError(null);
    }
  );

  const clearMessages = () => {
    setSuccessMessage('');
    setErrorMessage('');
    setPasswordError(null);
  };

  // Handler para salvar perfil
  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    clearMessages();
    
    if (!userData.userId) {
      setErrorMessage('Usuário não identificado');
      return;
    }
    
    await profileEdit.saveEditing();
  };

  // Handler para salvar senha
  const handleSalvarSenha = async (e) => {
    e.preventDefault();
    clearMessages();
    await passwordEdit.saveEditing();
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

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <Messages 
            success={successMessage} 
            error={errorMessage} 
            onClose={clearMessages}
          />

          <div className="account-content">
            {activeTab === 'perfil' ? (
              <ProfileForm
                nomeCompleto={profileEdit.editedData.nomeCompleto}
                setNomeCompleto={(value) => profileEdit.updateField('nomeCompleto', value)}
                cpf={profileEdit.editedData.cpf}
                setCpf={(value) => profileEdit.updateField('cpf', value)}
                email={profileEdit.editedData.email}
                setEmail={(value) => profileEdit.updateField('email', value)}
                editandoPerfil={profileEdit.isEditing}
                onEditClick={profileEdit.startEditing}
                onCancelClick={profileEdit.cancelEditing}
                onSubmit={handleSalvarPerfil}
              />
            ) : (
              <PasswordForm
                senhaAtual={passwordEdit.editedData.senhaAtual}
                setSenhaAtual={(value) => passwordEdit.updateField('senhaAtual', value)}
                novaSenha={passwordEdit.editedData.novaSenha}
                setNovaSenha={(value) => passwordEdit.updateField('novaSenha', value)}
                confirmarSenha={passwordEdit.editedData.confirmarSenha}
                setConfirmarSenha={(value) => passwordEdit.updateField('confirmarSenha', value)}
                editandoSenha={passwordEdit.isEditing}
                onEditClick={passwordEdit.startEditing}
                onCancelClick={passwordEdit.cancelEditing}
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