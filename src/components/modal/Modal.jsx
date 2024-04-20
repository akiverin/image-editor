import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, className, w80 }) => {
  const dialogRef = useRef(null);
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
      <dialog className={w80?"modal modal--w80":"modal"} ref={dialogRef} onCancel={onClose}>
        <div className="modal__head">
          <h2 className='modal__title'>{title}</h2>
          <button className="modal__close" onClick={onClose}>&#x2715;</button>
        </div>
        <div className={className?"modal__body " + className:"modal__body"}>
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
  className: PropTypes.string,
  w80: PropTypes.bool,
};

export default Modal;
