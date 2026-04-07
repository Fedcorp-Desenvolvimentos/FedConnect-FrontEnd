// pages/Cadastro/components/MessageAlert.jsx
import React from 'react';

const MessageAlert = ({ type, message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: 'bi-check-circle-fill',
    error: 'bi-exclamation-circle-fill',
    warning: 'bi-exclamation-triangle-fill',
    info: 'bi-info-circle-fill'
  };

  return (
    <div className={`message-alert alert-${type}`}>
      <i className={`bi ${icons[type] || icons.info}`}></i>
      <span>{message}</span>
      {onClose && (
        <button className="close-btn" onClick={onClose}>
          <i className="bi bi-x-lg"></i>
        </button>
      )}
    </div>
  );
};

export default MessageAlert;