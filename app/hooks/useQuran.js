import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useQuran() {
  const [surahs, setSurahs] = useState([]);
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllSurahs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/quran/surahs');
      setSurahs(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch surahs');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSurahById = useCallback(async (surahId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/quran/surahs/${surahId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch surah');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSurahVerses = useCallback(async (surahId, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/quran/surahs/${surahId}/verses`, {
        params: { page, limit: 50 },
      });
      setVerses(response.data.data.verses);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch verses');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchVerseById = useCallback(async (verseId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/quran/verses/${verseId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch verse');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchVerses = useCallback(async (query, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/quran/verses/search', {
        params: { q: query, page, limit: 20 },
      });
      setVerses(response.data.data.verses);
      return response.data.data;
    } catch (err) {
      setError('Search failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSurahs = useCallback(async (query) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/quran/surahs/search', {
        params: { q: query },
      });
      setSurahs(response.data.data);
      return response.data.data;
    } catch (err) {
      setError('Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRandomVerse = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/quran/random-verse');
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch random verse');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    surahs,
    verses,
    loading,
    error,
    fetchAllSurahs,
    fetchSurahById,
    fetchSurahVerses,
    fetchVerseById,
    searchVerses,
    searchSurahs,
    fetchRandomVerse,
  };
}
