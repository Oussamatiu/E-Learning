import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CourseCard } from '../sections/home/Courses';

const Courses = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  const [activeRating, setActiveRating] = useState('All');

  const categories = ['All', 'Programming', 'Design', 'Marketing', 'Business', 'Finance', 'Photography'];
  const prices = ['All', 'Free', 'Paid', 'On Sale'];
  const ratings = ['All', '4.5 & up', '4.0 & up', '3.5 & up'];

  const allCourses = [
    { id: 1, title: "Complete React Developer in 2024: Zero to Mastery", category: "Programming", rating: 4.8, reviews: "2,450", students: "12k", duration: "42h 30m", price: "$49.99", instructor: "Sarah Johnson", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80" },
    { id: 2, title: "UI/UX Design Masterclass: Strategy, Tools & Practice", category: "Design", rating: 4.9, reviews: "1,820", students: "8k", duration: "28h 15m", price: "$39.99", instructor: "Michael Chen", img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?w=400&q=80" },
    { id: 3, title: "Python for Data Science and Machine Learning", category: "Programming", rating: 4.7, reviews: "3,100", students: "15k", duration: "56h 45m", price: "$54.99", instructor: "David Miller", img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80" },
    { id: 4, title: "Digital Marketing Strategy: From Zero to Hero", category: "Marketing", rating: 4.6, reviews: "950", students: "5k", duration: "18h 20m", price: "$29.99", instructor: "Emily White", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80" },
    { id: 5, title: "Modern JavaScript: Building Scalable Web Apps", category: "Programming", rating: 4.8, reviews: "1,200", students: "7k", duration: "32h 10m", price: "$44.99", instructor: "Alex Rivera", img: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&q=80" },
    { id: 6, title: "Photography Masterclass: A Complete Guide", category: "Photography", rating: 4.9, reviews: "640", students: "3k", duration: "24h 50m", price: "$34.99", instructor: "Laura Smith", img: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80" },
    { id: 7, title: "Advanced SQL for Business Intelligence", category: "Business", rating: 4.7, reviews: "890", students: "4k", duration: "15h 40m", price: "$39.99", instructor: "James Wilson", img: "https://images.unsplash.com/photo-1551288049-bbbda5366991?w=400&q=80" },
    { id: 8, title: "Financial Analysis & Investment Management", category: "Finance", rating: 4.8, reviews: "520", students: "2k", duration: "22h 15m", price: "$49.99", instructor: "Robert Brown", img: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=400&q=80" },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = activeCategory === 'All' || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Page Header - Professional Dark Gradient */}
      <section className="bg-gradient-to-b from-[#1A1F5E] to-[#161a50] pt-24 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6636]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <span className="text-[#FF6636] font-semibold tracking-[0.3em] text-xs uppercase mb-6 block animate-fade-in">CATALOGUE</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Advanced <span className="text-[#FF6636]">Skills</span> Hub
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto font-normal">
            Explore our curated selection of professional courses designed to help you master new skills and advance your career.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
          
          {/* Sidebar Filters - Pro Layout */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-slate-200/40 sticky top-28">
              <div className="space-y-10">
                {/* Search Bar in Sidebar or Main content? User said "main content" */}
                {/* Let's put it at the top of the course grid area for maximum visibility */}
                
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1F5E] mb-6 uppercase tracking-widest border-l-4 border-[#FF6636] pl-4">Category</h3>
                  <div className="space-y-1">
                    {categories.map(cat => (
                      <button 
                        key={cat} 
                        onClick={() => setActiveCategory(cat)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex justify-between items-center group ${activeCategory === cat ? 'bg-[#FF6636] text-white shadow-lg shadow-[#FF6636]/20' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {cat}
                        <span className={`text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded ${activeCategory === cat ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 text-slate-400'}`}>12</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1F5E] mb-6 uppercase tracking-widest border-l-4 border-[#FF6636] pl-4">Price</h3>
                  <div className="space-y-1">
                    {prices.map(price => (
                      <button 
                        key={price} 
                        onClick={() => setActivePrice(price)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activePrice === price ? 'bg-[#FF6636] text-white shadow-lg shadow-[#FF6636]/20' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {price}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1F5E] mb-6 uppercase tracking-widest border-l-4 border-[#FF6636] pl-4">Ratings</h3>
                  <div className="space-y-1">
                    {ratings.map(rating => (
                      <button 
                        key={rating} 
                        onClick={() => setActiveRating(rating)}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center gap-3 ${activeRating === rating ? 'bg-[#FF6636] text-white shadow-lg shadow-[#FF6636]/20' : 'text-slate-500 hover:bg-slate-50'}`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Grid Area */}
          <div className="lg:col-span-3">
            {/* New Search Bar - Main Content Area */}
            <div className="mb-12">
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#FF6636] transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input 
                  type="text" 
                  placeholder="Search for courses, skills, or instructors..." 
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

            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
              <p className="text-slate-400 text-sm font-semibold tracking-widest uppercase">
                <span className="text-[#1A1F5E]">{filteredCourses.length} courses</span> found in <span className="text-[#FF6636]">{activeCategory}</span>
              </p>
              <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-2xl border border-gray-100 shadow-sm">
                 <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Sort:</span>
                 <select className="bg-transparent text-sm font-semibold text-[#1A1F5E] outline-none cursor-pointer">
                    <option>Most Popular</option>
                    <option>Newest</option>
                    <option>Price: Low-High</option>
                 </select>
              </div>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map(course => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-2xl font-bold text-[#1A1F5E] mb-2">No matches found</h3>
                <p className="text-slate-400 font-normal">Try different keywords or filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;