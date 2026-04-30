import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleToggle = async (id) => {
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

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">User Management</p>
            <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}
        {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">{success}</div>}

        <div className="border border-gray-200 rounded-md overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-7 h-7 border-[3px] border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
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
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-semibold ${
                          u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {u.is_active ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(u.id)}
                          disabled={actionLoading === `toggle-${u.id}` || u.role?.title === 'admin'}
                          className={`px-3 py-1 text-xs rounded-md disabled:opacity-50 ${
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
