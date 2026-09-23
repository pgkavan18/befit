import React from 'react';

const GlassCard = ({ children, className = '', hover = false, onClick, style = {} }) => {
  return (
    <div
      className={`glass-card ${hover ? 'glass-card-hover' : ''} ${className}`}
      onClick={onClick}
      style={{ padding: '24px', ...style }}
    >
      {children}
    </div>
  );
};

export default GlassCard;
