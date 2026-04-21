import { useState, useCallback } from 'react';
import { apiService } from '../services/api';

export const useSections = (courseId) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Create a new section
  const createSection = useCallback(async (sectionData) => {
    setLoading(true);
    setError(null);
    try {
      const dataToSend = { ...sectionData, course_id: courseId };
      const response = await apiService.sections.create(dataToSend);
      const newSection = response.data.data || response.data;
      setSections(prev => [...prev, { ...newSection, lessons: [] }]);
      return { success: true, data: newSection };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create section';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  // Update an existing section
  const updateSection = useCallback(async (id, sectionData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.sections.update(id, sectionData);
      const updatedSection = response.data.data || response.data;
      setSections(prev => prev.map(section => section.id === id ? { ...section, ...updatedSection } : section));
      return { success: true, data: updatedSection };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update section';
      setError(errorMessage);
      return { success: false, error: errorMessage, errors: err.response?.data?.errors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete a section
  const deleteSection = useCallback(async (id) => {
    setError(null);
    try {
      await apiService.sections.delete(id);
      setSections(prev => prev.filter(section => section.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to delete section';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Reorder sections
  const reorderSections = useCallback(async (orderedIds) => {
    try {
      await apiService.sections.reorder({ section_ids: orderedIds });
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reorder sections';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Set sections (for loading from course data)
  const setSectionsData = useCallback((data) => {
    setSections(data || []);
  }, []);

  return {
    sections,
    loading,
    error,
    createSection,
    updateSection,
    deleteSection,
    reorderSections,
    setSectionsData,
  };
};
