import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useProgress(userId) {
  const [progress, setProgress] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserProgress = useCallback(
    async (status = null, page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const params = { page, limit: 20 };
        if (status) params.status = status;

        const response = await apiClient.get(`/progress/${userId}`, { params });
        setProgress(response.data.data.progress);
        return response.data.data;
      } catch (err) {
        setError('Failed to fetch progress');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchProgressStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/progress/${userId}/stats`);
      setStats(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchProgressByVerse = useCallback(
    async (verseId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/progress/${userId}/verse/${verseId}`);
        return response.data.data;
      } catch (err) {
        if (err.response?.status === 404) {
          return null;
        }
        setError('Failed to fetch progress');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const updateProgress = useCallback(
    async (verseId, status, accuracy_percentage, times_reviewed) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post(`/progress/${userId}/verse/${verseId}`, {
          status,
          accuracy_percentage,
          times_reviewed,
        });

        // Update local progress list
        setProgress((prev) => {
          const index = prev.findIndex((p) => p.verse_id === verseId);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = response.data.data.progress;
            return updated;
          }
          return [...prev, response.data.data.progress];
        });

        // Update stats if available
        await fetchProgressStats();

        return response.data.data;
      } catch (err) {
        setError('Failed to update progress');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchProgressStats]
  );

  const deleteProgress = useCallback(
    async (verseId) => {
      setLoading(true);
      setError(null);

      try {
        await apiClient.delete(`/progress/${userId}/verse/${verseId}`);
        setProgress((prev) => prev.filter((p) => p.verse_id !== verseId));
        return { success: true };
      } catch (err) {
        setError('Failed to delete progress');
        return { success: false };
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return {
    progress,
    stats,
    loading,
    error,
    fetchUserProgress,
    fetchProgressStats,
    fetchProgressByVerse,
    updateProgress,
    deleteProgress,
  };
}
