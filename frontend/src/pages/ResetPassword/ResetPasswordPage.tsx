import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';

const API_URL = 'https://api.spyros-tserkezos.dev';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async () => {
    setError('');
    if (!password || !confirm) { setError('All fields are required'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
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

  if (!token) {
    return (
      <Layout>
        <div style={{ minHeight: '100vh', background: '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'Manrope, sans-serif', color: '#999' }}>Invalid reset link.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div style={{
          width: '100%', maxWidth: '420px',
          background: '#1a1a1a', borderTop: '3px solid #a37a41',
          borderRadius: '4px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
          padding: '32px', boxSizing: 'border-box',
        }}>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: '40px', marginBottom: '16px' }}>✅</p>
              <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', marginBottom: '12px' }}>
                Password Reset!
              </h2>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#999', lineHeight: 1.7 }}>
                Your password has been changed. Redirecting to home...
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '28px' }}>
                <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'white', margin: 0 }}>
                  Reset Password
                </h2>
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#a37a41', marginTop: '6px', letterSpacing: '0.06em' }}>
                  Enter your new password
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>New Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" style={inputStyle} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>Confirm Password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" style={inputStyle} />
                </div>

                {error && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#f87171', margin: 0 }}>{error}</p>}

                <button
                  onClick={handleReset}
                  disabled={loading}
                  style={{
                    marginTop: '4px', padding: '14px',
                    background: '#a37a41', color: 'white',
                    fontFamily: 'Manrope, sans-serif', fontSize: '11px', fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: 'none', borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#8a5e3a'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#a37a41'; }}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
}