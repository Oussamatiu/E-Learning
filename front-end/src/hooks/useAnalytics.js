import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useAnalytics = () => {
  const [data, setData] = useState({
    stats: null,
    revenue: [],
    students: [],
    topCourses: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (timeRange = '30') => {
    setLoading(true);
    setError(null);
    try {
      const [dashboardRes, revenueRes, studentsRes] = await Promise.all([
        apiService.analytics.getDashboard(timeRange),
        apiService.analytics.getRevenue(timeRange),
        apiService.analytics.getStudents(timeRange),
      ]);

      setData({
        stats: dashboardRes.data.data?.stats || dashboardRes.data.stats,
        revenue: dashboardRes.data.data?.revenue || revenueRes.data.data || revenueRes.data,
        students: dashboardRes.data.data?.students || studentsRes.data.data || studentsRes.data,
        topCourses: dashboardRes.data.data?.top_courses || [],
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    data,
    loading,
    error,
    fetchAnalytics,
  };
};
