import Modal from "react-modal";
import { FiX } from "react-icons/fi";
import "../../styles/Modal.css";

const BaseModal = ({ isOpen, onClose, title, children, size = "md" }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={`modal-content modal-${size}`}
      overlayClassName="modal-overlay"
      contentLabel={title}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
    >
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="modal-close-btn" onClick={onClose} title="Fechar">
          <FiX size={20} />
        </button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </Modal>
  );
};

export default BaseModal;