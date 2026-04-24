import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchCourseById, fetchSections } from '../../services/Coursesapi';
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
        const courseData = await fetchCourseById(id);
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
          const token = localStorage.getItem('token');
          const sectionsData = await fetchSections(id, token || '');
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
  const progressColor = progress >= 100 ? '#22c55e' : '#592b98';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 text-sm">Loading course content...</p>
        </div>
      </div>
    );
  }

  // ── ACCESS DENIED: not enrolled ─────────────────────────────────────────────
  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-[#f3eeff] rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Locked</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            You don't have access to this course. Purchase it to unlock all lessons and start learning.
          </p>
          <Link
            to={`/courses/${id}`}
            className="inline-flex items-center gap-2 bg-[#592b98] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#3e1f6b] transition-colors"
          >
            View Course & Purchase
          </Link>
          <div className="mt-4">
            <Link to="/" className="text-gray-400 hover:text-gray-600 text-sm">← Back to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 mb-4 font-medium">{error || 'Course not found'}</p>
          <Link to="/student/dashboard" className="text-[#592b98] hover:underline font-medium text-sm">← Back to Dashboard</Link>
        </div>
      </div>
    );
  }


  const prevLesson = getAdjacentLesson(-1);
  const nextLesson = getAdjacentLesson(1);
  const isCurrentComplete = selectedLesson ? completedLessons.has(selectedLesson.id) : false;

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">

      {/* ── Top Bar ── */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between flex-shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Link to="/student/courses" className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">{course.title}</h1>
            <p className="text-xs text-gray-400">{completedCount} / {totalLessons} lessons completed</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
          <div className="w-40 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: progressColor }}
            />
          </div>
          <span className="text-xs font-bold tabular-nums" style={{ color: progressColor }}>
            {Math.round(progress)}%
          </span>
          {progress >= 100 && (
            <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
              🎉 Complete!
            </span>
          )}
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-500 hover:text-gray-700 p-1.5 hover:bg-gray-100 rounded-md transition-colors flex-shrink-0"
          title={sidebarOpen ? 'Hide curriculum' : 'Show curriculum'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Lesson Area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {selectedLesson ? (
            <>
              {/* Video */}
              {selectedLesson.video_path || selectedLesson.video_url ? (
                <div className="bg-black aspect-video max-h-[55vh] flex items-center justify-center flex-shrink-0">
                  <video
                    key={selectedLesson.id}
                    src={
                      selectedLesson.video_url
                        ? selectedLesson.video_url
                        : `http://localhost:8000/api/courses/${id}/lessons/${selectedLesson.id}/stream`
                    }
                    controls
                    className="w-full h-full"
                    autoPlay
                    onEnded={() => {
                      if (!completedLessons.has(selectedLesson.id)) {
                        handleToggleComplete(selectedLesson.id);
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 aspect-video max-h-[55vh] flex items-center justify-center flex-shrink-0">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-gray-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-400 text-sm">No video for this lesson</p>
                  </div>
                </div>
              )}

              {/* Lesson Controls */}
              <div className="border-b border-gray-200 px-6 py-3 flex items-center justify-between bg-white flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Mark complete toggle */}
                  <button
                    onClick={() => handleToggleComplete(selectedLesson.id)}
                    disabled={togglingLesson === selectedLesson.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      isCurrentComplete
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-[#592b98] text-white hover:bg-[#3e1f6b]'
                    } disabled:opacity-60`}
                  >
                    {togglingLesson === selectedLesson.id ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isCurrentComplete ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {isCurrentComplete ? 'Completed ✓' : 'Mark Complete'}
                  </button>
                </div>

                {/* Prev / Next */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => prevLesson && setSelectedLesson(prevLesson)}
                    disabled={!prevLesson}
                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Prev
                  </button>
                  <button
                    onClick={() => nextLesson && setSelectedLesson(nextLesson)}
                    disabled={!nextLesson}
                    className="px-3 py-2 text-sm bg-[#592b98] text-white rounded-lg hover:bg-[#3e1f6b] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next →
                  </button>
                </div>
              </div>

              {/* Lesson Info */}
              <div className="p-6 max-w-4xl">
                <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedLesson.title}</h2>
                {selectedLesson.duration > 0 && (
                  <p className="text-xs text-gray-400 mb-4">⏱ {selectedLesson.duration} min</p>
                )}
                {selectedLesson.content && (
                  <div className="mt-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Lesson Notes</h3>
                    <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{selectedLesson.content}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <div className="text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-500 font-medium">Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Curriculum Sidebar ── */}
        {sidebarOpen && (
          <div className="w-80 border-l border-gray-200 bg-white flex-shrink-0 flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h3 className="text-sm font-bold text-gray-900">Course Content</h3>
              <p className="text-xs text-gray-500 mt-0.5">{sections.length} sections • {totalLessons} lessons</p>

              {/* Mini progress */}
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{completedCount} completed</span>
                  <span className="font-bold" style={{ color: progressColor }}>{Math.round(progress)}%</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%`, backgroundColor: progressColor }}
                  />
                </div>
              </div>
            </div>

            {/* Lessons */}
            <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
              {sections.length > 0 ? sections.map((section, idx) => (
                <div key={section.id || idx}>
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between p-3.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg
                        className={`w-3.5 h-3.5 text-gray-400 transition-transform flex-shrink-0 ${expandedSections[idx] ? 'rotate-90' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="text-xs font-bold text-gray-800 truncate">{section.title}</span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {(section.lessons || []).filter(l => completedLessons.has(l.id)).length}/{section.lessons?.length || 0}
                    </span>
                  </button>

                  {expandedSections[idx] && (
                    <div className="bg-white">
                      {section.lessons?.length > 0 ? section.lessons.map((lesson, lIdx) => {
                        const isActive    = selectedLesson?.id === lesson.id;
                        const isDone      = completedLessons.has(lesson.id);
                        return (
                          <button
                            key={lesson.id || lIdx}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full flex items-center gap-3 px-4 py-3 pl-8 text-left transition-colors border-l-2 ${
                              isActive
                                ? 'bg-[#f8f5ff] border-[#592b98]'
                                : 'hover:bg-gray-50 border-transparent'
                            }`}
                          >
                            {/* Status icon */}
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                              isDone
                                ? 'bg-green-500 text-white'
                                : isActive
                                  ? 'bg-[#592b98] text-white'
                                  : 'bg-gray-100 text-gray-400'
                            }`}>
                              {isDone ? (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className={`text-xs truncate leading-tight ${
                                isActive ? 'font-semibold text-[#592b98]' : isDone ? 'text-gray-500 line-through' : 'text-gray-700'
                              }`}>
                                {lesson.title}
                              </p>
                              {lesson.duration > 0 && (
                                <p className="text-[10px] text-gray-400 mt-0.5">{lesson.duration} min</p>
                              )}
                            </div>
                          </button>
                        );
                      }) : (
                        <p className="text-xs text-gray-400 px-4 py-3 pl-8">No lessons in this section</p>
                      )}
                    </div>
                  )}
                </div>
              )) : (
                <div className="p-8 text-center">
                  <p className="text-gray-500 text-sm">No content available yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseLearning;
