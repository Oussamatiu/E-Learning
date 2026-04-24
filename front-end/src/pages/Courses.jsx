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
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0,
    per_page: 9
  });

  const prices = ['All', 'Free', 'Paid'];
  const ratings = ['All', '4.5 & up', '4.0 & up', '3.5 & up'];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchParam = params.get('search');
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location.search]);

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

  const loadCourses = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (searchQuery) params.search = searchQuery;
      if (activeCategory !== 'All') params.category = activeCategory;
      if (activePrice !== 'All') params.price = activePrice;
      if (activeRating !== 'All') params.rating = activeRating;
      
      const response = await fetchCourses(params);
      
      setCourses(response.courses || []);
      if (response.meta) {
        setPagination(response.meta);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses(1);
  }, [searchQuery, activeCategory, activePrice, activeRating]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.last_page) {
      loadCourses(newPage);
      window.scrollTo(0, 0);
    }
  };

  const displayCourses = courses;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="bg-[#2d2f31] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Courses</h1>
          <p className="text-lg">Broad selection of courses</p>
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
                <div className="border-t border-gray-200 pt-4">
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
                <div className="border-t border-gray-200 pt-4">
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
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <p className="text-gray-900 font-bold whitespace-nowrap">
                    {pagination.total} results
                  </p>
                  
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-96">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#592b98] focus:border-[#592b98]"
                    />
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 font-medium">Sort by</span>
                  <select className="border border-gray-300 rounded px-4 py-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#592b98]">
                    <option>Most Popular</option>
                    <option>Highest Rated</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>

              {/* Course List */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-8 h-8 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : displayCourses.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        category={course.category?.name}
                        img={course.thumbnail}
                        instructor={course.instructor?.name}
                        price={parseFloat(course.price) === 0 ? 'Free' : `$${course.price}`}
                        rating={parseFloat(course.rating) || 0}
                        reviews={course.reviews_count || 0}
                        students={course.students_count || 0}
                        duration={course.duration || 'N/A'}
                        isBestseller={course.is_bestseller || false}
                      />
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination.last_page > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                      {[...Array(pagination.last_page)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => handlePageChange(i + 1)}
                          className={`w-10 h-10 rounded text-sm font-bold transition-colors ${pagination.current_page === i + 1 ? 'bg-gray-900 text-white' : 'text-gray-900 hover:bg-gray-200'}`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="py-20 text-center">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">No results</h3>
                  <p className="text-gray-600">We couldn't find any courses matching your criteria.</p>
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
