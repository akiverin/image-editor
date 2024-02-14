import React from 'react';
import './ButtonIcon.css';

const ButtonIcon = ({ label, title, children }) => {

  return (
    <button className="button-icon">
        {title&&<span className="visually-hidden">{title}</span>}
        {children}
    </button>
  );
};

export default ButtonIcon;
