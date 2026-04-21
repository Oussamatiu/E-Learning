// ─── BASE CONFIG ─────────────────────────────────────────────────────────────
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// ─── REQUEST WRAPPER ─────────────────────────────────────────────────────────
const request = async (endpoint, options = {}, signal) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server error: ${res.status}`);
  }

  return res.json();
};

// Request wrapper for multipart/form-data (file uploads)
const requestMultipart = async (endpoint, formData, token) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server error: ${res.status}`);
  }

  return res.json();
};

// ─── COURSES API ─────────────────────────────────────────────────────────────

export const fetchCourses = async (params = {}, signal) => {
  const query = new URLSearchParams();

  if (params.search) query.set('search', params.search);
  if (params.category && params.category !== 'All') {
    query.set('category', params.category);
  }

  const endpoint = `/api/courses${query.toString() ? `?${query}` : ''}`;

  const data = await request(endpoint, {}, signal);

  return Array.isArray(data) ? data : data.data ?? data.courses ?? [];
};

export const fetchCourseById = async (id, signal) => {
  return request(`/api/courses/${id}`, {}, signal);
};

export const fetchInstructorCourses = async (token, signal) => {
  const data = await request('/api/instructor/courses', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, signal);
  return Array.isArray(data) ? data : data.data ?? data.courses ?? [];
};

export const createCourse = async (courseData, token) => {
  const data = await request('/api/courses', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return data;
};

// ─── COURSE STRUCTURE API (Wizard) ────────────────────────────────────────────

/**
 * Create a course with full structure (sections + lessons) in a single request.
 * @param {Object} courseData - Course data with sections and lessons
 * @param {string} token - Auth token
 * @returns {Promise} - Created course object
 */
export const createCourseStructure = async (courseData, token) => {
  const data = await request('/api/courses/structure', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return data;
};

export const updateCourse = async (courseId, courseData, token) => {
  const data = await request(`/api/courses/${courseId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(courseData),
  });
  return data;
};

export const deleteCourse = async (courseId, token) => {
  const data = await request(`/api/courses/${courseId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const fetchCategories = async (signal) => {
  const data = await request('/api/categories', {}, signal);
  return Array.isArray(data) ? data : data.data ?? [];
};

export const enrollInCourse = async (courseId) => {
  return request(`/api/courses/${courseId}/enroll`, {
    method: 'POST',
  });
};

// ─── SECTIONS API ────────────────────────────────────────────────────────────

export const fetchSections = async (courseId, token, signal) => {
  const data = await request(`/api/courses/${courseId}/sections`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }, signal);
  // Sections already include lessons from backend
  return Array.isArray(data) ? data : data.data ?? [];
};

export const createSection = async (courseId, sectionData, token) => {
  const formData = new FormData();
  formData.append('title', sectionData.title);
  if (sectionData.description) formData.append('description', sectionData.description);
  if (sectionData.order !== undefined) formData.append('order', sectionData.order);

  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/sections`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const updateSection = async (courseId, sectionId, sectionData, token) => {
  const data = await request(`/api/courses/${courseId}/sections/${sectionId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(sectionData),
  });
  return data;
};

export const deleteSection = async (courseId, sectionId, token) => {
  const data = await request(`/api/courses/${courseId}/sections/${sectionId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// ─── LESSONS API ─────────────────────────────────────────────────────────────

export const createLesson = async (courseId, lessonData, token) => {
  const formData = new FormData();
  formData.append('title', lessonData.title);
  if (lessonData.content) formData.append('content', lessonData.content);
  if (lessonData.is_free !== undefined) formData.append('is_free', lessonData.is_free ? '1' : '0');
  if (lessonData.order !== undefined) formData.append('order', lessonData.order);
  if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration);
  if (lessonData.video_file) {
    formData.append('video_file', lessonData.video_file);
  }

  const res = await fetch(`${API_BASE_URL}/courses/${courseId}/lessons`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const updateLesson = async (courseId, lessonId, lessonData, token) => {
  const formData = new FormData();

  if (lessonData.title) formData.append('title', lessonData.title);
  if (lessonData.duration !== undefined) formData.append('duration', lessonData.duration);
  if (lessonData.section_id) formData.append('section_id', lessonData.section_id);

  if (lessonData.videoFile) {
    formData.append('video', lessonData.videoFile);
  }

  const res = await fetch(`${API_BASE_URL}/api/courses/${courseId}/lessons/${lessonId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || errorData.error || `Server error: ${res.status}`);
  }

  return res.json();
};

export const deleteLesson = async (courseId, lessonId, token) => {
  const data = await request(`/api/courses/${courseId}/lessons/${lessonId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const uploadLessonVideo = async (courseId, formData, token) => {
  return requestMultipart(`/api/courses/${courseId}/lessons`, formData, token);
};

// ─── COURSE OUTCOMES API ─────────────────────────────────────────────────────

export const createCourseOutcome = async (courseId, outcomeData, token) => {
  const data = await request(`/api/courses/${courseId}/outcomes`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(outcomeData),
  });
  return data;
};

export const updateCourseOutcome = async (courseId, outcomeId, outcomeData, token) => {
  const data = await request(`/api/courses/${courseId}/outcomes/${outcomeId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(outcomeData),
  });
  return data;
};

export const deleteCourseOutcome = async (courseId, outcomeId, token) => {
  const data = await request(`/api/courses/${courseId}/outcomes/${outcomeId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

// ─── COURSE TYPE (FRONTEND MIRROR OF LARAVEL RESOURCE) ───────────────────────

/**
 * @typedef {Object} Course
 * @property {number} id
 * @property {string} title
 * @property {string|null} image
 * @property {string} description
 * @property {number} price
 * @property {string} level
 * @property {string} status
 * @property {number} duration
 * @property {number} students_count
 * @property {number} rating
 * @property {string|null} thumbnail
 * @property {{id:number, name:string}} instructor
 * @property {{id:number, name:string}} category
 * @property {string} created_at
 * @property {string} updated_at
 */
