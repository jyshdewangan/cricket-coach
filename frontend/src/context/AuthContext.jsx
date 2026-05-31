import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser as apiLogin, registerUser as apiRegister, getMe } from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ghost_coach_token'));
  const [loading, setLoading] = useState(true);

  // Validate existing token on mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await getMe();
        setUser(res.data);
      } catch {
        localStorage.removeItem('ghost_coach_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    validateToken();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await apiLogin({ email, password });
    const jwt = res.data.token;
    const userData = res.data.user;
    localStorage.setItem('ghost_coach_token', jwt);
    setToken(jwt);
    // Fetch full user profile
    try {
      const meRes = await getMe();
      setUser(meRes.data);
    } catch {
      setUser(userData);
    }
    return res.data;
  }, []);

  const register = useCallback(async (data) => {
    const res = await apiRegister(data);
    const jwt = res.data.token;
    const userData = res.data.user;
    localStorage.setItem('ghost_coach_token', jwt);
    setToken(jwt);
    try {
      const meRes = await getMe();
      setUser(meRes.data);
    } catch {
      setUser(userData);
    }
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('ghost_coach_token');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
