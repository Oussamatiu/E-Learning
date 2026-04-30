import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getCourse } from '../services/coursesService';
import { getSections } from '../services/sectionsService';
import { addToCart, isInCart } from '../utils/cartUtils';
import api, { apiService } from '../services/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [course, setCourse] = useState(null);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [cartStatus, setCartStatus] = useState('');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsAdmin(user.role_id === 3 || user.role?.title === 'admin');
      } catch {}
    }
  }, []);

  const [comments, setComments] = useState([]);
  const [commentsMeta, setCommentsMeta] = useState({ current_page: 1, last_page: 1 });
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch course details (includes curriculum/sections)
        const courseData = await getCourse(id);
        const course = courseData.data || courseData;
        setCourse(course);
        // Backend is the ONLY authority on enrollment status
        setIsEnrolled(course.is_enrolled === true);

        // Use curriculum from course data if available
        if (course.curriculum && Array.isArray(course.curriculum)) {
          setSections(course.curriculum);
        } else {
          // Fallback: fetch sections separately
          const sectionsData = await getSections(id);
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

  // Check if course is in cart on component mount
  useEffect(() => {
    if (course) {
      setCartStatus(isInCart(course.id) ? 'in-cart' : '');
    }
  }, [course]);

  // Fetch comments when reviews tab is active
  useEffect(() => {
    if (activeTab !== 'reviews' || !id) return;
    const fetchComments = async () => {
      setCommentsLoading(true);
      try {
        const res = await apiService.comments.getAll(id, commentsMeta.current_page);
        setComments(res.data?.data || []);
        setCommentsMeta(res.data?.meta || { current_page: 1, last_page: 1 });
      } catch (e) {
        console.error('Failed to load comments', e);
      } finally {
        setCommentsLoading(false);
      }
    };
    fetchComments();
  }, [activeTab, id, commentsMeta.current_page]);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    setCommentError('');
    try {
      const res = await apiService.comments.create(id, { content: newComment.trim() });
      setComments(prev => [res.data?.comment, ...prev].filter(Boolean));
      setNewComment('');
    } catch (e) {
      setCommentError(e.response?.data?.message || 'Failed to post comment');
    } finally {
      setPostingComment(false);
    }
  };

  const handleRate = async (rating) => {
    if (!isEnrolled || ratingLoading) return;
    setRatingLoading(true);
    setRatingSuccess('');
    try {
      const res = await apiService.ratings.rate(id, rating);
      setUserRating(rating);
      setRatingSuccess(res.data?.message || 'Rating saved!');
      // Optimistically update course rating
      setCourse(prev => prev ? { ...prev, rating: res.data?.average ?? prev.rating, reviews: res.data?.total_count ?? prev.reviews } : prev);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save rating');
    } finally {
      setRatingLoading(false);
    }
  };

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

  // Add to cart handler
  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = addToCart(course);
      if (success) {
        setCartStatus('in-cart');
        // Show success message briefly
        setTimeout(() => setCartStatus(''), 2000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Buy now handler
  const handleBuyNow = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsBuyingNow(true);
    try {
      const response = await api.post('/orders/buy-now', {
        course_id: course.id
      });

      if (response.data.success) {
        navigate(`/checkout/${response.data.order.id}`);
      }
    } catch (error) {
      console.error('Error buying course:', error);
      if (error.response?.status === 422) {
        alert('You are already enrolled in this course!');
      } else {
        alert('Error processing your order. Please try again.');
      }
    } finally {
      setIsBuyingNow(false);
    }
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
   

      {/* Course Banner */}
      <section className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/courses" className="hover:text-white">Courses</Link>
            <span>/</span>
            <span className="text-white">{course.category?.name || course.category}</span>
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
                {['overview', 'curriculum', 'instructor', 'reviews'].map(tab => (
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
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{course.instructor.name}</h3>
                      {course.instructor.headline && (
                        <p className="text-sm text-[#592b98] font-medium mb-1">{course.instructor.headline}</p>
                      )}
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
                      {course.instructor.expertise && (
                        <p className="text-xs text-gray-500 mb-3">
                          <span className="font-semibold text-gray-700">Expertise:</span> {course.instructor.expertise}
                        </p>
                      )}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4">{course.instructor.bio}</p>
                      <div className="flex flex-wrap gap-3">
                        {course.instructor.website && (
                          <a
                            href={course.instructor.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#592b98] hover:underline"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            Website
                          </a>
                        )}
                        {course.instructor.linkedin_url && (
                          <a
                            href={course.instructor.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-[#592b98] hover:underline"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  {/* Rating summary */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-gray-900">{(Number(course.rating) || 0).toFixed(1)}</div>
                        <div className="flex justify-center mt-1">{renderStars(course.rating || 0)}</div>
                        <div className="text-xs text-gray-500 mt-1">{course.reviews || 0} reviews</div>
                      </div>
                      <div className="flex-1">
                        {isEnrolled && (
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-700 mb-2">Rate this course</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => handleRate(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  disabled={ratingLoading}
                                  className="p-0.5 transition-transform hover:scale-110 disabled:opacity-50"
                                >
                                  <svg
                                    className={`w-8 h-8 ${
                                      star <= (hoverRating || userRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                </button>
                              ))}
                            </div>
                            {ratingSuccess && <p className="text-xs text-green-600 mt-1">{ratingSuccess}</p>}
                          </div>
                        )}
                        {!isEnrolled && (
                          <p className="text-sm text-gray-500">Enroll in this course to leave a rating and review.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comment form */}
                  {isEnrolled && (
                    <div className="border border-gray-200 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Write a review</h3>
                      {commentError && <p className="text-xs text-red-600 mb-2">{commentError}</p>}
                      <textarea
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your experience with this course..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm resize-none"
                        maxLength={2000}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <span className="text-xs text-gray-400">{newComment.length}/2000</span>
                        <button
                          onClick={handlePostComment}
                          disabled={postingComment || !newComment.trim()}
                          className="bg-[#592b98] text-white text-sm font-semibold px-5 py-2 rounded-md hover:bg-[#3e1f6b] transition-colors disabled:opacity-50"
                        >
                          {postingComment ? 'Posting...' : 'Post Review'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Comments list */}
                  <div className="space-y-4">
                    {commentsLoading && comments.length === 0 && (
                      <div className="flex justify-center py-8">
                        <div className="w-6 h-6 border-2 border-[#592b98] border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}

                    {!commentsLoading && comments.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">No reviews yet. Be the first to review!</div>
                    )}

                    {comments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#592b98] to-[#9b6cd9] flex items-center justify-center text-white text-xs font-bold">
                            {comment.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">{comment.user?.name || 'Anonymous'}</p>
                            {comment.user_rating > 0 && (
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <svg
                                    key={s}
                                    className={`w-3.5 h-3.5 ${s <= comment.user_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-gray-400 mt-0.5">
                              {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{comment.content}</p>
                      </div>
                    ))}

                    {/* Pagination */}
                    {commentsMeta.last_page > 1 && (
                      <div className="flex justify-center gap-2 pt-4">
                        {Array.from({ length: commentsMeta.last_page }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCommentsMeta(prev => ({ ...prev, current_page: page }))}
                            className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                              page === commentsMeta.current_page
                                ? 'bg-[#592b98] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                    )}
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
                  <span className="text-2xl font-bold text-gray-900">{course.price}$
                  </span>
                  <span className="text-gray-400 line-through text-sm">{course.oldPrice}</span>
                  <span className="text-green-600 text-sm font-semibold">45% OFF</span>
                </div>

                {/* Purchase / Access Card */}
                <div className="space-y-3 mb-4">
                  {isAdmin && (
                    <Link
                      to={`/student/course/${course.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Review Course Content
                    </Link>
                  )}
                  {isEnrolled ? (
                    /* ── ENROLLED: show Open Course only ── */
                    <Link
                      to={`/student/course/${course.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 rounded-md hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Open Course
                    </Link>
                  ) : (
                    /* ── NOT ENROLLED: show Buy / Cart ── */
                    <>
                      <button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart || cartStatus === 'in-cart'}
                        className={`w-full font-semibold py-3 rounded-md transition-colors ${
                          cartStatus === 'in-cart'
                            ? 'bg-green-600 text-white'
                            : isAddingToCart
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-[#592b98] text-white hover:bg-[#3e1f6b]'
                        }`}
                      >
                        {isAddingToCart ? 'Adding...' : cartStatus === 'in-cart' ? '✓ Already in Cart' : 'Add to cart'}
                      </button>
                      <button
                        onClick={handleBuyNow}
                        disabled={isBuyingNow}
                        className={`w-full bg-white text-gray-900 border border-gray-300 font-semibold py-3 rounded-md transition-colors ${
                          isBuyingNow ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'
                        }`}
                      >
                        {isBuyingNow ? 'Processing...' : 'Buy now'}
                      </button>
                    </>
                  )}
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
