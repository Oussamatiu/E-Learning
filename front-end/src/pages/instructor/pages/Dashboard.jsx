import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCourses } from '../../../services/coursesService';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    getInstructorCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    pending: courses.filter(c => c.status === 'pending_review').length,
    rejected: courses.filter(c => c.status === 'rejected').length,
    draft: courses.filter(c => c.status === 'draft').length,
    students: courses.reduce((sum, c) => sum + (c.students_count || 0), 0),
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const StatCard = ({ label, value, icon, bg, textColor }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
        <span className={textColor}>{icon}</span>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-[#f7f9fa] min-h-full">

      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-0.5">Instructor Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">
              {greeting()}, {user.name?.split(' ')[0] || 'Instructor'} 👋
            </h1>
          </div>
          <Link
            to="/instructor/create-course"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#592b98] text-white text-sm font-semibold rounded-lg hover:bg-[#3e1f6b] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </Link>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <StatCard
            label="Total Courses"
            value={stats.total}
            bg="bg-[#f8f5ff]"
            textColor="text-[#592b98]"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            }
          />
          <StatCard
            label="Published"
            value={stats.published}
            bg="bg-green-50"
            textColor="text-green-500"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Pending Review"
            value={stats.pending}
            bg="bg-orange-50"
            textColor="text-orange-500"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            bg="bg-red-50"
            textColor="text-red-500"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            label="Drafts"
            value={stats.draft}
            bg="bg-gray-50"
            textColor="text-gray-500"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            }
          />
          <StatCard
            label="Total Students"
            value={stats.students}
            bg="bg-blue-50"
            textColor="text-blue-500"
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Your Courses</h2>
            <Link to="/instructor/courses" className="text-xs font-bold text-[#592b98] hover:underline">
              Manage all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#f8f5ff] rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 mb-1">No courses yet</p>
              <p className="text-sm text-gray-400 mb-5">Create your first course and start teaching</p>
              <Link to="/instructor/create-course" className="inline-block px-5 py-2 bg-[#592b98] text-white rounded-lg text-sm font-semibold hover:bg-[#3e1f6b] transition-colors">
                Create First Course
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {courses.slice(0, 8).map((course) => (
                <div key={course.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group">
                  {course.thumbnail ? (
                    <img
                      src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                      alt={course.title}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-[#592b98] to-[#3e1f6b] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                      </svg>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{course.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{course.category?.name || 'Uncategorized'}</p>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0 text-right">
                    <div className="hidden sm:block">
                      <p className="text-sm font-bold text-gray-900">{course.students_count || 0}</p>
                      <p className="text-xs text-gray-400">students</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      course.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : course.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : course.status === 'pending_review'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status === 'pending_review' ? 'Pending Review' : course.status}
                    </span>
                    <Link
                      to={`/instructor/edit-course/${course.id}`}
                      className="text-xs font-bold text-[#592b98] hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
