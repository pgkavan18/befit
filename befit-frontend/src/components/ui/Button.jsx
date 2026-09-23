import React from 'react';

const Button = ({
  children,
  type = 'button',
  variant = 'gradient',
  size = 'md',
  onClick,
  disabled = false,
  loading = false,
  icon: Icon,
  className = '',
  fullWidth = false,
  style = {},
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'gradient':
        return {
          background: 'var(--accent-gradient)',
          color: '#0a0a0f',
          fontWeight: 600,
          boxShadow: 'var(--shadow-glow-lime)',
        };
      case 'secondary':
        return {
          background: 'var(--bg-tertiary)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-glass)',
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'var(--accent-cyan)',
          border: '1px solid var(--accent-cyan)',
        };
      case 'danger':
        return {
          background: 'var(--danger)',
          color: '#ffffff',
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
        };
      default:
        return {};
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: '8px 14px', fontSize: '0.85rem' };
      case 'lg':
        return { padding: '14px 28px', fontSize: '1.05rem' };
      case 'md':
      default:
        return { padding: '11px 22px', fontSize: '0.95rem' };
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: 'var(--border-radius)',
    transition: 'all var(--transition-fast)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    letterSpacing: '0.02em',
    ...getVariantStyle(),
    ...getSizeStyle(),
    ...style,
  };

  return (
    <button
      type={type}
      style={baseStyle}
      onClick={onClick}
      disabled={disabled || loading}
      className={`befit-btn ${className}`}
      {...props}
    >
      {loading ? (
        <span
          className="spinner"
          style={{
            width: size === 'sm' ? '14px' : '18px',
            height: size === 'sm' ? '14px' : '18px',
            borderWidth: '2px',
          }}
        />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
