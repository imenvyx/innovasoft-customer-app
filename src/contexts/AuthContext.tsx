import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginRequest, RegisterRequest } from '../interfaces/auth';
import { login as loginService, register as registerService } from '../services/api/authService';
import { useTranslation } from 'react-i18next';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({ ...parsedUser, token: storedToken });
      } catch {
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginService(credentials);
      const userData: User = {
        id: response.userid,
        username: response.username,
        token: response.token,
        expiration: response.expiration,
      };
      setUser(userData);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Remember username if requested
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', credentials.username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.loginError');
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const register = useCallback(async (userData: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await registerService(userData);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t('auth.registerError');
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  const logout = useCallback(() => {
    setUser(null);
    // Solo limpiar tokens de autenticación, NO rememberedUsername ni rememberMe
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
