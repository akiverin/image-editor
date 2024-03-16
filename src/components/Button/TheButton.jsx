import React from 'react';
import PropTypes from 'prop-types';
import './TheButton.css';

const TheButton = ({ title, children, onClick, accent, className }) => {
  return (
    <button 
      className={accent ? "button button--accent "+className : "button "+className} 
      onClick={onClick}
    >
        {title&&<span className="visually-hidden">{title}</span>}
        {children}
    </button>
  );
};

TheButton.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  accent: PropTypes.bool,
  className: PropTypes.string,
};

export default TheButton;
