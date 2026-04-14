import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CourseCard } from '../sections/home/Courses';
import { fetchCourses, fetchCategories } from '../services/Coursesapi';

const Courses = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePrice, setActivePrice] = useState('All');
  const [activeRating, setActiveRating] = useState('All');
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [loading, setLoading] = useState(true);

  const prices = ['All', 'Free', 'Paid'];
  const ratings = ['All', '4.5 & up', '4.0 & up', '3.5 & up'];

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
        if (activeCategory !== 'All') params.category = activeCategory;
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
  }, [searchQuery, activeCategory]);

  const filteredCourses = courses.filter(course => {
    const matchesPrice = activePrice === 'All' ||
      (activePrice === 'Free' && course.price == 0) ||
      (activePrice === 'Paid' && course.price > 0);
    const matchesRating = activeRating === 'All' ||
      (activeRating === '4.5 & up' && course.rating >= 4.5) ||
      (activeRating === '4.0 & up' && course.rating >= 4.0) ||
      (activeRating === '3.5 & up' && course.rating >= 3.5);
    return matchesPrice && matchesRating;
  });

  return (
    <div className="min-h-screen bg-white">
    

      {/* Page Header */}
      <section className="py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse all courses</h1>
          <p className="text-gray-600 text-sm">Find the perfect course to upgrade your skills</p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar Filters */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Category</h3>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={activeCategory === cat}
                          onChange={() => setActiveCategory(cat)}
                          className="w-4 h-4 text-[#592b98] focus:ring-[#592b98]"
                        />
                        <span className="text-sm text-gray-600">{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Price</h3>
                  <div className="space-y-2">
                    {prices.map(price => (
                      <label key={price} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="price"
                          checked={activePrice === price}
                          onChange={() => setActivePrice(price)}
                          className="w-4 h-4 text-[#592b98] focus:ring-[#592b98]"
                        />
                        <span className="text-sm text-gray-600">{price}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Rating</h3>
                  <div className="space-y-2">
                    {ratings.map(rating => (
                      <label key={rating} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={activeRating === rating}
                          onChange={() => setActiveRating(rating)}
                          className="w-4 h-4 text-[#592b98] focus:ring-[#592b98]"
                        />
                        <span className="text-sm text-gray-600">{rating}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Course Grid Area */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search courses"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-md py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Results Info */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredCourses.length}</span> courses found
                </p>
                <select className="text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#592b98]">
                  <option>Most Popular</option>
                  <option>Highest Rated</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>

              {/* Course Grid */}
              {loading ? (
                <div className="text-center py-20 text-gray-500">Loading courses...</div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map(course => (
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
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-500 text-sm">Try adjusting your search or filters to find what you're looking for.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;
