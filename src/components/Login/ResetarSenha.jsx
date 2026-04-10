// src/components/Login/ResetarSenha.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";
import "../../styles/ResetarSenha.css";

const ResetarSenha = () => {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [tokenValido, setTokenValido] = useState(false);
  const [validandoToken, setValidandoToken] = useState(true);
  
  const { token } = useParams();
  // console.log(token);
  const navigate = useNavigate();

  useEffect(() => {
    const validarToken = async () => {
      // console.log("🔍 Validando token:", token);
      
      if (!token) {
        console.error("❌ Token não fornecido");
        setTokenValido(false);
        setValidandoToken(false);
        setErro("Link de recuperação inválido.");
        return;
      }
      
      try {
        // console.log(`📡 Chamando API: /validar-token-reset/${token}/`);
        const response = await api.get(`/validar-token-reset/${token}/`);
        
        // console.log("✅ Resposta da API:", response.data);
        
        if (response.data.valid === true) {
          // console.log("🎉 Token válido! Mostrando formulário.");
          setTokenValido(true);
        } else {
          // console.log("❌ Token inválido:", response.data.detail);
          setTokenValido(false);
          setErro(response.data.detail || "Link de recuperação inválido ou expirado.");
        }
      } catch (err) {
        console.error("❌ Erro na requisição:", err);
        console.error("Detalhes do erro:", err.response?.data);
        setTokenValido(false);
        setErro(err.response?.data?.detail || "Link de recuperação inválido ou expirado.");
      } finally {
        setValidandoToken(false);
      }
    };

    validarToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    // console.log("📝 Enviando formulário...");

    if (!novaSenha || novaSenha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      // console.log("📡 Enviando nova senha para:", token);
      
      const response = await api.post("/resetar-senha/", {
        token: token,
        nova_senha: novaSenha
      });
      
      // console.log("✅ Resposta:", response.data);
      
      setMensagem("Senha redefinida com sucesso! Redirecionando para o login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("❌ Erro ao redefinir senha:", err);
      console.error("Detalhes:", err.response?.data);
      setErro(err.response?.data?.detail || "Erro ao redefinir senha.");
    } finally {
      setLoading(false);
    }
  };

  // Estado de carregamento
  if (validandoToken) {
    return (
      <div className="resetar-senha-container">
        <div className="resetar-senha-card">
          <div className="verificando-container">
            <div className="verificando-animation">
              <div className="circle-check">
                <svg className="checkmark-svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                  <path className="checkmark-check" fill="none" d="M14 27l7 7 16-16" />
                </svg>
              </div>
              <div className="pulse-ring"></div>
            </div>
            <h3 className="verificando-title">Validando link de recuperação</h3>
            <div className="verificando-steps">
              <div className="step">
                <i className="bi bi-shield-lock-fill"></i>
                <span>Verificando token...</span>
              </div>
              <div className="step">
                <i className="bi bi-hourglass-split"></i>
                <span>Checando expiração...</span>
              </div>
            </div>
            <p className="verificando-text">Por favor, aguarde um momento</p>
          </div>
        </div>
      </div>
    );
  }
  // Token inválido
  if (!tokenValido) {
    return (
      <div className="resetar-senha-container">
        <div className="resetar-senha-card">
          <div className="error-state">
            <i className="bi bi-exclamation-triangle-fill"></i>
            <h2>Link inválido ou expirado</h2>
            <p>{erro || "O link de recuperação de senha que você acessou é inválido ou já expirou."}</p>
            <button 
              className="btn-primary"
              onClick={() => navigate("/esqueci-senha")}
            >
              Solicitar novo link
            </button>
            <button 
              className="btn-secondary"
              onClick={() => navigate("/login")}
            >
              Voltar para o login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Token válido - mostrar formulário
  return (
    <div className="resetar-senha-container">
      <div className="resetar-senha-card">
        <div className="resetar-senha-logo">
          <img src="../../imagens/LOGO.png" alt="Fedcorp Logo" className="logoImg" />
        </div>

        <h1 className="resetar-senha-title">Redefinir Senha</h1>
        <p className="resetar-senha-subtitle">
          Digite sua nova senha abaixo
        </p>

        <form className="resetar-senha-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="novaSenha">
              <i className="bi bi-lock-fill"></i>
              Nova senha
            </label>
            <input
              type="password"
              id="novaSenha"
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
              disabled={loading}
              className={erro ? "error" : ""}
            />
            <small className="password-hint">
              Mínimo de 6 caracteres
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">
              <i className="bi bi-check-circle-fill"></i>
              Confirmar nova senha
            </label>
            <input
              type="password"
              id="confirmarSenha"
              placeholder="Confirme sua nova senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
              disabled={loading}
              className={erro ? "error" : ""}
            />
          </div>

          {erro && (
            <div className="error-message">
              <i className="bi bi-exclamation-circle-fill"></i>
              <span>{erro}</span>
            </div>
          )}

          {mensagem && (
            <div className="success-message">
              <i className="bi bi-check-circle-fill"></i>
              <span>{mensagem}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="bi bi-arrow-repeat spinner"></i>
                Redefinindo...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg"></i>
                Redefinir senha
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetarSenha;