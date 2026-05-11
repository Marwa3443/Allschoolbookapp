import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useStatistics(userId) {
  const [dailyStats, setDailyStats] = useState([]);
  const [todayStats, setTodayStats] = useState(null);
  const [overallStats, setOverallStats] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDailyStats = useCallback(
    async (days = 30, page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/statistics/${userId}/daily`, {
          params: { days, page, limit: 30 },
        });
        setDailyStats(response.data.data.stats);
        return response.data.data;
      } catch (err) {
        setError('Failed to fetch daily stats');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchTodayStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/statistics/${userId}/today`);
      setTodayStats(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch today stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchOverallStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/statistics/${userId}/overall`);
      setOverallStats(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch overall stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchLeaderboard = useCallback(async (metric = 'memorized', limit = 20) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/statistics/leaderboard', {
        params: { metric, limit },
      });
      setLeaderboard(response.data.data.leaderboard);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch leaderboard');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDailyStats = useCallback(
    async (study_minutes, streak_count) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.put(`/statistics/${userId}/daily`, {
          study_minutes,
          streak_count,
        });
        setTodayStats(response.data.data);
        return response.data.data;
      } catch (err) {
        setError('Failed to update daily stats');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    dailyStats,
    todayStats,
    overallStats,
    leaderboard,
    loading,
    error,
    fetchDailyStats,
    fetchTodayStats,
    fetchOverallStats,
    fetchLeaderboard,
    updateDailyStats,
  };
}
