import React, { useState } from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  required = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', ...style }}>
      {label && (
        <label
          htmlFor={id}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: error ? 'var(--danger)' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          {label} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
        </label>
      )}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(26, 26, 46, 0.8)',
          border: `1px solid ${
            error
              ? 'var(--danger)'
              : focused
              ? 'var(--accent-cyan)'
              : 'var(--border-glass)'
          }`,
          borderRadius: 'var(--border-radius)',
          boxShadow: focused
            ? error
              ? '0 0 12px var(--danger-muted)'
              : '0 0 12px var(--accent-cyan-muted)'
            : 'none',
          transition: 'all var(--transition-fast)',
        }}
      >
        {Icon && (
          <div
            style={{
              paddingLeft: '14px',
              display: 'flex',
              alignItems: 'center',
              color: focused ? 'var(--accent-cyan)' : 'var(--text-muted)',
              transition: 'color var(--transition-fast)',
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '12px 14px 12px 10px' : '12px 14px',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.95rem',
          }}
          className={className}
          {...props}
        />
      </div>
      {error && (
        <span
          style={{
            fontSize: '0.8rem',
            color: 'var(--danger)',
            marginTop: '2px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
