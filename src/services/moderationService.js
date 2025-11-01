import api from './api';

const moderationService = {
  getReports: async (params = {}) => {
    const res = await api.get('/api/moderation/reports', { params });
    return res.data;
  },
  approve: async (id) => {
    const res = await api.post(`/api/moderation/approve/${id}`);
    return res.data;
  },
  reject: async (id) => {
    const res = await api.post(`/api/moderation/reject/${id}`);
    return res.data;
  },
  escalate: async (id) => {
    const res = await api.post(`/api/moderation/escalate/${id}`);
    return res.data;
  },
  addNote: async (id, text) => {
    const res = await api.post(`/api/moderation/note/${id}`, { text });
    return res.data;
  },
};

export default moderationService;
