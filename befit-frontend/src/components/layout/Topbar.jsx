import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';
import Button from '../ui/Button';

const pageTitles = {
  '/dashboard': 'Performance Dashboard',
  '/activities': 'Activity Tracker',
  '/recommendations': 'AI Recommendations',
  '/profile': 'User Profile',
};

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const title = pageTitles[location.pathname] || 'BeFit';

  return (
    <header
      style={{
        height: 'var(--topbar-height)',
        background: 'rgba(10, 10, 15, 0.75)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-glass)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Mobile menu trigger */}
        <button
          onClick={onMenuClick}
          type="button"
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'transparent',
            color: 'var(--text-primary)',
            padding: '6px',
            borderRadius: '6px',
          }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        <h1 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          {title}
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {location.pathname !== '/activities' && (
          <Button
            size="sm"
            icon={Plus}
            onClick={() => navigate('/activities')}
          >
            Log Activity
          </Button>
        )}
      </div>
    </header>
  );
};

export default Topbar;
