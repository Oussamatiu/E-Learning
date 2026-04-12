import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CourseCard = ({ id, title, category, img, instructor, price, rating, reviews, students, duration }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => navigate(`/course/${id}`)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group flex flex-col h-full cursor-pointer hover:-translate-y-2"
    >
      <div className="relative aspect-video overflow-hidden">
        <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-[#FF6636] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{category}</span>
          <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">HOT</span>
        </div>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2 text-[#FF6636]">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-gray-900 font-bold text-xs ml-1">{rating}</span>
          <span className="text-gray-400 text-xs font-normal">({reviews} reviews)</span>
        </div>
        <h3 className="text-[15px] font-bold text-[#1A1F5E] mb-3 leading-snug line-clamp-2 group-hover:text-[#FF6636] transition-colors">{title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
            <img src={`https://i.pravatar.cc/100?u=${instructor}`} alt={instructor} className="w-full h-full object-cover" />
          </div>
          <span className="text-xs text-gray-500">by <span className="text-[#1A1F5E] font-semibold">{instructor}</span></span>
        </div>
        
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              {students} students
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {duration}
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-50">
             <span className="text-[#FF6636] font-bold text-lg">{price}</span>
             <button className="text-[11px] font-semibold uppercase tracking-widest text-[#1A1F5E] group-hover:text-[#FF6636] transition-colors">Enroll Now →</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const courses = [
    { id: 1, title: "Complete React Developer in 2024: Zero to Mastery", category: "Programming", rating: 4.8, reviews: "2,450", students: "12k", duration: "42h 30m", price: "$49.99", instructor: "Sarah Johnson", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80" },
    { id: 2, title: "UI/UX Design Masterclass: Strategy, Tools & Practice", category: "Design", rating: 4.9, reviews: "1,820", students: "8k", duration: "28h 15m", price: "$39.99", instructor: "Michael Chen", img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=400&q=80" },
    { id: 3, title: "Python for Data Science and Machine Learning", category: "Data Science", rating: 4.7, reviews: "3,100", students: "15k", duration: "56h 45m", price: "$54.99", instructor: "David Miller", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80" },
    { id: 4, title: "Digital Marketing Strategy: From Zero to Hero", category: "Marketing", rating: 4.6, reviews: "950", students: "5k", duration: "18h 20m", price: "$29.99", instructor: "Emily White", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
    { id: 5, title: "Modern JavaScript: Building Scalable Web Apps", category: "Programming", rating: 4.8, reviews: "1,200", students: "7k", duration: "32h 10m", price: "$44.99", instructor: "Alex Rivera", img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80" },
    { id: 6, title: "Photography Masterclass: A Complete Guide", category: "Photography", rating: 4.9, reviews: "640", students: "3k", duration: "24h 50m", price: "$34.99", instructor: "Laura Smith", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80" },
    { id: 7, title: "Advanced SQL for Business Intelligence", category: "Data Science", rating: 4.7, reviews: "890", students: "4k", duration: "15h 40m", price: "$39.99", instructor: "James Wilson", img: "https://images.unsplash.com/photo-1551288049-bbbda5366991?w=400&q=80" },
    { id: 8, title: "Financial Analysis & Investment Management", category: "Finance", rating: 4.8, reviews: "520", students: "2k", duration: "22h 15m", price: "$49.99", instructor: "Robert Brown", img: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400&q=80" },
  ];

  const categories = ['All', 'Programming', 'Design', 'Data Science', 'Marketing', 'Finance', 'Photography'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || course.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <section className="py-24 px-6 bg-[#F8FAFC]">
      <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-16">
          <div className="max-w-xl">
            <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">ALL COURSES</span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] leading-tight">Find the best course for you</h2>
            <p className="text-slate-500 mt-4 font-normal text-lg">Explore our curated selection of top-tier professional courses.</p>
          </div>
          
          <div className="w-full lg:max-w-2xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF6636] transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input 
                type="text" 
                placeholder="Search courses, skills, or instructors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-slate-100 pl-16 pr-32 py-5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-[#FF6636]/10 focus:border-[#FF6636] transition-all shadow-xl shadow-slate-200/40 text-[#1A1F5E] font-semibold text-lg placeholder:text-slate-400"
              />
              <div className="absolute right-3 top-3 bottom-3 flex items-center">
                <button className="bg-[#1A1F5E] text-white h-full px-8 rounded-xl font-semibold hover:bg-[#FF6636] transition-all shadow-lg active:scale-95">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
           {categories.map(filter => (
             <button 
              key={filter} 
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all border ${
                activeFilter === filter 
                ? 'bg-[#1A1F5E] text-white border-[#1A1F5E] shadow-lg shadow-[#1A1F5E]/20' 
                : 'bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-[#1A1F5E]/20'
              }`}
             >
               {filter}
             </button>
           ))}
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-xl font-bold text-[#1A1F5E] mb-2">No results found</h3>
            <p className="text-slate-400">Try adjusting your search or filters.</p>
          </div>
        )}

        <div className="mt-16 text-center">
          <button className="bg-white text-[#1A1F5E] border-2 border-[#1A1F5E]/10 px-10 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-sm">
            Browse all courses →
          </button>
        </div>
      </div>
    </section>
  );
};
;