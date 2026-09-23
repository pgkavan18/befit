import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Zap, ArrowRight, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const googleBtnRef = useRef(null);

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Initialize Google Identity Services if available
  useEffect(() => {
    if (window.google?.accounts?.id && googleBtnRef.current) {
      try {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: async (res) => {
            try {
              setLoading(true);
              await loginWithGoogle(res.credential);
              toast.success('Signed in with Google!');
              navigate(from, { replace: true });
            } catch (err) {
              toast.error(err.response?.data?.message || 'Google sign-in failed');
            } finally {
              setLoading(false);
            }
          },
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'filled_black',
          size: 'large',
          width: '100%',
          shape: 'pill',
        });
      } catch (err) {
        console.warn('Google Identity initialization error', err);
      }
    }
  }, [loginWithGoogle, navigate, from, toast]);

  const validate = () => {
    const errs = {};
    if (!email) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back to BeFit!');
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.status === 401
          ? 'Invalid email or password'
          : err.response?.data?.message || 'Login failed. Please try again.';
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
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '10%',
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
          bottom: '-15%',
          right: '10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none',
        }}
      />

      {/* Left hero banner */}
      <div
        className="auth-hero-banner"
        style={{
          flex: '1 1 50%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(145deg, rgba(18, 18, 26, 0.8), rgba(10, 10, 15, 0.95))',
          borderRight: '1px solid var(--border-glass)',
          position: 'relative',
        }}
      >
        <div style={{ maxWidth: '520px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 16px',
              borderRadius: 'var(--border-radius-pill)',
              background: 'rgba(173, 255, 47, 0.1)',
              border: '1px solid rgba(173, 255, 47, 0.25)',
              marginBottom: '32px',
            }}
          >
            <Zap size={18} color="var(--accent-lime)" />
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-lime)' }}>
              Next-Gen Fitness Intelligence
            </span>
          </div>

          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}
          >
            Elevate Your Peak <br />
            <span className="text-gradient">Performance</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              color: 'var(--text-secondary)',
              marginBottom: '40px',
              lineHeight: 1.6,
            }}
          >
            Log workouts, track key metrics, and receive tailored AI-powered recommendations to shatter your personal records.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={20} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Multi-sport tracking (Running, Weights, Cycling, Yoga & more)
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={20} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                AI-driven recovery & safety recommendations
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={20} color="var(--accent-cyan)" />
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                Interactive weekly trend analytics & insights
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right login form */}
      <div
        style={{
          flex: '1 1 50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        <GlassCard
          className="animate-scale-in"
          style={{
            width: '100%',
            maxWidth: '440px',
            padding: '40px 36px',
            background: 'rgba(18, 18, 28, 0.85)',
          }}
        >
          <div style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '8px' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Enter your credentials to access your fitness dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Input
              id="login-email"
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              required
            />

            <div style={{ position: 'relative' }}>
              <Input
                id="login-password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              fullWidth
              loading={loading}
              icon={ArrowRight}
              style={{ marginTop: '8px' }}
            >
              Sign In
            </Button>
          </form>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              margin: '24px 0',
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
            <span>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-glass)' }} />
          </div>

          {/* Google Sign-in mount / button */}
          <div ref={googleBtnRef} style={{ display: 'flex', justifyContent: 'center', minHeight: '40px' }}>
            <button
              type="button"
              onClick={() => {
                toast.info('Enter credentials or register a test account below.');
              }}
              style={{
                width: '100%',
                padding: '11px 16px',
                borderRadius: 'var(--border-radius)',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Footer switch */}
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Don't have an account? </span>
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--accent-lime)' }}>
              Sign Up
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;
