// components/MinhaConta/Messages.jsx

const Messages = ({ success, error, onClose }) => {
  if (!success && !error) return null;

  return (
    <div className="messages-container">
      {success && (
        <div className="alert alert-success" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <span>{success}</span>
          <button 
            className="alert-close" 
            onClick={onClose}
            aria-label="Fechar mensagem"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}
      
      {error && (
        <div className="alert alert-error" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <span>{error}</span>
          <button 
            className="alert-close" 
            onClick={onClose}
            aria-label="Fechar mensagem"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default Messages;