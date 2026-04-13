import React from 'react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: '👥',
      title: 'Reach Global Audience',
      description: 'Teach students from around the world and make a real impact.'
    },
    {
      icon: '💰',
      title: 'Earn Competitive Income',
      description: 'Generate revenue while sharing your expertise with eager learners.'
    },
    {
      icon: '🎯',
      title: 'Build Your Brand',
      description: 'Establish authority and grow your professional reputation online.'
    },
    {
      icon: '📊',
      title: 'Detailed Analytics',
      description: 'Track student progress and course performance with comprehensive dashboards.'
    },
    {
      icon: '🛠️',
      title: 'Easy Course Creation',
      description: 'Intuitive tools to create, upload, and manage your courses effortlessly.'
    },
    {
      icon: '🤝',
      title: 'Support & Community',
      description: 'Join a thriving community of instructors with dedicated support.'
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="w-[90%] lg:w-[85%] mx-auto">
        <div className="text-center mb-16">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">WHY TEACH WITH US</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] mb-4">Benefits of Being an Instructor</h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-lg">Join thousands of successful instructors earning income while making an impact in education.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-2">
              <div className="text-5xl mb-4">{benefit.icon}</div>
              <h3 className="text-xl font-bold text-[#1A1F5E] mb-3">{benefit.title}</h3>
              <p className="text-slate-500 font-normal">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;