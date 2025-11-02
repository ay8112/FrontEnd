import axios from 'axios';

const api = axios.create({
  // Backend runs on 3000, frontend dev server on 3001
  baseURL: process.env.REACT_APP_API_URL || 'https://behindend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    try {
      // Check for role-specific language preference
      let lang = null;
      // Try to determine if user is admin from token
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          lang = payload.role === 'admin' 
            ? localStorage.getItem('lang_admin') 
            : localStorage.getItem('lang_user');
        } catch (_) {}
      }
      // Fallback to generic lang or user lang
      if (!lang) {
        lang = localStorage.getItem('lang_user') || localStorage.getItem('lang_admin') || localStorage.getItem('lang');
      }
      if (lang) config.headers['Accept-Language'] = lang;
    } catch (_) {}
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
