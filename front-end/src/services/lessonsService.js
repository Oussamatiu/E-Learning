import apiClient from './apiClient';

export const createLesson = (courseId, lessonData) => {
  const formData = new FormData();
  formData.append('title', lessonData.title);
  if (lessonData.content) formData.append('content', lessonData.content);
  if (lessonData.is_free !== undefined) formData.append('is_free', lessonData.is_free ? '1' : '0');
  if (lessonData.order !== undefined) formData.append('order', lessonData.order);
  if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration);
  if (lessonData.video_file) {
    formData.append('video_file', lessonData.video_file);
  }

  return apiClient.post(`/courses/${courseId}/lessons`, formData);
};

export const updateLesson = (courseId, lessonId, lessonData) => {
  const formData = new FormData();
  if (lessonData.title) formData.append('title', lessonData.title);
  if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration);
  if (lessonData.section_id) formData.append('section_id', lessonData.section_id);
  if (lessonData.videoFile) {
    formData.append('video', lessonData.videoFile);
  }

  // Uses post with method override or just POST if backend expects it for FormData updates
  return apiClient.post(`/courses/${courseId}/lessons/${lessonId}`, formData);
};

export const deleteLesson = (courseId, lessonId) => apiClient.delete(`/courses/${courseId}/lessons/${lessonId}`);

export const uploadLessonVideo = (courseId, formData) => apiClient.post(`/courses/${courseId}/lessons`, formData);
