import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  // ─── Ensure stored Bearer token is in every axios request ───────────────────
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // ─── Check existing session on mount ────────────────────────────────────────
  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      if (err.status !== 401) {
        console.error('Auth check error:', err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Login ───────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        const { user: loggedInUser, token } = res.data;

        // Persist token for Bearer auth (cross-origin cookie fallback)
        if (token) {
          localStorage.setItem('authToken', token);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }

        setUser(loggedInUser);
        return { success: true, user: loggedInUser };
      }
      throw new Error(res.message || 'Login failed');
    } catch (err) {
      const errMsg = err.message || 'Invalid email or password';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Register ────────────────────────────────────────────────────────────────
  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const res = await api.post('/auth/register', userData);
      if (res.success && res.data) {
        const { user: registeredUser } = res.data;
        return { success: true, user: registeredUser };
      }
      throw new Error(res.message || 'Registration failed');
    } catch (err) {
      const errMsg = err.message || 'Could not complete registration';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error on backend:', err);
    } finally {
      // Clear stored token
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  };

  // ─── Refresh user profile ────────────────────────────────────────────────────
  const refreshUser = async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.data?.user) {
        setUser(res.data.user);
      }
    } catch (err) {
      console.error('Error refreshing user details:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        refreshUser,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
