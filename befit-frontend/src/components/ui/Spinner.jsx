import React from 'react';

const Spinner = ({ size = 'md', fullScreen = false, label }) => {
  const spinnerClass = size === 'lg' ? 'spinner spinner-lg' : 'spinner';

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div className={spinnerClass} />
      {label && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className="loading-screen">{content}</div>;
  }

  return content;
};

export default Spinner;
