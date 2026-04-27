import React, { useEffect, useState } from 'react';
import api from '../../../services/api';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const Wallet = () => {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('instructor/wallet')
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const monthly   = data?.monthly  || [];
  const byCourse  = data?.by_course || [];
  const maxEarning = Math.max(...monthly.map(m => m.earnings), 1);
console.log(data);
  return (
    <div className="p-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-1">Finance</p>
        <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
        <p className="text-gray-500 text-sm mt-1">Earnings from student course purchases</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          {
            label: 'Total Earnings',
            value: `$${Number(data?.total_earnings || 0).toFixed(2)}`,
            icon: '💰',
            color: 'bg-purple-50 text-[#592b98]',
          },
          {
            label: 'Total Sales',
            value: data?.total_sales || 0,
            icon: '🛒',
            color: 'bg-blue-50 text-blue-600',
          },
          {
            label: 'Courses Selling',
            value: byCourse.length,
            icon: '📚',
            color: 'bg-green-50 text-green-600',
          },
        ].map(card => (
          <div key={card.label} className={`rounded-2xl p-5 ${card.color} flex items-center gap-4`}>
            <span className="text-3xl">{card.icon}</span>
            <div>
              <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">{card.label}</p>
              <p className="text-2xl font-bold mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      {monthly.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold text-gray-700 mb-5">Monthly Earnings (Last 6 months)</h2>
          <div className="flex items-end gap-3 h-40">
            {monthly.map(m => {
              const pct  = (m.earnings / maxEarning) * 100;
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
      )}

      {/* Per-course table */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-700">Earnings by Course</h2>
        </div>
        {byCourse.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-4xl mb-3">💳</p>
            <p className="text-gray-500 text-sm">No earnings yet. Publish a course to start selling!</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Course</th>
                <th className="px-6 py-3 text-right">Sales</th>
                <th className="px-6 py-3 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {byCourse.map(c => (
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
        )}
      </div>
    </div>
  );
};

export default Wallet;
