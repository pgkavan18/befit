import React, { useState } from 'react';
import { Activity, Scale, Ruler, Calendar, Flame, Sparkles, Edit3, HeartPulse, Info } from 'lucide-react';
import GlassCard from './ui/GlassCard';
import Button from './ui/Button';
import UpdateMetricsModal from './UpdateMetricsModal';
import { calculateBmi, getBmiCategory, getHealthyWeightRange, calculateBmr } from '../utils/bmiCalculator';

const BmiCard = ({ user, onUpdateClick, compact = false }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleEdit = () => {
    if (onUpdateClick) {
      onUpdateClick();
    } else {
      setModalOpen(true);
    }
  };

  const hasMetrics = user?.height && user?.weight;
  const bmiValue = hasMetrics ? (user.bmi || calculateBmi(user.weight, user.height)) : null;
  const bmiDetails = bmiValue ? getBmiCategory(bmiValue) : null;
  const healthyRange = user?.height ? getHealthyWeightRange(user.height) : null;
  const bmr = (user?.weight && user?.height && user?.age)
    ? calculateBmr(user.weight, user.height, user.age)
    : null;

  // Conversion helpers
  const heightInFeetInches = (cm) => {
    if (!cm) return '';
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}'${inches}"`;
  };

  const weightInLbs = (kg) => {
    if (!kg) return '';
    return Math.round(kg * 2.20462);
  };

  if (compact) {
    return (
      <>
        <GlassCard
          className="animate-fade-in"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: 'var(--border-radius-sm)',
                  background: 'rgba(173, 255, 47, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-lime)',
                }}
              >
                <Activity size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>BMI & Health</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Body composition</p>
              </div>
            </div>

            <Button variant="ghost" size="sm" icon={Edit3} onClick={handleEdit}>
              Edit
            </Button>
          </div>

          {hasMetrics && bmiValue && bmiDetails ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
                <span style={{ fontSize: '2.2rem', fontWeight: 800, color: bmiDetails.color, lineHeight: 1 }}>
                  {bmiValue}
                </span>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: bmiDetails.color,
                    padding: '3px 10px',
                    borderRadius: 'var(--border-radius-pill)',
                    background: bmiDetails.badgeBg,
                    border: `1px solid ${bmiDetails.badgeBorder}`,
                  }}
                >
                  {bmiDetails.category}
                </span>
              </div>

              {/* Progress Bar Gauge */}
              <div
                style={{
                  width: '100%',
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #38bdf8 0%, #38bdf8 25%, #adff2f 25%, #adff2f 50%, #fbbf24 50%, #fbbf24 75%, #f87171 75%, #f87171 100%)',
                  position: 'relative',
                  marginTop: '12px',
                  marginBottom: '16px',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-4px',
                    left: `${Math.min(96, Math.max(4, bmiDetails.gaugePercent))}%`,
                    transform: 'translateX(-50%)',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: `3px solid ${bmiDetails.color}`,
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span>Weight: <strong style={{ color: 'var(--text-primary)' }}>{user.weight} kg</strong></span>
                <span>Height: <strong style={{ color: 'var(--text-primary)' }}>{user.height} cm</strong></span>
                {user.age && <span>Age: <strong style={{ color: 'var(--text-primary)' }}>{user.age} y</strong></span>}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Set your age, height, and weight to check your BMI and personalized fitness insights.
              </p>
              <Button variant="outline" size="sm" icon={Activity} onClick={handleEdit}>
                Calculate BMI
              </Button>
            </div>
          )}
        </GlassCard>
        <UpdateMetricsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Full detailed profile card
  return (
    <>
      <GlassCard className="animate-fade-in" style={{ padding: '28px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(173, 255, 47, 0.2), rgba(0, 245, 255, 0.1))',
                border: '1px solid rgba(173, 255, 47, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-lime)',
              }}
            >
              <Activity size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Body Composition & BMI</h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                Physical metrics, BMI index, and metabolic benchmarks
              </p>
            </div>
          </div>

          <Button variant="secondary" icon={Edit3} onClick={handleEdit}>
            {hasMetrics ? 'Update Metrics' : 'Set Metrics'}
          </Button>
        </div>

        {hasMetrics && bmiValue && bmiDetails ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Top row: BMI Value + Metrics tiles */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
              }}
            >
              {/* BMI score spotlight */}
              <div
                style={{
                  gridColumn: 'span 1',
                  padding: '20px',
                  borderRadius: 'var(--border-radius)',
                  background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.7), rgba(18, 18, 28, 0.9))',
                  border: `1px solid ${bmiDetails.badgeBorder}`,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Body Mass Index
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '6px' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 800, color: bmiDetails.color, lineHeight: 1 }}>
                    {bmiValue}
                  </span>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: bmiDetails.color,
                      padding: '3px 10px',
                      borderRadius: 'var(--border-radius-pill)',
                      background: bmiDetails.badgeBg,
                      border: `1px solid ${bmiDetails.badgeBorder}`,
                    }}
                  >
                    {bmiDetails.category}
                  </span>
                </div>
              </div>

              {/* Age Tile */}
              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--border-radius)',
                  background: 'rgba(26, 26, 46, 0.4)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)', marginBottom: '6px' }}>
                  <Calendar size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>Age</span>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {user.age ? `${user.age} yrs` : 'Not specified'}
                </p>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Chronological age</span>
              </div>

              {/* Height Tile */}
              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--border-radius)',
                  background: 'rgba(26, 26, 46, 0.4)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', marginBottom: '6px' }}>
                  <Ruler size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>Height</span>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {user.height} cm
                </p>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {heightInFeetInches(user.height)}
                </span>
              </div>

              {/* Weight Tile */}
              <div
                style={{
                  padding: '18px',
                  borderRadius: 'var(--border-radius)',
                  background: 'rgba(26, 26, 46, 0.4)',
                  border: '1px solid var(--border-glass)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '6px' }}>
                  <Scale size={18} />
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase' }}>Weight</span>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                  {user.weight} kg
                </p>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                  {weightInLbs(user.weight)} lbs
                </span>
              </div>
            </div>

            {/* Visual BMI Gauge Meter */}
            <div
              style={{
                padding: '20px',
                borderRadius: 'var(--border-radius)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-glass)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>BMI Spectrum Scale</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>WHO Classification</span>
              </div>

              {/* Spectrum Track */}
              <div style={{ position: 'relative', margin: '14px 0 24px 0' }}>
                <div
                  style={{
                    height: '10px',
                    borderRadius: '5px',
                    background: 'linear-gradient(to right, #38bdf8 0%, #38bdf8 25%, #adff2f 25%, #adff2f 50%, #fbbf24 50%, #fbbf24 75%, #f87171 75%, #f87171 100%)',
                    width: '100%',
                  }}
                />

                {/* Marker pointer */}
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    left: `${Math.min(97, Math.max(3, bmiDetails.gaugePercent))}%`,
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    transition: 'left 0.5s ease',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#ffffff',
                      border: `4px solid ${bmiDetails.color}`,
                      boxShadow: '0 0 12px rgba(255,255,255,0.7)',
                    }}
                  />
                  <span
                    style={{
                      marginTop: '6px',
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: bmiDetails.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    You: {bmiValue}
                  </span>
                </div>
              </div>

              {/* Gauge range labels */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  textAlign: 'center',
                  fontSize: '0.75rem',
                  gap: '4px',
                  color: 'var(--text-muted)',
                }}
              >
                <div>
                  <strong style={{ color: '#38bdf8' }}>Underweight</strong>
                  <div>&lt; 18.5</div>
                </div>
                <div>
                  <strong style={{ color: 'var(--accent-lime)' }}>Normal</strong>
                  <div>18.5 – 24.9</div>
                </div>
                <div>
                  <strong style={{ color: '#fbbf24' }}>Overweight</strong>
                  <div>25.0 – 29.9</div>
                </div>
                <div>
                  <strong style={{ color: '#f87171' }}>Obese</strong>
                  <div>&ge; 30.0</div>
                </div>
              </div>
            </div>

            {/* Health & Metabolic Insights */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '16px',
              }}
            >
              {healthyRange && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--border-radius)',
                    background: 'rgba(26, 26, 46, 0.3)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)', marginBottom: '6px' }}>
                    <Sparkles size={16} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Healthy Weight Range</span>
                  </div>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    {healthyRange.minWeight} – {healthyRange.maxWeight} kg
                  </p>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Standard optimal range for your height ({user.height} cm)
                  </span>
                </div>
              )}

              {bmr && (
                <div
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--border-radius)',
                    background: 'rgba(26, 26, 46, 0.3)',
                    border: '1px solid var(--border-glass)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff6b6b', marginBottom: '6px' }}>
                    <Flame size={16} />
                    <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Basal Metabolic Rate (BMR)</span>
                  </div>
                  <p style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                    ~{bmr.toLocaleString()} kcal / day
                  </p>
                  <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Resting daily calorie expenditure (Mifflin-St Jeor)
                  </span>
                </div>
              )}
            </div>

            {/* Clinical / Fitness Advice banner */}
            <div
              style={{
                padding: '16px 20px',
                borderRadius: 'var(--border-radius)',
                background: bmiDetails.badgeBg,
                border: `1px solid ${bmiDetails.badgeBorder}`,
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
              }}
            >
              <Info size={20} color={bmiDetails.color} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: 600, color: bmiDetails.color, marginBottom: '4px' }}>
                  {bmiDetails.description}
                </p>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {bmiDetails.advice}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.015)',
              borderRadius: 'var(--border-radius)',
              border: '1px dashed var(--border-glass)',
            }}
          >
            <Activity size={40} color="var(--accent-lime)" style={{ margin: '0 auto 12px auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
              No Body Metrics Recorded Yet
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0 auto 18px auto' }}>
              Enter your Age, Height, and Weight to unlock real-time BMI calculations, optimal weight targeting, and personalized workout calorie precision.
            </p>
            <Button variant="gradient" icon={Edit3} onClick={handleEdit}>
              Set Body Metrics & Check BMI
            </Button>
          </div>
        )}
      </GlassCard>

      <UpdateMetricsModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default BmiCard;
