import api from './api';

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
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get a single report by ID
  getReport: async (id) => {
    try {
      const res = await api.get(`/api/reports/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get escalated reports (Twitter updates)
  getEscalations: async (limit = 50) => {
    try {
      const res = await api.get(`/api/reports/escalations`, { params: { limit } });
      return res.data;
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