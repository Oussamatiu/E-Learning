import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { fetchInstructorCourses } from '../services/Coursesapi';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

//   useEffect(() => {
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('token');

//     if (!storedUser || !token) {
//       navigate('/login');
//       return;
//     }

//     let parsedUser;
//     try {
//       parsedUser = JSON.parse(storedUser);
//     } catch (err) {
//       navigate('/login');
//       return;
//     }

//     if (parsedUser.role_id !== 3 && parsedUser.role !== 'instructor' && parsedUser.role?.title !== 'instructor') {
//       navigate('/login');
//       return;
//     }

//     setUser(parsedUser);

//     const controller = new AbortController();
//     fetchInstructorCourses(token, controller.signal)
//       .then((data) => setCourses(data))
//       .catch((err) => setError(err.message || 'Unable to load instructor dashboard'))
//       .finally(() => setLoading(false));

//     return () => controller.abort();
//   }, [navigate]);

  const summary = useMemo(() => {
    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + (course.students_count || 0), 0);
    const averageRating = totalCourses
      ? (courses.reduce((sum, course) => sum + (course.rating || 0), 0) / totalCourses).toFixed(1)
      : 0;
    const published = courses.filter((course) => course.status === 'published').length;
    const drafts = totalCourses - published;

    return { totalCourses, totalStudents, averageRating, published, drafts };
  }, [courses]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-gray-200 bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-[#592b98]">Instructor dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">Welcome back, {user?.name || 'Instructor'}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-500 sm:text-base">
              Manage your courses, monitor enrolments, and keep your content updated from one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/courses" className="inline-flex items-center justify-center rounded-full border border-[#592b98] bg-white px-6 py-3 text-sm font-semibold text-[#592b98] transition hover:bg-[#592b98] hover:text-white">
              Browse platform courses
            </Link>
            <Link to="/become-instructor" className="inline-flex items-center justify-center rounded-full bg-[#592b98] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3e1f6b]">
              Publish new course
            </Link>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-10">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total courses</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.totalCourses}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Total students</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.totalStudents}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Average rating</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.averageRating}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Published courses</p>
            <p className="mt-4 text-4xl font-semibold text-slate-900">{summary.published}</p>
            <p className="mt-2 text-sm text-slate-500">Drafts: {summary.drafts}</p>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Your courses</h2>
              <p className="mt-2 text-sm text-slate-500">An overview of your published and draft courses.</p>
            </div>
            <Link
              to="/become-instructor"
              className="inline-flex items-center justify-center rounded-full bg-[#592b98] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#3e1f6b]"
            >
              Create a new course
            </Link>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            {loading ? (
              <div className="flex min-h-[280px] items-center justify-center text-slate-500">Loading your courses…</div>
            ) : error ? (
              <div className="min-h-[280px] rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">{error}</div>
            ) : courses.length === 0 ? (
              <div className="min-h-[280px] flex flex-col items-center justify-center gap-4 text-center text-slate-500">
                <p className="text-lg font-semibold text-slate-900">No instructor courses yet</p>
                <p>Create your first course to start reaching students and earning revenue.</p>
                <Link
                  to="/become-instructor"
                  className="inline-flex items-center justify-center rounded-full bg-[#592b98] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#3e1f6b]"
                >
                  Start creating
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                        <p className="mt-2 text-sm text-slate-500">{course.category?.name || 'Uncategorized'}</p>
                      </div>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${course.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                        {course.status ?? 'draft'}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-4">
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Students</p>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{course.students_count ?? 0}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Rating</p>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{course.rating ?? '—'}</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Duration</p>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{course.duration ?? '—'} min</p>
                      </div>
                      <div className="rounded-3xl bg-white p-4 shadow-sm">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Price</p>
                        <p className="mt-3 text-xl font-semibold text-slate-900">{course.price ? `$${course.price}` : 'Free'}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        to={`/course/${course.id}`}
                        className="inline-flex items-center justify-center rounded-full bg-[#592b98] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3e1f6b]"
                      >
                        View course
                      </Link>
                      <button
                        onClick={() => navigate(`/course/${course.id}`)}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default InstructorDashboard;
