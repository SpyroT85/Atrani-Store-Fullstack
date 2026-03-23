import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [invitedMsg, setInvitedMsg] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('invited') === 'true') {
      setInvitedMsg('Account created! Please log in.');
    }
  }, []);

  const handleLogin = async (emailVal: string, passwordVal: string) => {
    setError('');
    setLoading(true);
    const success = await login(emailVal, passwordVal);
    if (!success) {
      setError('Invalid credentials');
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">

        <div className="mb-8">
          <h1 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">Atrani Admin Panel</h1>
          <p className="text-sm text-zinc-400 mt-1">Sign in to your account</p>
          {invitedMsg && (
            <div className="text-green-600 text-sm mt-2">{invitedMsg}</div>
          )}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(email, password); }} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="text-sm px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-500">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm px-3 py-2 pr-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#C8874A]/40 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2 rounded-lg bg-[#C8874A] text-white text-sm font-medium hover:bg-[#b5763f] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={() => handleLogin('demo@atrani-adminpanel.com', 'admin123')}
            disabled={loading}
            className="w-full py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 dark:text-zinc-400 hover:border-[#C8874A]/50 hover:text-[#C8874A] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try Demo
          </button>
        </div>

      </div>
    </div>
  );
}