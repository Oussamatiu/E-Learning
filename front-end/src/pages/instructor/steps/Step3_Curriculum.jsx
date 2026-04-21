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

  const handleVideoFileChange = (sectionTempId, lessonTempId, file) => {
    dispatch({
      type: 'UPDATE_LESSON',
      sectionTempId,
      lessonTempId,
      updates: { video_file: file }
    });
  };

  const addSection = () => {
    // Just add empty section locally, user will create it via API
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

      // Update section with real ID and title
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
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Failed to delete section:', err);
      }
    }
    dispatch({ type: 'DELETE_SECTION', tempId });
  };

  const addLesson = (sectionTempId) => {
    // Just add empty lesson locally, user will create it via API
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
        video_file: lesson?.video_file
      };
      const lessonId = await onCreateLesson(sectionId, lessonData);

      // Update lesson with real ID
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
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Failed to delete lesson:', err);
      }
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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error('Error updating section:', errorData);
        throw new Error(errorData.message || 'Failed to update section');
      }

      setSectionEditing(prev => ({ ...prev, [tempId]: false }));
    } catch (err) {
      console.error('Failed to update section:', err);
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
      formData.append('_method', 'PUT');
      if (lessonData.video_file) {
        formData.append('video_file', lessonData.video_file);
      }

      const res = await fetch(`http://127.0.0.1:8000/api/courses/${courseId}/lessons/${lessonId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update lesson');
      }

      setLessonEditing(prev => ({ ...prev, [lessonTempId]: false }));
    } catch (err) {
      console.error('Failed to update lesson:', err);
      alert(err.message);
      setLessonEditing(prev => ({ ...prev, [lessonTempId]: false }));
    }
  };

  return (
    <div className="border border-gray-200 rounded-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Course Content</h2>
      <p className="text-gray-600 mb-6">
        {courseId
          ? 'Course created! Add sections and lessons to build your curriculum.'
          : 'Organize your course into sections and lessons'}
      </p>

      {!courseId && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            Please complete Step 2 (Outcomes) first to create the course.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {state.sections.map((section) => (
          <div key={section.tempId} className="border border-gray-200 rounded-md p-5 bg-gray-50">
            <div className="flex items-center justify-between mb-4">
              <input
                type="text"
                value={section.title}
                onChange={(e) => handleSectionChange(section.tempId, e.target.value)}
                className="flex-1 text-lg font-semibold bg-transparent border-b border-gray-300 focus:border-[#592b98] focus:outline-none pb-1"
                placeholder="Section Title"
              />
              {!section.id ? (
                <button
                  type="button"
                  onClick={() => createSectionWithTitle(section.tempId, section.title)}
                  disabled={sectionCreating[section.tempId] || !section.title.trim()}
                  className="ml-3 px-4 py-2 bg-[#592b98] text-white rounded-md text-sm font-medium hover:bg-[#3e1f6b] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sectionCreating[section.tempId] ? 'Creating...' : 'Create Section'}
                </button>
              ) : (
                <div className="flex items-center gap-2 ml-3">
                  <button
                    type="button"
                    onClick={() => setSectionEditing(prev => ({ ...prev, [section.tempId]: !prev[section.tempId] }))}
                    className="text-blue-600 hover:bg-blue-50 p-2 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  {sectionEditing[section.tempId] ? (
                    <button
                      type="button"
                      onClick={() => updateSection(section.tempId, section.id, section.title)}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                    >
                      Save
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeSection(section.tempId, section.id)}
                    className="text-red-600 hover:bg-red-50 p-2 rounded-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 ml-6">
              {section.lessons.map((lesson) => (
                <div key={lesson.tempId} className="bg-white p-4 rounded-md space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs text-gray-400 w-6 pt-2">L{section.lessons.indexOf(lesson) + 1}</span>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { title: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                          placeholder="Lesson title"
                        />
                        {!lesson.id ? (
                          <button
                            type="button"
                            onClick={() => createLessonWithTitle(section.tempId, section.id, lesson.tempId, lesson.title)}
                            disabled={lessonCreating[lesson.tempId] || !lesson.title.trim()}
                            className="px-3 py-1.5 bg-[#592b98] text-white rounded text-xs font-medium hover:bg-[#3e1f6b] disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {lessonCreating[lesson.tempId] ? 'Creating...' : 'Create'}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => updateLesson(section.tempId, lesson.tempId, lesson.id, lesson)}
                            disabled={lessonEditing[lesson.tempId]}
                            className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 disabled:opacity-50"
                          >
                            {lessonEditing[lesson.tempId] ? 'Saving...' : 'Save'}
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={lesson.is_free}
                            onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { is_free: e.target.checked })}
                            className="rounded"
                          />
                          Free preview
                        </label>
                        {section.lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeLesson(section.tempId, lesson.tempId, lesson.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={lesson.content}
                        onChange={(e) => handleLessonChange(section.tempId, lesson.tempId, { content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="Lesson content (optional)"
                      />
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Lesson Video (optional)</label>
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => handleVideoFileChange(section.tempId, lesson.tempId, e.target.files[0])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                        {lesson.video_file && (
                          <p className="mt-1 text-xs text-green-600">✓ {lesson.video_file.name}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => addLesson(section.tempId)}
              disabled={!section.id}
              className="mt-3 ml-6 flex items-center gap-2 text-sm text-[#592b98] hover:bg-[#f8f5ff] px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Lesson
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addSection}
        className="mt-6 px-6 py-3 border-2 border-dashed border-gray-300 text-gray-600 rounded-md font-medium hover:border-[#592b98] hover:text-[#592b98] w-full"
      >
        + Add New Section
      </button>
    </div>
  );
};

export default Step3_Curriculum;
