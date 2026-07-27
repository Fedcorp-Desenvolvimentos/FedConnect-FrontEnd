import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import PageLayout from "../../../Layouts/PageLayout/PageLayout";
import { 
  TbMail, 
  TbSend, 
  TbClock, 
  TbHistory,
  TbTrash,
  TbEye,
  TbCalendarEvent,
  TbFileDescription,
  TbUsers,
  TbPaperclip,
  TbCalendar,
  TbCalendarMonth,
  TbChevronLeft,
  TbChevronRight,
  TbX,
  TbRefresh,
  TbCheck
} from "react-icons/tb";
import { useSnackbar } from "notistack";
import "./EmailAutomation.css";

// Componentes Modais
import PreviewModalDetails from "./PreviewModalDetails";
import HistoryModal from "./HistoryModal";

const EmailAutomacao = () => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [emailsFila, setEmailsFila] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [selectedModelo, setSelectedModelo] = useState("");
  const [showAgendador, setShowAgendador] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // console.log("user", user)

  const admin = user?.nivel_acesso === "admin";

  if(!admin) {
    return (
      <PageLayout
        title="Acesso Negado"
        subtitle="Você não tem permissão para acessar esta página"
        icon={<TbMail />}
      >
        <div className="access-denied">
          <TbTrash size={48} />
          <p>Ops! Parece que você não tem acesso a esta funcionalidade.</p>
          <p>Se você acha que isso é um erro, entre em contato com o administrador do sistema.</p>
        </div>
      </PageLayout>
    );
  }
  
  // Estado para mês/ano de referência
  const [mesReferencia, setMesReferencia] = useState(() => {
    const now = new Date();
    return {
      mes: now.getMonth() + 1,
      ano: now.getFullYear(),
      nome: now.toLocaleString('pt-BR', { month: 'long' })
    };
  });
  
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

  // console.log("Dados a sero enviado:", emailData);

  // Input de destinatário temporário
  const [destinatarioInput, setDestinatarioInput] = useState("");

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

  // Navegação de mês/ano
  const navegarMes = (direcao) => {
    let novoMes = mesReferencia.mes + direcao;
    let novoAno = mesReferencia.ano;
    
    if (novoMes > 12) {
      novoMes = 1;
      novoAno++;
    } else if (novoMes < 1) {
      novoMes = 12;
      novoAno--;
    }
    
    const data = new Date(novoAno, novoMes - 1, 1);
    setMesReferencia({
      mes: novoMes,
      ano: novoAno,
      nome: data.toLocaleString('pt-BR', { month: 'long' })
    });
  };

  const handleModeloChange = (modeloId) => {
    const modelo = modelos.find(m => m.id === parseInt(modeloId));
    if (modelo) {
      setSelectedModelo(modeloId);
      // Substituir variáveis no assunto e corpo
      const mesReferenciaStr = `${mesReferencia.nome.charAt(0).toUpperCase() + mesReferencia.nome.slice(1)}/${mesReferencia.ano}`;
      
      setEmailData(prev => ({
        ...prev,
        assunto: modelo.assunto.replace('{mes_referencia}', mesReferenciaStr),
        corpo: modelo.corpo.replace(/{mes_referencia}/g, mesReferenciaStr)
      }));
      enqueueSnackbar(`Modelo "${modelo.nome}" carregado!`, { variant: "info" });
    }
  };

  // Atualizar variáveis quando mês/ano mudar
  useEffect(() => {
    if (selectedModelo) {
      const modelo = modelos.find(m => m.id === parseInt(selectedModelo));
      if (modelo) {
        const mesReferenciaStr = `${mesReferencia.nome.charAt(0).toUpperCase() + mesReferencia.nome.slice(1)}/${mesReferencia.ano}`;
        setEmailData(prev => ({
          ...prev,
          assunto: modelo.assunto.replace('{mes_referencia}', mesReferenciaStr),
          corpo: modelo.corpo.replace(/{mes_referencia}/g, mesReferenciaStr)
        }));
      }
    }
  }, [mesReferencia, selectedModelo]);

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
      // TODO: Chamar API para enviar e-mails
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

  const addDestinatario = () => {
    const email = destinatarioInput.trim();
    if (email && !emailData.destinatarios.includes(email)) {
      // Validação básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        setEmailData(prev => ({
          ...prev,
          destinatarios: [...prev.destinatarios, email]
        }));
        setDestinatarioInput("");
      } else {
        enqueueSnackbar("E-mail inválido", { variant: "warning" });
      }
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
      case 'enviado': return <TbCheck className="status-enviado" />;
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

  const headerActions = (
    <button 
      className="btn btn-outline"
      onClick={() => setShowHistory(true)}
    >
      <TbHistory size={18} /> Histórico
    </button>
  );

  return (
    <PageLayout
      title="Automação de E-mails"
      subtitle="Envie e agende e-mails para condomínios utilizando templates"
      icon={<TbMail />}
      actions={headerActions}
      className="email-automation-page"
    >
      <div className="email-automation-content">
        
        {/* Card Principal - Formulário */}
        <div className="automation-card">
          <div className="two-columns">
            
            {/* Coluna Esquerda */}
            <div className="form-column">
              
              {/* Seletor de Mês/Ano */}
              <div className="form-group">
                <label>
                  <TbCalendarMonth size={16} />
                  Mês/Ano de Referência
                </label>
                <div className="month-selector">
                  <button 
                    type="button"
                    className="month-nav-btn"
                    onClick={() => navegarMes(-1)}
                  >
                    <TbChevronLeft size={16} />
                  </button>
                  <div className="month-display">
                    <TbCalendar size={14} />
                    <span className="month-name">
                      {mesReferencia.nome.charAt(0).toUpperCase() + mesReferencia.nome.slice(1)}
                    </span>
                    <span className="month-year">{mesReferencia.ano}</span>
                  </div>
                  <button 
                    type="button"
                    className="month-nav-btn"
                    onClick={() => navegarMes(1)}
                  >
                    <TbChevronRight size={16} />
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <TbFileDescription size={16} />
                  Modelo rápido
                </label>
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

              <div className="form-group">
                <label>
                  <TbUsers size={16} />
                  Destinatários
                </label>
                <div className="destinatarios-input">
                  <input 
                    type="email"
                    value={destinatarioInput}
                    onChange={(e) => setDestinatarioInput(e.target.value)}
                    onKeyPress={(e) => {
                      if(e.key === 'Enter') {
                        addDestinatario();
                      }
                    }}
                    placeholder="Digite o e-mail e pressione Enter"
                    className="form-input"
                  />
                  <button 
                    type="button"
                    className="btn-add-destinatario"
                    onClick={addDestinatario}
                  >
                    <TbSend size={14} /> Adicionar
                  </button>
                </div>
                <div className="destinatarios-list">
                  {emailData.destinatarios.map(email => (
                    <span key={email} className="destinatario-tag">
                      <TbMail size={12} />
                      {email}
                      <button onClick={() => removeDestinatario(email)}>
                        <TbX size={14} />
                      </button>
                    </span>
                  ))}
                  {emailData.destinatarios.length === 0 && (
                    <span className="destinatarios-empty">
                      Nenhum destinatário adicionado
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>
                  <TbFileDescription size={16} />
                  Assunto
                </label>
                <input 
                  type="text"
                  value={emailData.assunto}
                  onChange={(e) => setEmailData({...emailData, assunto: e.target.value})}
                  placeholder="Assunto do e-mail..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>
                  <TbPaperclip size={16} />
                  Anexos
                </label>
                <input 
                  type="file"
                  multiple
                  onChange={(e) => setEmailData({...emailData, anexos: Array.from(e.target.files)})}
                  className="form-file"
                />
                {emailData.anexos.length > 0 && (
                  <div className="anexos-list">
                    {emailData.anexos.map((file, idx) => (
                      <span key={idx} className="anexo-tag">
                        <TbPaperclip size={12} />
                        {file.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Coluna Direita */}
            <div className="corpo-column">
              <div className="form-group">
                <label>
                  <TbFileDescription size={16} />
                  Corpo do e-mail
                </label>
                <textarea 
                  value={emailData.corpo}
                  onChange={(e) => setEmailData({...emailData, corpo: e.target.value})}
                  placeholder="Digite o conteúdo do e-mail... Use {variaveis} para personalização"
                  rows={14}
                  className="form-textarea"
                />
                {/* <div className="variaveis-hint">
                  <span>Variáveis disponíveis:</span>
                  <code>{'{condominio_nome}'}</code>
                  <code>{'{mes_referencia}'}</code>
                  <code>{'{data_vencimento}'}</code>
                  <code>{'{valor_fatura}'}</code>
                  <code>{'{numero_fatura}'}</code>
                </div> */}
              </div>
            </div>
          
          </div>

          {/* Botões de ação */}
          <div className="button-group">
            <button 
              className="btn btn-primary"
              onClick={handleSendEmails}
              disabled={loading}
            >
              {loading ? "Enviando..." : <><TbSend size={16} /> Enviar Agora</>}
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowAgendador(true)}
            >
              <TbClock size={16} /> Agendar
            </button>
            <button 
              className="btn btn-outline"
              onClick={() => setShowPreview(true)}
              title="Visualizar"
            >
              <TbEye size={16} /> Preview
            </button>
          </div>
        </div>

        {/* Modal de Agendamento */}
        {showAgendador && (
          <div className="modal-overlay" onClick={() => setShowAgendador(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <TbCalendarEvent size={20} />
                <h3>Agendar Envio</h3>
                <button className="modal-close" onClick={() => setShowAgendador(false)}>
                  <TbX size={20} />
                </button>
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

        {/* Modal de Preview */}
        <PreviewModalDetails 
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          emailData={emailData}
        />

        {/* Modal de Histórico */}
        <HistoryModal 
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          emailsFila={emailsFila}
          getStatusIcon={getStatusIcon}
          getStatusText={getStatusText}
          carregarFilaEmails={carregarFilaEmails}
        />

      </div>
    </PageLayout>
  );
};

export default EmailAutomacao;