import React from 'react';
import GlassCard from './ui/GlassCard';
import Badge from './ui/Badge';
import { TrendingUp, Lightbulb, ShieldAlert, Calendar } from 'lucide-react';

const RecommendationCard = ({ recommendation }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <GlassCard
      hover
      className="animate-fade-in-up"
      style={{
        borderLeft: '4px solid var(--accent-lime)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {recommendation.type ? (
            <Badge type={recommendation.type} />
          ) : (
            <Badge variant="accent">General Advice</Badge>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
          }}
        >
          <Calendar size={13} />
          <span>{formatDate(recommendation.createdAt)}</span>
        </div>
      </div>

      {recommendation.recommendation && (
        <p style={{ fontSize: '0.92rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
          {recommendation.recommendation}
        </p>
      )}

      {/* Improvements */}
      {recommendation.improvements && recommendation.improvements.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--success)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <TrendingUp size={15} />
            <span>Target Improvements</span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recommendation.improvements.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  listStyleType: 'disc',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {recommendation.suggestions && recommendation.suggestions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--accent-cyan)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <Lightbulb size={15} />
            <span>Workout Suggestions</span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recommendation.suggestions.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  listStyleType: 'disc',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Safety Tips */}
      {recommendation.safety && recommendation.safety.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--warning)',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            <ShieldAlert size={15} />
            <span>Safety & Recovery</span>
          </div>
          <ul style={{ paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {recommendation.safety.map((item, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)',
                  listStyleType: 'disc',
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </GlassCard>
  );
};

export default RecommendationCard;
