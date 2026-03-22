import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/Layout';
import AvatarUpload from '../../components/AvatarUpload';

const API_URL = 'https://api.spyros-tserkezos.dev';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Detect Google user (no password)
  const isGoogleUser = !user?.email || user.avatar?.includes('googleusercontent');

  if (!user) {
    navigate('/');
    return null;
  }

  const handleAvatarUpload = async (url: string) => {
    try {
      await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name: user.name, avatar: url }),
      });
      updateUser({ avatar: url });
    } catch {
      // silent fail — avatar still shows from local state
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) { setProfileError('Name is required'); return; }
    setSavingProfile(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      const res = await fetch(`${API_URL}/api/users/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ name, avatar: user.avatar }),
      });
      if (!res.ok) throw new Error('Failed to save');
      updateUser({ name });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch {
      setProfileError('Failed to save changes');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    setPasswordSuccess(false);
    if (!currentPassword || !newPassword || !confirmPassword) { setPasswordError('All fields are required'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return; }

    setSavingPassword(true);
    try {
      const res = await fetch(`${API_URL}/api/users/me/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { setPasswordError(data.error); return; }
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch {
      setPasswordError('Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '13px',
    padding: '12px 16px',
    border: '1px solid #e5e5e5',
    borderRadius: '4px',
    background: 'white',
    color: '#1a1a1a',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    color: '#666',
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: '#a37a41',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
  };

  return (
    <Layout>
      <div style={{ minHeight: '100vh', background: '#F2F2F2', padding: 'clamp(40px, 6vw, 80px) 16px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Header */}
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 300, color: '#1a1a1a', margin: 0 }}>
              My Profile
            </h1>
            <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', color: '#999', marginTop: '6px', letterSpacing: '0.04em' }}>
              Manage your account settings
            </p>
          </div>

          {/* Avatar + Name section */}
          <div style={{ background: 'white', borderRadius: '8px', padding: 'clamp(24px, 4vw, 40px)' }}>
            <p style={sectionTitleStyle}>Profile Information</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
              <AvatarUpload
                currentAvatar={user.avatar}
                name={user.name}
                token={user.token}
                onUpload={handleAvatarUpload}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = '#a37a41')}
                  onBlur={e => (e.target.style.borderColor = '#e5e5e5')}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  style={{ ...inputStyle, background: '#f9f9f9', color: '#999', cursor: 'not-allowed' }}
                />
                <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '10px', color: '#bbb', margin: 0 }}>
                  Email cannot be changed
                </p>
              </div>

              {profileError && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#f87171', margin: 0 }}>{profileError}</p>}
              {profileSuccess && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#4ade80', margin: 0 }}>✓ Profile saved successfully</p>}

              <button
                onClick={handleSaveProfile}
                disabled={savingProfile}
                style={{
                  alignSelf: 'flex-start',
                  padding: '12px 28px',
                  background: '#a37a41',
                  color: 'white',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '10px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: savingProfile ? 'not-allowed' : 'pointer',
                  opacity: savingProfile ? 0.6 : 1,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => { if (!savingProfile) e.currentTarget.style.background = '#8a5e3a'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#a37a41'; }}
              >
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Change Password section — hidden for Google users */}
          {!isGoogleUser && (
            <div style={{ background: 'white', borderRadius: '8px', padding: 'clamp(24px, 4vw, 40px)' }}>
              <p style={sectionTitleStyle}>Change Password</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>Current Password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#a37a41')}
                    onBlur={e => (e.target.style.borderColor = '#e5e5e5')}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#a37a41')}
                    onBlur={e => (e.target.style.borderColor = '#e5e5e5')}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = '#a37a41')}
                    onBlur={e => (e.target.style.borderColor = '#e5e5e5')}
                  />
                </div>

                {passwordError && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#f87171', margin: 0 }}>{passwordError}</p>}
                {passwordSuccess && <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#4ade80', margin: 0 }}>✓ Password changed successfully</p>}

                <button
                  onClick={handleChangePassword}
                  disabled={savingPassword}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '12px 28px',
                    background: '#a37a41',
                    color: 'white',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: savingPassword ? 'not-allowed' : 'pointer',
                    opacity: savingPassword ? 0.6 : 1,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => { if (!savingPassword) e.currentTarget.style.background = '#8a5e3a'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#a37a41'; }}
                >
                  {savingPassword ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </div>
          )}

          {/* Google user info */}
          {isGoogleUser && (
            <div style={{ background: 'white', borderRadius: '8px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-4z"/>
                <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
                <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.5 35.6 26.9 36 24 36c-5.2 0-9.7-2.9-11.3-7l-6.5 5C9.6 39.5 16.3 44 24 44z"/>
                <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.8l6.2 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
              </svg>
              <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: '11px', color: '#999', margin: 0 }}>
                You're signed in with Google. Password management is handled by Google.
              </p>
            </div>
          )}

          {/* Logout */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => { logout(); navigate('/'); }}
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#f87171',
                background: 'none',
                border: '1px solid rgba(248,113,113,0.3)',
                borderRadius: '4px',
                padding: '10px 20px',
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; e.currentTarget.style.borderColor = '#f87171'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
}