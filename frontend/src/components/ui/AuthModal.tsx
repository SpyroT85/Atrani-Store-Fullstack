import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { IoClose } from 'react-icons/io5';
import { FiEye, FiEyeOff } from 'react-icons/fi';

const API_URL = 'http://localhost:5000';

interface AuthModalProps {
  onClose: () => void;
}

type Mode = 'login' | 'signup' | 'verify';

function validatePassword(password: string): string {
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 16) return 'Password must be at most 16 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
  if (!/[^a-zA-Z0-9]/.test(password)) return 'Password must contain at least one symbol';
  return '';
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordValid = mode !== 'signup' || (
    password.length >= 6 &&
    password.length <= 16 &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  );

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (mode === 'login') {
      const success = await login(email, password);
      if (!success) { setError('Invalid email or password'); setLoading(false); return; }
      onClose();
    } else {
      if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
      const pwError = validatePassword(password);
      if (pwError) { setError(pwError); setLoading(false); return; }
      const success = await signup(name, email, password);
      if (!success) { setError('Email already in use'); setLoading(false); return; }
      setLoading(false);
      setMode('verify');
    }
  };

  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`;
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '13px',
    padding: '12px 16px',
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.05)',
    color: 'white',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '10px',
    letterSpacing: '0.12em',
    color: '#999',
    textTransform: 'uppercase',
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      />

      <div
        style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 101, width: '100%', maxWidth: '420px', backgroundColor: '#1a1a1a', borderTop: '3px solid #a37a41', borderRadius: '4px', boxShadow: '-4px 0 24px rgba(0,0,0,0.4)', padding: '32px', boxSizing: 'border-box' }}
        onClick={e => e.stopPropagation()}
      >
        {mode === 'verify' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <p style={{ fontSize: '40px', marginBottom: '16px' }}>✉️</p>
            <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', marginBottom: '12px' }}>
              Check your email
            </h2>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#999', lineHeight: 1.7, margin: 0 }}>
              We sent a verification link to<br />
              <span style={{ color: '#a37a41' }}>{email}</span>.<br />
              Click it to activate your account.
            </p>
            <button
              onClick={onClose}
              style={{ marginTop: '28px', padding: '12px 32px', background: '#a37a41', color: 'white', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Got it
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', margin: 0 }}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </h2>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#a37a41', marginTop: '6px', letterSpacing: '0.06em' }}>
                  {mode === 'login' ? 'Welcome back to Atrani' : 'Join Atrani'}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', padding: '4px', display: 'flex', alignItems: 'center' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                onMouseLeave={e => (e.currentTarget.style.color = '#999')}
              >
                <IoClose size={22} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode === 'signup' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>Name</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" style={inputStyle} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#666', display: 'flex', alignItems: 'center', padding: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#666')}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
                {mode === 'signup' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                    {[
                      { label: 'At least 6 characters', valid: password.length >= 6 },
                      { label: 'At most 16 characters', valid: password.length > 0 && password.length <= 16 },
                      { label: 'At least one uppercase letter', valid: /[A-Z]/.test(password) },
                      { label: 'At least one number', valid: /[0-9]/.test(password) },
                      { label: 'At least one symbol', valid: /[^a-zA-Z0-9]/.test(password) },
                    ].map(({ label, valid }) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: password.length === 0 ? '#555' : valid ? '#4ade80' : '#f87171', lineHeight: 1 }}>
                          {password.length === 0 ? '–' : valid ? '✓' : '✗'}
                        </span>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', letterSpacing: '0.04em', color: password.length === 0 ? '#555' : valid ? '#4ade80' : '#f87171' }}>
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#f87171', margin: 0 }}>{error}</p>}

              <button
                type="submit"
                disabled={loading || !passwordValid}
                style={{ marginTop: '4px', padding: '14px', background: '#a37a41', color: 'white', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', border: 'none', borderRadius: '4px', cursor: loading || !passwordValid ? 'not-allowed' : 'pointer', opacity: loading || !passwordValid ? 0.5 : 1 }}
                onMouseEnter={e => { if (!loading && passwordValid) e.currentTarget.style.background = '#8a5e3a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#a37a41'; }}
              >
                {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div style={{ margin: '20px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            </div>

            <button
              onClick={handleGoogle}
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '13px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '4px', background: 'transparent', color: 'white', fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#a37a41')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.7-2.9-11.3-7l-6.5 5C9.6 39.5 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              Continue with Google
            </button>

            <p style={{ textAlign: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#666', marginTop: '20px', marginBottom: 0 }}>
              {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setPassword(''); setShowPassword(false); }}
                style={{ color: '#a37a41', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: '11px', padding: 0 }}
                onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </>
        )}
      </div>
    </>
  );
}