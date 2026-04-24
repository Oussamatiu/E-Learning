import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const StudentCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, in-progress, completed

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

  const filteredEnrollments = enrollments.filter(e => {
    if (filter === 'in-progress') return Number(e.progress) > 0 && Number(e.progress) < 100;
    if (filter === 'completed') return Number(e.progress) >= 100;
    return true;
  });

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="bg-white py-8 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">My Courses</h1>
          <p className="text-gray-600 text-sm">All your enrolled courses in one place</p>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="py-6 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <div className="flex gap-6 border-b border-gray-200 mb-6">
            {[
              { key: 'all', label: 'All Courses' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'completed', label: 'Completed' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`pb-3 text-sm font-semibold transition-colors relative ${
                  filter === tab.key ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {filter === tab.key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#592b98]"></div>
                )}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredEnrollments.length === 0 ? (
            <div className="text-center py-16 border border-gray-200 rounded-lg">
              <p className="text-lg font-semibold text-gray-900 mb-2">No courses found</p>
              <p className="text-gray-500 mb-6">
                {filter === 'all' ? 'Start your learning journey today' : 'No courses match this filter'}
              </p>
              <Link
                to="/courses"
                className="inline-block px-6 py-3 bg-[#592b98] text-white rounded-md font-semibold hover:bg-[#3e1f6b] transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  to={`/student/course/${enrollment.course_id}`}
                  className="group flex items-center gap-5 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-32 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {enrollment.course?.thumbnail ? (
                      <img
                        src={`http://localhost:8000/storage/${enrollment.course.thumbnail}`}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#592b98] to-[#3e1f6b] flex items-center justify-center">
                        <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Course Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#592b98] transition-colors truncate">
                      {enrollment.course?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {enrollment.course?.instructor?.name || 'Instructor'}
                    </p>
                  </div>

                  {/* Progress */}
                  <div className="w-40 flex-shrink-0">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Progress</span>
                      <span className="font-semibold text-[#592b98]">{enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-[#592b98] h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 text-gray-300 group-hover:text-[#592b98] flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentCourses;
