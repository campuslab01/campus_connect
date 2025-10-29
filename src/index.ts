import axios from 'axios';

// Determine the base URL based on the environment
// Vite exposes environment variables on the `import.meta.env` object.
// Variables prefixed with VITE_ are exposed to the client-side code.
let API_BASE_URL = import.meta.env.VITE_API_URL || 'https://campus-connect-server-yqbh.onrender.com/api';

// Ensure API_BASE_URL ends with /api
if (!API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.endsWith('/') ? API_BASE_URL + 'api' : API_BASE_URL + '/api';
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the auth token in headers
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

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('tokenTimestamp');
      console.log('🔐 401 Unauthorized - clearing token');
    }
    return Promise.reject(error);
  }
);

export default api;
