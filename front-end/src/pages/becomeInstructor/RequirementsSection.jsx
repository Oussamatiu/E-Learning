import React from 'react';

const RequirementsSection = () => {
  const requirements = [
    'Strong subject knowledge',
    'Clear and engaging communication',
    'Ability to structure lessons logically',
    'Comfortable using video and learning tools',
    'Focused on helping students achieve results'
  ];

  return (
    <section className="py-16 px-4 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Instructor requirements made simple
            </h2>
            <p className="text-gray-600 mb-8">
              You don't need to be a professional speaker—just bring your expertise, passion, and a willingness to help learners succeed.
            </p>
          </div>

          <div className="space-y-4">
            {requirements.map((requirement, index) => (
              <div key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">{requirement}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RequirementsSection;
