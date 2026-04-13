import React from 'react';

const HowItWorksSection = () => {
  return (
    <section className="py-32 px-6 bg-gradient-to-br from-white via-slate-50/30 to-white relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23FF6636' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="w-[90%] lg:w-[85%] mx-auto relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6636]/10 to-blue-500/10 px-6 py-3 rounded-full border border-[#FF6636]/20 mb-6">
            <span className="w-3 h-3 bg-[#FF6636] rounded-full animate-pulse"></span>
            <span className="text-[#FF6636] font-bold tracking-[0.2em] text-sm uppercase">GETTING STARTED</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-[#1A1F5E] mb-6 leading-tight">
            How It{' '}
            <span className="relative">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6636] to-blue-600">Works</span>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-[#FF6636] to-blue-600 rounded-full"></div>
            </span>
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto text-xl leading-relaxed font-light">
            Start teaching in just a few simple steps. Our streamlined process makes it easy to launch your courses and begin earning.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            {
              step: 1,
              title: 'Create Account',
              description: 'Sign up and complete your instructor profile with your experience and expertise details.',
              color: 'from-blue-500 to-blue-600',
              bgColor: 'bg-blue-50',
              icon: '👤'
            },
            {
              step: 2,
              title: 'Design Course',
              description: 'Use our intuitive course builder to structure your content and add learning modules.',
              color: 'from-purple-500 to-purple-600',
              bgColor: 'bg-purple-50',
              icon: '🎨'
            },
            {
              step: 3,
              title: 'Upload Content',
              description: 'Add videos, assignments, quizzes, and resources to engage your students effectively.',
              color: 'from-green-500 to-green-600',
              bgColor: 'bg-green-50',
              icon: '📤'
            },
            {
              step: 4,
              title: 'Publish & Earn',
              description: 'Publish your course and start earning as students enroll and complete your content.',
              color: 'from-orange-500 to-red-500',
              bgColor: 'bg-orange-50',
              icon: '🚀'
            }
          ].map((item, index) => (
            <div key={index} className="group relative">
              {/* Connection line */}
              {index < 3 && (
                <div className="hidden lg:block absolute top-12 -right-4 w-8 h-1 bg-gradient-to-r from-gray-200 to-transparent z-0">
                  <div className="w-full h-full bg-gradient-to-r from-[#FF6636] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              )}

              <div className="relative bg-white p-8 rounded-3xl border border-gray-100 hover:border-transparent hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 hover:-translate-y-4 group">
                {/* Step number */}
                <div className={`relative w-16 h-16 ${item.bgColor} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}></span>
                  <span className="text-2xl font-black text-gray-700 relative z-10">{item.step}</span>
                </div>

                {/* Icon */}
                <div className="text-center mb-4">
                  <span className="text-4xl">{item.icon}</span>
                </div>

                <h3 className="text-xl font-bold text-[#1A1F5E] mb-4 text-center group-hover:text-[#FF6636] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-600 font-medium text-center leading-relaxed">
                  {item.description}
                </p>

                {/* Hover effect overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Quick Setup',
              description: 'Get your course live in under 24 hours',
              color: 'text-yellow-500'
            },
            {
              icon: '🎛️',
              title: 'Full Control',
              description: 'Manage pricing, content, and student interactions',
              color: 'text-blue-500'
            },
            {
              icon: '🛟',
              title: 'Expert Support',
              description: '24/7 support from our dedicated team',
              color: 'text-green-500'
            }
          ].map((feature, index) => (
            <div key={index} className="group bg-white p-8 rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-[#FF6636]/10 to-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <span className={`text-2xl ${feature.color}`}>{feature.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-[#1A1F5E] mb-2 group-hover:text-[#FF6636] transition-colors duration-300">
                    {feature.title}
                  </h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button className="group relative bg-gradient-to-r from-[#FF6636] to-[#ff7b4a] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-[#FF6636]/30 transition-all duration-300 transform hover:scale-105">
            <span className="relative z-10 flex items-center gap-3">
              Start Your Journey Today
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#ff7b4a] to-[#FF6636] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;