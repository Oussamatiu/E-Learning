import React, { useState } from 'react';

const Step3_Curriculum = ({ state, dispatch, errors, courseId, onCreateSection, onCreateLesson }) => {
  const [sectionCreating, setSectionCreating] = useState({});
  const [lessonCreating, setLessonCreating] = useState({});
  const [sectionEditing, setSectionEditing] = useState({});
  const [lessonEditing, setLessonEditing] = useState({});

  const handleSectionChange = (tempId, title) => {
    dispatch({ type: 'UPDATE_SECTION', tempId, title });
  };

  const handleLessonChange = (sectionTempId, lessonTempId, updates) => {
    dispatch({ type: 'UPDATE_LESSON', sectionTempId, lessonTempId, updates });
  };

const MAX_VIDEO_MINUTES = 15;

const handleVideoFileChange = (sectionTempId, lessonTempId, file) => {
  if (!file) return;

  const video = document.createElement('video');
  const url = URL.createObjectURL(file);
  video.src = url;

  video.onloadedmetadata = () => {
    URL.revokeObjectURL(url);
    const durationSeconds = Math.round(video.duration);
    const durationMinutes = video.duration / 60;

    if (durationMinutes > MAX_VIDEO_MINUTES) {
      dispatch({
        type: 'UPDATE_LESSON',
        sectionTempId,
        lessonTempId,
        updates: {
          video_file: null,
          duration: null,
          video_error: `Video is ${durationMinutes.toFixed(1)} min — max allowed is ${MAX_VIDEO_MINUTES} min.`
        }
      });
    } else {
      dispatch({
        type: 'UPDATE_LESSON',
        sectionTempId,
        lessonTempId,
        updates: {
          video_file: file,
          duration: durationSeconds,
          video_error: null
        }
      });
    }
  };

  video.onerror = () => {
    URL.revokeObjectURL(url);
    dispatch({
      type: 'UPDATE_LESSON',
      sectionTempId,
      lessonTempId,
      updates: { video_file: null, duration: null, video_error: 'Could not read video file.' }
    });
  };
};

  const addSection = () => {
    dispatch({ type: 'ADD_SECTION' });
  };

  const createSectionWithTitle = async (tempId, title) => {
    if (!courseId) return;
    if (!title || title.trim() === '') {
      alert('Section title cannot be empty');
      return;
    }
    setSectionCreating(prev => ({ ...prev, [tempId]: true }));
    try {
      const sectionId = await onCreateSection(title.trim());
      dispatch({ type: 'UPDATE_SECTION_WITH_ID', tempId, sectionId, title: title.trim() });
    } catch (err) {
      console.error('Failed to create section:', err);
      alert(err.message);
    } finally {
      setSectionCreating(prev => ({ ...prev, [tempId]: false }));
    }
  };

  const removeSection = async (tempId, sectionId) => {
    if (sectionId && courseId) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/sections/${sectionId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (err) {}
    }
    dispatch({ type: 'DELETE_SECTION', tempId });
  };

  const addLesson = (sectionTempId) => {
    dispatch({ type: 'ADD_LESSON', sectionTempId });
  };

  const createLessonWithTitle = async (sectionTempId, sectionId, lessonTempId, title) => {
    if (!courseId || !sectionId) return;
    if (!title || title.trim() === '') {
      alert('Lesson title cannot be empty');
      return;
    }
    setLessonCreating(prev => ({ ...prev, [lessonTempId]: true }));
    try {
      const lesson = state.sections.find(s => s.tempId === sectionTempId)?.lessons.find(l => l.tempId === lessonTempId);
      const lessonData = {
        title: title.trim(),
        content: lesson?.content || '',
        is_free: lesson?.is_free || false,
        order: state.sections.find(s => s.tempId === sectionTempId)?.lessons.length || 0,
        video_file: lesson?.video_file,
        duration: lesson?.duration || 0
      };
      const lessonId = await onCreateLesson(sectionId, lessonData);
      dispatch({ type: 'UPDATE_LESSON_WITH_ID', sectionTempId, lessonTempId, lessonId });
    } catch (err) {
      console.error('Failed to create lesson:', err);
      alert(err.message);
    } finally {
      setLessonCreating(prev => ({ ...prev, [lessonTempId]: false }));
    }
  };

  const removeLesson = async (sectionTempId, lessonTempId, lessonId) => {
    if (lessonId && courseId) {
      const token = localStorage.getItem('token');
      try {
        await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/${lessonId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
      } catch (err) {}
    }
    dispatch({ type: 'DELETE_LESSON', sectionTempId, lessonTempId });
  };

  const updateSection = async (tempId, sectionId, title) => {
    if (!courseId || !sectionId) return;
    if (!title || title.trim() === '') {
      alert('Section title cannot be empty');
      return;
    }
    setSectionEditing(prev => ({ ...prev, [tempId]: true }));
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('_method', 'PUT');

      const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/sections/${sectionId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update section');
      setSectionEditing(prev => ({ ...prev, [tempId]: false }));
    } catch (err) {
      alert(err.message);
      setSectionEditing(prev => ({ ...prev, [tempId]: false }));
    }
  };

  const updateLesson = async (sectionTempId, lessonTempId, lessonId, lessonData) => {
    if (!courseId || !lessonId) return;
    setLessonEditing(prev => ({ ...prev, [lessonTempId]: true }));
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', lessonData.title);
      formData.append('content', lessonData.content || '');
      formData.append('is_free', lessonData.is_free ? '1' : '0');
      formData.append('duration', lessonData.duration || 0);
      formData.append('_method', 'PUT');
      if (lessonData.video_file) {
        formData.append('video_file', lessonData.video_file);
      }

      const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to update lesson');
      setLessonEditing(prev => ({ ...prev, [lessonTempId]: false }));
    } catch (err) {
      alert(err.message);
      setLessonEditing(prev => ({ ...prev, [lessonTempId]: false }));
    }
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Curriculum</h2>
        <p className="text-sm text-gray-500">
          {courseId
            ? 'Course draft saved! Now build your curriculum by adding sections and lessons.'
            : 'Organize your course into sections and lessons.'}
        </p>
      </div>

      {!courseId && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3 items-start">
          <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-yellow-800 font-medium">
            Please complete Step 2 (Outcomes) and click Next to initialize the course before adding curriculum.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {state.sections.map((section, sIndex) => (
          <div key={section.tempId} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="bg-gray-50 px-6 py-5 flex items-center justify-between border-b border-gray-100">
              <div className="flex-1 flex items-center gap-3">
                <span className="font-bold text-gray-400 text-sm">Section {sIndex + 1}:</span>
                <input
                  type="text"
                  value={section.title}
                  onChange={(e) => handleSectionChange(section.tempId, e.target.value)}
                  className="flex-1 text-lg font-bold bg-transparent border-b-2 border-transparent focus:border-[#592b98] focus:outline-none transition-colors px-1"
                  placeholder="Enter a title for this section"
                />
              </div>

              {!section.id ? (
                <button
                  type="button"
                  onClick={() => createSectionWithTitle(section.tempId, section.title)}
                  disabled={sectionCreating[section.tempId] || !section.title.trim()}
                  className="ml-4 px-5 py-2 bg-[#592b98] text-white rounded-lg text-sm font-semibold hover:bg-[#3e1f6b] disabled:opacity-50 transition-colors shadow-sm"
                >
                  {sectionCreating[section.tempId] ? 'Saving...' : 'Save Section'}
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => setSectionEditing(prev => ({ ...prev, [section.tempId]: !prev[section.tempId] }))}
                    className="p-2 text-gray-400 hover:text-[#592b98] hover:bg-[#f8f5ff] rounded-lg transition-colors"
                    title="Edit Title"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {sectionEditing[section.tempId] && (
                    <button
                      type="button"
                      onClick={() => updateSection(section.tempId, section.id, section.title)}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 shadow-sm"
                    >
                      Save
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeSection(section.tempId, section.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Section"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Section Lessons */}
            <div className="p-4 space-y-3 bg-white">
              {section.lessons.map((lesson, lIndex) => (
                <div key={lesson.tempId} className="flex flex-col md:flex-row gap-4 p-4 border border-gray-100 bg-gray-50/50 rounded-xl hover:border-gray-200 transition-colors group">
                  
                  {/* Left: Icon & Number */}
                  <div className="flex items-start gap-3 mt-1">
                    <div className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold shadow-sm">
                      {lIndex + 1}
                    </div>
                  </div>

                  {/* Center: Content */}
                  <div className="flex-1 space-y-4">
                    {/* Title & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { title: e.target.value })}
                          className="w-full px-3 py-2 border-b border-gray-200 bg-transparent focus:border-[#592b98] focus:bg-white focus:ring-0 rounded-t-md text-sm font-semibold text-gray-900 transition-colors placeholder-gray-400"
                          placeholder="Lesson Title (e.g., Introduction to the course)"
                        />
                      </div>
                      
                      <div className="flex items-center gap-2 shrink-0">
                        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white px-3 py-1.5 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                          <input
                            type="checkbox"
                            checked={lesson.is_free}
                            onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { is_free: e.target.checked })}
                            className="rounded text-[#592b98] focus:ring-[#592b98]"
                          />
                          Free Preview
                        </label>

                        {!lesson.id ? (
                          <button
                            type="button"
                            onClick={() => createLessonWithTitle(section.tempId, section.id, lesson.tempId, lesson.title)}
                            disabled={lessonCreating[lesson.tempId] || !lesson.title.trim()}
                            className="px-4 py-1.5 bg-[#592b98] text-white rounded-lg text-xs font-semibold hover:bg-[#3e1f6b] disabled:opacity-50 transition-colors shadow-sm"
                          >
                            {lessonCreating[lesson.tempId] ? 'Saving...' : 'Save'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateLesson(section.tempId, lesson.tempId, lesson.id, lesson)}
                            disabled={lessonEditing[lesson.tempId]}
                            className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50 shadow-sm"
                          >
                            {lessonEditing[lesson.tempId] ? 'Saving...' : 'Update'}
                          </button>
                        )}
                        
                        {section.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(section.tempId, lesson.tempId, lesson.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Lesson Description */}
                    <div>
                      <input
                        type="text"
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { content: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-[#592b98] focus:ring-1 focus:ring-[#592b98] transition-colors placeholder-gray-400"
                        placeholder="Brief description of what is covered in this lesson..."
                      />
                    </div>

                    {/* Lesson Video */}
                    <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Video File (Max {MAX_VIDEO_MINUTES} min)</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoFileChange(section.tempId, lesson.tempId, e.target.files[0])}
                          className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#f8f5ff] file:text-[#592b98] hover:file:bg-[#e6dcf5] cursor-pointer"
                        />
                      </div>
                      
                      <div className="w-48 text-right shrink-0">
                        {lesson.video_error && (
                          <p className="text-xs font-semibold text-red-500 flex items-center justify-end gap-1">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
                            <span className="truncate">{lesson.video_error}</span>
                          </p>
                        )}
                        {lesson.video_file && !lesson.video_error && (
                          <p className="text-xs font-semibold text-green-600 flex items-center justify-end gap-1">
                            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            <span className="truncate max-w-[120px]" title={lesson.video_file.name}>{lesson.video_file.name}</span>
                            <span>({Math.floor((lesson.duration || 0) / 60)}m {(lesson.duration || 0) % 60}s)</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-2 pb-1">
                <button
                  type="button"
                  onClick={() => addLesson(section.tempId)}
                  disabled={!section.id}
                  className="flex items-center gap-2 text-xs font-bold text-[#592b98] bg-[#f8f5ff] hover:bg-[#e6dcf5] px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-transparent hover:border-[#e6dcf5]"
                >
                  <span className="text-lg leading-none">+</span> Add Lesson
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-8 flex items-center justify-center gap-2 w-full px-6 py-4 border-2 border-dashed border-gray-300 text-gray-500 rounded-xl font-bold hover:border-[#592b98] hover:text-[#592b98] hover:bg-[#f8f5ff] transition-all"
      >
        <span className="text-xl leading-none">+</span> Add New Section
      </button>
    </div>
  );
};

export default Step3_Curriculum;
