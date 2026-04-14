import React from 'react';

export const CTA = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#592b98] rounded-lg p-8 md:p-16 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              Unlock your potential
            </h2>
            <p className="text-white/80 text-base mb-8 max-w-xl mx-auto">
              Join 200K+ learners and start your journey today. Access thousands of courses from expert instructors.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <button className="bg-white text-[#592b98] px-8 py-3 rounded-md font-semibold text-base hover:bg-gray-50 transition-colors">
                Get started
              </button>
              <button className="bg-transparent text-white border border-white/30 px-8 py-3 rounded-md font-semibold text-base hover:bg-white/10 transition-colors">
                Browse courses
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-green-400 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 No credit card required
              </div>
              <div className="flex items-center gap-2">
                 <svg className="w-4 h-4 text-green-400 fill-current" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};