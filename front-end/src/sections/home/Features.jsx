import React from 'react';

const FeatureCard = ({ icon, title, desc, bgColor, iconColor }) => (
  <div className="p-8 rounded-3xl bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group border border-transparent hover:border-gray-100 hover:-translate-y-2">
    <div className={`w-16 h-16 ${bgColor} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm shadow-current/10`}>
      <div className={`${iconColor}`}>
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-bold text-[#1A1F5E] mb-4 group-hover:text-[#FF6636] transition-colors">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-[15px] font-normal">{desc}</p>
  </div>
);

export const Features = () => (
  <section className="py-32 bg-[#F8FAFC] relative overflow-hidden">
    <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto relative z-10">
      <div className="text-center mb-20">
        <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block">WHY OUR PLATFORM</span>
        <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] leading-tight">
          Everything you need to master <br/> your learning
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard 
          bgColor="bg-orange-50"
          iconColor="text-orange-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          title="Automatic Time Tracking"
          desc="Every second you spend learning is tracked and logged automatically, helping you stay focused and productive."
        />
        <FeatureCard 
          bgColor="bg-blue-50"
          iconColor="text-blue-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          title="100% Precision Control"
          desc="Full control over your learning path with precision-engineered tools and resources to help you succeed."
        />
        <FeatureCard 
          bgColor="bg-green-50"
          iconColor="text-green-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          title="Exclusive Messaging"
          desc="Direct access to instructors and peers through our exclusive messaging system for better collaboration."
        />
        <FeatureCard 
          bgColor="bg-purple-50"
          iconColor="text-purple-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11l-3 3m0 0l-3-3m3 3V3" /></svg>}
          title="Progress Analytics"
          desc="Detailed insights into your learning progress with comprehensive analytics and visualization tools."
        />
        <FeatureCard 
          bgColor="bg-yellow-50"
          iconColor="text-yellow-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
          title="Verified Certificates"
          desc="Earn industry-recognized certificates upon completion of your courses to showcase your expertise."
        />
        <FeatureCard 
          bgColor="bg-red-50"
          iconColor="text-red-500"
          icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
          title="Learn Anywhere"
          desc="Access your courses from anywhere in the world, on any device, at any time that suits you best."
        />
      </div>
    </div>
  </section>
);
