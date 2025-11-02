import api from './api';

// Helper to get full image URL
const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  // If it's already a full URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // Otherwise prepend the backend base URL
  const baseURL = process.env.REACT_APP_API_URL || 'https://behindend.onrender.com';
  return `${baseURL}${imageUrl}`;
};

const reportService = {
  // Create a new report
  createReport: async (formData) => {
    try {
      const res = await api.post(`/api/reports`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all reports with optional filters
  getReports: async (filters = {}) => {
    try {
      const res = await api.get(`/api/reports`, { params: filters });
      // Transform imageUrl to full URL
      const reports = res.data.map(report => ({
        ...report,
        imageUrl: getFullImageUrl(report.imageUrl)
      }));
      return reports;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single report by ID
  getReport: async (id) => {
    try {
      const res = await api.get(`/api/reports/${id}`);
      return {
        ...res.data,
        imageUrl: getFullImageUrl(res.data.imageUrl)
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get escalated reports (Twitter updates)
  getEscalations: async (limit = 50) => {
    try {
      const res = await api.get(`/api/reports/escalations`, { params: { limit } });
      // Transform imageUrl to full URL
      const reports = res.data.map(report => ({
        ...report,
        imageUrl: getFullImageUrl(report.imageUrl)
      }));
      return reports;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update escalation tweet text (optionally repost)
  updateEscalation: async (id, { text, repost = true }) => {
    try {
      const res = await api.patch(`/api/reports/${id}/escalation`, { text, repost });
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete escalation tweet
  deleteEscalation: async (id) => {
    try {
      const res = await api.delete(`/api/reports/${id}/escalation`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update report status
  updateReportStatus: async (id, status) => {
    try {
      const res = await api.patch(`/api/reports/${id}/status`, { status });
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update report details
  updateReport: async (id, data) => {
    try {
      const res = await api.patch(`/api/reports/${id}`, data);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a report
  deleteReport: async (id) => {
    try {
      const res = await api.delete(`/api/reports/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default reportService;