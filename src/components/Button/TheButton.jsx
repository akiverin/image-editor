import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TheButton.css';

const TheButton = ({ type, title, children, onClick, accent, className, normal, link, to, adjacent }) => {
  return (
    !link && !to ? 
    <button 
    type={type}
    className={`button ${accent ? 'button--accent' : ''} ${normal ? 'button--normal' : ''} ${adjacent ? 'button--adjacent_'+adjacent : ''} ${className}`}
    onClick={onClick}
    >
        {title&&<span className="visually-hidden">{title}</span>}
        {children}
    </button>
    :
    <Link 
      className={`button ${accent ? 'button--accent' : ''} ${normal ? 'button--normal' : ''} ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};

TheButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  accent: PropTypes.bool,
  normal: PropTypes.bool,
  className: PropTypes.string,
  type: PropTypes.string,
  link: PropTypes.string,
  to: PropTypes.object,
  adjacent: PropTypes.string,
};

export default TheButton;
