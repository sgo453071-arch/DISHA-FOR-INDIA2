/* Logging service for client-side error reporting */
import api from './api';
// In development we log to console; in production we attempt to POST to a backend logging endpoint.
export const logMalformedResponse = async (payload) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Malformed API response logged:', payload);
      return;
    }
    // Use existing axios instance to respect baseURL and interceptors
    // Import placed at top of file
    await api.post('/log', {
      type: 'malformed_response',
      payload,
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Failed to send malformed response to logging endpoint:', e);
  }
};

export default { logMalformedResponse };
