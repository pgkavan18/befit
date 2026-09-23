import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Calendar,
  ShieldCheck,
  Award,
  Flame,
  Clock,
  LogOut,
  Zap,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getActivities, getUserProfile } from '../api/api';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import BmiCard from '../components/BmiCard';

const ProfilePage = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivities()
      .then((res) => {
        setActivities(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err));

    getUserProfile()
      .then((res) => {
        if (res.data) {
          updateUser(res.data);
        }
      })
      .catch((err) => console.error('Failed to sync profile', err));
  }, []);

  const totalActivities = activities.length;
  const totalCalories = activities.reduce((s, a) => s + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((s, a) => s + (Number(a.duration) || 0), 0);

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out.');
    navigate('/login');
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Active Member';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
      {/* Profile Header Card */}
      <GlassCard
        className="animate-fade-in"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          flexWrap: 'wrap',
          background: 'linear-gradient(135deg, rgba(18, 18, 28, 0.95), rgba(26, 26, 46, 0.8))',
          borderLeft: '4px solid var(--accent-lime)',
          padding: '32px',
        }}
      >
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0a0a0f',
            boxShadow: 'var(--shadow-glow-lime)',
            flexShrink: 0,
          }}
        >
          {user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U'}
        </div>

        <div style={{ flex: 1, minWidth: '220px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 700 }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Athlete'}
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                background: 'rgba(173, 255, 47, 0.15)',
                color: 'var(--accent-lime)',
                border: '1px solid rgba(173, 255, 47, 0.3)',
                padding: '3px 8px',
                borderRadius: 'var(--border-radius-pill)',
                fontWeight: 600,
                textTransform: 'uppercase',
              }}
            >
              PRO ATHLETE
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '12px' }}>
            {user?.email}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            <Calendar size={14} />
            <span>Member since {formatDate(user?.createdAt)}</span>
          </div>
        </div>

        <Button variant="danger" icon={LogOut} onClick={handleLogout}>
          Sign Out
        </Button>
      </GlassCard>

      {/* Body Composition & BMI Section */}
      <BmiCard user={user} />

      {/* Fitness Statistics */}
      <GlassCard>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '20px' }}>
          Lifetime Activity Statistics
        </h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
          }}
        >
          <div
            style={{
              padding: '18px',
              background: 'rgba(26, 26, 46, 0.5)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)', marginBottom: '8px' }}>
              <Zap size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Workouts</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalActivities}</p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Completed sessions</span>
          </div>

          <div
            style={{
              padding: '18px',
              background: 'rgba(26, 26, 46, 0.5)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6b6b', marginBottom: '8px' }}>
              <Flame size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Calories</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalCalories.toLocaleString()} kcal</p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total calories burned</span>
          </div>

          <div
            style={{
              padding: '18px',
              background: 'rgba(26, 26, 46, 0.5)',
              borderRadius: 'var(--border-radius)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '8px' }}>
              <Clock size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 600, textTransform: 'uppercase' }}>Active Time</span>
            </div>
            <p style={{ fontSize: '1.6rem', fontWeight: 700 }}>{totalMinutes} min</p>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total active training</span>
          </div>
        </div>
      </GlassCard>

      {/* Security & Account Information */}
      <GlassCard>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '16px' }}>
          Security & Session
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="var(--success)" />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>Stateless JWT Authentication</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Cryptographically verified HMAC-SHA256 signature
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--success)', fontWeight: 600 }}>Active</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: 'var(--border-radius)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-glass)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={20} color="var(--accent-cyan)" />
              <div>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>User ID</p>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.id || 'N/A'}</p>
              </div>
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Standard User</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default ProfilePage;
