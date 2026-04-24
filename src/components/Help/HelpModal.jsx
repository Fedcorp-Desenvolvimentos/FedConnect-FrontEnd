// src/components/Help/HelpModal.jsx

import React from 'react';
import { FaTimes, FaLightbulb, FaQuestionCircle, FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';
import * as S from './HelpModalStyles';

const HelpModal = ({ 
  isOpen, 
  onClose, 
  title = "Guia Rápido",
  icon = <FaLightbulb />,
  content,
  type = "info" // info, warning, tip
}) => {
  if (!isOpen) return null;

  const getIconByType = () => {
    switch (type) {
      case 'warning':
        return <FaExclamationTriangle />;
      case 'tip':
        return <FaLightbulb />;
      default:
        return <FaInfoCircle />;
    }
  };

  const renderContent = () => {
    if (typeof content === 'string') {
      return <p>{content}</p>;
    }
    return content;
  };

  return (
    <S.ModalOverlay onClick={onClose}>
      <S.ModalContent onClick={(e) => e.stopPropagation()}>
        <S.ModalHeader $type={type}>
          <S.ModalTitleWrapper>
            {icon || getIconByType()}
            <S.ModalTitle>{title}</S.ModalTitle>
          </S.ModalTitleWrapper>
          <S.ModalClose onClick={onClose}>
            <FaTimes />
          </S.ModalClose>
        </S.ModalHeader>
        
        <S.ModalBody>
          {renderContent()}
        </S.ModalBody>
        
        <S.ModalFooter>
          <S.ModalButton onClick={onClose}>
            Entendi
          </S.ModalButton>
        </S.ModalFooter>
      </S.ModalContent>
    </S.ModalOverlay>
  );
};

export default HelpModal;