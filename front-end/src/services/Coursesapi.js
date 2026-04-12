// ─── BASE CONFIG ─────────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

// Helper — centralized fetch wrapper with error handling
const request = async (endpoint, options = {}, signal) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    signal,
    headers: {
      'Content-Type': 'application/json',
      // Uncomment if your API requires auth:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) throw new Error(`Server error: ${res.status}`);

  return res.json();
};

// ─── COURSES API ──────────────────────────────────────────────────────────────

/**
 * Fetch all courses with optional filters.
 *
 * @param {{ search?: string, category?: string }} params
 * @param {AbortSignal} [signal]
 * @returns {Promise<Course[]>}
 *
 * GET /api/courses?search=react&category=Programming
 * Response: { courses: [...] }  OR  [...]
 */
export const fetchCourses = async (params = {}, signal) => {
  const query = new URLSearchParams();
  if (params.search)   query.set('search', params.search);
  if (params.category && params.category !== 'All') query.set('category', params.category);

  const endpoint = `/api/courses${query.toString() ? `?${query}` : ''}`;
  const data = await request(endpoint, {}, signal);

  // Support both { courses: [...] } and plain array responses
  return Array.isArray(data) ? data : data.courses ?? [];
};

/**
 * Fetch a single course by ID.
 *
 * @param {number|string} id
 * @param {AbortSignal} [signal]
 * @returns {Promise<Course>}
 *
 * GET /api/courses/:id
 */
export const fetchCourseById = async (id, signal) => {
  return request(`/api/courses/${id}`, {}, signal);
};

/**
 * Fetch all available course categories.
 *
 * @param {AbortSignal} [signal]
 * @returns {Promise<string[]>}
 *
 * GET /api/courses/categories
 * Response: { categories: [...] }  OR  [...]
 */
export const fetchCategories = async (signal) => {
  const data = await request('/api/courses/categories', {}, signal);
  return Array.isArray(data) ? data : data.categories ?? [];
};

/**
 * Enroll the current user in a course.
 *
 * @param {number|string} courseId
 * @returns {Promise<{ success: boolean, message: string }>}
 *
 * POST /api/courses/:id/enroll
 */
export const enrollInCourse = async (courseId) => {
  return request(`/api/courses/${courseId}/enroll`, { method: 'POST' });
};

// ─── TYPES (JSDoc) ───────────────────────────────────────────────────────────
/**
 * @typedef {Object} Course
 * @property {number}  id
 * @property {string}  title
 * @property {string}  category
 * @property {string}  img
 * @property {string}  instructor
 * @property {string}  price       - e.g. "$49.99"
 * @property {number}  rating      - e.g. 4.8
 * @property {string}  reviews     - e.g. "2,450"
 * @property {string}  students    - e.g. "12k"
 * @property {string}  duration    - e.g. "42h 30m"
 */