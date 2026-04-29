import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, ready } = useAuth();

  if (!ready) return null;
  if (!admin) return <Login />;

  return <>{children}</>;
}