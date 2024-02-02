import React, { useEffect, useCallback } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {

    const closeModal = useCallback(() => {
        onClose();
      }, [onClose]);
    
      const handleEscape = useCallback((event) => {
        if (event.keyCode === 27) {
          closeModal();
        }
      }, [closeModal]);
    
      useEffect(() => {
        if (isOpen) {
          document.addEventListener('keydown', handleEscape, false); 
        } else {
          document.removeEventListener('keydown', handleEscape, false); 
        }
    
        return () => {
          document.removeEventListener('keydown', handleEscape, false);
        };
      }, [isOpen, handleEscape,]);

      const handleOutsideClick = useCallback((event) => {
        if (!event.target.closest('.modal-content')) { 
          closeModal();
        }
      }, [closeModal]);

  return (
    <>
      {isOpen && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            {children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
