import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentDashboard = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await api.get('api/student/enrollments');
        if (response.data.success) {
          setEnrollments(response.data.enrollments);
        }
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter(e => Number(e.progress) > 0 && Number(e.progress) < 100).length,
    completed: enrollments.filter(e => Number(e.progress) >= 100).length,
  };

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const StatCard = ({ label, value, icon, color }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
        {icon}
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
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-0.5">Student Dashboard</p>
            <h1 className="text-xl font-bold text-gray-900">
              {greeting()}, {user.name?.split(' ')[0] || 'Student'} 👋
            </h1>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#592b98] text-white text-sm font-semibold rounded-lg hover:bg-[#3e1f6b] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Browse Courses
          </Link>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Enrolled Courses"
            value={stats.total}
            color="bg-[#f8f5ff]"
            icon={
              <svg className="w-5 h-5 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            }
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            color="bg-orange-50"
            icon={
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            color="bg-green-50"
            icon={
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Courses Section */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-900">Continue Learning</h2>
            <Link to="/student/courses" className="text-xs font-bold text-[#592b98] hover:underline">
              View all →
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-16 px-6">
              <div className="w-14 h-14 mx-auto mb-4 bg-[#f8f5ff] rounded-full flex items-center justify-center">
                <svg className="w-7 h-7 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253" />
                </svg>
              </div>
              <p className="font-semibold text-gray-900 mb-1">No courses yet</p>
              <p className="text-sm text-gray-400 mb-5">Enroll in a course to start learning</p>
              <Link to="/courses" className="inline-block px-5 py-2 bg-[#592b98] text-white rounded-lg text-sm font-semibold hover:bg-[#3e1f6b] transition-colors">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {enrollments.slice(0, 6).map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/student/course/${enrollment.course_id}`}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors group"
                >
                  {/* Thumbnail */}
                  {enrollment.course?.thumbnail ? (
                    <img
                      src={`http://localhost:8000/storage/${enrollment.course.thumbnail}`}
                      alt={enrollment.course.title}
                      className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gradient-to-br from-[#592b98] to-[#3e1f6b] rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-[#592b98] transition-colors">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5 mb-2">{enrollment.course?.instructor?.name || 'Instructor'}</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#592b98] h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#592b98] flex-shrink-0">{enrollment.progress || 0}%</span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-[#592b98] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
