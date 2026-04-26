import apiClient from './apiClient';

export const getSections = (courseId) => apiClient.get(`/courses/${courseId}/sections`)
  .then(data => Array.isArray(data) ? data : data.data ?? []);

export const createSection = (courseId, sectionData) => {
  const formData = new FormData();
  formData.append('title', sectionData.title);
  if (sectionData.description) formData.append('description', sectionData.description);
  if (sectionData.order !== undefined) formData.append('order', sectionData.order);

  return apiClient.post(`/courses/${courseId}/sections`, formData);
};

export const updateSection = (courseId, sectionId, sectionData) => apiClient.put(`/courses/${courseId}/sections/${sectionId}`, sectionData);

export const deleteSection = (courseId, sectionId) => apiClient.delete(`/courses/${courseId}/sections/${sectionId}`);
