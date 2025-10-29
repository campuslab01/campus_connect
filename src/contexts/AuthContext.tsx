import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  department?: string;
  age?: number;
  bio?: string;
  interests?: string[];
  lookingFor?: string[];
  relationshipStatus?: string;
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  lastSeen: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: any) => Promise<AuthResult>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(false);

  // Use the centralized axios configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api',
    withCredentials: true,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // AuthContext API configuration

  // Add request interceptor for JWT token
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for auth errors
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // Token is invalid, clear it and redirect to auth
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        setUser(null);
      }
      return Promise.reject(error);
    }
  );

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenTimestamp = localStorage.getItem('tokenTimestamp');
    
    if (token && tokenTimestamp) {
      // Check if token is expired (5 hours = 5 * 60 * 60 * 1000 milliseconds)
      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const fiveHours = 5 * 60 * 60 * 1000;
      
      if (tokenAge > fiveHours) {
        // Token expired, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('tokenTimestamp');
        setUser(null);
      } else {
        // Token is still valid, verify it
        verifyToken();
      }
    }
  }, []);

  // Set up periodic session timeout checker
  useEffect(() => {
    const checkSessionTimeout = () => {
      const token = localStorage.getItem('token');
      const tokenTimestamp = localStorage.getItem('tokenTimestamp');
      
      if (token && tokenTimestamp) {
        const tokenAge = Date.now() - parseInt(tokenTimestamp);
        const fiveHours = 5 * 60 * 60 * 1000;
        
        if (tokenAge > fiveHours) {
          // Session expired, log out user
          localStorage.removeItem('token');
          localStorage.removeItem('tokenTimestamp');
          setUser(null);
        }
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkSessionTimeout, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await api.get('/auth/me');

      if (response.data.status === 'success') {
        setUser(response.data.data.user);
      }
    } catch (error) {
      // Token is invalid, remove it
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
  
      if (response.data.status === 'success') {
        const { user: userData, token } = response.data.data;
  
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
  
        setUser(userData);
  
        return { success: true, message: 'Login successful', user: userData };
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const register = async (userData: any): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
  
      if (response.data.status === 'success') {
        const { user: newUser, token } = response.data.data;
  
        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());
  
        setUser(newUser);
  
        return { success: true, message: 'Registration successful', user: newUser };
      } else {
        return { success: false, message: response.data.message || 'Registration failed' };
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local state regardless of API call success
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTimestamp');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};