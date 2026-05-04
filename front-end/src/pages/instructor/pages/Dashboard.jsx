import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInstructorCourses } from '../../../services/coursesService';
import api from '../../../services/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [coursesRes, walletRes] = await Promise.allSettled([
          getInstructorCourses(),
          api.get('instructor/wallet'),
        ]);
        if (coursesRes.status === 'fulfilled') setCourses(coursesRes.value);
        if (walletRes.status === 'fulfilled') setWallet(walletRes.value.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  const stats = {
    total: courses.length,
    published: courses.filter(c => c.status === 'published').length,
    pending: courses.filter(c => c.status === 'pending_review').length,
    rejected: courses.filter(c => c.status === 'rejected').length,
    draft: courses.filter(c => c.status === 'draft').length,
    students: courses.reduce((sum, c) => sum + (c.students_count || 0), 0),
  };

  const earnings = wallet?.total_earnings || 0;
  const totalSales = wallet?.total_sales || 0;
  const monthly = wallet?.monthly || [];
  const byCourse = wallet?.by_course || [];
  const history = wallet?.history || [];
  const maxEarning = Math.max(...monthly.map(m => m.earnings), 1);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin" />
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Earnings"
            value={`$${Number(earnings).toFixed(2)}`}
            bg="bg-[#f8f5ff]"
            textColor="text-[#592b98]"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Total Students"
            value={stats.students}
            bg="bg-blue-50"
            textColor="text-blue-500"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <StatCard
            label="Total Sales"
            value={totalSales}
            bg="bg-green-50"
            textColor="text-green-500"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
          />
          <StatCard
            label="Published Courses"
            value={stats.published}
            bg="bg-orange-50"
            textColor="text-orange-500"
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>

        {/* Two-Column Layout: Chart + Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Monthly Earnings Chart */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Monthly Earnings</h2>
              <Link to="/instructor/wallet" className="text-xs font-bold text-[#592b98] hover:underline">
                View wallet →
              </Link>
            </div>
            {monthly.length > 0 ? (
              <div className="px-6 py-6">
                <div className="flex items-end gap-3 h-40">
                  {monthly.map(m => {
                    const pct = (m.earnings / maxEarning) * 100;
                    const label = MONTHS[parseInt(m.month.split('-')[1], 10) - 1];
                    return (
                      <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                        <span className="text-[10px] text-gray-500 font-semibold">${m.earnings}</span>
                        <div className="w-full rounded-t-lg bg-[#592b98] transition-all duration-700"
                          style={{ height: `${pct}%`, minHeight: '4px' }} />
                        <span className="text-[10px] text-gray-400">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-6 py-12 text-center">
                <p className="text-gray-400 text-sm">No earnings data yet</p>
              </div>
            )}
          </div>

          {/* Course Status Summary */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Course Status</h2>
            </div>
            <div className="px-6 py-4 space-y-4">
              {[
                { label: 'Published', value: stats.published, color: 'bg-green-500' },
                { label: 'Pending Review', value: stats.pending, color: 'bg-blue-500' },
                { label: 'Draft', value: stats.draft, color: 'bg-yellow-500' },
                { label: 'Rejected', value: stats.rejected, color: 'bg-red-500' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <span className="text-sm font-bold text-[#592b98]">{stats.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Column Layout: Courses + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Courses */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Your Courses</h2>
              <Link to="/instructor/courses" className="text-xs font-bold text-[#592b98] hover:underline">
                Manage all →
              </Link>
            </div>

            {courses.length === 0 ? (
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
                {courses.slice(0, 5).map((course) => (
                  <div key={course.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                    {course.thumbnail ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${course.thumbnail}`}
                        alt={course.title}
                        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-[#592b98] to-[#3e1f6b] rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                        </svg>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">{course.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{course.students_count || 0} students</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      course.status === 'published' ? 'bg-green-100 text-green-700'
                        : course.status === 'rejected' ? 'bg-red-100 text-red-700'
                        : course.status === 'pending_review' ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {course.status === 'pending_review' ? 'Pending' : course.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Recent Transactions</h2>
              <Link to="/instructor/wallet" className="text-xs font-bold text-[#592b98] hover:underline">
                View all →
              </Link>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-16 px-6">
                <p className="text-4xl mb-3">💳</p>
                <p className="text-gray-400 text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {history.slice(0, 5).map(tx => (
                  <div key={tx.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{tx.description || 'Course sale'}</p>
                        <p className="text-xs text-gray-400">{tx.date}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">+${Number(tx.amount).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Earning Courses */}
        {byCourse.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Top Earning Courses</h2>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 text-left">Course</th>
                  <th className="px-6 py-3 text-right">Sales</th>
                  <th className="px-6 py-3 text-right">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {byCourse.slice(0, 5).map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-3">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400 text-xs">📘</div>
                      )}
                      <span className="font-medium text-gray-900 line-clamp-1">{c.title}</span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 font-semibold">{c.sales}</td>
                    <td className="px-6 py-4 text-right font-bold text-[#592b98]">${c.earnings.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};

/* Reusable stat card matching existing design */
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

export default Dashboard;
