import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourse } from '../../services/coursesService';
import { getSections } from '../../services/sectionsService';
import api from '../../services/api';

const CourseLearning = () => {
  const { id } = useParams();
  const [course, setCourse]           = useState(null);
  const [sections, setSections]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedLesson, setSelectedLesson]     = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Progress state
  const [completedLessons, setCompletedLessons] = useState(new Set());
  const [progress, setProgress]       = useState(0);
  const [totalLessons, setTotalLessons] = useState(0);
  const [togglingLesson, setTogglingLesson] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false); // enrollment gate

  // Load course + sections
  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      setError(null);
      try {
        const courseData = await getCourse(id);
        const course = courseData.data || courseData;

        // Backend decides access — frontend just reacts
        if (course.is_enrolled !== true) {
          setAccessDenied(true);
          setLoading(false);
          return;
        }

        setCourse(course);

        if (course.curriculum && Array.isArray(course.curriculum)) {
          setSections(course.curriculum);
          const expanded = {};
          course.curriculum.forEach((s, i) => { expanded[i] = true; });
          setExpandedSections(expanded);
          if (course.curriculum[0]?.lessons?.[0]) {
            setSelectedLesson(course.curriculum[0].lessons[0]);
          }
          const count = course.curriculum.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
          setTotalLessons(count);
        } else {
          const sectionsData = await getSections(id);
          const sects = Array.isArray(sectionsData) ? sectionsData : sectionsData.data || [];
          setSections(sects);
          const expanded = {};
          sects.forEach((s, i) => { expanded[i] = true; });
          setExpandedSections(expanded);
          if (sects[0]?.lessons?.[0]) setSelectedLesson(sects[0].lessons[0]);
          const count = sects.reduce((sum, s) => sum + (s.lessons?.length || 0), 0);
          setTotalLessons(count);
        }
      } catch (err) {
        console.error('Error loading course:', err);
        setError('Failed to load course content');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  // Load progress after course loads
  useEffect(() => {
    if (!id) return;
    const loadProgress = async () => {
      try {
        const res = await api.get(`api/courses/${id}/progress`);
        const data = res.data;
        setCompletedLessons(new Set(data.completed_lessons.map(Number)));
        setProgress(data.progress);
        if (data.total_lessons) setTotalLessons(data.total_lessons);
      } catch (e) {
        // Not enrolled or error — silently ignore, progress stays at 0
      }
    };
    loadProgress();
  }, [id]);

  const toggleSection = (idx) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Mark lesson complete / incomplete
  const handleToggleComplete = useCallback(async (lessonId) => {
    if (togglingLesson) return;
    setTogglingLesson(lessonId);
    try {
      const res = await api.post(`api/courses/${id}/lessons/${lessonId}/progress`);
      const data = res.data;
      setCompletedLessons(prev => {
        const next = new Set(prev);
        if (data.completed) next.add(lessonId);
        else next.delete(lessonId);
        return next;
      });
      setProgress(data.progress);
    } catch (e) {
      console.error('Failed to update progress:', e);
    } finally {
      setTogglingLesson(null);
    }
  }, [id, togglingLesson]);

  // Navigate to next lesson
  const getAdjacentLesson = useCallback((direction) => {
    const allLessons = sections.flatMap(s => s.lessons || []);
    const idx = allLessons.findIndex(l => l.id === selectedLesson?.id);
    if (idx === -1) return null;
    return allLessons[idx + direction] || null;
  }, [sections, selectedLesson]);

  const completedCount = completedLessons.size;
  const progressColor = progress >= 100 ? '#10b981' : '#592b98'; // Emerald green if 100%

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#592b98]/20 border-t-[#592b98] rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">Preparing your learning workspace...</p>
      </div>
    );
  }

  // ── ACCESS DENIED: not enrolled ─────────────────────────────────────────────
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#f8f5ff] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Course Locked</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            You don't have access to this course yet. Purchase it to unlock all lessons and start your learning journey today.
          </p>
          <Link
            to={`/courses/${id}`}
            className="inline-flex items-center justify-center w-full gap-2 bg-[#592b98] text-white font-bold px-6 py-3.5 rounded-xl hover:bg-[#4a2480] transition-all shadow-sm hover:shadow"
          >
            View Course Details
          </Link>
          <div className="mt-6">
            <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-6 font-bold">{error || 'Course not found'}</p>
          <Link to="/student/dashboard" className="text-[#592b98] hover:underline font-semibold text-sm">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }


  const prevLesson = getAdjacentLesson(-1);
  const nextLesson = getAdjacentLesson(1);
  const isCurrentComplete = selectedLesson ? completedLessons.has(selectedLesson.id) : false;

  return (
    <div className="h-screen flex flex-col bg-gray-900 font-sans overflow-hidden">

      {/* ── Top Navigation Bar ── */}
      <header className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
        
        {/* Left: Back & Title */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <Link 
            to="/student/courses" 
            className="text-gray-400 hover:text-white transition-colors flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-800"
            title="Back to Dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          
          <div className="min-w-0 border-l border-gray-700 pl-4">
            <h1 className="text-sm font-bold text-white truncate leading-tight tracking-wide">{course.title}</h1>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-widest mt-0.5">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
        </div>

        {/* Right: Progress & Sidebar Toggle */}
        <div className="flex items-center gap-6 flex-shrink-0">
          
          {/* Progress Section */}
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: progressColor }}>
                {progress >= 100 ? 'Course Completed 🎉' : 'Your Progress'}
              </span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%`, backgroundColor: progressColor }}
                  />
                </div>
                <span className="text-xs font-bold text-white tabular-nums w-8 text-right">
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-700 hidden sm:block"></div>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all border ${
              sidebarOpen 
                ? 'bg-gray-800 text-white border-gray-700' 
                : 'bg-transparent text-gray-400 border-transparent hover:text-white hover:bg-gray-800'
            }`}
          >
            {sidebarOpen ? 'Hide Content' : 'Course Content'}
            <svg className={`w-4 h-4 transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </header>

      {/* ── Main Workspace ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Left: Video & Content Area ── */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-gray-50 scroll-smooth">
          {selectedLesson ? (
            <div className="max-w-6xl mx-auto w-full flex flex-col min-h-full">
              
              {/* Video Player Wrapper */}
              <div className="w-full bg-black shadow-lg relative aspect-video flex-shrink-0">
                {selectedLesson.video_path || selectedLesson.video_url ? (
                  <video
                    key={selectedLesson.id}
                    src={
                      selectedLesson.video_url
                        ? selectedLesson.video_url
                        : `http://localhost:8000/api/courses/${id}/lessons/${selectedLesson.id}/stream`
                    }
                    controls
                    className="w-full h-full object-contain"
                    autoPlay
                    onEnded={() => {
                      if (!completedLessons.has(selectedLesson.id)) {
                        handleToggleComplete(selectedLesson.id);
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 border-b border-gray-800">
                    <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-medium">Text or interactive lesson</p>
                    <p className="text-sm text-gray-500 mt-1">Read the content below</p>
                  </div>
                )}
              </div>

              {/* Lesson Toolbar */}
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm flex-shrink-0">
                <div className="flex-1 min-w-0 pr-4">
                   <h2 className="text-xl font-extrabold text-gray-900 truncate">{selectedLesson.title}</h2>
                   {selectedLesson.duration > 0 && (
                     <p className="text-xs text-gray-500 font-semibold mt-1">Duration: {selectedLesson.duration} min</p>
                   )}
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Mark complete button */}
                  <button
                    onClick={() => handleToggleComplete(selectedLesson.id)}
                    disabled={togglingLesson === selectedLesson.id}
                    className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isCurrentComplete
                        ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100'
                        : 'bg-[#592b98] text-white shadow-sm hover:bg-[#4a2480] hover:shadow'
                    } disabled:opacity-60 disabled:cursor-not-allowed`}
                  >
                    {togglingLesson === selectedLesson.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isCurrentComplete ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isCurrentComplete ? 'Completed' : 'Mark Complete'}
                  </button>

                  <div className="w-px h-6 bg-gray-200 mx-1"></div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => prevLesson && setSelectedLesson(prevLesson)}
                      disabled={!prevLesson}
                      title="Previous Lesson"
                      className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                      disabled={!nextLesson}
                      title="Next Lesson"
                      className="p-2.5 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Text Content */}
              <div className="flex-1 p-6 md:p-10">
                {selectedLesson.content ? (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto prose prose-gray max-w-none">
                    <h3 className="text-xs font-bold text-[#592b98] mb-4 uppercase tracking-widest border-b border-gray-100 pb-4">
                      Lesson Notes & Resources
                    </h3>
                    <div className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-line font-medium">
                      {selectedLesson.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-gray-400 font-medium">No additional notes for this lesson.</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center flex-1 h-full">
              <div className="text-center bg-white p-12 rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-[#592b98]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to learn?</h3>
                <p className="text-gray-500 font-medium max-w-xs mx-auto">Select a lesson from the curriculum sidebar to start watching.</p>
              </div>
            </div>
          )}
        </main>

        {/* ── Right: Curriculum Sidebar ── */}
        {sidebarOpen && (
          <aside className="w-[340px] bg-white border-l border-gray-200 flex-shrink-0 flex flex-col z-20 shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.05)] transition-all">
            
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-100 bg-white">
              <h3 className="text-base font-extrabold text-gray-900 mb-1">Course Content</h3>
            </div>

            {/* Curriculum Accordion */}
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              {sections.length > 0 ? sections.map((section, idx) => (
                <div key={section.id || idx} className="border-b border-gray-100 last:border-b-0">
                  
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-start justify-between p-4 bg-gray-50/50 hover:bg-gray-100 transition-colors text-left group"
                  >
                    <div className="flex-1 pr-4">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#592b98] transition-colors leading-tight mb-1">
                        Section {idx + 1}: {section.title}
                      </h4>
                      <div className="flex items-center text-[11px] font-semibold text-gray-500">
                        <span>{(section.lessons || []).filter(l => completedLessons.has(l.id)).length} / {section.lessons?.length || 0}</span>
                        <span className="mx-1.5">•</span>
                        <span>{section.lessons?.reduce((sum, l) => sum + (l.duration || 0), 0)} min</span>
                      </div>
                    </div>
                    <div className="pt-0.5">
                      <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${expandedSections[idx] ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Section Lessons */}
                  {expandedSections[idx] && (
                    <div className="bg-white py-1">
                      {section.lessons?.length > 0 ? section.lessons.map((lesson, lIdx) => {
                        const isActive    = selectedLesson?.id === lesson.id;
                        const isDone      = completedLessons.has(lesson.id);
                        
                        return (
                          <button
                            key={lesson.id || lIdx}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors relative group ${
                              isActive
                                ? 'bg-[#f8f5ff]'
                                : 'hover:bg-gray-50'
                            }`}
                          >
                            {/* Active Indicator Line */}
                            {isActive && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#592b98]"></div>
                            )}

                            {/* Checkbox / Play Icon */}
                            <div className="mt-0.5 shrink-0">
                              {isDone ? (
                                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shadow-sm">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : isActive ? (
                                <div className="w-5 h-5 rounded-full bg-[#592b98] text-white flex items-center justify-center shadow-sm">
                                  <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 4l12 6-12 6z" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-[#592b98]/40 transition-colors"></div>
                              )}
                            </div>

                            {/* Text content */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] leading-snug mb-1 ${
                                isActive ? 'font-bold text-[#592b98]' : 'font-semibold text-gray-700 group-hover:text-gray-900'
                              }`}>
                                {lIdx + 1}. {lesson.title}
                              </p>
                              <div className="flex items-center gap-2 text-[10px] font-semibold text-gray-500">
                                {lesson.duration > 0 ? (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    {lesson.duration} min
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-2-2h-2" /></svg>
                                    Article
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      }) : (
                        <p className="text-xs font-medium text-gray-400 px-6 py-4 italic">No lessons in this section yet.</p>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                  <svg className="w-12 h-12 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-500 text-sm font-medium">Curriculum is empty.</p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default CourseLearning;
