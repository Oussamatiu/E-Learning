import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseProtectionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 md:p-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Keep your course content secure
              </h2>
              <p className="text-gray-600 max-w-xl">
                Protect your intellectual property with built-in anti-piracy tools designed for premium education content.
              </p>
            </div>

            <button
              onClick={() => navigate('/register?role=3')}
              className="inline-flex items-center justify-center px-8 py-3 bg-[#592b98] text-white font-semibold rounded-md hover:bg-[#3e1f6b] transition-colors whitespace-nowrap"
            >
              Secure your course
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseProtectionSection;
