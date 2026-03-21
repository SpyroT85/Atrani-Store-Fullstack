import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API_URL = 'https://api.spyros-tserkezos.dev';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { navigate('/login'); return; }

    fetch(`${API_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(user => {
        loginWithToken(token, user);
        navigate('/');
      })
      .catch(() => navigate('/login'));
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#F1F1F1]">
      <div
        style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e0d6c8',
          borderTop: '3px solid #C8874A',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}