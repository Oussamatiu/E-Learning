import apiClient from './apiClient';

export const login = (credentials) => apiClient.post('/login', credentials);

export const register = (userData) => apiClient.post('/register', userData);

export const verifyEmail = (token) => apiClient.post('/verify-email', { token });
