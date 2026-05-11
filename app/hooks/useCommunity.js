import { useState, useCallback } from 'react';
import apiClient from '../lib/apiClient';

export function useCommunity() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllPosts = useCallback(async (category = null, page = 1, sortBy = 'newest') => {
    setLoading(true);
    setError(null);

    try {
      const params = { page, limit: 10, sortBy };
      if (category && category !== 'all') params.category = category;

      const response = await apiClient.get('/community', { params });
      setPosts(response.data.data.posts);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch posts');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/community/${postId}`);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = useCallback(async (userId, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/community/user/${userId}`, {
        params: { page, limit: 10 },
      });
      setPosts(response.data.data.posts);
      return response.data.data;
    } catch (err) {
      setError('Failed to fetch user posts');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (userId, title, content, category) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/community/user/${userId}`, {
        title,
        content,
        category,
      });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId, title, content, category) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.put(`/community/${postId}`, {
        title,
        content,
        category,
      });
      return response.data.data;
    } catch (err) {
      setError('Failed to update post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/community/${postId}`);
      return { success: true };
    } catch (err) {
      setError('Failed to delete post');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const likePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/community/${postId}/like`);
      return response.data.data;
    } catch (err) {
      setError('Failed to like post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikePost = useCallback(async (postId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.post(`/community/${postId}/unlike`);
      return response.data.data;
    } catch (err) {
      setError('Failed to unlike post');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPosts = useCallback(async (query, page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/community/search', {
        params: { q: query, page, limit: 10 },
      });
      setPosts(response.data.data.posts);
      return response.data.data;
    } catch (err) {
      setError('Search failed');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    posts,
    loading,
    error,
    fetchAllPosts,
    fetchPostById,
    fetchUserPosts,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    searchPosts,
  };
}
