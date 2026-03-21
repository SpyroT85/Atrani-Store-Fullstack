import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithToken: (token: string, userData: Omit<User, 'token'>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const API_URL = 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      const userData = { ...data.user, token: data.token };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch {
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/api/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const loginWithToken = (token: string, userData: Omit<User, 'token'>) => {
    const full = { ...userData, token };
    setUser(full);
    localStorage.setItem('user', JSON.stringify(full));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}