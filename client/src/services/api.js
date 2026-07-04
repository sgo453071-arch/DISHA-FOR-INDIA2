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
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      logMalformedResponse({ endpoint: error.config?.url, status: error.response.status, data: error.response.data });
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.dispatchEvent(new CustomEvent('auth-expired'));
      }
    }
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
