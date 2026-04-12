
import React from 'react';

export const Hero = () => (
  <section className="relative bg-[#1A1F5E] pt-24 pb-16 px-6 overflow-hidden animate-fade-in">
    {/* Background Glows */}
    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

    <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
      <div className="text-left">
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white/90 text-sm font-medium mb-8 border border-white/10">
          <span className="w-2 h-2 bg-[#FF6636] rounded-full"></span>
          Trusted by 5000+ top local and global
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1]">
          Learn anything. <br />
          <span className="text-white/90">Track <span className="text-white">every</span> minute.</span>
        </h1>
        <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed">
          Master new skills with 100+ professional courses, built-in time tracking, 
          and direct instructor messaging. Your learning journey, fully monitored.
        </p>
        
        {/* Search Bar */}
        <div className="relative max-w-2xl mb-10 group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#FF6636] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Search for anything... (Ex: JavaScript, Design, Marketing)" 
            className="w-full bg-white text-gray-900 pl-14 pr-32 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6636]/20 transition-all shadow-xl"
          />
          <button className="absolute right-3 top-3 bottom-3 bg-[#FF6636] text-white px-8 rounded-xl font-semibold hover:bg-[#e85a2c] transition-all active:scale-95 shadow-lg">
            Search
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-16">
          <button className="bg-[#FF6636] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#e85a2c] transition-all shadow-lg shadow-[#FF6636]/20 active:scale-95">
            Get Started Now →
          </button>
          <button className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all">
            Browse all courses
          </button>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-4 text-white/50 text-sm font-medium">
          <span>Popular:</span>
          {['Design', 'Video', 'Latter', 'UI/UX Design', 'Art', 'All Course'].map((cat) => (
            <a key={cat} href="#" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-4">{cat}</a>
          ))}
        </div>
      </div>

      <div className="relative hidden lg:block">
        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" alt="Platform Preview" className="w-full" />
          {/* Floating UI Element */}
          <div className="absolute top-10 right-10 bg-white p-6 rounded-2xl shadow-2xl animate-float">
             <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Progress Saved!</p>
                   <p className="text-[#1A1F5E] font-bold">Time Tracking Started</p>
                </div>
             </div>
             <div className="flex gap-2">
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-green-500 w-[75%]"></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">75%</span>
             </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#FF6636] rounded-3xl -z-10 rotate-12"></div>
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-400 rounded-full -z-10 blur-xl opacity-50"></div>
      </div>
    </div>

    {/* Bottom Stats */}
    <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto mt-24 border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
        {[
          { label: 'Active Learners', value: '200K+' },
          { label: 'Courses', value: '2,800+' },
          { label: 'Expert Mentors', value: '450+' },
          { label: 'Satisfaction Rate', value: '98%' },
        ].map((stat) => (
          <div key={stat.label} className="group cursor-default">
            <h3 className="text-4xl font-bold text-white mb-2 group-hover:text-[#FF6636] transition-colors">{stat.value}</h3>
            <p className="text-white/40 text-sm font-medium tracking-wide uppercase">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
