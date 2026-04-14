
import React from 'react';

export const Hero = () => (
  <section className="bg-white pt-8 pb-12 px-4 border-b border-gray-200">
    <div className="max-w-7xl mx-auto">
      {/* Hero Content - Udemy Style */}
      <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Learn without limits
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-xl">
            Build skills with courses, certificates, and degrees online from world-class universities and companies.
          </p>

          {/* Search Bar - Prominent */}
          <div className="relative max-w-xl mb-6">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search for anything"
              className="w-full bg-white border-2 border-gray-300 pl-12 pr-32 py-3.5 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm font-medium"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#592b98] text-white px-6 py-2.5 rounded-md text-sm font-medium hover:bg-[#3e1f6b] transition-colors">
              Search
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="font-medium">Popular:</span>
            {['Python', 'Excel', 'Web Development', 'JavaScript', 'Data Science', 'AWS'].map((topic) => (
              <a key={topic} href="#" className="hover:text-[#592b98] hover:underline transition-colors">{topic}</a>
            ))}
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative hidden lg:block">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
              alt="Students learning together"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-200 pt-8 mt-8">
        <p className="text-sm text-gray-500 mb-4 font-medium">Trusted by employees at</p>
        <div className="flex flex-wrap items-center gap-8 opacity-60 grayscale">
          {['Company 1', 'Company 2', 'Company 3', 'Company 4', 'Company 5'].map((company, idx) => (
            <div key={idx} className="h-8 w-24 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  </section>
);
