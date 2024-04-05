import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ButtonIcon.css';

const ButtonIcon = ({ title, children, onClick, active, link, tooltip }) => {

  return (
    !link ? 
    <button 
      className={active ? "button-icon button-icon--active" : "button-icon"} 
      onClick={onClick}
    >
        {title&&<span className="visually-hidden">{title}</span>}
        {tooltip && <p className="button-icon__tooltip">{tooltip}</p>}
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

ButtonIcon.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
  active: PropTypes.bool,
  link: PropTypes.string,
  tooltip: PropTypes.string,
};

export default ButtonIcon;
