import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { paymentId, amount, courses = [] } = location.state || {};

  if (!paymentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Payment Page</h1>
          <button
            onClick={() => navigate('/courses')}
            className="bg-[#7c3aed] text-white px-6 py-2 rounded-lg hover:bg-[#6d28d9]"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. You can now access your courses immediately.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-left">
                <p className="text-gray-600">Payment ID:</p>
                <p className="font-medium text-gray-900">{paymentId}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">Amount Paid:</p>
                <p className="font-medium text-green-600">${amount?.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Purchased Courses</h2>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-600 text-sm">📚</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900 text-sm">{course.title}</h3>
                      <p className="text-gray-600 text-xs">{course.instructor}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">${course.price?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/my-courses')}
              className="bg-[#7c3aed] text-white px-8 py-3 rounded-lg hover:bg-[#6d28d9] transition-colors">
              View My Courses
            </button>
            <button
              onClick={() => navigate('/courses')}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              Browse More Courses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;