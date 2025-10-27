import axios from 'axios';

// Determine the base URL based on the environment
// Vite exposes environment variables on the `import.meta.env` object.
// Variables prefixed with VITE_ are exposed to the client-side code.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for sending cookies with requests
});

// You can also add an interceptor to include the auth token in headers
// This is a more robust way than adding it to every single request manually.
// Example:
// api.interceptors.request.use(...)

export default api;
