import React from 'react';

const SecureLoginSection = () => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="w-[90%] lg:w-[85%] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block">STUDENT SECURITY</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] mb-4">Secure Device Login Protection</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Protect your courses with our advanced multi-device login system. Each student can only access their account from up to 2 devices simultaneously.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF6636]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#FF6636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m7.5-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1F5E] mb-2">2-Device Limit</h3>
                  <p className="text-slate-500">Each student account can be active on maximum 2 devices at the same time, preventing account sharing.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF6636]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#FF6636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1F5E] mb-2">Device Authentication</h3>
                  <p className="text-slate-500">All login attempts are verified through secure authentication protocols to prevent unauthorized access.</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#FF6636]/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-[#FF6636]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1A1F5E] mb-2">Instant Notifications</h3>
                  <p className="text-slate-500">Students receive instant alerts when their account is accessed on a new device.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80"
              alt="Secure Login"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureLoginSection;