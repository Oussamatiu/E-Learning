import React from 'react';

const TestimonialCard = ({ name, role, content, avatar }) => (
  <div className="bg-gray-50 rounded-lg p-6">
    <div className="flex gap-1 mb-4 text-[#b4690e]">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <p className="text-gray-700 text-sm leading-relaxed mb-6">"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-sm">{name}</h4>
        <p className="text-gray-500 text-xs">{role}</p>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Kathryn Murphy",
      role: "UX Designer",
      content: "The best learning experience I've had. The built-in time tracker is a game-changer.",
      avatar: "https://i.pravatar.cc/150?u=kathryn"
    },
    {
      name: "Guy Hawkins",
      role: "Web Developer",
      content: "The courses are top-notch and the instructors are very responsive.",
      avatar: "https://i.pravatar.cc/150?u=guy"
    },
    {
      name: "Cody Fisher",
      role: "Digital Marketer",
      content: "I love the community and the progress analytics. It's so satisfying to see my skills grow.",
      avatar: "https://i.pravatar.cc/150?u=cody"
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Learners are speaking</h2>
          <p className="text-gray-600">See what our students have to say</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testi, idx) => (
            <TestimonialCard key={idx} {...testi} />
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">4.9/5</p>
            <p className="text-gray-500 text-sm">Average rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">200K+</p>
            <p className="text-gray-500 text-sm">Happy students</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">98%</p>
            <p className="text-gray-500 text-sm">Would recommend</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 mb-1">450+</p>
            <p className="text-gray-500 text-sm">Expert mentors</p>
          </div>
        </div>
      </div>
    </section>
  );
};