import React, { useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, className, w80, bg0 }) => {
  const dialogRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleMouseDown = (event) => {
    setIsDragging(true);
    setStartPos({
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    });
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const modalWidth = dialogRef.current.offsetWidth;
      const modalHeight = dialogRef.current.offsetHeight;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const widthBorder = (windowWidth-modalWidth)/2;
      const heightBorder = (windowHeight-modalHeight)/2;
      const cordX = event.clientX - startPos.x;
      const cordY = event.clientY - startPos.y;
        setPosition({
          x: cordX<(-1 * widthBorder)?-1 * widthBorder :
           (cordX > widthBorder ? widthBorder : cordX),
          y: cordY<(-1 * heightBorder)?-1 * heightBorder :
          (cordY > heightBorder ? heightBorder : cordY),
        });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const classModal = "modal" + (w80 ? " modal--w80" : "") + (bg0 ? " modal--bg0" : "")

  return (
      <dialog 
        className={classModal} 
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
        ref={dialogRef} 
        onCancel={onClose}
      >
        <div className="modal__head">
          <button 
            className="modal__drag-shape drag-shape"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <p className="drag-shape__label visually-hidden">Перетаскивание модального окна</p>
          </button>
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
  bg0: PropTypes.bool,
};

export default Modal;
