import { useState, useCallback, useEffect } from 'react';
import { FaUserCircle, FaShieldAlt, FaSpinner } from 'react-icons/fa';
import { IoIosBusiness } from 'react-icons/io';
import { useSnackbar } from 'notistack';
import * as S from './MinhaContaStyles';
import PageLayout from '../../Layouts/PageLayout/PageLayout';
import Tabs from './components/Tabs';
import ProfileForm from './components/ProfileForm';
import PasswordForm from './components/PasswordForm';
import { useUserData } from './hooks/useUserData';
import { usePasswordChange } from './hooks/usePasswordChange';
import { useEditMode } from './hooks/useEditMode';
import { useLoading } from '../../hooks/useLoading';
import { UserService } from '../../services/userService';

const MinhaConta = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { startLoading, stopLoading, withLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('perfil');

  const { userData, refreshUserData } = useUserData();
  const { 
    passwordData, 
    updatePasswordField, 
    changePassword, 
    loading: passwordLoading,
    error: passwordError,
    setError: setPasswordError
  } = usePasswordChange();

  // Reset dos campos de senha
  const resetPasswordFields = useCallback(() => {
    updatePasswordField('senhaAtual', '');
    updatePasswordField('novaSenha', '');
    updatePasswordField('confirmarSenha', '');
    setPasswordError(null);
  }, [updatePasswordField, setPasswordError]);

  // Função de save para perfil
  const handleSavePerfil = useCallback(async (data) => {
    try {
      await withLoading(
        async () => {
          await UserService.updateUser(userData.userId, {
            nome_completo: data.nomeCompleto,
            cpf: data.cpf,
            email: data.email
          });
        },
        'Atualizando perfil...'
      );
      enqueueSnackbar('Perfil atualizado com sucesso!', { variant: 'success' });
      await refreshUserData();
      return true;
    } catch (err) {
      enqueueSnackbar(err.response?.data?.detail || 'Erro ao atualizar perfil', { variant: 'error' });
      return false;
    }
  }, [userData.userId, refreshUserData, enqueueSnackbar, withLoading]);

  // Função de save para senha
  const handleSaveSenha = useCallback(async (data) => {
    try {
      const success = await withLoading(
        async () => {
          return await changePassword(
            data.senhaAtual,
            data.novaSenha,
            data.confirmarSenha
          );
        },
        'Alterando senha...'
      );
      
      if (success) {
        enqueueSnackbar('Senha alterada com sucesso!', { variant: 'success' });
        resetPasswordFields();
        return true;
      } else if (passwordError) {
        enqueueSnackbar(passwordError, { variant: 'error' });
        return false;
      }
      return false;
    } catch (err) {
      enqueueSnackbar('Erro ao alterar senha', { variant: 'error' });
      return false;
    }
  }, [changePassword, passwordError, enqueueSnackbar, resetPasswordFields, withLoading]);

  // Configurar modo de edição para perfil
  const profileEdit = useEditMode(
    {
      nomeCompleto: userData.nomeCompleto || '',
      cpf: userData.cpf || '',
      email: userData.email || ''
    },
    handleSavePerfil
  );

  // Configurar modo de edição para senha
  const passwordEdit = useEditMode(
    {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    },
    handleSaveSenha,
    resetPasswordFields
  );

  const handleSalvarPerfil = async (e) => {
    e.preventDefault();
    await profileEdit.saveEditing();
  };

  const handleSalvarSenha = async (e) => {
    e.preventDefault();
    await passwordEdit.saveEditing();
  };

  return (
    <PageLayout
      title="Minha Conta"
      subtitle="Gerencie suas informações pessoais e segurança"
      icon={<IoIosBusiness />}
    >
      <S.Container>
        <S.Card>
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          <S.Content>
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
          </S.Content>
        </S.Card>
      </S.Container>
    </PageLayout>
  );
};

export default MinhaConta;