import { TbEye, TbX, TbMail, TbPaperclip, TbUsers } from "react-icons/tb";

const PreviewModal = ({ isOpen, onClose, emailData }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-preview" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <TbEye size={20} />
          <h3>Preview do E-mail</h3>
          <button className="modal-close" onClick={onClose}>
            <TbX size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div className="preview-field">
            <label>
              <TbMail size={14} />
              Assunto:
            </label>
            <div className="preview-value">{emailData.assunto || "Sem assunto"}</div>
          </div>
          
          <div className="preview-field">
            <label>
              <TbUsers size={14} />
              Destinatários:
            </label>
            <div className="preview-value">
              {emailData.destinatarios.length > 0 
                ? emailData.destinatarios.join(", ") 
                : "Nenhum destinatário"}
            </div>
          </div>
          
          <div className="preview-field">
            <label>
              <TbPaperclip size={14} />
              Anexos:
            </label>
            <div className="preview-value">
              {emailData.anexos.length > 0 
                ? emailData.anexos.map(f => f.name).join(", ")
                : "Nenhum anexo"}
            </div>
          </div>
          
          <div className="preview-field">
            <label>Corpo do e-mail:</label>
            <div className="preview-content">
              {emailData.corpo || "Sem conteúdo"}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;