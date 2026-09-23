import React from 'react';

const typeColors = {
  RUNNING: { bg: 'rgba(255, 107, 107, 0.15)', text: '#ff6b6b', border: 'rgba(255, 107, 107, 0.3)' },
  WALKING: { bg: 'rgba(78, 205, 196, 0.15)', text: '#4ecdc4', border: 'rgba(78, 205, 196, 0.3)' },
  CYCLING: { bg: 'rgba(255, 230, 109, 0.15)', text: '#ffe66d', border: 'rgba(255, 230, 109, 0.3)' },
  SWIMMING: { bg: 'rgba(0, 229, 255, 0.15)', text: '#00e5ff', border: 'rgba(0, 229, 255, 0.3)' },
  WEIGHT_TRAINING: { bg: 'rgba(173, 255, 47, 0.15)', text: '#adff2f', border: 'rgba(173, 255, 47, 0.3)' },
  YOGA: { bg: 'rgba(218, 112, 214, 0.15)', text: '#da70d6', border: 'rgba(218, 112, 214, 0.3)' },
  CARDIO: { bg: 'rgba(255, 159, 67, 0.15)', text: '#ff9f43', border: 'rgba(255, 159, 67, 0.3)' },
  STRETCHING: { bg: 'rgba(162, 155, 254, 0.15)', text: '#a29bfe', border: 'rgba(162, 155, 254, 0.3)' },
};

const Badge = ({
  children,
  type,
  variant = 'default',
  size = 'md',
  style = {},
  className = '',
}) => {
  let colorConfig = {
    bg: 'var(--bg-tertiary)',
    text: 'var(--text-secondary)',
    border: 'var(--border-glass)',
  };

  if (type && typeColors[type]) {
    colorConfig = typeColors[type];
  } else if (variant === 'success') {
    colorConfig = { bg: 'var(--success-muted)', text: 'var(--success)', border: 'var(--success)' };
  } else if (variant === 'danger') {
    colorConfig = { bg: 'var(--danger-muted)', text: 'var(--danger)', border: 'var(--danger)' };
  } else if (variant === 'warning') {
    colorConfig = { bg: 'var(--warning-muted)', text: 'var(--warning)', border: 'var(--warning)' };
  } else if (variant === 'accent') {
    colorConfig = { bg: 'var(--accent-lime-muted)', text: 'var(--accent-lime)', border: 'var(--accent-lime)' };
  }

  const padding = size === 'sm' ? '3px 8px' : '5px 12px';
  const fontSize = size === 'sm' ? '0.72rem' : '0.8rem';

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding,
        fontSize,
        fontWeight: 600,
        borderRadius: 'var(--border-radius-pill)',
        background: colorConfig.bg,
        color: colorConfig.text,
        border: `1px solid ${colorConfig.border}`,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      {children || type?.replace('_', ' ')}
    </span>
  );
};

export default Badge;
