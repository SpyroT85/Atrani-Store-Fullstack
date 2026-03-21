import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://api.spyros-tserkezos.dev';

export default function AcceptInvite() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    if (!t) setError('Invalid or missing invite link.');
    else setToken(t);
  }, []);

  const handleSubmit = async () => {
    setError('');
    if (!password) { setError('Password is required.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admins/accept-invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      setSuccess(true);
      setTimeout(() => navigate('/?invited=true'), 2500);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit();
    };

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition";

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">Atrani Admin Panel</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {success ? 'Account created!' : 'Set your password to activate your account.'}
          </p>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-green-500 text-xl">✓</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center">
              Your account has been created. Redirecting to login...
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-500">Confirm Password</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="••••••••"
                className={inputClass}
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !token}
              className="mt-2 w-full py-2 rounded-lg bg-[#C8874A] text-white text-sm font-medium hover:bg-[#b5763f] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}