import React from 'react';

const FinalCTASection = () => {
  return (
    <section className="py-16 px-4 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#592b98] rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to share your expertise?
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-2xl mx-auto">
            Join thousands of instructors teaching on LearnTrack. Create your first course today.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="inline-flex items-center justify-center px-8 py-3 bg-white text-[#592b98] font-semibold rounded-md hover:bg-gray-100 transition-colors">
              Become an instructor
            </button>
            <button className="inline-flex items-center justify-center px-8 py-3 bg-transparent border border-white/30 text-white font-semibold rounded-md hover:bg-white/10 transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTASection;
