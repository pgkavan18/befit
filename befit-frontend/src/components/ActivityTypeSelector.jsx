import React from 'react';
import {
  Flame,
  Footprints,
  Bike,
  Waves,
  Dumbbell,
  HeartPulse,
  Activity,
  Sparkles,
} from 'lucide-react';

export const ACTIVITY_TYPES = [
  { id: 'RUNNING', label: 'Running', icon: Flame, color: '#ff6b6b' },
  { id: 'WALKING', label: 'Walking', icon: Footprints, color: '#4ecdc4' },
  { id: 'CYCLING', label: 'Cycling', icon: Bike, color: '#ffe66d' },
  { id: 'SWIMMING', label: 'Swimming', icon: Waves, color: '#00e5ff' },
  { id: 'WEIGHT_TRAINING', label: 'Weights', icon: Dumbbell, color: '#adff2f' },
  { id: 'YOGA', label: 'Yoga', icon: HeartPulse, color: '#da70d6' },
  { id: 'CARDIO', label: 'Cardio', icon: Activity, color: '#ff9f43' },
  { id: 'STRETCHING', label: 'Stretching', icon: Sparkles, color: '#a29bfe' },
];

const ActivityTypeSelector = ({ selectedType, onSelect }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label
        style={{
          fontSize: '0.875rem',
          fontWeight: 500,
          color: 'var(--text-secondary)',
        }}
      >
        Activity Type <span style={{ color: 'var(--danger)' }}>*</span>
      </label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
          gap: '10px',
        }}
      >
        {ACTIVITY_TYPES.map((type) => {
          const isSelected = selectedType === type.id;
          const Icon = type.icon;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onSelect(type.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 8px',
                borderRadius: 'var(--border-radius)',
                background: isSelected ? 'rgba(173, 255, 47, 0.12)' : 'rgba(26, 26, 46, 0.6)',
                border: isSelected
                  ? '1.5px solid var(--accent-lime)'
                  : '1px solid var(--border-glass)',
                boxShadow: isSelected ? '0 0 16px rgba(173, 255, 47, 0.25)' : 'none',
                color: isSelected ? 'var(--accent-lime)' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                transform: isSelected ? 'scale(1.02)' : 'none',
              }}
            >
              <Icon size={22} style={{ color: isSelected ? 'var(--accent-lime)' : type.color }} />
              <span
                style={{
                  marginTop: '8px',
                  fontSize: '0.8rem',
                  fontWeight: isSelected ? 600 : 400,
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {type.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityTypeSelector;
