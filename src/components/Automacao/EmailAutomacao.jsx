// EmailAutomationPage.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import PageTemplate from "../PageTemplate/PageTemplate";
import { 
  TbMail, 
  TbSend, 
  TbClock, 
  TbHistory,
  TbTrash,
  TbEye,
  TbCalendarEvent
} from "react-icons/tb";
import { useSnackbar } from "notistack";
import "./EmailAutomation.css";

const EmailAutomacao = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [emailsFila, setEmailsFila] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedModelo, setSelectedModelo] = useState("");
  const [showAgendador, setShowAgendador] = useState(false);
  const [agendamentoData, setAgendamentoData] = useState({
    data: "",
    hora: "",
    recorrencia: "nenhuma"
  });
  const [emailData, setEmailData] = useState({
    assunto: "",
    destinatarios: [],
    anexos: [],
    corpo: ""
  });
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    carregarModelos();
    carregarFilaEmails();
  }, []);

  const carregarModelos = async () => {
    setModelos([
      { id: 1, nome: "Fatura Mensal - Condomínios", assunto: "Fatura {mes_referencia} - {condominio_nome}", corpo: "Prezados, segue em anexo a fatura referente ao mês de {mes_referencia}..." },
      { id: 2, nome: "Segunda Via - Fatura", assunto: "Segunda Via - Fatura {mes_referencia}", corpo: "Conforme solicitado, segue em anexo a segunda via da fatura..." },
      { id: 3, nome: "Comprovante de Pagamento", assunto: "Comprovante - Pagamento Fatura {mes_referencia}", corpo: "Confirmamos o recebimento do pagamento referente à fatura..." },
      { id: 4, nome: "Aviso de Vencimento", assunto: "Vencimento Próximo - Fatura {mes_referencia}", corpo: "Informamos que a fatura vence em {data_vencimento}..." }
    ]);
  };

  const carregarFilaEmails = async () => {
    setEmailsFila([
      { id: 1, assunto: "Fatura Novembro - Condomínio Solar", destinatarios: ["financeiro@solar.com.br"], status: "pendente", data_agendamento: "2024-11-25 10:00", anexos: 2 },
      { id: 2, assunto: "Fatura Novembro - Condomínio Parque", destinatarios: ["contato@parque.com.br"], status: "enviado", data_envio: "2024-11-24 14:30", anexos: 1 },
      { id: 3, assunto: "Aviso Vencimento - Condomínio Centro", destinatarios: ["adm@centro.com.br"], status: "erro", data_agendamento: "2024-11-26 09:00", anexos: 1, erro: "E-mail inválido" }
    ]);
  };

  const handleModeloChange = (modeloId) => {
    const modelo = modelos.find(m => m.id === parseInt(modeloId));
    if (modelo) {
      setSelectedModelo(modeloId);
      setEmailData(prev => ({
        ...prev,
        assunto: modelo.assunto,
        corpo: modelo.corpo
      }));
      enqueueSnackbar(`Modelo "${modelo.nome}" carregado!`, { variant: "info" });
    }
  };

  const handleSendEmails = async () => {
    if (!emailData.destinatarios.length) {
      enqueueSnackbar("Adicione pelo menos um destinatário", { variant: "warning" });
      return;
    }

    if (!emailData.assunto || !emailData.corpo) {
      enqueueSnackbar("Preencha assunto e corpo do e-mail", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        enqueueSnackbar(`✅ ${emailData.destinatarios.length} e-mail(s) enviado(s) com sucesso!`, { 
          variant: "success",
          autoHideDuration: 4000
        });
        setEmailData({
          assunto: "",
          destinatarios: [],
          anexos: [],
          corpo: ""
        });
        setSelectedModelo("");
        carregarFilaEmails();
      }, 1500);
    } catch (error) {
      enqueueSnackbar("Erro ao enviar e-mails", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleEmails = async () => {
    if (!emailData.destinatarios.length) {
      enqueueSnackbar("Adicione pelo menos um destinatário", { variant: "warning" });
      return;
    }

    if (!emailData.assunto || !emailData.corpo) {
      enqueueSnackbar("Preencha assunto e corpo do e-mail", { variant: "warning" });
      return;
    }

    if (!agendamentoData.data || !agendamentoData.hora) {
      enqueueSnackbar("Selecione data e hora para o agendamento", { variant: "warning" });
      return;
    }

    setLoading(true);
    try {
      setTimeout(() => {
        enqueueSnackbar(`⏰ E-mail agendado para ${agendamentoData.data} às ${agendamentoData.hora}`, { 
          variant: "success",
          autoHideDuration: 4000
        });
        setShowAgendador(false);
        setEmailData({
          assunto: "",
          destinatarios: [],
          anexos: [],
          corpo: ""
        });
        setSelectedModelo("");
        setAgendamentoData({ data: "", hora: "", recorrencia: "nenhuma" });
        carregarFilaEmails();
      }, 1500);
    } catch (error) {
      enqueueSnackbar("Erro ao agendar e-mail", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  const addDestinatario = (email) => {
    if (email && !emailData.destinatarios.includes(email)) {
      setEmailData(prev => ({
        ...prev,
        destinatarios: [...prev.destinatarios, email]
      }));
    }
  };

  const removeDestinatario = (email) => {
    setEmailData(prev => ({
      ...prev,
      destinatarios: prev.destinatarios.filter(d => d !== email)
    }));
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pendente': return <TbClock className="status-pendente" />;
      case 'enviado': return <TbSend className="status-enviado" />;
      case 'erro': return <TbTrash className="status-erro" />;
      default: return <TbClock />;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pendente': return 'Agendado';
      case 'enviado': return 'Enviado';
      case 'erro': return 'Erro';
      default: return status;
    }
  };

  return (
    <PageTemplate
      title="Automação de E-mails"
      subtitle="Envie, agende e automatize o envio de e-mails para condomínios"
      icon={<TbMail />}
      className="email-automation-page"
    >
      <div className="email-automation-content">
        {/* Layout em coluna única com largura máxima */}
        <div className="automation-container">
          
          {/* Card Principal - Envio e Agendamento */}
          <div className="automation-card main-card">
            <div className="card-header">
              <TbSend className="card-icon" />
              <h2>Novo E-mail</h2>
              <span className="badge">Faturamento</span>
            </div>
            
            <div className="card-body">
              <div className="two-columns">
                {/* Coluna Esquerda - Formulário */}
                <div className="form-column">
                  {/* Seleção de modelo */}
                  <div className="form-group">
                    <label>📄 Modelo rápido</label>
                    <select 
                      value={selectedModelo} 
                      onChange={(e) => handleModeloChange(e.target.value)}
                      className="form-select"
                    >
                      <option value="">Selecione um modelo...</option>
                      {modelos.map(modelo => (
                        <option key={modelo.id} value={modelo.id}>{modelo.nome}</option>
                      ))}
                    </select>
                  </div>

                  {/* Destinatários */}
                  <div className="form-group">
                    <label>✉️ Destinatários</label>
                    <div className="destinatarios-input">
                      <input 
                        type="email"
                        placeholder="Digite o e-mail e pressione Enter"
                        onKeyPress={(e) => {
                          if(e.key === 'Enter') {
                            addDestinatario(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="form-input"
                      />
                    </div>
                    <div className="destinatarios-list">
                      {emailData.destinatarios.map(email => (
                        <span key={email} className="destinatario-tag">
                          {email}
                          <button onClick={() => removeDestinatario(email)}>×</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Assunto */}
                  <div className="form-group">
                    <label>📝 Assunto</label>
                    <input 
                      type="text"
                      value={emailData.assunto}
                      onChange={(e) => setEmailData({...emailData, assunto: e.target.value})}
                      placeholder="Assunto do e-mail..."
                      className="form-input"
                    />
                  </div>

                  {/* Anexos */}
                  <div className="form-group">
                    <label>📎 Anexos</label>
                    <input 
                      type="file"
                      multiple
                      onChange={(e) => setEmailData({...emailData, anexos: Array.from(e.target.files)})}
                      className="form-file"
                    />
                    {emailData.anexos.length > 0 && (
                      <div className="anexos-list">
                        {emailData.anexos.map((file, idx) => (
                          <span key={idx} className="anexo-tag">{file.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Coluna Direita - Corpo do Email */}
                <div className="corpo-column">
                  <div className="form-group">
                    <label>📄 Corpo do e-mail</label>
                    <textarea 
                      value={emailData.corpo}
                      onChange={(e) => setEmailData({...emailData, corpo: e.target.value})}
                      placeholder="Digite o conteúdo do e-mail... Use {variaveis} para personalização"
                      rows={12}
                      className="form-textarea"
                    />
                  </div>
                </div>
              </div>

              {/* Modal de Agendamento */}
              {showAgendador && (
                <div className="modal-overlay" onClick={() => setShowAgendador(false)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                      <TbCalendarEvent />
                      <h3>Agendar Envio</h3>
                      <button className="modal-close" onClick={() => setShowAgendador(false)}>×</button>
                    </div>
                    <div className="modal-body">
                      <div className="form-group">
                        <label>Data</label>
                        <input 
                          type="date"
                          value={agendamentoData.data}
                          onChange={(e) => setAgendamentoData({...agendamentoData, data: e.target.value})}
                          className="form-input"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div className="form-group">
                        <label>Hora</label>
                        <input 
                          type="time"
                          value={agendamentoData.hora}
                          onChange={(e) => setAgendamentoData({...agendamentoData, hora: e.target.value})}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Recorrência</label>
                        <select 
                          value={agendamentoData.recorrencia}
                          onChange={(e) => setAgendamentoData({...agendamentoData, recorrencia: e.target.value})}
                          className="form-select"
                        >
                          <option value="nenhuma">Apenas uma vez</option>
                          <option value="diario">Diário</option>
                          <option value="semanal">Semanal</option>
                          <option value="mensal">Mensal</option>
                        </select>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-outline" onClick={() => setShowAgendador(false)}>
                        Cancelar
                      </button>
                      <button className="btn btn-primary" onClick={handleScheduleEmails} disabled={loading}>
                        {loading ? "Agendando..." : "Confirmar Agendamento"}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Botões de ação */}
              <div className="button-group">
                <button 
                  className="btn btn-primary"
                  onClick={handleSendEmails}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "📤 Enviar Agora"}
                </button>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowAgendador(true)}
                >
                  <TbClock /> Agendar
                </button>
                <button 
                  className="btn btn-icon"
                  onClick={() => setShowPreview(!showPreview)}
                  title="Visualizar"
                >
                  <TbEye />
                </button>
              </div>

              {/* Preview do e-mail */}
              {showPreview && (
                <div className="email-preview">
                  <h4>Preview do E-mail</h4>
                  <div className="preview-subject">
                    <strong>Assunto:</strong> {emailData.assunto || "Sem assunto"}
                  </div>
                  <div className="preview-body">
                    <strong>Corpo:</strong>
                    <div className="preview-content">
                      {emailData.corpo || "Sem conteúdo"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Card - Histórico e Fila (Abaixo) */}
          <div className="automation-card history-card">
            <div className="card-header">
              <TbHistory className="card-icon" />
              <h2>Histórico e Agendamentos</h2>
              <button className="btn-refresh" onClick={carregarFilaEmails}>
                <TbClock />
              </button>
            </div>
            
            <div className="card-body">
              <div className="emails-list">
                {emailsFila.length === 0 ? (
                  <div className="empty-state">
                    <TbMail size={40} />
                    <p>Nenhum e-mail agendado ou enviado</p>
                  </div>
                ) : (
                  emailsFila.map(email => (
                    <div key={email.id} className="email-item">
                      <div className="email-status">
                        {getStatusIcon(email.status)}
                      </div>
                      <div className="email-info">
                        <div className="email-assunto">{email.assunto}</div>
                        <div className="email-destinatarios">
                          Para: {email.destinatarios.join(", ")}
                        </div>
                        <div className="email-meta">
                          {email.status === 'pendente' && (
                            <span>📅 Agendado para: {email.data_agendamento}</span>
                          )}
                          {email.status === 'enviado' && (
                            <span>✅ Enviado em: {email.data_envio}</span>
                          )}
                          {email.status === 'erro' && (
                            <span className="error-meta">❌ Erro: {email.erro}</span>
                          )}
                          {email.anexos && (
                            <span>📎 {email.anexos} anexo(s)</span>
                          )}
                        </div>
                      </div>
                      <div className="email-actions">
                        <span className={`status-badge status-${email.status}`}>
                          {getStatusText(email.status)}
                        </span>
                        {email.status === 'pendente' && (
                          <button className="btn-icon-small" title="Cancelar agendamento">
                            <TbTrash />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageTemplate>
  );
};

export default EmailAutomacao;