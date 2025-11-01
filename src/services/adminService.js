import api from './api';

export const adminAPI = {
  getStats: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return await api.get(`/api/admin/stats?${queryString}`);
  },
  
  getReportsByType: async (dateRange = {}) => {
    const queryString = new URLSearchParams(dateRange).toString();
    return await api.get(`/api/admin/reports/by-type?${queryString}`);
  },
  
  getReportsByLocation: async (dateRange = {}) => {
    const queryString = new URLSearchParams(dateRange).toString();
    return await api.get(`/api/admin/reports/by-location?${queryString}`);
  },
  
  getReportsByStatus: async (dateRange = {}) => {
    const queryString = new URLSearchParams(dateRange).toString();
    return await api.get(`/api/admin/reports/by-status?${queryString}`);
  }
};