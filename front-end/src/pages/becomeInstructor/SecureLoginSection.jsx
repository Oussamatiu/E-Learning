import React from 'react';

const SecureLoginSection = () => {
  return (
    <section className="py-16 px-4 bg-gray-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Secure device login protection
            </h2>
            <p className="text-gray-600 mb-8 max-w-md">
              Keep your course community safe with smart device controls, authentication checks, and instant alerts for suspicious logins.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#592b98]/10 rounded flex items-center justify-center mb-4 text-[#592b98]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">2-Device Limit</h3>
                <p className="text-gray-600 text-sm">Prevent account sharing by limiting access to two devices per student.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#592b98]/10 rounded flex items-center justify-center mb-4 text-[#592b98]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Authentication Checks</h3>
                <p className="text-gray-600 text-sm">Verify login attempts automatically to keep every course session safe.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#592b98]/10 rounded flex items-center justify-center mb-4 text-[#592b98]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a6 6 0 0 0-12 0v4a6 6 0 0 0 12 0V8z" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Alerts</h3>
                <p className="text-gray-600 text-sm">Students receive notifications when a new device accesses their account.</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="w-12 h-12 bg-[#592b98]/10 rounded flex items-center justify-center mb-4 text-[#592b98]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M2 12h20" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Trusted Learning</h3>
                <p className="text-gray-600 text-sm">Protect your reputation with a secure student experience.</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&q=80"
                alt="Secure Login"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureLoginSection;
