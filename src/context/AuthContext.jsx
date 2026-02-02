import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { updateEchoAuth } from '../lib/echo';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
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
    } catch (error) {
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    updateEchoAuth(null);
    setUser(null);
  };

  const switchRole = async () => {
    if (!user) return null;
    if (isSwitchingRole) return user;

    const previousUser = user;
    const nextRole = previousUser.current_role === 'seeker' ? 'provider' : 'seeker';
    const optimisticUser = { ...previousUser, current_role: nextRole };

    setIsSwitchingRole(true);
    setUser(optimisticUser);
    localStorage.setItem('user', JSON.stringify(optimisticUser));

    try {
      const response = await api.post('/user/switch-role');
      const updatedUser = response.data.user;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      localStorage.setItem('user', JSON.stringify(previousUser));
      setUser(previousUser);
      throw error;
    } finally {
      setIsSwitchingRole(false);
    }
  };

  const updateUser = (updatedUser) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isSwitchingRole, login, register, logout, switchRole, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
