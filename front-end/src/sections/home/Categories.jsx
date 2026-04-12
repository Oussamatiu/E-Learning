import React from 'react';

const CategoryCard = ({ title, count, img }) => (
  <div className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3]">
    <img 
      src={img} 
      alt={title} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
      <h3 className="text-white font-semibold text-xl mb-1">{title}</h3>
      <p className="text-white/70 text-sm">{count} Courses</p>
    </div>
  </div>
);

export const Categories = () => {
  const categories = [
    { title: 'Programming', count: '1.2k+', img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=80' },
    { title: 'Design', count: '800+', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80' },
    { title: 'Business', count: '600+', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80' },
    { title: 'Marketing', count: '450+', img: 'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d8?w=400&q=80' },
    { title: 'Photography', count: '300+', img: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&q=80' },
    { title: 'Web', count: '1k+', img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&q=80' },
    { title: 'Game Dev', count: '200+', img: 'https://images.unsplash.com/photo-1550745679-33fba1864e8c?w=400&q=80' },
    { title: 'Music', count: '150+', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80' },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-[1440px] w-[90%] lg:w-[80%] mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[#FF6636] font-semibold tracking-[0.2em] text-xs uppercase mb-4 block underline underline-offset-8">CATEGORIES</span>
            <h2 className="text-4xl font-bold text-[#1A1F5E]">Explore Top Categories</h2>
          </div>
          <button className="text-[#FF6636] font-semibold hover:underline flex items-center gap-2 group">
            View All Categories 
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
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