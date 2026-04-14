import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-12 px-4 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Become an instructor
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-xl">
              Instructors from around the world teach millions of learners on LearnTrack. We provide the tools you need to succeed.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/register?role=3')}
                className="inline-flex items-center justify-center px-6 py-3 bg-[#592b98] text-white font-semibold rounded-md hover:bg-[#3e1f6b] transition-colors"
              >
                Get started
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 border border-gray-300 font-semibold rounded-md hover:bg-gray-50 transition-colors"
              >
                Learn more
              </button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="rounded-lg overflow-hidden shadow-lg max-h-[420px] w-full">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=900&q=80"
                alt="Instructor teaching"
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
