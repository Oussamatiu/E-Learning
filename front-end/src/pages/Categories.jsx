import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ title, count, icon, color, courses }) => (
  <div className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white">
    <div className={`w-12 h-12 ${color} rounded flex items-center justify-center mb-4 text-white`}>
      {icon}
    </div>
    <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:underline">{title}</h2>
    <p className="text-gray-500 text-sm mb-4">{count} courses</p>
    <div className="flex flex-wrap gap-2">
      {courses.slice(0, 3).map((tag, i) => (
        <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

const Categories = () => {
  const categories = [
    {
      title: 'Programming',
      count: '1,240',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      color: 'bg-indigo-600',
      courses: ['React & Next.js', 'Python for AI', 'Go Microservices', 'Rust Systems', 'DevOps']
    },
    {
      title: 'Design',
      count: '850',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      color: 'bg-fuchsia-600',
      courses: ['Product Design', 'Figma Mastery', 'Brand Identity', '3D Motion', 'Design Systems']
    },
    {
      title: 'Business',
      count: '540',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
      color: 'bg-emerald-600',
      courses: ['Leadership', 'Strategic Growth', 'Project Management', 'MBA Core', 'Operations']
    },
    {
      title: 'Marketing',
      count: '420',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-1.46-6.024a1.76 1.76 0 00-1.717-1.347H3.5a1.76 1.76 0 010-3.522h.944a1.76 1.76 0 001.717-1.347l1.46-6.024a1.76 1.76 0 013.417.592V5.882z" /></svg>,
      color: 'bg-orange-600',
      courses: ['Digital Marketing', 'SEO Mastery', 'Content Strategy', 'Social Media', 'Analytics']
    },
    {
      title: 'Data Science',
      count: '680',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h2a2 2 0 002-2zm6-11l-3 3m0 0l-3-3m3 3V3" /></svg>,
      color: 'bg-blue-600',
      courses: ['Machine Learning', 'Python for Data', 'SQL Mastery', 'Tableau', 'Statistics']
    },
    {
      title: 'Photography',
      count: '320',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>,
      color: 'bg-purple-600',
      courses: ['Photography Basics', 'Lightroom', 'Portrait Photography', 'Video Editing', 'Studio Lighting']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Explore all categories</h1>
            <p className="text-gray-600 text-sm">Find the perfect course for your learning journey</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Popular topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['Cloud Architecture', 'Machine Learning', 'UX Design', 'Python', 'Leadership', 'Digital Marketing', 'Web Development', 'Data Analysis'].map(skill => (
              <Link
                key={skill}
                to={`/courses?search=${skill.toLowerCase()}`}
                className="px-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {skill}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
