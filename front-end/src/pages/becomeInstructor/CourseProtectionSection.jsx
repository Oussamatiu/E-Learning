import React from 'react';

const CourseProtectionSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="w-[90%] lg:w-[85%] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">CONTENT PROTECTION</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] mb-4">Protect Your Course Content</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Your valuable course content is protected with advanced anti-piracy measures to ensure your intellectual property remains secure.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A1F5E] mb-3">No Screenshot Recording</h3>
            <p className="text-slate-500 font-normal">Advanced technology prevents students from taking screenshots of your course content, protecting your intellectual property.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 15.536a6 6 0 11-8.485-8.485m0 0a6 6 0 118.485 8.485" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A1F5E] mb-3">Video Recording Blocked</h3>
            <p className="text-slate-500 font-normal">Video recording and screen capture are completely disabled during course viewing to prevent unauthorized distribution.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A1F5E] mb-3">Access Logging</h3>
            <p className="text-slate-500 font-normal">Comprehensive access logs track all student activity, allowing you to monitor course usage patterns and detect any suspicious behavior.</p>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-[#FF6636]/10 to-blue-500/10 p-8 rounded-2xl border border-[#FF6636]/20">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#FF6636] text-white flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18.243 3.757a6 6 0 00-8.485-8.485L10 3.515l-.758-.758a6 6 0 00-8.485 8.485l8.485 8.485 8.485-8.485z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#1A1F5E] mb-2">Why This Matters for Your Business</h4>
              <p className="text-slate-600">Protecting your course content ensures that only paying students have access to your material, preserving your revenue stream and maintaining the value of your courses in the marketplace.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseProtectionSection;