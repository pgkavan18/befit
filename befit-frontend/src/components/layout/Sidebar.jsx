import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Activity,
  Sparkles,
  User,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/activities', label: 'Activities', icon: Activity },
  { path: '/recommendations', label: 'Recommendations', icon: Sparkles },
  { path: '/profile', label: 'Profile', icon: User },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside
      className={`befit-sidebar ${isOpen ? 'sidebar-open' : ''}`}
      style={{
        width: 'var(--sidebar-width)',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: 'rgba(18, 18, 26, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRight: '1px solid var(--border-glass)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        transition: 'transform var(--transition-normal)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: '24px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid var(--border-glass)',
        }}
      >
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-lime)',
          }}
        >
          <Zap size={22} color="#0a0a0f" />
        </div>
        <div>
          <span
            className="text-gradient"
            style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em' }}
          >
            BeFit
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              marginTop: '-2px',
            }}
          >
            Performance Hub
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--border-radius)',
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? 'var(--accent-lime)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(173, 255, 47, 0.1)' : 'transparent',
                border: isActive
                  ? '1px solid rgba(173, 255, 47, 0.25)'
                  : '1px solid transparent',
                transition: 'all var(--transition-fast)',
              })}
            >
              <Icon size={19} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User info & Logout */}
      <div
        style={{
          padding: '16px',
          borderTop: '1px solid var(--border-glass)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          background: 'rgba(10, 10, 15, 0.4)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p
              style={{
                fontSize: '0.88rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Fitness Member'}
            </p>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.email || ''}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '9px',
            borderRadius: 'var(--border-radius-sm)',
            background: 'rgba(255, 77, 106, 0.1)',
            border: '1px solid rgba(255, 77, 106, 0.2)',
            color: 'var(--danger)',
            fontSize: '0.82rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'background var(--transition-fast)',
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
