import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCourses, fetchCategories } from '../../services/Coursesapi';

export const CourseCard = ({ id, title, category, img, instructor, price, rating, reviews, students, duration, isBestseller }) => {
  const navigate = useNavigate();

  // Generate star display
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <svg key={i} className="w-4 h-4 text-[#b4690e] fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
          } else if (i === fullStars && hasHalfStar) {
            return <svg key={i} className="w-4 h-4 text-[#b4690e]" fill="currentColor" viewBox="0 0 20 20"><defs><linearGradient id={`half-${i}`}><stop offset="50%" stopColor="#b4690e"/><stop offset="50%" stopColor="#e5e7eb"/></linearGradient></defs><path fill={`url(#half-${i})`} d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
          }
          return <svg key={i} className="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;
        })}
      </div>
    );
  };

  return (
    <div
      onClick={() => navigate(`/course/${id}`)}
      className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <img src={"http://127.0.0.1:8000/storage/" + img} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
        {isBestseller && (
          <span className="absolute top-2 left-2 bg-[#b4690e] text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
            Bestseller
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 leading-snug hover:underline">
          {title}
        </h3>

        {/* Instructor */}
        <p className="text-xs text-gray-500 mb-2">{instructor}</p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          {renderStars(rating)}
          <span className="text-xs font-bold text-[#b4690e]">{rating}</span>
          <span className="text-xs text-gray-400">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-base font-bold text-gray-900">{price}</span>
        </div>
      </div>
    </div>
  );
};

export const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategories(['All', ...cats.map(cat => cat.name)]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      try {
        const params = {};
        if (searchQuery) params.search = searchQuery;
        if (activeFilter !== 'All') params.category = activeFilter;
        const data = await fetchCourses(params);
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [searchQuery, activeFilter]);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">A broad selection of courses</h2>
          <p className="text-gray-600">Choose from over 100,000 online video courses with new additions published every month</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
           {categories.map(filter => (
             <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                activeFilter === filter
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:border-gray-900'
              }`}
             >
               {filter}
             </button>
           ))}
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading courses...</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                category={course.category?.name}
                img={course.thumbnail}
                instructor={course.instructor?.name}
                price={`$${course.price}`}
                rating={course.rating || 0}
                reviews={course.reviews_count || 0}
                students={course.students_count || 0}
                duration={course.duration || 'N/A'}
                isBestseller={course.is_bestseller || false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </section>
  );
};
;