import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useAudio() {
  const [reciters, setReciters] = useState([]);
  const [audioFiles, setAudioFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllReciters = useCallback(async (sortBy = 'rating', page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/audio/reciters', {
        params: { sortBy, page, limit: 20 },
      });
      setReciters(response.data.data.reciters);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch reciters');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReciterById = useCallback(async (reciterId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/audio/reciters/${reciterId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch reciter');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReciterAudio = useCallback(async (reciterId, surahId = null, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 50 };
      if (surahId) params.surahId = surahId;

      const response = await apiClient.get(`/audio/reciters/${reciterId}/audio`, { params });
      setAudioFiles(response.data.data.audioFiles);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch audio files');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAudioFile = useCallback(async (audioId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/audio/files/${audioId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch audio file');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSurahAudio = useCallback(async (surahId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/audio/surahs/${surahId}/audio`);
      setAudioFiles(response.data.data.audioFiles);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch surah audio');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchReciters = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/audio/reciters/search', {
        params: { q: query },
      });
      setReciters(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const rateReciter = useCallback(async (reciterId, rating) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/audio/reciters/${reciterId}/rate`, { rating });
      return response.data.data;
    } catch (err) {
      setError('Failed to rate reciter');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    reciters,
    audioFiles,
    loading,
    error,
    fetchAllReciters,
    fetchReciterById,
    fetchReciterAudio,
    fetchAudioFile,
    fetchSurahAudio,
    searchReciters,
    rateReciter,
  };
}
