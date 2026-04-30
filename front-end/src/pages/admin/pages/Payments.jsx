import React, { useState, useEffect } from 'react';
import { apiService } from '../../../services/api';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

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

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">Payment Monitoring</p>
            <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>}

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
                        <span className={`inline-block px-2 py-0.5 rounded-sm text-xs font-semibold ${
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Payments;
