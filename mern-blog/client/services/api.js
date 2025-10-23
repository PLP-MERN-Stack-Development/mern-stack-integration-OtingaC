import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data),
  getMe: () => api.get('/api/auth/me'),
};

// Posts API
export const postsAPI = {
  getAllPosts: (params) => api.get('/api/posts', { params }),
  getPost: (id) => api.get(`/api/posts/${id}`),
  createPost: (formData) => api.post('/api/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updatePost: (id, formData) => api.put(`/api/posts/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deletePost: (id) => api.delete(`/api/posts/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAllCategories: () => api.get('/api/categories'),
  getCategory: (id) => api.get(`/api/categories/${id}`),
  createCategory: (data) => api.post('/api/categories', data),
  updateCategory: (id, data) => api.put(`/api/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/api/categories/${id}`),
};

// Comments API
export const commentsAPI = {
  getCommentsByPost: (postId) => api.get(`/api/comments/post/${postId}`),
  createComment: (data) => api.post('/api/comments', data),
  updateComment: (id, data) => api.put(`/api/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/api/comments/${id}`),
};

export default api;