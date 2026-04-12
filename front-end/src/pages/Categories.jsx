import React from 'react';
import { Link } from 'react-router-dom';

const CategoryRow = ({ title, count, icon, color, description, courses }) => (
  <div className="group bg-white rounded-[40px] p-10 border border-gray-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 flex flex-col lg:flex-row gap-12 items-center mb-12 last:mb-0">
    {/* Left: Visual/Icon */}
    <div className={`w-full lg:w-1/3 aspect-[4/3] ${color} rounded-[32px] flex items-center justify-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-700`}>
      <div className="absolute inset-0 opacity-20">
         <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-40 h-40 bg-black rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
      </div>
      <div className="text-white relative z-10 transform group-hover:scale-110 transition-transform duration-700 drop-shadow-2xl">
        {icon}
      </div>
    </div>

    {/* Right: Content */}
    <div className="flex-1 text-center lg:text-left">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-[10px] uppercase mb-2 block">{count} Professional Courses</span>
          <h2 className="text-4xl font-bold text-[#1A1F5E] group-hover:text-[#FF6636] transition-colors">{title}</h2>
        </div>
        <Link 
          to={`/courses?category=${title.toLowerCase()}`}
          className="inline-flex items-center justify-center gap-3 bg-[#1A1F5E] text-white px-8 py-4 rounded-2xl font-semibold text-sm hover:bg-[#FF6636] transition-all shadow-lg active:scale-95 group-hover:shadow-[#FF6636]/20"
        >
          Explore All
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </Link>
      </div>
      
      <p className="text-slate-500 text-lg font-normal leading-relaxed mb-8 max-w-2xl">
        {description}
      </p>

      {/* Mini Tags */}
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {courses.map((tag, i) => (
          <span key={i} className="px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-400 hover:text-[#1A1F5E] hover:border-[#1A1F5E]/20 transition-colors cursor-default">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const Categories = () => {
  const categories = [
    { 
      title: 'Programming', 
      count: '1,240', 
      icon: <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      color: 'bg-indigo-600',
      description: 'Architect scalable systems and master modern frameworks. From systems programming to cloud-native applications, our expert-led curriculum covers the full spectrum of engineering.',
      courses: ['React & Next.js', 'Python for AI', 'Go Microservices', 'Rust Systems', 'DevOps']
    },
    { 
      title: 'Design', 
      count: '850', 
      icon: <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      color: 'bg-fuchsia-600',
      description: 'Elevate visual communication through data-driven design. Master UI/UX principles, motion graphics, and brand strategy to create impactful digital experiences.',
      courses: ['Product Design', 'Figma Mastery', 'Brand Identity', '3D Motion', 'Design Systems']
    },
    { 
      title: 'Business', 
      count: '540', 
      icon: <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-emerald-600',
      description: 'Drive growth and lead with confidence. Our courses focus on high-impact leadership, strategic management, and operational excellence for modern enterprises.',
      courses: ['Leadership', 'Strategic Growth', 'Project Management', 'MBA Core', 'Operations']
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Sophisticated Header */}
      <section className="bg-[#1A1F5E] pt-24 pb-48 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <span className="text-[#FF6636] font-semibold tracking-[0.4em] text-xs uppercase mb-6 block">KNOWLEDGE ARCHITECTURE</span>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Professional <br /> <span className="text-[#FF6636]">Specializations</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl leading-relaxed font-normal">
              Curated learning paths designed for industry professionals and ambitious career changers. Explore our high-impact categories.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 px-6 -mt-32 relative z-20">
        <div className="max-w-7xl mx-auto">
          {categories.map((cat, idx) => (
            <CategoryRow key={idx} {...cat} />
          ))}
        </div>
      </section>

      {/* Bottom discovery */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto border-t border-slate-100 pt-24 text-center">
           <h2 className="text-3xl font-bold text-[#1A1F5E] mb-12">Looking for a specific skill?</h2>
           <div className="flex flex-wrap justify-center gap-4">
              {['Cloud Architecture', 'Quantum Computing', 'Behavioral Economics', 'Neural Networks', 'Game Theory', 'Strategic Finance'].map(skill => (
                <button key={skill} className="px-10 py-5 rounded-2xl bg-slate-50 border border-slate-100 text-sm font-semibold text-slate-400 hover:text-white hover:bg-[#FF6636] hover:border-[#FF6636] transition-all duration-300">
                  {skill}
                </button>
              ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;