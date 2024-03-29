import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
      <dialog className="modal" ref={dialogRef} onCancel={onClose}>
        <div className="modal__head">
          <h2 className='modal__title'>{title}</h2>
          <button className="modal__close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className="modal__body">
          {children}
        </div>
      </dialog>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool,
  children: PropTypes.node,
  title: PropTypes.string,
  onClose: PropTypes.func,
};

export default Modal;
