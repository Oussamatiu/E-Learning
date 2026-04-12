// This is a professional wrapper for your API calls
const BASE_URL = 'http://127.0.0.1:8000/api';

export const apiService = {
  async login(email, password) {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This throws the error message from your backend (e.g., "Invalid Password")
        throw new Error(data.message || 'Something went wrong');
      }

      return data; // Success (contains token, user info, etc.)
    } catch (error) {
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (error) {
      throw error;
    }
  }
};