import React, { useState, useEffect } from 'react';
import {
  Plus,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Flame,
  ChevronDown,
  ChevronUp,
  Zap,
  Sparkles,
  RefreshCw,
  Sliders,
} from 'lucide-react';
import { getActivities, trackActivity } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import ActivityTypeSelector from '../components/ActivityTypeSelector';
import ActivityTable from '../components/ActivityTable';
import GlassCard from '../components/ui/GlassCard';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import {
  estimateCalories,
  INTENSITY_LEVELS,
  MET_TABLE,
} from '../utils/calorieCalculator';

const ActivitiesPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const now = new Date();
  const defaultTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [type, setType] = useState('RUNNING');
  const [duration, setDuration] = useState('');
  const [intensity, setIntensity] = useState('MODERATE');
  const [caloriesBurned, setCaloriesBurned] = useState('');
  const [isAutoCalories, setIsAutoCalories] = useState(true);
  const [startTime, setStartTime] = useState(defaultTime);

  // Additional Metrics
  const [showMetrics, setShowMetrics] = useState(false);
  const [distance, setDistance] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [notes, setNotes] = useState('');

  // Live auto-calculation effect
  useEffect(() => {
    if (isAutoCalories) {
      const estimated = estimateCalories({
        type,
        duration: Number(duration) || 0,
        intensity,
        distanceKm: distance,
        heartRate,
        weightKg: user?.weight,
      });
      setCaloriesBurned(estimated > 0 ? String(estimated) : '');
    }
  }, [type, duration, intensity, distance, heartRate, isAutoCalories, user?.weight]);

  // Filters & Search
  const [selectedFilter, setSelectedFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchActivities = async () => {
    try {
      const res = await getActivities();
      setActivities(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to load activities', err);
      toast.error('Could not load activity history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type) {
      toast.error('Please select an activity type');
      return;
    }
    if (!duration || Number(duration) <= 0) {
      toast.error('Please enter a valid positive duration');
      return;
    }
    if (!startTime) {
      toast.error('Please select a start time');
      return;
    }

    let finalCalories = Number(caloriesBurned);
    if (!finalCalories || finalCalories <= 0) {
      finalCalories = estimateCalories({
        type,
        duration: Number(duration),
        intensity,
        distanceKm: distance,
        heartRate,
      });
    }

    const additional_metrics = {
      intensity,
    };
    if (distance) additional_metrics.distance_km = Number(distance);
    if (heartRate) additional_metrics.avg_heart_rate = Number(heartRate);
    if (notes.trim()) additional_metrics.notes = notes.trim();

    // Convert local datetime input to ISO-8601 (e.g. 2026-09-08T12:00:00)
    const formattedStartTime = new Date(startTime).toISOString().slice(0, 19);

    const payload = {
      type,
      duration: Number(duration),
      caloriesBurned: finalCalories,
      startTime: formattedStartTime,
      additional_metrics: Object.keys(additional_metrics).length > 0 ? additional_metrics : null,
    };

    setSubmitting(true);
    try {
      await trackActivity(payload);
      toast.success(`Workout tracked! ${finalCalories} kcal burned.`);
      // Reset form
      setDuration('');
      setCaloriesBurned('');
      setDistance('');
      setHeartRate('');
      setNotes('');
      setIntensity('MODERATE');
      setIsAutoCalories(true);
      // Refresh list
      await fetchActivities();
    } catch (err) {
      console.error('Failed to track activity', err);
      toast.error(err.response?.data?.message || 'Failed to log activity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Today's summary calculation
  const todayStr = new Date().toISOString().split('T')[0];
  const todayActivities = activities.filter(
    (a) => a.startTime && a.startTime.startsWith(todayStr)
  );
  const todayCalories = todayActivities.reduce(
    (acc, a) => acc + (Number(a.caloriesBurned) || 0),
    0
  );
  const todayMinutes = todayActivities.reduce(
    (acc, a) => acc + (Number(a.duration) || 0),
    0
  );

  // Filtered activities
  const filteredActivities = activities.filter((act) => {
    const matchesType = selectedFilter === 'ALL' || act.type === selectedFilter;
    const matchesSearch =
      searchQuery === '' ||
      act.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.additional_metrics &&
        JSON.stringify(act.additional_metrics).toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Top Section: Log Activity Form + Today's Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.8fr) minmax(300px, 1fr)',
          gap: '24px',
        }}
      >
        {/* Track Activity Form */}
        <GlassCard>
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '4px' }}>
              Log New Activity
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Select activity type and specify duration, burned energy, and optional telemetry.
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ActivityTypeSelector selectedType={type} onSelect={setType} />

            {/* Workout Intensity Selector */}
            <div>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  marginBottom: '8px',
                }}
              >
                <Zap size={15} color="var(--accent-lime)" />
                Workout Intensity / Effort
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                }}
              >
                {INTENSITY_LEVELS.map((lvl) => {
                  const isSelected = intensity === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setIntensity(lvl.id)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 'var(--border-radius)',
                        border: isSelected
                          ? '1px solid var(--accent-lime)'
                          : '1px solid var(--border-glass)',
                        background: isSelected
                          ? 'rgba(173, 255, 47, 0.12)'
                          : 'rgba(26, 26, 46, 0.4)',
                        color: isSelected ? 'var(--accent-lime)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '2px',
                        transition: 'all var(--transition-fast)',
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{lvl.label}</span>
                      <span style={{ fontSize: '0.72rem', opacity: 0.8 }}>
                        {lvl.multiplier}x burn • {lvl.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', alignItems: 'start' }}>
              <Input
                id="act-duration"
                label="Duration (min)"
                type="number"
                placeholder="45"
                icon={Clock}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                min="1"
              />

              {/* Calories Input with Auto-Calculation Badge & Toggle */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '6px',
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Flame size={14} color="#ff6b6b" /> Calories (kcal)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAutoCalories(!isAutoCalories)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: isAutoCalories ? 'var(--accent-lime)' : 'var(--accent-cyan)',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: 0,
                    }}
                  >
                    {isAutoCalories ? <Sparkles size={12} /> : <Sliders size={12} />}
                    {isAutoCalories ? 'Auto (MET)' : 'Manual'}
                  </button>
                </div>
                <Input
                  id="act-calories"
                  type="number"
                  placeholder={isAutoCalories ? 'Auto-calculated...' : '320'}
                  icon={Flame}
                  value={caloriesBurned}
                  onChange={(e) => {
                    setIsAutoCalories(false);
                    setCaloriesBurned(e.target.value);
                  }}
                  min="0"
                />
                {isAutoCalories && duration && Number(duration) > 0 ? (
                  <div
                    style={{
                      marginTop: '6px',
                      fontSize: '0.72rem',
                      color: 'var(--accent-lime)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Zap size={11} />
                    Auto-estimated ({MET_TABLE[type]?.name || type}, {intensity.toLowerCase()})
                  </div>
                ) : !isAutoCalories ? (
                  <button
                    type="button"
                    onClick={() => setIsAutoCalories(true)}
                    style={{
                      marginTop: '6px',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-cyan)',
                      fontSize: '0.72rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      padding: 0,
                    }}
                  >
                    <RefreshCw size={11} /> Reset to auto-estimate
                  </button>
                ) : null}
              </div>

              <Input
                id="act-start"
                label="Start Time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>

            {/* Collapsible Additional Metrics */}
            <div>
              <button
                type="button"
                onClick={() => setShowMetrics(!showMetrics)}
                style={{
                  background: 'transparent',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  padding: '4px 0',
                }}
              >
                {showMetrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {showMetrics ? 'Hide Additional Metrics' : '+ Add Metrics (Heart Rate, Distance, Notes)'}
              </button>

              {showMetrics && (
                <div
                  className="animate-fade-in"
                  style={{
                    marginTop: '14px',
                    padding: '16px',
                    borderRadius: 'var(--border-radius)',
                    background: 'rgba(26, 26, 46, 0.5)',
                    border: '1px solid var(--border-glass)',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <Input
                    id="act-distance"
                    label="Distance (km)"
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  />
                  <Input
                    id="act-hr"
                    label="Avg Heart Rate (bpm)"
                    type="number"
                    placeholder="148"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                  />
                  <div style={{ gridColumn: 'span 2' }}>
                    <Input
                      id="act-notes"
                      label="Workout Notes / Intensity"
                      placeholder="e.g. Interval sprints, felt strong, hydrated well"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="md"
              loading={submitting}
              icon={Plus}
              style={{ alignSelf: 'flex-start', marginTop: '4px' }}
            >
              Record Activity
            </Button>
          </form>
        </GlassCard>

        {/* Today's Summary Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <GlassCard
            style={{
              background: 'linear-gradient(145deg, rgba(18, 18, 28, 0.9), rgba(26, 26, 46, 0.7))',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600 }}>Today's Target</h3>
              <CheckCircle2 size={18} color="var(--accent-lime)" />
            </div>

            {/* Calorie Progress Ring / Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Calories Burned</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {todayCalories} / 500 kcal
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (todayCalories / 500) * 100)}%`,
                    background: 'var(--accent-gradient)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            {/* Active Minutes Progress Ring / Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Active Minutes</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                  {todayMinutes} / 60 min
                </span>
              </div>
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, (todayMinutes / 60) * 100)}%`,
                    background: 'var(--accent-cyan)',
                    borderRadius: '4px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                background: 'rgba(173, 255, 47, 0.05)',
                border: '1px solid rgba(173, 255, 47, 0.15)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '12px 14px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
              }}
            >
              <strong style={{ color: 'var(--accent-lime)' }}>{todayActivities.length} session(s)</strong> logged today. Keep up the high energy!
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Activity History & Filters */}
      <GlassCard>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Activity History</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Showing {filteredActivities.length} of {activities.length} workouts
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ width: '220px' }}>
              <Input
                placeholder="Search workouts..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: 0 }}
              />
            </div>

            {/* Type Filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--border-radius-sm)',
                  color: 'var(--text-primary)',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                <option value="ALL">All Activities</option>
                <option value="RUNNING">Running</option>
                <option value="WALKING">Walking</option>
                <option value="CYCLING">Cycling</option>
                <option value="SWIMMING">Swimming</option>
                <option value="WEIGHT_TRAINING">Weights</option>
                <option value="YOGA">Yoga</option>
                <option value="CARDIO">Cardio</option>
                <option value="STRETCHING">Stretching</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 0', display: 'flex', justifyContent: 'center' }}>
            <Spinner label="Loading activity logs..." />
          </div>
        ) : (
          <ActivityTable activities={filteredActivities} />
        )}
      </GlassCard>
    </div>
  );
};

export default ActivitiesPage;
