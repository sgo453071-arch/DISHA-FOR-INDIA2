import axios from 'axios';
import { logMalformedResponse } from './loggingService';

// Create an instance of axios with base configurations
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Helper to set auth token on the axios instance
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Request interceptor: attach Bearer token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Interceptor to handle responses globally (e.g. logouts on 401s and 403)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // If the backend returns a 401 Unauthorized or 403 Forbidden, we know the session has expired
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear token from storage and axios headers
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      // Log the auth failure for debugging
      logMalformedResponse({ endpoint: error.config?.url, status: error.response.status, data: error.response.data });
      // Redirect to login with an expired flag, unless already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login?expired=true';
      }
    }
    // Normalize errors to return the message from the backend if available
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    });
  }
);

export default api;
