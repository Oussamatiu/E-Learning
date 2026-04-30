import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

const Overview = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    apiService.admin.getDashboard()
      .then(res => setStats(res.data?.stats || {}))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">Admin Dashboard</p>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}, {user.name?.split(' ')[0] || 'Admin'} 👋
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', value: stats.total_users || 0 },
            { label: 'Total Courses', value: stats.total_courses || 0 },
            { label: 'Published', value: stats.published_courses || 0 },
            { label: 'Pending Review', value: stats.pending_courses || 0 },
            { label: 'Total Orders', value: stats.total_orders || 0 },
            { label: 'Total Revenue', value: `$${Number(stats.total_revenue || 0).toFixed(2)}` },
            { label: 'Enrollments', value: stats.total_enrollments || 0 },
          ].map((stat, i) => (
            <div key={i} className="text-center py-6 border border-gray-200 rounded-md">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-gray-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Review Pending Courses', desc: `${stats.pending_courses || 0} courses awaiting approval`, to: '/admin/courses', color: 'bg-[#f8f5ff] text-[#592b98]' },
              { title: 'Manage Users', desc: `${stats.total_users || 0} registered users`, to: '/admin/users', color: 'bg-blue-50 text-blue-600' },
              { title: 'View Payments', desc: `Revenue: $${Number(stats.total_revenue || 0).toFixed(2)}`, to: '/admin/payments', color: 'bg-green-50 text-green-600' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.to}
                className="group block p-6 border border-gray-200 rounded-md hover:shadow-lg transition-shadow"
              >
                <div className={`w-10 h-10 ${action.color} rounded-md flex items-center justify-center mb-4`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:underline">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
