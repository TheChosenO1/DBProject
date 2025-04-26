import React from 'react';
import './Button.css';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`custom-button ${className}`}
    >
      {children}
    </button>
  );
};

export default Button; 