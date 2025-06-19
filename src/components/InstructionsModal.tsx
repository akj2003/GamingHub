import React, { useEffect } from 'react';
import './InstructionsModal.css';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
      // TODO: Implement robust focus management for accessibility:
      // 1. Trap focus within the modal.
      // 2. Set initial focus (e.g., to the close button or the modal container).
      // 3. Return focus to the triggering element when the modal closes.
      // The comment "Future enhancement: focus management" is noted. This is a critical part of it.
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Generate a more unique ID for ARIA
  const modalTitleId = `instructions-title-${title.replace(/\s+/g, '-').toLowerCase().replace(/[^a-z0-9-]/g, '') || 'modal'}-${Math.random().toString(36).substring(2, 9)}`;


  return (
    <div
      className="instructions-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
    >
      <div className="instructions-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="instructions-modal-header">
          <h2 id={modalTitleId}>{title}</h2>
          <button onClick={onClose} className="instructions-modal-close-btn" aria-label="Close instructions">&times;</button>
        </div>
        <div className="instructions-modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default InstructionsModal;
