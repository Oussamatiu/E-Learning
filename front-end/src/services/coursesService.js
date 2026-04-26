import apiClient from './apiClient';

export const getCourses = (params = {}) => {
  const queryParams = {};
  if (params.search) queryParams.search = params.search;
  if (params.category && params.category !== 'All') queryParams.category = params.category;
  if (params.price && params.price !== 'All') queryParams.price = params.price;
  if (params.rating && params.rating !== 'All') queryParams.rating = params.rating;
  if (params.page) queryParams.page = params.page;
  if (params.per_page) queryParams.per_page = params.per_page;

  return apiClient.get('/courses', { params: queryParams }).then(data => {
    if (data.meta) {
      return { courses: data.data || [], meta: data.meta };
    }
    return { courses: Array.isArray(data) ? data : data.data ?? data.courses ?? [], meta: null };
  });
};

export const getCourse = (id) => apiClient.get(`/courses/${id}`);

export const getInstructorCourses = (config = {}) => apiClient.get('/instructor/courses', config)
  .then(data => Array.isArray(data) ? data : data.data ?? data.courses ?? []);

export const createCourse = (courseData) => apiClient.post('/courses', courseData);

export const createCourseStructure = (courseData) => apiClient.post('/courses/structure', courseData);

export const updateCourse = (courseId, courseData) => apiClient.put(`/courses/${courseId}`, courseData);

export const deleteCourse = (courseId) => apiClient.delete(`/courses/${courseId}`);

export const getCategories = () => apiClient.get('/api/categories')
  .then(data => Array.isArray(data) ? data : data.data ?? []);

export const enrollInCourse = (courseId) => apiClient.post(`/courses/${courseId}/enroll`);

// Course Outcomes API
export const createCourseOutcome = (courseId, outcomeData) => apiClient.post(`/courses/${courseId}/outcomes`, outcomeData);

export const updateCourseOutcome = (courseId, outcomeId, outcomeData) => apiClient.put(`/courses/${courseId}/outcomes/${outcomeId}`, outcomeData);

export const deleteCourseOutcome = (courseId, outcomeId) => apiClient.delete(`/courses/${courseId}/outcomes/${outcomeId}`);
