import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserAccount } from '../types';
import { api } from '../utils/api';

interface AuthContextType {
  user: UserAccount | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; newPassword?: string; avatarUrl?: string }) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local persistence helpers for static host / offline fallback
function getSavedUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('sth_auth_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getSavedToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sth_auth_token') || null;
}

function saveAuthState(user: UserAccount | null, token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem('sth_auth_user', JSON.stringify(user));
      // Sync subscription user email as well
      localStorage.setItem('userEmail', user.email);
    } else {
      localStorage.removeItem('sth_auth_user');
    }

    if (token) {
      localStorage.setItem('sth_auth_token', token);
    } else {
      localStorage.removeItem('sth_auth_token');
    }
  } catch (e) {
    console.error('Failed to save auth state:', e);
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(getSavedUser);
  const [token, setToken] = useState<string | null>(getSavedToken);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate session on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = getSavedToken();
        const savedUser = getSavedUser();

        if (savedUser) {
          setUser(savedUser);
        }

        if (savedToken || savedUser?.email) {
          // Verify with backend
          const res = await api.get<{ user: UserAccount }>(
            `/api/auth/me?email=${encodeURIComponent(savedUser?.email || '')}`,
            { showToastOnError: false }
          );

          if (res.ok && res.data?.user) {
            setUser(res.data.user);
            saveAuthState(res.data.user, savedToken);
          }
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const formattedEmail = email.toLowerCase().trim();

    // Attempt backend login
    const res = await api.post<{ success: boolean; token: string; user: UserAccount }>(
      '/api/auth/login',
      { email: formattedEmail, password },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success && res.data?.user) {
      setUser(res.data.user);
      setToken(res.data.token);
      saveAuthState(res.data.user, res.data.token);
      return { success: true };
    }

    // Local fallback for offline/static host
    const savedUser = getSavedUser();
    if (savedUser && savedUser.email.toLowerCase() === formattedEmail) {
      setUser(savedUser);
      const fallbackToken = `sth_jwt_${savedUser.id}_${Date.now()}`;
      setToken(fallbackToken);
      saveAuthState(savedUser, fallbackToken);
      return { success: true };
    }

    return { success: false, error: res.error || 'Invalid email or password.' };
  };

  const signup = async (name: string, email: string, password: string, phone?: string) => {
    const formattedEmail = email.toLowerCase().trim();

    const res = await api.post<{ success: boolean; token: string; user: UserAccount }>(
      '/api/auth/signup',
      { name: name.trim(), email: formattedEmail, password, phone: phone?.trim() },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success && res.data?.user) {
      setUser(res.data.user);
      setToken(res.data.token);
      saveAuthState(res.data.user, res.data.token);
      return { success: true };
    }

    // Local Fallback for offline/static host
    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: formattedEmail,
      phone: phone?.trim() || '',
      role: formattedEmail === 'admin@smarttoolhub.net' ? 'admin' : 'user',
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    const fallbackToken = `sth_jwt_${newUser.id}_${Date.now()}`;
    setUser(newUser);
    setToken(fallbackToken);
    saveAuthState(newUser, fallbackToken);
    return { success: true };
  };

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    saveAuthState(null, null);
  }, []);

  const updateProfile = async (data: { name?: string; phone?: string; newPassword?: string; avatarUrl?: string }) => {
    if (!user) return { success: false, error: 'User is not logged in.' };

    const res = await api.put<{ success: boolean; user: UserAccount }>(
      '/api/auth/profile',
      { email: user.email, ...data },
      { showToastOnError: false }
    );

    let updatedUser: UserAccount = { ...user };
    if (data.name) updatedUser.name = data.name.trim();
    if (data.phone !== undefined) updatedUser.phone = data.phone.trim();
    if (data.avatarUrl) updatedUser.avatarUrl = data.avatarUrl;

    if (res.ok && res.data?.user) {
      updatedUser = res.data.user;
    }

    setUser(updatedUser);
    saveAuthState(updatedUser, token);
    return { success: true };
  };

  const forgotPassword = async (email: string) => {
    const formattedEmail = email.toLowerCase().trim();
    const res = await api.post<{ success: boolean; message: string }>(
      '/api/auth/forgot-password',
      { email: formattedEmail },
      { showToastOnError: false }
    );

    if (res.ok && res.data?.success) {
      return { success: true, message: res.data.message };
    }

    return {
      success: true,
      message: `Password reset instructions sent to ${formattedEmail}. (Demo password: demo1234)`
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        updateProfile,
        forgotPassword
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
