import axios from 'axios';
let baseURL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000/api' : '');
if (!import.meta.env.DEV && !baseURL) {
  throw new Error('VITE_API_URL is required for non-development builds');
}
if (import.meta.env.DEV) {
  const isLocalhost = baseURL.startsWith('http://localhost:') || baseURL.startsWith('https://localhost:');
  if (!isLocalhost) {
    throw new Error('Development must use localhost API. Set VITE_API_URL=http://localhost:5000/api');
  }
}
if (!baseURL.endsWith('/api')) {
  baseURL = baseURL.endsWith('/') ? baseURL + 'api' : baseURL + '/api';
}
const api = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
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
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    if (import.meta.env.DEV) {
      console.error(`❌ ${error.config?.method?.toUpperCase()} ${url} - ${status || 'Network Error'}`, {
        message: error.response?.data?.message,
        errors: error.response?.data?.errors,
      });
    }
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    if (status === 429) {
      const retryAfter = error.response?.headers['retry-after'];
      const message = retryAfter 
        ? `Too many requests. Please try again in ${retryAfter} seconds.`
        : 'Too many requests. Please try again later.';
      (error as any).rateLimitInfo = {
        retryAfter: retryAfter ? parseInt(retryAfter) * 1000 : 60000,
        message,
      };
    }
    return Promise.reject(error);
  }
);
export default api;
