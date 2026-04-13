import React from 'react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 px-6">
      <div className="w-[90%] lg:w-[85%] mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] mb-6">Ready to Start Teaching?</h2>
        <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
          Join our platform today and start building your course. Our expert team will guide you through every step of the process.
        </p>
        <button
          onClick={() => navigate('/register')}
          className="bg-[#FF6636] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-[#e85a2c] transition-all shadow-xl shadow-[#FF6636]/20 active:scale-95"
        >
          Become an Instructor Now →
        </button>
      </div>
    </section>
  );
};

export default CTASection;