import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CourseDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for the course
  const course = {
    id: id || '1',
    title: "Complete React Developer in 2024: Zero to Mastery",
    category: "Programming",
    rating: 4.8,
    reviews: "2,450",
    students: "12,340",
    duration: "42h 30m",
    price: "$49.99",
    oldPrice: "$89.99",
    instructor: {
      name: "Sarah Johnson",
      role: "Senior Frontend Engineer",
      avatar: "https://i.pravatar.cc/150?u=sarah",
      courses: 12,
      students: "45k+",
      bio: "Sarah is a passionate educator and software engineer with over 10 years of experience in building scalable web applications. She has helped thousands of students master modern web technologies."
    },
    img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    lastUpdated: "April 2024",
    language: "English",
    learnings: [
      "Master React.js from scratch to advanced level",
      "Build real-world projects with React, Redux, and Firebase",
      "Learn modern state management with Context API and Hooks",
      "Understand performance optimization and testing",
      "Deploy scalable React applications to production"
    ],
    curriculum: [
      {
        title: "Introduction to React",
        lessons: [
          { title: "What is React?", duration: "10:24", free: true },
          { title: "Setting up your environment", duration: "15:45", free: true },
          { title: "Our first React App", duration: "20:10", free: false }
        ]
      },
      {
        title: "React Components & Props",
        lessons: [
          { title: "Functional Components", duration: "18:20", free: false },
          { title: "Understanding Props", duration: "22:15", free: false },
          { title: "Component Lifecycle", duration: "25:40", free: false }
        ]
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans antialiased text-[#1A1F5E]">
      
      {/* Course Hero Section */}
      <section className="bg-[#1A1F5E] pt-12 pb-24 px-6 relative overflow-hidden animate-fade-in">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-white/50 text-sm mb-8 font-medium">
             <Link to="/" className="hover:text-white transition-colors">Home</Link>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             <Link to="/courses" className="hover:text-white transition-colors">Courses</Link>
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
             <span className="text-white/90">{course.category}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-2">
              <span className="bg-[#FF6636] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-6 inline-block">BESTSELLER</span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {course.title}
              </h1>
              <p className="text-white/70 text-lg mb-8 max-w-2xl leading-relaxed font-normal">
                Master React 18, Hooks, Redux, React Router, Next.js and more! Build production-ready web applications from scratch.
              </p>

              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80 font-normal">
                <div className="flex items-center gap-1 text-[#FF6636]">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < 4 ? 'fill-current' : 'text-white/20'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-white font-bold ml-1">{course.rating}</span>
                  <span className="text-white/40 font-normal ml-1">({course.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  {course.students} students enrolled
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {course.duration} total duration
                </div>
              </div>

              <div className="mt-8 flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                    <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                 </div>
                 <div>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest">Instructor</p>
                    <p className="text-white font-semibold">{course.instructor.name}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 relative -mt-16 z-20 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* What you'll learn */}
            <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-xl shadow-slate-200/40">
              <h2 className="text-2xl font-bold mb-8">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
                {course.learnings.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-[15px] font-normal text-slate-600 leading-relaxed">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-gray-100 gap-10">
              {['overview', 'curriculum', 'instructor'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-semibold uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#FF6636]' : 'text-slate-400 hover:text-[#1A1F5E]'}`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF6636] rounded-full"></div>}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="pt-4">
               {activeTab === 'overview' && (
                 <div className="space-y-6 text-slate-600 font-normal leading-relaxed">
                   <p>Learn the skills to become a React.js expert. This comprehensive course takes you from absolute beginner to building production-ready applications with the world's most popular frontend library.</p>
                   <p>We'll cover everything from the basic concepts like JSX and components, all the way to advanced topics like state management with Redux, performance optimization, and testing with Jest.</p>
                 </div>
               )}

               {activeTab === 'curriculum' && (
                 <div className="space-y-4">
                   {course.curriculum.map((section, idx) => (
                     <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden bg-slate-50">
                       <div className="p-5 bg-white flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors">
                          <h3 className="font-semibold">{section.title}</h3>
                          <span className="text-xs font-semibold text-[#FF6636] uppercase tracking-widest">{section.lessons.length} Lessons</span>
                       </div>
                       <div className="divide-y divide-gray-100">
                         {section.lessons.map((lesson, lIdx) => (
                           <div key={lIdx} className="p-5 flex justify-between items-center text-sm font-normal hover:bg-white transition-colors">
                              <div className="flex items-center gap-3">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${lesson.free ? 'bg-[#FF6636]/10 text-[#FF6636]' : 'bg-slate-100 text-slate-400'}`}>
                                    {lesson.free ? (
                                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    ) : (
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    )}
                                 </div>
                                 <span className={lesson.free ? 'text-[#1A1F5E]' : 'text-slate-400'}>{lesson.title}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                 <span className="text-slate-400 font-semibold">{lesson.duration}</span>
                                 {lesson.free && <span className="text-[10px] font-semibold uppercase text-[#FF6636] bg-[#FF6636]/10 px-2 py-0.5 rounded">Preview</span>}
                              </div>
                           </div>
                         ))}
                       </div>
                     </div>
                   ))}
                 </div>
               )}

               {activeTab === 'instructor' && (
                 <div className="bg-white rounded-[32px] p-10 border border-gray-100 flex flex-col md:flex-row gap-8">
                    <div className="w-32 h-32 rounded-[24px] overflow-hidden flex-shrink-0 shadow-lg border-4 border-slate-50">
                       <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                       <h3 className="text-2xl font-bold mb-1">{course.instructor.name}</h3>
                       <p className="text-[#FF6636] font-semibold text-sm mb-4 uppercase tracking-widest">{course.instructor.role}</p>
                       
                       <div className="flex gap-6 mb-6">
                          <div>
                             <span className="block font-bold text-[#1A1F5E] text-lg">{course.instructor.courses}</span>
                             <span className="text-slate-400 text-xs font-semibold uppercase">Courses</span>
                          </div>
                          <div>
                             <span className="block font-bold text-[#1A1F5E] text-lg">{course.instructor.students}</span>
                             <span className="text-slate-400 text-xs font-semibold uppercase">Students</span>
                          </div>
                       </div>
                       
                       <p className="text-slate-600 font-normal leading-relaxed italic">
                         "{course.instructor.bio}"
                       </p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[40px] shadow-2xl shadow-slate-200/60 overflow-hidden border border-white sticky top-28 group">
              <div className="relative aspect-video overflow-hidden">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                   <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#FF6636] shadow-xl transform scale-75 group-hover:scale-100 transition-transform">
                      <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                   </div>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl font-bold text-[#1A1F5E]">{course.price}</span>
                  <span className="text-slate-300 line-through font-semibold">{course.oldPrice}</span>
                  <span className="bg-[#FF6636]/10 text-[#FF6636] px-2 py-1 rounded text-xs font-bold uppercase ml-auto">45% OFF</span>
                </div>

                <div className="space-y-3 mb-8">
                   <button className="w-full bg-[#FF6636] text-white font-bold py-4 rounded-2xl hover:bg-[#e85a2c] transition-all shadow-xl shadow-[#FF6636]/20 active:scale-95">
                      Enroll in Course
                   </button>
                   <button className="w-full bg-white text-[#1A1F5E] border-2 border-slate-100 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all">
                      Add to Wishlist
                   </button>
                </div>

                <div className="space-y-4">
                   <p className="text-sm font-bold text-[#1A1F5E]">This course includes:</p>
                   <div className="space-y-3">
                      {[
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, text: "42.5 hours on-demand video" },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>, text: "12 downloadable resources" },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>, text: "Certificate of completion" },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, text: "Full lifetime access" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-sm text-slate-500 font-normal">
                           <div className="text-[#FF6636]">{item.icon}</div>
                           {item.text}
                        </div>
                      ))}
                   </div>
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50 flex justify-center gap-6">
                   <button className="text-slate-400 hover:text-[#FF6636] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button>
                   <button className="text-slate-400 hover:text-[#FF6636] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></button>
                   <button className="text-slate-400 hover:text-[#FF6636] transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetails;