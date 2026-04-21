import React from 'react';

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto w-full max-w-5xl px-4">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98]">Student Dashboard</p>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-2 text-gray-600">Browse courses, continue learning, and manage your enrollments.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-gray-200 bg-[#f8f5ff] p-6">
              <p className="text-sm text-gray-500">My learning path</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">Continue your courses</h2>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-[#fff7f0] p-6">
              <p className="text-sm text-gray-500">Saved courses</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">Pick up where you left off</h2>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-[#effcf7] p-6">
              <p className="text-sm text-gray-500">Recommendations</p>
              <h2 className="mt-3 text-xl font-semibold text-gray-900">Courses tailored for you</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
