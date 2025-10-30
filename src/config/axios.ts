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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, clear it and redirect to auth
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
