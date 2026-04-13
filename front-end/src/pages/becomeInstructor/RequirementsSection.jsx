import React from 'react';

const RequirementsSection = () => {
  const requirements = [
    'Expertise in your field or subject area',
    'Good communication skills',
    'Ability to create engaging course content',
    'Professional audio/video equipment',
    'Commitment to student success'
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="w-[90%] lg:w-[85%] mx-auto">
        <div className="text-center mb-12">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">WHAT WE'RE LOOKING FOR</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E]">Instructor Requirements</h2>
        </div>

        <div className="bg-gradient-to-br from-[#1A1F5E]/5 to-[#FF6636]/5 p-12 rounded-2xl border border-[#FF6636]/10">
          <ul className="space-y-4">
            {requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-6 h-6 rounded-full bg-[#FF6636] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-lg text-[#1A1F5E] font-semibold">{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;