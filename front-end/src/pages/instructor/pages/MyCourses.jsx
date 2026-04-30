import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCourses, deleteCourse } from '../../../services/coursesService';
import api from '../../../services/api';

const MyCourses = () => {
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [publishing, setPublishing] = useState(null);
  const [filter, setFilter]     = useState('all'); // all | published | pending_review | rejected | draft

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = () => {
    getInstructorCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    const token = localStorage.getItem('token');
    setDeleting(id);
    try {
      await deleteCourse(id);
      setCourses(c => c.filter(x => x.id !== id));
    } catch (e) {
      alert('Failed to delete: ' + e.message);
    } finally {
      setDeleting(null);
    }
  };

  const handlePublish = async (id) => {
    setPublishing(id);
    try {
      const res = await api.post(`courses/${id}/publish`);
      setCourses(prev =>
        prev.map(c => c.id === id ? { ...c, status: res.data.status } : c)
      );
      if (res.data.status === 'pending_review') {
        alert('Course submitted for admin review. You will be notified once it is approved.');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to toggle status.');
    } finally {
      setPublishing(null);
    }
  };

  const filtered = courses.filter(c =>
    filter === 'all' ? true : c.status === filter
  );

  const counts = {
    all:            courses.length,
    published:      courses.filter(c => c.status === 'published').length,
    pending_review: courses.filter(c => c.status === 'pending_review').length,
    rejected:       courses.filter(c => c.status === 'rejected').length,
    draft:          courses.filter(c => c.status === 'draft').length,
  };

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">Course Management</p>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
          </div>
          <Link
            to="/instructor/create-course"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#592b98] text-white font-semibold rounded-lg hover:bg-[#3e1f6b] transition-colors text-sm"
          >
            <span className="text-lg leading-none">+</span> New Course
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Filter tabs */}
        <div className="flex items-center gap-1 mb-6 bg-white border border-gray-200 rounded-xl p-1 w-fit">
          {[
            { key: 'all',            label: 'All' },
            { key: 'published',      label: '🟢 Published' },
            { key: 'pending_review', label: '🔵 Pending' },
            { key: 'rejected',       label: '🔴 Rejected' },
            { key: 'draft',          label: '🟡 Draft' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                filter === tab.key
                  ? 'bg-[#592b98] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label} <span className="opacity-60 ml-1">({counts[tab.key]})</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Loading your courses...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-300 rounded-2xl bg-white">
            <p className="text-4xl mb-3">📚</p>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
            <p className="text-gray-500 text-sm mb-6">
              {filter === 'draft' ? 'All your courses are published!' : 'Create your first course to get started.'}
            </p>
            <Link
              to="/instructor/create-course"
              className="inline-block px-6 py-2.5 bg-[#592b98] text-white rounded-lg font-semibold text-sm hover:bg-[#3e1f6b] transition-colors"
            >
              Create Course
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((course) => (
              <div key={course.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                {/* Thumbnail */}
                <div className="relative">
                  {course.img || course.thumbnail ? (
                    <img
                      src={course.img || `http://127.0.0.1:8000/storage/${course.thumbnail}`}
                      alt={course.title}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-br from-[#592b98]/10 to-[#9b6cd9]/10 flex items-center justify-center">
                      <svg className="w-12 h-12 text-[#592b98]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {/* Status badge */}
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-bold shadow-sm ${
                    course.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : course.status === 'rejected'
                      ? 'bg-red-100 text-red-700'
                      : course.status === 'pending_review'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {course.status === 'published' ? '🟢 Published' : course.status === 'rejected' ? '🔴 Rejected' : course.status === 'pending_review' ? '🔵 Pending Review' : '🟡 Draft'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">{course.title}</h3>
                  <p className="text-xs text-gray-400 mb-3">{course.category?.name || 'Uncategorized'} · {course.level}</p>

                  <div className="flex items-center justify-between text-sm mb-4">
                    <span className="font-bold text-[#592b98]">${course.price || '0'}</span>
                    <span className="text-gray-400">{course.students_count || 0} students</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Publish / Unpublish / Status */}
                    {course.status === 'published' ? (
                      <button
                        onClick={() => handlePublish(course.id)}
                        disabled={publishing === course.id}
                        className="w-full py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200"
                      >
                        {publishing === course.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            Move to Draft
                          </>
                        )}
                      </button>
                    ) : course.status === 'pending_review' ? (
                      <div className="w-full py-2 rounded-lg text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200 text-center">
                        Pending Admin Approval
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePublish(course.id)}
                        disabled={publishing === course.id}
                        className="w-full py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 flex items-center justify-center gap-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                      >
                        {publishing === course.id ? (
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {course.status === 'rejected' ? 'Resubmit for Review' : 'Submit for Review'}
                          </>
                        )}
                      </button>
                    )}

                    {/* Edit + View + Delete */}
                    <div className="flex gap-2">
                      <Link
                        to={`/instructor/edit-course/${course.id}`}
                        className="flex-1 py-2 bg-[#592b98] text-white rounded-lg text-sm font-semibold hover:bg-[#3e1f6b] transition-colors text-center"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/course/${course.id}`}
                        className="flex-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors text-center"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(course.id)}
                        disabled={deleting === course.id}
                        className="px-3 py-2 border border-red-200 text-red-500 rounded-lg text-sm hover:bg-red-50 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        {deleting === course.id ? '…' : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
