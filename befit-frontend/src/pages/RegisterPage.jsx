import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Zap, ArrowRight, Eye, EyeOff, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { calculateBmi, getBmiCategory } from '../utils/bmiCalculator';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    height: '',
    weight: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showBodyMetrics, setShowBodyMetrics] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const liveBmi = useMemo(() => {
    return calculateBmi(formData.weight, formData.height);
  }, [formData.weight, formData.height]);

  const liveBmiDetails = useMemo(() => {
    return liveBmi ? getBmiCategory(liveBmi) : null;
  }, [liveBmi]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!formData.password) {
      errs.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (formData.age && (Number(formData.age) < 1 || Number(formData.age) > 130)) {
      errs.age = 'Valid age (1-130)';
    }
    if (formData.height && (Number(formData.height) < 30 || Number(formData.height) > 300)) {
      errs.height = 'Valid height (30-300 cm)';
    }
    if (formData.weight && (Number(formData.weight) < 10 || Number(formData.weight) > 500)) {
      errs.weight = 'Valid weight (10-500 kg)';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        formData.age,
        formData.height,
        formData.weight
      );
      toast.success('Account created successfully! Welcome to BeFit.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.response?.status === 409
          ? 'An account with this email already exists'
          : 'Registration failed. Please try again.');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        position: 'relative',
        padding: '40px 20px',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(173, 255, 47, 0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          left: '20%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      <GlassCard
        className="animate-scale-in"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '40px 36px',
          background: 'rgba(18, 18, 28, 0.9)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-lime)',
              marginBottom: '16px',
            }}
          >
            <Zap size={24} color="#0a0a0f" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '6px' }}>
            Create your account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Start your high-performance fitness journey today
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              id="firstName"
              label="First Name"
              placeholder="Alex"
              icon={User}
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
              required
            />
            <Input
              id="lastName"
              label="Last Name"
              placeholder="Rivera"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="alex@example.com"
            icon={Mail}
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <div style={{ position: 'relative' }}>
            <Input
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="At least 6 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '36px',
                background: 'transparent',
                color: 'var(--text-muted)',
                padding: '4px',
              }}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input
            id="confirmPassword"
            label="Confirm Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Re-enter password"
            icon={Lock}
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
          />

          {/* Optional Health & Body Metrics Section */}
          <div
            style={{
              marginTop: '4px',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--border-radius)',
              background: 'rgba(255, 255, 255, 0.02)',
              overflow: 'hidden',
            }}
          >
            <button
              type="button"
              onClick={() => setShowBodyMetrics(!showBodyMetrics)}
              style={{
                width: '100%',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'transparent',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-lime)' }}>
                <Activity size={16} />
                <span>Add Body Metrics for BMI Check (Optional)</span>
              </div>
              {showBodyMetrics ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showBodyMetrics && (
              <div style={{ padding: '0 14px 14px 14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Provide your age, height, and weight so BeFit can calculate your BMI, personalized calorie burn, and health goals.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                  <Input
                    id="age"
                    label="Age (yrs)"
                    type="number"
                    min="1"
                    max="130"
                    placeholder="25"
                    value={formData.age}
                    onChange={handleChange}
                    error={errors.age}
                  />
                  <Input
                    id="height"
                    label="Height (cm)"
                    type="number"
                    step="0.1"
                    min="30"
                    max="300"
                    placeholder="175"
                    value={formData.height}
                    onChange={handleChange}
                    error={errors.height}
                  />
                  <Input
                    id="weight"
                    label="Weight (kg)"
                    type="number"
                    step="0.1"
                    min="10"
                    max="500"
                    placeholder="70"
                    value={formData.weight}
                    onChange={handleChange}
                    error={errors.weight}
                  />
                </div>

                {liveBmi && liveBmiDetails && (
                  <div
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--border-radius-sm)',
                      background: liveBmiDetails.badgeBg,
                      border: `1px solid ${liveBmiDetails.badgeBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '8px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Calculated BMI:</span>
                      <strong style={{ fontSize: '1.05rem', color: liveBmiDetails.color }}>{liveBmi}</strong>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: liveBmiDetails.color,
                        padding: '2px 8px',
                        borderRadius: 'var(--border-radius-pill)',
                        background: 'rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      {liveBmiDetails.category}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            variant="gradient"
            size="lg"
            fullWidth
            loading={loading}
            icon={ArrowRight}
            style={{ marginTop: '12px' }}
          >
            Create Account
          </Button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--accent-lime)' }}>
            Sign In
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default RegisterPage;
