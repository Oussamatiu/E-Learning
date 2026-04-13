import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-[#1A1F5E] to-[#161a50] pt-32 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF6636]/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="w-[90%] lg:w-[85%] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-[#FF6636] font-semibold tracking-[0.3em] text-xs uppercase mb-6 block">SHARE YOUR KNOWLEDGE</span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Become an <span className="text-[#FF6636]">Instructor</span>
            </h1>
            <p className="text-white/70 text-lg mb-8 font-normal leading-relaxed">
              Share your expertise with students worldwide. Create engaging courses, build your personal brand, and earn competitive income while making a real difference.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/register')}
                className="bg-[#FF6636] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#e85a2c] transition-all shadow-xl shadow-[#FF6636]/20 active:scale-95"
              >
                Get Started →
              </button>
              <button className="bg-white/10 text-white border border-white/20 px-10 py-4 rounded-xl font-bold hover:bg-white/20 transition-all backdrop-blur-sm">
                Learn More
              </button>
            </div>

            <div className="flex gap-8 mt-12">
              <div>
                <p className="text-3xl font-bold text-[#FF6636] mb-1">50K+</p>
                <p className="text-white/60 text-sm">Active Students</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#FF6636] mb-1">1000+</p>
                <p className="text-white/60 text-sm">Expert Instructors</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#FF6636] mb-1">2500+</p>
                <p className="text-white/60 text-sm">Quality Courses</p>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF6636]/20 to-blue-500/20 rounded-3xl blur-2xl"></div>
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80"
                alt="Instructor"
                className="relative rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;