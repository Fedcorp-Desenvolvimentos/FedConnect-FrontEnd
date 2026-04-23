import React from 'react';
import { 
  FaCheckCircle, 
  FaExclamationCircle, 
  FaExclamationTriangle, 
  FaInfoCircle,
  FaTimes 
} from 'react-icons/fa';
import * as S from '../CadastroStyles';

const MessageAlert = ({ type, message, onClose }) => {
  if (!message) return null;

  const icons = {
    success: <FaCheckCircle />,
    error: <FaExclamationCircle />,
    warning: <FaExclamationTriangle />,
    info: <FaInfoCircle />
  };

  return (
    <S.MessageAlert $type={type}>
      {icons[type] || icons.info}
      <span>{message}</span>
      {onClose && (
        <S.AlertClose onClick={onClose}>
          <FaTimes />
        </S.AlertClose>
      )}
    </S.MessageAlert>
  );
};

export default MessageAlert;