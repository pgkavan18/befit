import React from 'react';
import GlassCard from './GlassCard';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'var(--accent-lime)',
  trend,
  className = '',
}) => {
  return (
    <GlassCard
      hover
      className={`animate-fade-in-up ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle top-right glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: accentColor,
          opacity: 0.15,
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {Icon && (
          <div
            style={{
              padding: '10px',
              borderRadius: 'var(--border-radius)',
              background: 'rgba(255, 255, 255, 0.04)',
              color: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <h2 style={{ fontSize: '1.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {value}
        </h2>
      </div>

      {(subtitle || trend) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {trend && (
            <span
              style={{
                color: trend > 0 ? 'var(--success)' : 'var(--danger)',
                fontWeight: 600,
              }}
            >
              {trend > 0 ? `+${trend}%` : `${trend}%`}
            </span>
          )}
          {subtitle && <span>{subtitle}</span>}
        </div>
      )}
    </GlassCard>
  );
};

export default StatCard;
