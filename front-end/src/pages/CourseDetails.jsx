import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById, fetchSections } from '../services/Coursesapi';

const CourseDetails = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch course details (includes curriculum/sections)
        const courseData = await fetchCourseById(id);
        const course = courseData.data || courseData;
        setCourse(course);

        // Use curriculum from course data if available
        if (course.curriculum && Array.isArray(course.curriculum)) {
          setSections(course.curriculum);
        } else {
          // Fallback: fetch sections separately
          const token = localStorage.getItem('token');
          const sectionsData = await fetchSections(id, token || '');
          setSections(Array.isArray(sectionsData) ? sectionsData : sectionsData.data || []);
        }
      } catch (err) {
        console.error('Error fetching course:', err.error);
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <Link to="/" className="text-[#592b98] hover:underline">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Close modal handler
  const closeModal = () => {
    setSelectedLesson(null);
  };

  // Format price
  const formatPrice = (price) => {
    if (!price) return 'Free';
    return typeof price === 'number' ? `$${price.toFixed(2)}` : price;
  };

  // Format duration
  const formatDuration = (minutes) => {
    if (!minutes) return '0h 0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get instructor info
  const instructor = course.instructor || { name: 'Unknown', bio: '', courses_count: 0, students_count: 0 };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`w-4 h-4 ${i < fullStars ? 'text-[#b4690e] fill-current' : 'text-gray-300 fill-current'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 py-3 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#592b98] rounded flex items-center justify-center text-white font-bold text-base">L</div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">LearnTrack</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Share</button>
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Gift this course</button>
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">Apply now</button>
          </div>
        </div>
      </header>

      {/* Course Banner */}
      <section className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <span className="text-white">{course.category}</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="text-green-400 text-sm font-semibold uppercase tracking-wider">Bestseller</span>
              <h1 className="text-2xl md:text-3xl font-bold text-white mt-2 mb-4">
                {course.title}
              </h1>
              <p className="text-gray-300 text-sm mb-4 max-w-2xl">
                {course.description ? course.description.substring(0, 150) + '...' : 'No description available for this course.'}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  {renderStars(course.rating)}
                  <span className="text-yellow-500 font-bold">{course.rating}</span>
                  <span className="text-gray-400">({course.reviews})</span>
                </div>
                <div className="text-gray-300">{course.students} students</div>
                <div className="text-gray-300">{course.duration}</div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Created by</p>
                  <Link to="#" className="text-white text-sm hover:underline">{course.instructor.name}</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: Course Content */}
          <div className="lg:col-span-2 space-y-8">

            {/* What you'll learn */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">What you'll learn</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {course.learnings && course.learnings.length > 0 ? course.learnings.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 fill-current flex-shrink-0 mt-0.5" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {item}
                  </div>
                )) : (
                  <p className="text-gray-500 text-sm col-span-2">No learning outcomes specified</p>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-8 border-b border-gray-200 mb-6">
                {['overview', 'curriculum', 'instructor'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-semibold uppercase tracking-wide transition-colors relative ${
                      activeTab === tab ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>}
                  </button>
                ))}
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                  <p>{course.description || 'No description available for this course.'}</p>
                </div>
              )}

              {activeTab === 'curriculum' && (
                <div className="space-y-2">
                  {sections.length > 0 ? sections.map((section, idx) => (
                    <div key={section.id || idx} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 p-4 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        <span className="text-xs text-gray-500">{section.lessons?.length || 0} lessons</span>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {section.lessons?.map((lesson, lIdx) => (
                          <div key={lesson.id || lIdx} className="p-4 flex justify-between items-center text-sm hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              {lesson.free ? (
                                <svg className="w-4 h-4 text-green-500 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                              )}
                              <span className={lesson.free ? 'text-[#592b98] font-medium' : 'text-gray-700'}>{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-gray-500">{lesson.duration || '5m'}</span>
                              {lesson.free && lesson.video_url && (
                                <button
                                  onClick={() => setSelectedLesson(lesson)}
                                  className="px-3 py-1 bg-[#592b98] text-white text-xs rounded hover:bg-[#3e1f6b] transition-colors"
                                >
                                  Watch Preview
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-sm text-center py-8">No curriculum available</p>
                  )}
                </div>
              )}

              {activeTab === 'instructor' && (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                      <img src={course.instructor.avatar} alt={course.instructor.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{course.instructor.name}</h3>
                      <p className="text-gray-500 text-sm mb-3">{course.instructor.role}</p>
                      <div className="flex gap-6 mb-4">
                        <div>
                          <span className="block font-bold text-gray-900">{course.instructor.courses}</span>
                          <span className="text-gray-500 text-xs">Courses</span>
                        </div>
                        <div>
                          <span className="block font-bold text-gray-900">{course.instructor.students}</span>
                          <span className="text-gray-500 text-xs">Students</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">{course.instructor.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Purchase Card */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg overflow-hidden sticky top-20">
              <div className="aspect-video relative">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
                <button className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-gray-900">{course.price}</span>
                  <span className="text-gray-400 line-through text-sm">{course.oldPrice}</span>
                  <span className="text-green-600 text-sm font-semibold">45% OFF</span>
                </div>

                <div className="space-y-3 mb-4">
                  <button className="w-full bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors">
                    Add to cart
                  </button>
                  <button className="w-full bg-white text-gray-900 border border-gray-300 font-semibold py-3 rounded-md hover:bg-gray-50 transition-colors">
                    Buy now
                  </button>
                </div>

                <p className="text-xs text-gray-500 text-center mb-4">30-Day Money-Back Guarantee</p>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {course.duration} on-demand video
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    12 downloadable resources
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Certificate of completion
                  </div>
                  <div className="flex items-center gap-3">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Full lifetime access
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div
            className="bg-white rounded-lg max-w-xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{selectedLesson.title}</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                aria-label="Close video preview"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Video */}
            <div className="aspect-video bg-black">
              {selectedLesson.video_url ? (
                <video src={selectedLesson.video_url} controls className="w-full h-full" autoPlay playsInline />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Description */}
            {selectedLesson.content && (
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{selectedLesson.content}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;
