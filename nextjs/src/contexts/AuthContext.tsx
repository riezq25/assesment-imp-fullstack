'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        fetchProfile();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get<{ data: User }>('/auth/profile');
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      const { user, token, } = response.data;
      console.log(response.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      const response = await api.post<AuthResponse>('/auth/register', credentials);
      const { user, token } = response.data;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
      }
      setUser(user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
