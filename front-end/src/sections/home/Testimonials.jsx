import React from 'react';

const TestimonialCard = ({ name, role, content, rating, avatar }) => (
  <div className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group flex flex-col h-full">
    <div className="flex gap-1 mb-6 text-[#FF6636]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-600 text-lg italic leading-relaxed mb-10 flex-1">"{content}"</p>
    <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-semibold text-[#1A1F5E] text-lg">{name}</h4>
        <p className="text-gray-400 text-sm font-normal">{role}</p>
      </div>
    </div>
  </div>
);

const StatItem = ({ label, value, icon }) => (
  <div className="text-center group">
    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 mx-auto group-hover:bg-[#FF6636] transition-colors duration-500">
       <div className="text-[#FF6636] group-hover:text-white transition-colors duration-500">
          {icon}
       </div>
    </div>
    <h3 className="text-3xl font-bold text-[#1A1F5E] mb-1">{value}</h3>
    <p className="text-gray-400 text-sm font-semibold tracking-wide uppercase">{label}</p>
  </div>
);

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Kathryn Murphy",
      role: "UX Designer",
      content: "The best learning experience I've had. The built-in time tracker is a game-changer for staying on top of my learning goals.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=kathryn"
    },
    {
      name: "Guy Hawkins",
      role: "Web Developer",
      content: "The courses are top-notch and the instructors are very responsive. I've learned more here than in my college courses.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=guy"
    },
    {
      name: "Cody Fisher",
      role: "Digital Marketer",
      content: "I love the community and the progress analytics. It's so satisfying to see my skills grow with clear data.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=cody"
    }
  ];

  return (
    <section className="py-32 bg-white">
      <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto">
        <div className="text-center mb-20">
          <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">TESTIMONIALS</span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1A1F5E] leading-tight">
            Loved by learners worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-32">
          {testimonials.map((testi, idx) => (
            <TestimonialCard key={idx} {...testi} />
          ))}
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-20 border-t border-gray-100">
          <StatItem 
            label="Average Rating" 
            value="4.9/5" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.54 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.784.57-1.838-.197-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
          />
          <StatItem 
            label="Happy Students" 
            value="200K+" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatItem 
            label="Recommendations" 
            value="98%" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>}
          />
          <StatItem 
            label="Expert Mentors" 
            value="450+" 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
        </div>
      </div>
    </section>
  );
};