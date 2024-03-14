import React from 'react';
import { Link } from 'react-router-dom';
import './ButtonIcon.css';

const ButtonIcon = ({ title, children, onClick, active, link }) => {
  return (
    !link ? 
    <button 
      className={active ? "button-icon button-icon--active" : "button-icon"} 
      onClick={onClick}
    >
        {title&&<span className="visually-hidden">{title}</span>}
        {children}
    </button> :
    <Link 
      className={active ? "button-icon button-icon--active" : "button-icon"} 
      to={{
        pathname: link,
      }}
    >
      {children}
    </Link>
  );
};

export default ButtonIcon;
