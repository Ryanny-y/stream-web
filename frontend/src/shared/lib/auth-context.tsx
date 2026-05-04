import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthResponse, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth_data');
    if (storedAuth) {
      try {
        const authData: AuthResponse = JSON.parse(storedAuth);
        setState({
          user: {
            userId: authData.userId,
            username: authData.username,
            email: authData.email,
            fullName: authData.fullName,
            roles: authData.roles,
          },
          accessToken: authData.accessToken,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Failed to parse stored auth data', error);
        localStorage.removeItem('auth_data');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback((data: AuthResponse) => {
    localStorage.setItem('auth_data', JSON.stringify(data));
    setState({
      user: {
        userId: data.userId,
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        roles: data.roles,
      },
      accessToken: data.accessToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_data');
    setState({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
