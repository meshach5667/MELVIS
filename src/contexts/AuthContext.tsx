import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  handleLogin as apiLogin, 
  handleSignup as apiSignup, 
  getUserData as getStoredUserData,
  clearAuthData,
  setAuthData,
  isAuthenticated as checkAuth,
  type User
} from '../utils/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token and user data on app load
    const userData = getStoredUserData();
    const isAuth = checkAuth();
    
    if (isAuth && userData) {
      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await apiLogin(email, password);
      
      if (result.success && result.data) {
        setAuthData(result.data);
        setUser(result.data.user);
        return { success: true };
      }
      
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const result = await apiSignup(name, email, password, confirmPassword);
      
      if (result.success && result.data) {
        setAuthData(result.data);
        setUser(result.data.user);
        return { success: true };
      }
      
      return { success: false, error: result.error || 'Registration failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuthData();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};