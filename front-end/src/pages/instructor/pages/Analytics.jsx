import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import Card from '../components/Card';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30');

  const stats = [
    { label: 'Total Revenue', value: '$45,234.00', change: '+18.2%', trend: 'up' },
    { label: 'Total Students', value: '8,542', change: '+12.5%', trend: 'up' },
    { label: 'Course Enrollments', value: '1,234', change: '+8.3%', trend: 'up' },
    { label: 'Avg. Rating', value: '4.7', change: '+0.2', trend: 'up' }
  ];

  const topCourses = [
    { rank: 1, title: 'React Masterclass 2024', revenue: '$12,450', students: 1245, rating: 4.8 },
    { rank: 2, title: 'Node.js Backend Development', revenue: '$8,920', students: 892, rating: 4.7 },
    { rank: 3, title: 'Advanced CSS & Tailwind', revenue: '$5,670', students: 567, rating: 4.9 },
    { rank: 4, title: 'Docker & Kubernetes', revenue: '$4,230', students: 445, rating: 4.8 },
    { rank: 5, title: 'Python for Data Science', revenue: '$3,890', students: 234, rating: 4.6 }
  ];

  const revenueData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1500 },
    { day: 'Thu', revenue: 2200 },
    { day: 'Fri', revenue: 1900 },
    { day: 'Sat', revenue: 2800 },
    { day: 'Sun', revenue: 2400 }
  ];

  const studentData = [
    { month: 'Jan', students: 450 },
    { month: 'Feb', students: 520 },
    { month: 'Mar', students: 680 },
    { month: 'Apr', students: 750 },
    { month: 'May', students: 890 },
    { month: 'Jun', students: 1020 }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));
  const maxStudents = Math.max(...studentData.map(d => d.students));

  return (
    <div>
      <Topbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 text-sm mt-1">Track your course performance and student engagement</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#592b98]"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#592b98] text-white rounded-md text-sm font-medium hover:bg-[#3e1f6b] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => (
            <Card key={index}>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <div className="flex items-end justify-between mt-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <span className={`flex items-center text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend === 'up' ? (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  )}
                  {stat.change}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Revenue Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-[#592b98] rounded-sm"></span>
                  Revenue
                </span>
              </div>
            </div>
            <div className="h-64 flex items-end gap-4">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-[#592b98] rounded-t-md transition-all hover:bg-[#3e1f6b]"
                    style={{ height: `${(item.revenue / maxRevenue) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{item.day}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Student Growth Chart */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Student Growth</h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 bg-blue-500 rounded-sm"></span>
                  Students
                </span>
              </div>
            </div>
            <div className="h-64 flex items-end gap-4">
              {studentData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                    style={{ height: `${(item.students / maxStudents) * 200}px` }}
                  ></div>
                  <span className="text-xs text-gray-500">{item.month}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Top Performing Courses */}
        <Card padding="p-0">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {topCourses.map((course) => (
                  <tr key={course.rank} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                        course.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                        course.rank === 2 ? 'bg-gray-100 text-gray-700' :
                        course.rank === 3 ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-50 text-gray-500'
                      }`}>
                        {course.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-900">{course.revenue}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{course.students.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Student Demographics</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">18-24 years</span>
                  <span className="font-medium text-gray-900">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#592b98] h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">25-34 years</span>
                  <span className="font-medium text-gray-900">42%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">35-44 years</span>
                  <span className="font-medium text-gray-900">18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">45+ years</span>
                  <span className="font-medium text-gray-900">5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Device Usage</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-md">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Desktop</p>
                  <p className="text-xs text-gray-500">62% of students</p>
                </div>
                <span className="text-lg font-bold text-gray-900">62%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-md">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Mobile</p>
                  <p className="text-xs text-gray-500">28% of students</p>
                </div>
                <span className="text-lg font-bold text-gray-900">28%</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-md">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Tablet</p>
                  <p className="text-xs text-gray-500">10% of students</p>
                </div>
                <span className="text-lg font-bold text-gray-900">10%</span>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Completion Rates</h3>
            <div className="space-y-4">
              {topCourses.slice(0, 4).map((course, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 truncate flex-1">{course.title}</span>
                    <span className="font-medium text-gray-900 ml-2">{85 - index * 5}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${85 - index * 5}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
