import axios from 'axios';

// Create axios instance with base configuration
// Prefer local API in development for faster iteration
let baseURL = import.meta.env.VITE_API_URL
  || (import.meta.env.DEV ? 'http://localhost:5000/api' : 'https://campus-connect-server-yqbh.onrender.com/api');

// Ensure baseURL ends with /api
if (!baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

// Production-ready axios configuration

const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle auth errors and logging
api.interceptors.response.use(
  (response) => {
    // Log successful API calls in development
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Enhanced error handling
    const status = error.response?.status;
    const url = error.config?.url;
    
    // Log errors for debugging
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${url} - ${status || 'Network Error'}`, {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
      });
    }
    
    // Handle 401 Unauthorized
    if (status === 401) {
      // Token is invalid, clear it and redirect to auth
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    
    // Handle 429 Rate Limit
    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after'];
      const message = retryAfter 
        ? `Too many requests. Please try again in ${retryAfter} seconds.`
        : 'Too many requests. Please try again later.';
      
      // Store rate limit info for retry logic
      (error as any).rateLimitInfo = {
        retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : 60000,
        message,
      };
    }
    
    return Promise.reject(error);
  }
);

export default api;
