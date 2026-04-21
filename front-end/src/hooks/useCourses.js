import { useState, useEffect, useCallback } from 'react';
import { apiService } from '../services/api';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all instructor courses
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.courses.getInstructorCourses();
      setCourses(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new course
  const createCourse = useCallback(async (courseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.courses.create(courseData);
      const newCourse = response.data.data || response.data;
      setCourses(prev => [...prev, newCourse]);
      return { success: true, data: newCourse };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create course';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Update an existing course
  const updateCourse = useCallback(async (id, courseData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.courses.update(id, courseData);
      const updatedCourse = response.data.data || response.data;
      setCourses(prev => prev.map(course => course.id === id ? updatedCourse : course));
      return { success: true, data: updatedCourse };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update course';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a course
  const deleteCourse = useCallback(async (id) => {
    setError(null);
    try {
      await apiService.courses.delete(id);
      setCourses(prev => prev.filter(course => course.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete course';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get a single course by ID
  const getCourseById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.courses.getOne(id);
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch course';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
  };
};
