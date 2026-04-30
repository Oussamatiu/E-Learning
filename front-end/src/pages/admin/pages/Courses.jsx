import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [courseFilter, setCourseFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [courseFilter]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getCourses(courseFilter);
      setCourses(res.data?.data || []);
    } catch (e) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(`approve-${id}`);
    try {
      await apiService.admin.approveCourse(id);
      setSuccess('Course approved');
      fetchCourses();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(`reject-${id}`);
    try {
      await apiService.admin.rejectCourse(id);
      setSuccess('Course rejected');
      fetchCourses();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    setActionLoading(`delete-${id}`);
    try {
      await apiService.admin.deleteCourse(id);
      setSuccess('Course deleted');
      fetchCourses();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">Course Review</p>
            <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
          </div>
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="pending_review">Pending Review</option>
            <option value="published">Published</option>
            <option value="rejected">Rejected</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">{success}</div>}

        <div className="border border-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Instructor</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses.map(course => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{course.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{course.title}</td>
                      <td className="px-4 py-3">{course.instructor?.name || '-'}</td>
                      <td className="px-4 py-3">${course.price}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-semibold ${
                          course.status === 'published' ? 'bg-green-100 text-green-700' :
                          course.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          course.status === 'pending_review' ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status === 'pending_review' ? 'Pending Review' : course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {course.status === 'pending_review' && (
                            <>
                              <button
                                onClick={() => handleApprove(course.id)}
                                disabled={actionLoading === `approve-${course.id}`}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading === `approve-${course.id}` ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleReject(course.id)}
                                disabled={actionLoading === `reject-${course.id}`}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50"
                              >
                                {actionLoading === `reject-${course.id}` ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(course.id)}
                            disabled={actionLoading === `delete-${course.id}`}
                            className="px-3 py-1 bg-gray-600 text-white text-xs rounded-md hover:bg-gray-700 disabled:opacity-50"
                          >
                            {actionLoading === `delete-${course.id}` ? '...' : 'Delete'}
                          </button>
                          <a
                            href={`/course/${course.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-[#592b98] text-white text-xs rounded-md hover:bg-[#3e1f6b]"
                          >
                            View
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No courses found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;
