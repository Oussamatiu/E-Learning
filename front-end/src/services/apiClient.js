import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }

  return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      let message = error.response.data?.message || `Error: ${error.response.status}`;
      
      // If there are detailed validation errors, append them
      if (error.response.data?.error && typeof error.response.data.error === 'object') {
        const validationErrors = Object.values(error.response.data.error).flat().join(' ');
        message = `${message}: ${validationErrors}`;
      } else if (typeof error.response.data?.error === 'string') {
        message = error.response.data.error;
      }
      
      return Promise.reject(new Error(message));
    }
    
    return Promise.reject(new Error('Network error: Please check your connection.'));
  }
);

export default apiClient;
