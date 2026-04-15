import { TbHistory, TbX, TbClock, TbRefresh, TbMail, TbTrash, TbCheck } from "react-icons/tb";

const HistoryModal = ({ isOpen, onClose, emailsFila, getStatusIcon, getStatusText, carregarFilaEmails }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-history" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <TbHistory size={20} />
          <h3>Histórico e Agendamentos</h3>
          <button className="modal-close" onClick={onClose}>
            <TbX size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="history-actions">
            <button className="btn-refresh" onClick={carregarFilaEmails}>
              <TbRefresh size={14} /> Atualizar
            </button>
          </div>
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
                        <TbTrash size={14} />
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
  );
};

export default HistoryModal;