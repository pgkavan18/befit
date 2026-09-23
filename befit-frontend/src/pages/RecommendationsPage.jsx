import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Filter,
  Lightbulb,
  Wand2,
} from 'lucide-react';
import { getUserRecommendations, generateRecommendation, getActivities } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import RecommendationCard from '../components/RecommendationCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Spinner from '../components/ui/Spinner';
import GlassCard from '../components/ui/GlassCard';

const RecommendationsPage = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [recommendations, setRecommendations] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Filter state
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Modal Form State
  const [selectedActivityId, setSelectedActivityId] = useState('');
  const [improvementText, setImprovementText] = useState('');
  const [improvements, setImprovements] = useState([]);
  const [suggestionText, setSuggestionText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [safetyText, setSafetyText] = useState('');
  const [safetyList, setSafetyList] = useState([]);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [recRes, actRes] = await Promise.all([
        getUserRecommendations(user.id),
        getActivities(),
      ]);
      setRecommendations(Array.isArray(recRes.data) ? recRes.data : []);
      setActivities(Array.isArray(actRes.data) ? actRes.data : []);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Tag list add / remove handlers
  const handleAddTag = (type, val, setter, listSetter) => {
    if (!val.trim()) return;
    listSetter((prev) => [...prev, val.trim()]);
    setter('');
  };

  const handleRemoveTag = (index, listSetter) => {
    listSetter((prev) => prev.filter((_, i) => i !== index));
  };

  // Preset Template generator for convenience
  const applyPreset = (presetType) => {
    if (presetType === 'running') {
      setImprovements(['Increase cadence to 175-180 spm', 'Focus on midfoot striking']);
      setSuggestions(['Add weekly interval hill repeats (6 x 400m)', 'Incorporate tempo threshold run on Thursdays']);
      setSafetyList(['Dynamic hamstring stretches before workout', 'Maintain 48h rest between high-intensity sprints']);
    } else if (presetType === 'weights') {
      setImprovements(['Ensure full range of motion on eccentric phase (3 sec descent)', 'Tighten core bracing']);
      setSuggestions(['Progressive overload: add 2.5kg to compound lifts next week', 'Superset accessory exercises']);
      setSafetyList(['Warm up rotator cuffs with resistance bands', 'Consume 25-30g protein within 2 hours']);
    } else if (presetType === 'recovery') {
      setImprovements(['Improve sleep consistency (7.5+ hours)', 'Increase hydration to 3.5L/day']);
      setSuggestions(['20 minutes low-intensity active recovery walk', 'Contrast shower or foam rolling']);
      setSafetyList(['Monitor resting heart rate for overtraining signs', 'Take an unscheduled rest day if soreness exceeds 6/10']);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedActivityId) {
      toast.error('Please select an activity to generate recommendations for');
      return;
    }

    setGenerating(true);
    try {
      const payload = {
        activityId: selectedActivityId,
        improvements: improvements.length > 0 ? improvements : ['Increase pace consistency'],
        suggestions: suggestions.length > 0 ? suggestions : ['Add 10 minutes endurance building'],
        safety: safetyList.length > 0 ? safetyList : ['Ensure thorough dynamic warm-up and cool down'],
      };

      await generateRecommendation(payload);
      toast.success('New AI recommendation generated!');
      setIsModalOpen(false);
      // Reset
      setSelectedActivityId('');
      setImprovements([]);
      setSuggestions([]);
      setSafetyList([]);
      await fetchData();
    } catch (err) {
      console.error('Failed to generate recommendation', err);
      toast.error(err.response?.data?.message || 'Failed to generate recommendation.');
    } finally {
      setGenerating(false);
    }
  };

  const filteredRecommendations = recommendations.filter((r) => {
    if (selectedFilter === 'ALL') return true;
    return r.type === selectedFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Header Banner */}
      <GlassCard
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
          background: 'linear-gradient(135deg, rgba(18, 18, 28, 0.9), rgba(26, 26, 46, 0.7))',
          borderLeft: '4px solid var(--accent-lime)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Sparkles size={22} color="var(--accent-lime)" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Fitness Coaching & Insights</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '650px' }}>
            Personalized performance recommendations, corrective suggestions, and recovery protocols built specifically around your recorded workouts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Button
            icon={Plus}
            onClick={() => setIsModalOpen(true)}
            disabled={activities.length === 0}
          >
            {activities.length === 0 ? 'Log Activity First' : 'Generate Recommendation'}
          </Button>
        </div>
      </GlassCard>

      {/* Filter Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Showing {filteredRecommendations.length} recommendations
        </p>

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
              padding: '8px 12px',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Categories</option>
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

      {/* Recommendations Grid */}
      {loading ? (
        <div style={{ padding: '60px 0', display: 'flex', justifyContent: 'center' }}>
          <Spinner size="lg" label="Analyzing performance data..." />
        </div>
      ) : filteredRecommendations.length === 0 ? (
        <GlassCard
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            border: '1px dashed var(--border-glass)',
          }}
        >
          <Lightbulb size={40} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No recommendations yet</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '440px', margin: '0 auto 20px' }}>
            {activities.length === 0
              ? 'Log at least one workout in the Activities tab to generate your first set of AI coaching advice.'
              : 'Click below to generate actionable suggestions for your recorded sessions.'}
          </p>
          {activities.length > 0 && (
            <Button icon={Wand2} onClick={() => setIsModalOpen(true)}>
              Generate Insights
            </Button>
          )}
        </GlassCard>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
          }}
        >
          {filteredRecommendations.map((rec) => (
            <RecommendationCard key={rec.id || Math.random()} recommendation={rec} />
          ))}
        </div>
      )}

      {/* Generate Recommendation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate AI Recommendation"
        maxWidth="620px"
      >
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Select Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              Select Workout Session <span style={{ color: 'var(--danger)' }}>*</span>
            </label>
            <select
              value={selectedActivityId}
              onChange={(e) => setSelectedActivityId(e.target.value)}
              required
              style={{
                width: '100%',
                background: 'rgba(26, 26, 46, 0.8)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--border-radius)',
                color: 'var(--text-primary)',
                padding: '12px 14px',
                fontSize: '0.92rem',
                cursor: 'pointer',
              }}
            >
              <option value="">-- Choose a recorded activity --</option>
              {activities.map((act) => (
                <option key={act.id} value={act.id}>
                  {act.type} • {act.duration} min • {act.caloriesBurned} kcal (
                  {new Date(act.startTime).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets */}
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quick AI Presets: </span>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => applyPreset('running')}
                style={{
                  background: 'rgba(255, 107, 107, 0.15)',
                  color: '#ff6b6b',
                  border: '1px solid rgba(255, 107, 107, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cardio & Cadence
              </button>
              <button
                type="button"
                onClick={() => applyPreset('weights')}
                style={{
                  background: 'rgba(173, 255, 47, 0.15)',
                  color: '#adff2f',
                  border: '1px solid rgba(173, 255, 47, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Strength Progression
              </button>
              <button
                type="button"
                onClick={() => applyPreset('recovery')}
                style={{
                  background: 'rgba(0, 229, 255, 0.15)',
                  color: '#00e5ff',
                  border: '1px solid rgba(0, 229, 255, 0.3)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Active Recovery & Safety
              </button>
            </div>
          </div>

          {/* Improvements Input */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Target Improvements"
                  placeholder="e.g. Focus on cadence control"
                  value={improvementText}
                  onChange={(e) => setImprovementText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag('improvement', improvementText, setImprovementText, setImprovements);
                    }
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddTag('improvement', improvementText, setImprovementText, setImprovements)}
              >
                Add
              </Button>
            </div>
            {improvements.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {improvements.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(74, 222, 128, 0.15)',
                      color: 'var(--success)',
                      border: '1px solid var(--success)',
                      padding: '3px 10px',
                      borderRadius: 'var(--border-radius-pill)',
                      fontSize: '0.78rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item}
                    <span
                      onClick={() => handleRemoveTag(i, setImprovements)}
                      style={{ cursor: 'pointer', fontWeight: 700 }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Suggestions Input */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Workout Suggestions"
                  placeholder="e.g. Add 3x500m intervals"
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag('suggestion', suggestionText, setSuggestionText, setSuggestions);
                    }
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddTag('suggestion', suggestionText, setSuggestionText, setSuggestions)}
              >
                Add
              </Button>
            </div>
            {suggestions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {suggestions.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(0, 229, 255, 0.15)',
                      color: 'var(--accent-cyan)',
                      border: '1px solid var(--accent-cyan)',
                      padding: '3px 10px',
                      borderRadius: 'var(--border-radius-pill)',
                      fontSize: '0.78rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item}
                    <span
                      onClick={() => handleRemoveTag(i, setSuggestions)}
                      style={{ cursor: 'pointer', fontWeight: 700 }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Safety Input */}
          <div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <Input
                  label="Safety & Injury Prevention Tips"
                  placeholder="e.g. Thorough dynamic stretching beforehand"
                  value={safetyText}
                  onChange={(e) => setSafetyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag('safety', safetyText, setSafetyText, setSafetyList);
                    }
                  }}
                />
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleAddTag('safety', safetyText, setSafetyText, setSafetyList)}
              >
                Add
              </Button>
            </div>
            {safetyList.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                {safetyList.map((item, i) => (
                  <span
                    key={i}
                    style={{
                      background: 'rgba(251, 191, 36, 0.15)',
                      color: 'var(--warning)',
                      border: '1px solid var(--warning)',
                      padding: '3px 10px',
                      borderRadius: 'var(--border-radius-pill)',
                      fontSize: '0.78rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    {item}
                    <span
                      onClick={() => handleRemoveTag(i, setSafetyList)}
                      style={{ cursor: 'pointer', fontWeight: 700 }}
                    >
                      ×
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="gradient"
              loading={generating}
              icon={Sparkles}
            >
              Generate AI Advice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RecommendationsPage;
