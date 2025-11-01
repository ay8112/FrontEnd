import api from './api';

const classifyService = {
  classify: async (file) => {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post('/api/classify', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data; // { wasteType, confidence }
  },
};

export default classifyService;
