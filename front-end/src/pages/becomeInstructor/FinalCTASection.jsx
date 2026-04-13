import React from 'react';

const FinalCTASection = () => {
  return (
    <section className="relative py-32 px-6 bg-gradient-to-br from-[#1A1F5E] via-[#1e225e] to-[#FF6636]/20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#FF6636]/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-green-500/10 rounded-full blur-2xl animate-pulse delay-1500"></div>
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-[#FF6636]/20 rotate-45 animate-bounce delay-300"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400/30 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-purple-400/40 rotate-12 animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 right-1/4 w-5 h-5 border border-white/10 rotate-45 animate-bounce delay-500"></div>
      </div>

      <div className="w-[90%] lg:w-[85%] mx-auto relative z-10 text-center">
        <div className="space-y-8">
          {/* Main heading */}
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Ready to Transform{' '}
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6636] via-[#ff7b4a] to-[#FF6636] animate-gradient-x">
                  Education?
                </span>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-[#FF6636]/50 to-transparent rounded-full blur-sm"></div>
              </span>
            </h2>
          </div>

          {/* Description */}
          <p className="text-white/80 text-xl md:text-2xl leading-relaxed font-light max-w-4xl mx-auto">
            Start your teaching journey today and help millions of students achieve their goals.
            Join our community of successful instructors and make a lasting impact.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <button className="group relative bg-gradient-to-r from-[#FF6636] to-[#ff7b4a] text-white px-16 py-6 rounded-2xl font-bold text-xl hover:shadow-2xl hover:shadow-[#FF6636]/40 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden">
              <span className="relative z-10 flex items-center gap-4">
                Become an Instructor
                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff7b4a] to-[#FF6636] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-2xl"></div>
            </button>

            <button className="group bg-white/10 backdrop-blur-md text-white border-2 border-white/30 px-12 py-6 rounded-2xl font-bold text-lg hover:bg-white/20 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
              <span className="flex items-center gap-3">
                Schedule a Demo
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </span>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-8 pt-16">
            {[
              { number: '50K+', label: 'Active Instructors', icon: '👨‍🏫' },
              { number: '2M+', label: 'Students Taught', icon: '🎓' },
              { number: '$100M+', label: 'Paid to Instructors', icon: '💰' },
              { number: '150+', label: 'Countries Reached', icon: '🌍' }
            ].map((stat, index) => (
              <div key={index} className="group bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-2">
                <div className="text-center space-y-3">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black text-[#FF6636] group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-white/70 text-sm font-medium uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="pt-12 border-t border-white/20">
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-sm font-medium">Fast Payouts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">24/7 Support</span>
              </div>
            </div>

            <div className="mt-8 text-white/50 text-sm">
              Have questions?{' '}
              <a href="#" className="text-[#FF6636] hover:text-[#ff7b4a] font-semibold transition-colors duration-300 hover:underline">
                Contact our support team
              </a>{' '}
              or{' '}
              <a href="#" className="text-[#FF6636] hover:text-[#ff7b4a] font-semibold transition-colors duration-300 hover:underline">
                schedule a demo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/5 to-transparent">
        <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
          <polygon className="fill-white/5" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </section>
  );
};

export default FinalCTASection;