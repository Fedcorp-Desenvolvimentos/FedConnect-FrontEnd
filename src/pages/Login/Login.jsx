import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLoading } from '../../hooks/useLoading';
import * as S from './LoginStyles';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const { startLoading, stopLoading, updateProgress } = useLoading();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        startLoading();
        try {
            const result = await login({ email, password });

            if (result.success) {
                updateProgress(100);
                await new Promise(resolve => setTimeout(resolve, 300));
                navigate('/home');
            } else {
                setError(result.error || 'Falha no login. Verifique suas credenciais.');
                stopLoading();
            }
        } catch (err) {
            setError('Ocorreu um erro inesperado durante o login.');
            console.error('Erro de login no componente:', err);
        } finally {
            stopLoading();
        }
    };

    return (
        <>
            <S.GradientBg />
            <S.LoginWrapper>
                <S.LoginContainer>
                    <S.LoginBox>
                        <S.LogoImg 
                            src="/imagens/LOGO.png"
                            alt="Fedcorp Logo"
                        />
                        
                        <S.Title>FedConnect</S.Title>
                        <S.Subtitle>Insira seus dados para acessar a plataforma</S.Subtitle>

                        <S.Form onSubmit={handleSubmit}>
                            <S.InputGroup>
                                <S.Label htmlFor="email">E-mail:</S.Label>
                                <S.Input
                                    type="email"
                                    id="email"
                                    placeholder="Digite seu e-mail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </S.InputGroup>

                            <S.InputGroup>
                                <S.Label htmlFor="senha">Senha:</S.Label>
                                <S.PasswordWrapper>
                                    <S.Input
                                        type={showPassword ? "text" : "password"}
                                        id="senha"
                                        placeholder="Digite sua senha"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <S.TogglePasswordButton
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                                    </S.TogglePasswordButton>
                                </S.PasswordWrapper>
                            </S.InputGroup>

                            {error && (
                                <S.ErrorMessage>
                                    {error}
                                </S.ErrorMessage>
                            )}

                            <S.LoginButton type="submit">
                                Entrar
                            </S.LoginButton>

                            <S.ForgotPassword href="/recuperar-senha">
                                Esqueceu sua senha?
                            </S.ForgotPassword>
                        </S.Form>
                    </S.LoginBox>
                </S.LoginContainer>
            </S.LoginWrapper>
        </>
    );
};

export default Login;