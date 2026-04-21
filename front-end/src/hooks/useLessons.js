import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useLessons = (sectionId) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new lesson
  const createLesson = useCallback(async (lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const dataToSend = { ...lessonData, section_id: sectionId };
      const response = await apiService.lessons.create(dataToSend);
      const newLesson = response.data.data || response.data;
      setLessons(prev => [...prev, newLesson]);
      return { success: true, data: newLesson };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create lesson';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  // Update an existing lesson
  const updateLesson = useCallback(async (id, lessonData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.lessons.update(id, lessonData);
      const updatedLesson = response.data.data || response.data;
      setLessons(prev => prev.map(lesson => lesson.id === id ? { ...lesson, ...updatedLesson } : lesson));
      return { success: true, data: updatedLesson };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update lesson';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a lesson
  const deleteLesson = useCallback(async (id) => {
    setError(null);
    try {
      await apiService.lessons.delete(id);
      setLessons(prev => prev.filter(lesson => lesson.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete lesson';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Reorder lessons
  const reorderLessons = useCallback(async (orderedIds) => {
    try {
      await apiService.lessons.reorder({ lesson_ids: orderedIds });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reorder lessons';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Get a single lesson
  const getLesson = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.lessons.getOne(id);
      return { success: true, data: response.data.data || response.data };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch lesson';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  // Set lessons data (for loading from section)
  const setLessonsData = useCallback((data) => {
    setLessons(data || []);
  }, []);

  return {
    lessons,
    loading,
    error,
    createLesson,
    updateLesson,
    deleteLesson,
    reorderLessons,
    getLesson,
    setLessonsData,
  };
};
