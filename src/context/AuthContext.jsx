import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [membre, setMembre]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('membre')); } catch { return null; }
  });
  const [token, setToken]     = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  const saveAuth = (token, membre) => {
    localStorage.setItem('token', token);
    localStorage.setItem('membre', JSON.stringify(membre));
    setToken(token);
    setMembre(membre);
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('membre');
    setToken(null);
    setMembre(null);
  };

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const res = await apiLogin(credentials);
      saveAuth(res.data.token, res.data.membre);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const res = await apiRegister(data);
      saveAuth(res.data.token, res.data.membre);
      return res.data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch { /* ignore */ }
    clearAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ membre, token, loading, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
