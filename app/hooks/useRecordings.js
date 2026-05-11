import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useRecordings(userId) {
  const [recordings, setRecordings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserRecordings = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get(`/recordings/${userId}`, {
          params: { page, limit: 20 },
        });
        setRecordings(response.data.data.recordings);
        return response.data.data;
      } catch (err) {
        setError('Failed to fetch recordings');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const fetchRecordingStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/recordings/${userId}/stats`);
      setStats(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch recording stats');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const uploadRecording = useCallback(
    async (audioFile, verses_range, notes) => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('audio', audioFile);
        if (verses_range) formData.append('verses_range', verses_range);
        if (notes) formData.append('notes', notes);

        const response = await apiClient.post(`/recordings/${userId}/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        await fetchUserRecordings();
        return response.data.data;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to upload recording');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [userId, fetchUserRecordings]
  );

  const fetchRecordingById = useCallback(async (recordingId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/recordings/detail/${recordingId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch recording');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeRecording = useCallback(async (recordingId, tajweed_score, accuracy_score, feedback) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/recordings/${recordingId}/analyze`, {
        tajweed_score,
        accuracy_score,
        feedback,
      });
      return response.data.data;
    } catch (err) {
      setError('Failed to analyze recording');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRecording = useCallback(async (recordingId, notes, verses_range) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/recordings/${recordingId}`, {
        notes,
        verses_range,
      });
      return response.data.data;
    } catch (err) {
      setError('Failed to update recording');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteRecording = useCallback(async (recordingId) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/recordings/${recordingId}`);
      await fetchUserRecordings();
      return { success: true };
    } catch (err) {
      setError('Failed to delete recording');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [fetchUserRecordings]);

  return {
    recordings,
    stats,
    loading,
    error,
    fetchUserRecordings,
    fetchRecordingStats,
    uploadRecording,
    fetchRecordingById,
    analyzeRecording,
    updateRecording,
    deleteRecording,
  };
}
