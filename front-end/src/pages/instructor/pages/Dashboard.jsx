import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchInstructorCourses } from '../../../services/Coursesapi';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetchInstructorCourses(token)
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    drafts: courses.filter(c => c.status === 'draft').length,
    students: courses.reduce((sum, c) => sum + (c.students_count || 0), 0),
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98] mb-2">
                Instructor Dashboard
              </p>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
                Welcome back, Instructor
              </h1>
              <p className="text-gray-600 text-lg mb-8 max-w-xl">
                Manage your courses, track enrolments, and monitor your performance from one place.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/instructor/create-course"
                  className="inline-flex items-center justify-center px-6 py-3 bg-[#592b98] text-white font-semibold rounded-md hover:bg-[#3e1f6b] transition-colors"
                >
                  Create New Course
                </Link>
                <Link
                  to="/instructor/courses"
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 border border-gray-300 font-semibold rounded-md hover:bg-gray-50 transition-colors"
                >
                  View My Courses
                </Link>
              </div>
            </div>

            <div className="relative flex justify-center">
              <div className="rounded-lg overflow-hidden shadow-lg max-h-[420px] w-full">
                <img
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=80"
                  alt="Instructor dashboard"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 px-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Performance</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#f8f5ff] rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Courses</p>
              <p className="text-3xl font-bold text-[#592b98]">{stats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Published</p>
              <p className="text-3xl font-bold text-green-600">{stats.published}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Drafts</p>
              <p className="text-3xl font-bold text-orange-600">{stats.drafts}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Total Students</p>
              <p className="text-3xl font-bold text-blue-600">{stats.students}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Courses Section */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Your Courses</h2>
            <Link
              to="/instructor/create-course"
              className="px-5 py-2.5 bg-[#592b98] text-white rounded-md text-sm font-semibold hover:bg-[#3e1f6b] transition-colors"
            >
              + New Course
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading your courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-lg">
              <p className="text-lg font-semibold text-gray-900 mb-2">No courses yet</p>
              <p className="text-gray-500 mb-6">Create your first course to start teaching</p>
              <Link
                to="/instructor/create-course"
                className="inline-block px-6 py-3 bg-[#592b98] text-white rounded-md font-semibold hover:bg-[#3e1f6b] transition-colors"
              >
                Create Course
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {course.thumbnail ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">{course.category?.name || 'Uncategorized'}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        course.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.status}
                      </span>
                      <Link
                        to={`/instructor/edit-course/${course.id}`}
                        className="text-sm text-[#592b98] hover:underline font-medium"
                      >
                        Edit
                      </Link>
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

export default Dashboard;
