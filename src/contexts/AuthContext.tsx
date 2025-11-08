import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  college: string;
  department?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  interests?: string[];
  lookingFor?: string[];
  relationshipStatus?: string;
  profileImage?: string;
  photos?: string[];
  isVerified?: boolean;
  isActive: boolean;
  createdAt: string;
  lastSeen: string;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
  errors?: Array<{ msg: string; param?: string }>; // optional detailed backend errors
}


interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: any) => Promise<AuthResult>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  isBootstrapping: boolean;
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
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // Use the centralized axios configuration
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api',
    withCredentials: true,
    timeout: 60000,
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
        setIsBootstrapping(false);
      } else {
        // Token is still valid, verify it
        verifyToken().finally(() => setIsBootstrapping(false));
      }
    } else {
      setIsBootstrapping(false);
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
      console.log('[LOGIN] Sending payload:', { email, password });
      console.log('[LOGIN] Endpoint: /auth/login');
      // Warm up backend (Render free instances may cold start)
      try {
        await api.get('/health', { timeout: 10000 });
      } catch (_) {
        // ignore health check failure; proceed to attempt login
      }

      let response;
      try {
        response = await api.post('/auth/login', { email, password });
      } catch (err: any) {
        if (err?.code === 'ECONNABORTED') {
          // Retry once after timeout
          try {
            await api.get('/health', { timeout: 10000 }).catch(() => {});
            response = await api.post('/auth/login', { email, password });
          } catch (e) {
            throw err;
          }
        } else {
          throw err;
        }
      }
      console.log('[LOGIN] Response:', response.data);

      if (response.data.status === 'success') {
        const { user: userData, token } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());

        setUser(userData);

        return { success: true, message: 'Login successful', user: userData };
      } else {
        console.warn('[LOGIN] Backend returned error:', response.data);
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error: any) {
      const backend = error?.response?.data;
      console.error('[LOGIN] Error:', error);
      if (backend) {
        console.error('[LOGIN] Backend error response:', backend);
      }
      const firstErrorMsg = backend?.errors?.[0]?.msg;
      const errorMessage = firstErrorMsg || backend?.message || 'Login failed';
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<AuthResult> => {
    setIsLoading(true);
    try {
      console.log('[REGISTER] Sending payload:', userData);
      console.log('[REGISTER] Endpoint: /auth/register');
      const response = await api.post('/auth/register', userData);
      console.log('[REGISTER] Response:', response.data);

      if (response.data.status === 'success') {
        const { user: newUser, token } = response.data.data;

        localStorage.setItem('token', token);
        localStorage.setItem('tokenTimestamp', Date.now().toString());

        setUser(newUser);

        return { success: true, message: 'Registration successful', user: newUser };
      } else {
        console.warn('[REGISTER] Backend returned error:', response.data);
        return { success: false, message: response.data.message || 'Registration failed' };
      }
    } catch (error: any) {
      const backend = error?.response?.data;
      console.error('[REGISTER] Error:', error);
      if (backend) {
        console.error('[REGISTER] Backend error response:', backend);
      }
      const firstErrorMsg = backend?.errors?.[0]?.msg;
      const errorMessage = firstErrorMsg || backend?.message || 'Registration failed';
      return { success: false, message: errorMessage, errors: backend?.errors };
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

  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    updateUser,
    isLoading,
    isBootstrapping,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};