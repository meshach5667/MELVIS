import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import { handleSignup as apiHandleSignup, handleLogin as apiHandleLogin } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string; // This might become 'username' or 'fullName' depending on backend
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  // Reverted to 5 arguments, omitting lastName
  signup: (name: string, username: string, email: string, password: string, confirmPassword: string) => Promise<boolean>; 
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
    // Check for existing auth token
    const token = Cookies.get('auth_token');
    const userData = Cookies.get('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        Cookies.remove('auth_token');
        Cookies.remove('user_data');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const success = await apiHandleLogin(email, password); // Use actual API handler
      if (success) {
        // Assuming apiHandleLogin now stores user data and token
        // Fetch user data from where apiHandleLogin stores it (e.g., localStorage)
        // For now, let's assume it returns the user or we can fetch it
        // This part might need adjustment based on how apiHandleLogin is implemented
        const userData = Cookies.get('user_data'); // Or localStorage.getItem('user')
        if (userData) {
          setUser(JSON.parse(userData));
        }
      }
      return success;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Reverted to 5 arguments, omitting lastName
  const signup = async (name: string, username: string, email: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      // Reverted to 5 arguments, omitting lastName
      const success = await apiHandleSignup(name, username, email, password, confirmPassword);
      if (success) {
        const userDataString = Cookies.get('user_data') || localStorage.getItem('user');
        if (userDataString) { // Corrected syntax error: removed extra parenthesis
          const parsedUser = JSON.parse(userDataString);
          setUser({
            id: parsedUser.id || parsedUser.user?.id,
            email: parsedUser.email || parsedUser.user?.email,
            name: parsedUser.name || parsedUser.username || parsedUser.user?.username,
          });
        }
      }
      return success;
    } catch (error) {
      console.error('Signup error in AuthContext:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    Cookies.remove('auth_token');
    Cookies.remove('user_data');
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