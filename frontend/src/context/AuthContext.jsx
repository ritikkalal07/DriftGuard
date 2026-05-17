import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * Auth Context – provides login / signup / logout and session state
 * to every route in the application.
 */
const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /* ── restore session on mount ─────────────────────────────────── */
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      try {
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (_err) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  };

  /* ── login ─────────────────────────────────────────────────────── */
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.login({ email, password });

      if (response.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true };
      }

      const message = response?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } catch (error) {
      const message = typeof error === 'string'
        ? error
        : (error?.message || error?.data?.message || 'Login failed');
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ── signup ────────────────────────────────────────────────────── */
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await authAPI.signup({ name, email, password });

      if (response.success) {
        const { user, token } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsAuthenticated(true);
        toast.success('Account created successfully!');
        return { success: true };
      }
    } catch (error) {
      const message = typeof error === 'string'
        ? error
        : (error?.message || error?.data?.message || 'Signup failed');
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  /* ── logout ────────────────────────────────────────────────────── */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  /* ── context value ─────────────────────────────────────────────── */
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
