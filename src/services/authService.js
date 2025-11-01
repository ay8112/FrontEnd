import api from './api';

export const authAPI = {
  login: async (email, password) => {
    return await api.post('/api/auth/login', { email, password });
  },
  
  register: async (username, email, password) => {
    return await api.post('/api/auth/register', { username, email, password });
  }
};
