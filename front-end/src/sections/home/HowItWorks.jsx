import React from 'react';

const StepCard = ({ number, title, desc, icon }) => (
  <div className="relative flex flex-col items-center text-center group">
    <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20 group-hover:bg-[#FF6636] transition-all duration-500 shadow-xl">
      <div className="text-white">
        {icon}
      </div>
      <div className="absolute -top-4 -right-4 w-10 h-10 bg-[#FF6636] rounded-full flex items-center justify-center text-white font-bold text-lg border-4 border-[#1A1F5E]">
        {number}
      </div>
    </div>
    <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
    <p className="text-white/60 text-sm leading-relaxed max-w-[250px]">{desc}</p>
  </div>
);

export const HowItWorks = () => {
  return (
    <section className="py-32 bg-[#1A1F5E] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block">PROCESS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Start learning in <span className="text-[#FF6636]">3 simple steps</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <StepCard 
            number="01"
            title="Create Free Account"
            desc="Sign up for a free account in seconds and get access to our vast library of courses."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
          />
          <StepCard 
            number="02"
            title="Choose Your Course"
            desc="Browse through 100+ professional courses and pick the one that fits your goals."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          />
          <StepCard 
            number="03"
            title="Start Learning & Track"
            desc="Begin your learning journey and watch your progress with our built-in time tracker."
            icon={<svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
          />
        </div>

        <div className="mt-20 text-center">
          <button className="bg-[#FF6636] text-white px-10 py-4 rounded-xl font-semibold hover:bg-[#e85a2c] transition-all shadow-lg shadow-[#FF6636]/20 active:scale-95">
            Get Started Now →
          </button>
        </div>
      </div>
    </section>
  );
};