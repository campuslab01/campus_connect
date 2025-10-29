import axios from 'axios';

// Create axios instance with base configuration
// Updated for production deployment
let baseURL = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';

// Ensure baseURL ends with /api
if (!baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}

// Debug logging
console.log('🔍 Axios Configuration Debug:');
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('Final baseURL:', baseURL);
console.log('Environment:', import.meta.env.MODE);
console.log('Build timestamp:', new Date().toISOString());

const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Making API request to:', config.baseURL + config.url);
    console.log('Full URL:', config.url);
    console.log('Method:', config.method?.toUpperCase());
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token added to request');
    } else {
      console.log('⚠️ No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error.message);
    console.error('❌ Error URL:', error.config?.url);
    console.error('❌ Error Status:', error.response?.status);
    console.error('❌ Error Data:', error.response?.data);
    
    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - clearing token and redirecting');
      // Token is invalid, clear it and redirect to auth
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
