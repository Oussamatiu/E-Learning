import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [courseFilter, setCourseFilter] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role_id === 3 || user.role?.title === 'admin';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'courses') fetchCourses();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'payments') fetchPayments();
  }, [activeTab]);

  const fetchDashboard = async () => {
    try {
      const res = await apiService.admin.getDashboard();
      setStats(res.data?.stats || {});
    } catch (e) {
      setError('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getUsers();
      setUsers(res.data?.data || []);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await apiService.admin.getPayments();
      setPayments(res.data?.data || []);
    } catch (e) {
      setError('Failed to load payments');
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

  const handleDeleteCourse = async (id) => {
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

  const handleToggleUser = async (id) => {
    setActionLoading(`toggle-${id}`);
    try {
      await apiService.admin.toggleUser(id);
      setSuccess('User status updated');
      fetchUsers();
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update user');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading && activeTab === 'overview' && !stats.total_users) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#592b98] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#592b98] rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-xs text-gray-500">Control Panel</p>
            </div>
          </div>
          <button
            onClick={() => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/login'); }}
            className="text-sm text-red-500 hover:text-red-600 font-medium"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">{success}</div>}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {['overview', 'courses', 'users', 'payments'].map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setError(''); setSuccess(''); }}
              className={`px-5 py-2.5 rounded-md text-sm font-semibold capitalize transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#592b98] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Users', value: stats.total_users || 0, icon: '👤' },
              { label: 'Total Courses', value: stats.total_courses || 0, icon: '📚' },
              { label: 'Published', value: stats.published_courses || 0, icon: '✅' },
              { label: 'Pending Review', value: stats.pending_courses || 0, icon: '⏳' },
              { label: 'Total Orders', value: stats.total_orders || 0, icon: '🛒' },
              { label: 'Total Revenue', value: `$${Number(stats.total_revenue || 0).toFixed(2)}`, icon: '💰' },
              { label: 'Enrollments', value: stats.total_enrollments || 0, icon: '🎓' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Courses */}
        {activeTab === 'courses' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Course Review</h2>
              <select
                value={courseFilter}
                onChange={(e) => { setCourseFilter(e.target.value); fetchCourses(); }}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="draft">Pending</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
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
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          course.status === 'published' ? 'bg-green-100 text-green-700' :
                          course.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          {course.status === 'draft' && (
                            <>
                              <button
                                onClick={() => handleApprove(course.id)}
                                disabled={actionLoading === `approve-${course.id}`}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50"
                              >
                                {actionLoading === `approve-${course.id}` ? '...' : 'Approve'}
                              </button>
                              <button
                                onClick={() => handleReject(course.id)}
                                disabled={actionLoading === `reject-${course.id}`}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                              >
                                {actionLoading === `reject-${course.id}` ? '...' : 'Reject'}
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={actionLoading === `delete-${course.id}`}
                            className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 disabled:opacity-50"
                          >
                            {actionLoading === `delete-${course.id}` ? '...' : 'Delete'}
                          </button>
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
          </div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{u.id}</td>
                      <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3 capitalize">{u.role?.title || '-'}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleUser(u.id)}
                          disabled={actionLoading === `toggle-${u.id}` || u.role?.title === 'admin'}
                          className={`px-3 py-1 text-xs rounded disabled:opacity-50 ${
                            u.is_active
                              ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100'
                          }`}
                        >
                          {actionLoading === `toggle-${u.id}` ? '...' : u.is_active ? 'Suspend' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-500">No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Payments */}
        {activeTab === 'payments' && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Payment Monitoring</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-medium">
                  <tr>
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Order ID</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{p.id}</td>
                      <td className="px-4 py-3">{p.order_id}</td>
                      <td className="px-4 py-3">{p.order?.user?.name || '-'}</td>
                      <td className="px-4 py-3 font-medium">${Number(p.amount).toFixed(2)}</td>
                      <td className="px-4 py-3 capitalize">{p.provider}</td>
                      <td className="px-4 py-3">{p.payment_method_type || p.provider}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                          p.status === 'completed' ? 'bg-green-100 text-green-700' :
                          p.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{p.created_at ? new Date(p.created_at).toLocaleDateString() : '-'}</td>
                    </tr>
                  ))}
                  {payments.length === 0 && (
                    <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-500">No payments found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
