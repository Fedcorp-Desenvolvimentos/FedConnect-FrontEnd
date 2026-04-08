// src/pages/EsqueciSenha/EsqueciSenha.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/EsqueciSenha.css";
import api from "../../services/api";
import { useSnackbar } from "notistack";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleVoltarLogin = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (!email) {
      setErro("Por favor, informe seu e-mail.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErro("Por favor, informe um e-mail válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("solicitar-reset-senha/", { email });
      enqueueSnackbar(res?.message || "Enviamos um link de recuperação para o seu e-mail. Verifique sua caixa de entrada e spam.", {
        variant: "success",
      });
      setEmail("");
    } catch (err) {
      enqueueSnackbar(res?.message || "Falha ao solicitar recuperação de senha. Tente novamente mais tarde.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="esqueci-senha-container">
      <div className="esqueci-senha-card">
        <div className="esqueci-senha-logo">
          <img
              src="../../imagens/LOGO.png"
              alt="Fedcorp Logo"
              className="logoImg"
          />
        </div>

        <h1 className="esqueci-senha-title">Esqueceu sua senha?</h1>
        <p className="esqueci-senha-subtitle">
          Recupere o acesso à sua conta
        </p>

        <div className="esqueci-senha-info-box">
          <i className="bi bi-info-circle-fill"></i>
          <p>
            Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
          </p>
        </div>

        <form className="esqueci-senha-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <i className="bi bi-envelope-fill"></i>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={loading}
              className={erro ? "error" : ""}
            />
          </div>

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
                Enviando...
              </>
            ) : (
              <>
                <i className="bi bi-envelope-paper-fill"></i>
                Enviar link de recuperação
              </>
            )}
          </button>
        </form>

        <button
          type="button"
          className="btn-back"
          onClick={handleVoltarLogin}
        >
          <i className="bi bi-arrow-left"></i>
          Voltar para o login
        </button>
      </div>
    </div>
  );
};

export default EsqueciSenha;