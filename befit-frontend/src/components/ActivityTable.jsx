import React, { useState } from 'react';
import Badge from './ui/Badge';
import { Flame, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const ActivityTable = ({ activities = [], emptyMessage = 'No activities recorded yet.' }) => {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '48px 24px',
          color: 'var(--text-muted)',
          background: 'rgba(255, 255, 255, 0.02)',
          borderRadius: 'var(--border-radius)',
          border: '1px dashed var(--border-glass)',
        }}
      >
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{emptyMessage}</p>
        <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>
          Log your workout or cardio session to see your progress here!
        </p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr
            style={{
              borderBottom: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <th style={{ padding: '14px 16px' }}>Activity</th>
            <th style={{ padding: '14px 16px' }}>Duration</th>
            <th style={{ padding: '14px 16px' }}>Calories</th>
            <th style={{ padding: '14px 16px' }}>Date & Time</th>
            <th style={{ padding: '14px 16px', textAlign: 'right' }}>Details</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity) => {
            const isExpanded = expandedId === activity.id;
            const hasMetrics =
              activity.additional_metrics &&
              Object.keys(activity.additional_metrics).length > 0;

            return (
              <React.Fragment key={activity.id || Math.random()}>
                <tr
                  style={{
                    borderBottom: isExpanded ? 'none' : '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background var(--transition-fast)',
                    cursor: hasMetrics ? 'pointer' : 'default',
                    fontSize: '0.92rem',
                  }}
                  onClick={() => hasMetrics && toggleExpand(activity.id)}
                  className="activity-row"
                >
                  <td style={{ padding: '16px' }}>
                    <Badge type={activity.type} />
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} style={{ color: 'var(--accent-cyan)' }} />
                      <span>{activity.duration} min</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Flame size={15} style={{ color: '#ff6b6b' }} />
                      <span>{activity.caloriesBurned} kcal</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} />
                      <span>{formatDate(activity.startTime)}</span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    {hasMetrics && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(activity.id);
                        }}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-secondary)',
                          padding: '4px 8px',
                          borderRadius: 'var(--border-radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                        }}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        Metrics
                      </button>
                    )}
                  </td>
                </tr>

                {isExpanded && hasMetrics && (
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td colSpan={5} style={{ padding: '0 16px 16px 16px' }}>
                      <div
                        style={{
                          background: 'rgba(26, 26, 46, 0.6)',
                          padding: '12px 16px',
                          borderRadius: 'var(--border-radius-sm)',
                          border: '1px solid var(--border-glass)',
                        }}
                      >
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                          Additional Metrics:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          {Object.entries(activity.additional_metrics).map(([key, val]) => (
                            <div
                              key={key}
                              style={{
                                background: 'rgba(255, 255, 255, 0.04)',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                              }}
                            >
                              <span style={{ color: 'var(--accent-cyan)', fontWeight: 500 }}>
                                {key}:{' '}
                              </span>
                              <span style={{ color: 'var(--text-primary)' }}>
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
