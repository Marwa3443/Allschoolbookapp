import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useAchievements(userId) {
  const [achievements, setAchievements] = useState([]);
  const [allAchievements, setAllAchievements] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/achievements');
      setAllAchievements(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch achievements');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/achievements/${userId}/achievements`);
      setAchievements(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch user achievements');
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchAchievementProgress = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/achievements/${userId}/progress`);
      setProgress(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch achievement progress');
      return [];
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const unlockAchievement = useCallback(
    async (achievementId) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.post(`/achievements/${userId}/unlock/${achievementId}`);
        await fetchUserAchievements();
        return response.data.data;
      } catch (err) {
        setError('Failed to unlock achievement');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchUserAchievements]
  );

  const checkAndUnlockAchievements = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/achievements/${userId}/check-and-unlock`);
      await fetchUserAchievements();
      return response.data.data;
    } catch (err) {
      setError('Failed to check achievements');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchUserAchievements]);

  return {
    achievements,
    allAchievements,
    progress,
    loading,
    error,
    fetchAllAchievements,
    fetchUserAchievements,
    fetchAchievementProgress,
    unlockAchievement,
    checkAndUnlockAchievements,
  };
}
