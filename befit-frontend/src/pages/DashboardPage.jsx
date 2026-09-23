import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Flame,
  Clock,
  Award,
  Plus,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { getActivities, getUserRecommendations, getUserProfile } from '../api/api';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/ui/StatCard';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import WeeklyChart from '../components/WeeklyChart';
import ActivityTable from '../components/ActivityTable';
import RecommendationCard from '../components/RecommendationCard';
import BmiCard from '../components/BmiCard';

const DashboardPage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const actRes = await getActivities();
        const actData = Array.isArray(actRes.data) ? actRes.data : [];
        setActivities(actData);

        if (user?.id) {
          try {
            const recRes = await getUserRecommendations(user.id);
            const recData = Array.isArray(recRes.data) ? recRes.data : [];
            setRecommendations(recData);
          } catch (e) {
            console.warn('Could not fetch recommendations', e);
          }

          try {
            const profRes = await getUserProfile();
            if (profRes.data) {
              updateUser(profRes.data);
            }
          } catch (e) {
            console.warn('Could not sync profile in dashboard', e);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id]);

  // Compute stats
  const totalActivities = activities.length;
  const totalCalories = activities.reduce((sum, a) => sum + (Number(a.caloriesBurned) || 0), 0);
  const totalMinutes = activities.reduce((sum, a) => sum + (Number(a.duration) || 0), 0);

  // Compute streak (distinct days with activities)
  const activityDays = new Set(
    activities
      .map((a) => a.startTime?.split('T')[0])
      .filter(Boolean)
  );
  const activeDaysCount = activityDays.size;

  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.startTime || 0) - new Date(a.startTime || 0))
    .slice(0, 5);

  const latestRecommendation = recommendations.length > 0 ? recommendations[recommendations.length - 1] : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
        <Spinner size="lg" label="Loading dashboard metrics..." />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Welcome Banner */}
      <div
        className="glass-card animate-fade-in"
        style={{
          padding: '28px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7), rgba(18, 18, 28, 0.9))',
          border: '1px solid rgba(173, 255, 47, 0.15)',
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 700, marginBottom: '6px' }}>
            Hello, {user?.firstName || 'Athlete'}! 👋
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            You've logged <strong style={{ color: 'var(--accent-lime)' }}>{totalActivities} workouts</strong> burning{' '}
            <strong style={{ color: '#ff6b6b' }}>{totalCalories.toLocaleString()} kcal</strong> total. Keep the momentum going!
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            icon={Plus}
            onClick={() => navigate('/activities')}
          >
            Track Workout
          </Button>
          <Button
            variant="secondary"
            icon={Sparkles}
            onClick={() => navigate('/recommendations')}
          >
            AI Insights
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
        }}
      >
        <StatCard
          title="Total Workouts"
          value={totalActivities}
          subtitle="All recorded sessions"
          icon={Activity}
          accentColor="var(--accent-lime)"
        />
        <StatCard
          title="Calories Burned"
          value={`${totalCalories.toLocaleString()} kcal`}
          subtitle="Lifetime total energy"
          icon={Flame}
          accentColor="#ff6b6b"
        />
        <StatCard
          title="Active Duration"
          value={`${totalMinutes} min`}
          subtitle="Total workout time"
          icon={Clock}
          accentColor="var(--accent-cyan)"
        />
        <StatCard
          title="Active Days"
          value={`${activeDaysCount} days`}
          subtitle="Consistency score"
          icon={Award}
          accentColor="#ffe66d"
        />
      </div>

      {/* BMI & Body Metrics Quick Overview */}
      <BmiCard user={user} compact />

      {/* Weekly Activity Trends Chart */}
      <GlassCard className="animate-fade-in-up">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Past 7 Days Activity</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Calories burned (green curve) vs. active minutes (blue dotted)
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ADFF2F' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Calories</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00E5FF' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Minutes</span>
            </div>
          </div>
        </div>

        <WeeklyChart activities={activities} />
      </GlassCard>

      {/* Split section: Recent Activities & Latest Recommendation */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: latestRecommendation ? '1.4fr 1fr' : '1fr',
          gap: '24px',
        }}
      >
        {/* Recent Activities */}
        <GlassCard>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Recent Activities</h3>
            <button
              onClick={() => navigate('/activities')}
              style={{
                background: 'transparent',
                color: 'var(--accent-cyan)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.85rem',
                fontWeight: 500,
              }}
            >
              View All <ArrowRight size={14} />
            </button>
          </div>
          <ActivityTable activities={recentActivities} />
        </GlassCard>

        {/* Latest Recommendation Spotlight */}
        {latestRecommendation && (
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="var(--accent-lime)" />
                Latest AI Coach Note
              </h3>
              <button
                onClick={() => navigate('/recommendations')}
                style={{
                  background: 'transparent',
                  color: 'var(--accent-lime)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                All Insights <ArrowRight size={14} />
              </button>
            </div>
            <RecommendationCard recommendation={latestRecommendation} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
