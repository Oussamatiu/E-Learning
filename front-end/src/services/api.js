import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // For file uploads, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid - clear auth and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - user doesn't have permission
          console.error('Forbidden: You do not have permission to access this resource');
          break;
        case 404:
          console.error('Not found: The requested resource was not found');
          break;
        case 422:
          // Validation error - will be handled by component
          break;
        case 500:
          console.error('Server error: Please try again later');
          break;
        default:
          console.error(`Error ${error.response.status}: ${error.message}`);
      }
    } else if (error.request) {
      console.error('Network error: Please check your connection');
    } else {
      console.error('Error: ', error.message);
    }
    return Promise.reject(error);
  }
);

// API Service methods
export const apiService = {
  // Courses
  courses: {
    getAll: () => api.get('/courses'),
    getOne: (id) => api.get(`/courses/${id}`),
    create: (data) => api.post('/courses', data),
    update: (id, data) => api.put(`/courses/${id}`, data),
    delete: (id) => api.delete(`/courses/${id}`),
    getInstructorCourses: () => api.get('/instructor/courses'),
  },

  // Sections
  sections: {
    create: (data) => api.post('/sections', data),
    update: (id, data) => api.put(`/sections/${id}`, data),
    delete: (id) => api.delete(`/sections/${id}`),
    reorder: (data) => api.post('/sections/reorder', data),
  },

  // Lessons
  lessons: {
    getOne: (id) => api.get(`/lessons/${id}`),
    create: (data) => api.post('/lessons', data),
    update: (id, data) => api.put(`/lessons/${id}`, data),
    delete: (id) => api.delete(`/lessons/${id}`),
    reorder: (data) => api.post('/lessons/reorder', data),
  },

  // Analytics
  analytics: {
    getDashboard: (timeRange = '30') => api.get(`/instructor/analytics?time_range=${timeRange}`),
    getRevenue: (timeRange = '30') => api.get(`/instructor/analytics/revenue?time_range=${timeRange}`),
    getStudents: (timeRange = '30') => api.get(`/instructor/analytics/students?time_range=${timeRange}`),
  },

  // Settings
  instructor: {
    getProfile: () => api.get('/instructor/profile'),
    updateProfile: (data) => api.put('/instructor/profile', data),
    updatePassword: (data) => api.put('/instructor/password', data),
    getPayoutSettings: () => api.get('/instructor/payout-settings'),
    updatePayoutSettings: (data) => api.put('/instructor/payout-settings', data),
  },
};

export default api;
