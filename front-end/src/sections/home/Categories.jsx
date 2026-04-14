import React from 'react';

const CategoryCard = ({ title, count, img }) => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden rounded-md mb-3 aspect-[4/3]">
      <img
        src={img}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    <h3 className="font-semibold text-gray-900 text-sm group-hover:underline">{title}</h3>
    <p className="text-gray-500 text-xs">{count} courses</p>
  </div>
);

export const Categories = () => {
  const categories = [
    { title: 'Programming', count: '1,200+', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
    { title: 'Design', count: '800+', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80' },
    { title: 'Business', count: '600+', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
    { title: 'Marketing', count: '450+', img: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d8?w=400&q=80' },
    { title: 'Photography', count: '300+', img: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80' },
    { title: 'Web Development', count: '1,000+', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80' },
    { title: 'Game Development', count: '200+', img: 'https://images.unsplash.com/photo-1550745679-33fba1864e8c?w=400&q=80' },
    { title: 'Music', count: '150+', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' },
  ];

  return (
    <section className="py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Top categories</h2>
          <button className="text-[#592b98] font-medium text-sm hover:underline flex items-center gap-1">
            Explore all
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} {...cat} />
          ))}
        </div>
      </div>
    </section>
  );
};