import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { updateEchoAuth } from '../lib/echo';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return (token && storedUser) ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(() => Boolean(localStorage.getItem('token')));

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const bootstrapAuth = async () => {
      try {
        updateEchoAuth(token);
        const response = await api.get('/user');

        if (cancelled) {
          return;
        }

        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      } catch {
        if (cancelled) {
          return;
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        updateEchoAuth(null);
        setUser(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    bootstrapAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/login', { email, password });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    updateEchoAuth(token);
    setUser(user);
    return user;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await api.post('/register', { name, email, password, password_confirmation });
    const { user, token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    updateEchoAuth(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch {
      // Ignored
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateEchoAuth(null);
    setUser(null);
  };

  const switchRole = async () => {
    const response = await api.post('/user/switch-role');
    const updatedUser = response.data.user;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };


  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const refreshUser = async () => {
    const response = await api.get('/user');
    localStorage.setItem('user', JSON.stringify(response.data));
    setUser(response.data);
    return response.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, switchRole, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
