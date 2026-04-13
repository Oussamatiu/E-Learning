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
    throw new Error(`Server error: ${res.status}`);
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

  return Array.isArray(data) ? data : data.data ?? [];
};

export const fetchCourseById = async (id, signal) => {
  return request(`/api/courses/${id}`, {}, signal);
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