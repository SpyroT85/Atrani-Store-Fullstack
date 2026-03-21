import { useAuth } from '../../context/AuthContext';
import Login from '../../pages/Login';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin } = useAuth();

  if (!admin) return <Login />;

  return <>{children}</>;
}