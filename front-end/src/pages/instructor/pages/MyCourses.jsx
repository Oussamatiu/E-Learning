import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchInstructorCourses, deleteCourse } from '../../../services/Coursesapi';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    const token = localStorage.getItem('token');
    fetchInstructorCourses(token)
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    const token = localStorage.getItem('token');
    setDeleting(id);
    try {
      await deleteCourse(id, token);
      setCourses(courses.filter(c => c.id !== id));
      alert('Course deleted successfully');
    } catch (error) {
      alert('Failed to delete: ' + error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98] mb-2">
                Course Management
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                My Courses
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                Create, edit, and manage your course content. Organize your lessons and track student progress.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/instructor/create-course"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#592b98] text-white font-semibold rounded-md hover:bg-[#3e1f6b] transition-colors"
                >
                  Create New Course
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-lg max-h-[420px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=900&q=80"
                  alt="Manage courses"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses List Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-600">{courses.length} courses found</p>
            <Link
              to="/instructor/create-course"
              className="px-5 py-2.5 bg-[#592b98] text-white rounded-md text-sm font-semibold hover:bg-[#3e1f6b] transition-colors"
            >
              + New Course
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
              Loading your courses...
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <div className="w-20 h-20 bg-[#f8f5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
              <p className="text-gray-500 mb-6">Start creating your first course and share your knowledge with students</p>
              <Link
                to="/instructor/create-course"
                className="inline-block px-8 py-3 bg-[#592b98] text-white rounded-md font-semibold hover:bg-[#3e1f6b] transition-colors"
              >
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {course.thumbnail ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{course.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{course.category?.name || 'Uncategorized'}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Level:</span>
                        <span className="text-gray-900 capitalize font-medium">{course.level}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Price:</span>
                        <span className="text-gray-900 font-medium">${course.price || 'Free'}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Students:</span>
                        <span className="text-gray-900 font-medium">{course.students_count || 0}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-gray-200">
                      <Link
                        to={`/instructor/edit-course/${course.id}`}
                        className="flex-1 px-4 py-2 bg-[#592b98] text-white rounded-md text-sm font-semibold hover:bg-[#3e1f6b] transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/course/${course.id}`}
                        className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleting === course.id}
                        className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        {deleting === course.id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MyCourses;
