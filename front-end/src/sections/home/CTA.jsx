import React from 'react';

export const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto">
        <div className="bg-[#FF6636] rounded-3xl p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#FF6636]/30 group">
          {/* Decorative background patterns */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <span className="text-white/80 font-semibold tracking-[0.2em] text-xs uppercase mb-6 block underline underline-offset-8 decoration-white/30">START TODAY</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              Ready to start your learning journey?
            </h2>
            <p className="text-white/80 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              Join thousands of students learning from top-tier professionals and tracking their goals every single minute.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-white text-[#FF6636] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all shadow-xl active:scale-95 group-hover:scale-105 duration-300">
                Get Started Now
              </button>
              <button className="bg-transparent text-white border-2 border-white/30 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all active:scale-95">
                View All Courses
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/60 text-sm font-normal">
              <div className="flex items-center gap-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 No credit card required
              </div>
              <div className="flex items-center gap-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 Cancel anytime, no strings attached
              </div>
              <div className="flex items-center gap-2">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                 200+ trusted partners
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};