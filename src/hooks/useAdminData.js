import { useState, useCallback } from 'react';
import { adminAPI } from '../services/adminService';

export const useAdminData = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchStats = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, typeRes, locationRes, statusRes] = await Promise.all([
        adminAPI.getStats(filters),
        adminAPI.getReportsByType(filters),
        adminAPI.getReportsByLocation(filters),
        adminAPI.getReportsByStatus(filters)
      ]);

      setData({
        totalReports: statsRes.data.totalReports,
        byType: typeRes.data,
        byLocation: locationRes.data,
        byStatus: statusRes.data,
        lastUpdated: new Date()
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    data,
    fetchStats
  };
};

export default useAdminData;