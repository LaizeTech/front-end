import React from 'react';
import './Alert.css';

const Alert = ({ type = 'error', message, onClose, show }) => {
  if (!show) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      case 'error':
      default:
        return '✕';
    }
  };

  return (
    <div className={`alert alert-${type} ${show ? 'alert-show' : ''}`}>
      <div className="alert-content">
        <span className="alert-icon">{getIcon()}</span>
        <span className="alert-message">{message}</span>
        {onClose && (
          <button className="alert-close" onClick={onClose} aria-label="Fechar alerta">
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
