'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API_BASE } from '@/lib/cities';

interface AuthUser {
  id: number;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

const TOKEN_KEY = 'civicpulse-token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setLoading(false);
      return;
    }
    fetch(`${API_BASE}/api/me`, { headers: { Authorization: `Bearer ${stored}` } })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((u) => {
        setUser(u);
        setToken(stored);
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setUser(u);
  };

  const login = async (username: string, password: string) => {
    const r = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail ?? 'Login failed');
    }
    const data = await r.json();
    persist(data.token, data.user);
  };

  const register = async (username: string, password: string) => {
    const r = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail ?? 'Registration failed');
    }
    const data = await r.json();
    persist(data.token, data.user);
  };

  const logout = async () => {
    if (token) {
      fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
