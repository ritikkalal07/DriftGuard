import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
  getScans: (id) => api.get(`/projects/${id}/scans`),
};

// Scans API
export const scansAPI = {
  getAll: (params) => api.get('/scans', { params }),
  getById: (id) => api.get(`/scans/${id}`),
  create: (data) => api.post('/scans', data),
  delete: (id) => api.delete(`/scans/${id}`),
  getReports: (id) => api.get(`/scans/${id}/reports`),
};

// Reports API
export const reportsAPI = {
  getAll: (params) => api.get('/reports', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  updateStatus: (id, status) => api.put(`/reports/${id}/status`, { status }),
  getSuggestions: (id) => api.get(`/reports/${id}/suggestions`),
  export: (id) => api.get(`/reports/${id}/export`),
};

// Suggestions API
export const suggestionsAPI = {
  accept: (id) => api.put(`/suggestions/${id}/accept`),
  reject: (id) => api.put(`/suggestions/${id}/reject`),
  export: (id) => api.get(`/suggestions/${id}/export`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getActivity: (params) => api.get('/dashboard/activity', { params }),
  getTrends: (params) => api.get('/dashboard/trends', { params }),
  getProjectsHealth: () => api.get('/dashboard/projects-health'),
};

// Settings API
export const settingsAPI = {
  get: () => api.get('/settings'),
  update: (data) => api.put('/settings', data),
  getAIProvider: () => api.get('/settings/ai-provider'),
  testAI: () => api.post('/settings/test-ai'),
};

export default api;

// Made with Bob
