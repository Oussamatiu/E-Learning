import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useInstructorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.instructor.getProfile();
      const profileData = response.data.data || response.data;
      setProfile(profileData);
      return { success: true, data: profileData };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.instructor.updateProfile(profileData);
      const updatedProfile = response.data.data || response.data;
      setProfile(updatedProfile);
      return { success: true, data: updatedProfile };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      await apiService.instructor.updatePassword(passwordData);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
  };
};
