import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCategories } from '../../../services/coursesService';
import courseReducer from '../../../reducers/courseReducer';
import Step1_CourseInfo from '../steps/Step1_CourseInfo';
import Step2_Outcomes   from '../steps/Step2_Outcomes';
import Step3_Curriculum from '../steps/Step3_Curriculum';
import Step4_Review     from '../steps/Step4_Review';

const initialState = {
  title: '',
  description: '',
  category_id: '',
  price: '',
  level: 'beginner',
  status: 'draft',
  thumbnail: null,
  thumbnailPreview: null,
  outcomes: [''],
  sections: []
};

const CreateCourse = () => {
  const navigate = useNavigate();
  const { id: editId } = useParams(); // present only on edit route
  const isEditMode = Boolean(editId);

  const [state, dispatch]       = useReducer(courseReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading]   = useState(false);
  const [updateSaving, setUpdateSaving] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loadingCourse, setLoadingCourse] = useState(isEditMode);
  const [categories, setCategories] = useState([]);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdCourseId, setCreatedCourseId] = useState(isEditMode ? editId : null);

  // Load categories
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  // In edit mode: load existing course data and pre-fill the form
  useEffect(() => {
    if (!isEditMode) return;

    const load = async () => {
      setLoadingCourse(true);
      try {
        const token = localStorage.getItem('token');
        // fetch full course with sections/lessons/outcomes
        const res = await fetch(`http://127.0.0.1:8000/api/courses/${editId}?include=sections,outcomes`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        const course = data.data || data.course || data;

        // Pre-fill basic info
        dispatch({ type: 'SET_FIELD', key: 'title',       value: course.title || '' });
        dispatch({ type: 'SET_FIELD', key: 'description', value: course.description || '' });
        dispatch({ type: 'SET_FIELD', key: 'price',       value: course.price || '' });
        dispatch({ type: 'SET_FIELD', key: 'level',       value: course.level || 'beginner' });
        dispatch({ type: 'SET_FIELD', key: 'status',      value: course.status || 'draft' });

        // category_id — backend may return category as object {id,name}
        const catId = course.category_id ?? course.category?.id ?? '';
        dispatch({ type: 'SET_FIELD', key: 'category_id', value: String(catId) });

        // Existing thumbnail preview (URL, not a File)
        if (course.thumbnail) {
          dispatch({
            type: 'SET_THUMBNAIL',
            thumbnail: null,
            preview: `http://127.0.0.1:8000/storage/${course.thumbnail}`
          });
        }

        // Outcomes
        const outcomes = (course.outcomes || course.learnings || []).map(o =>
          typeof o === 'string' ? o : o.description || ''
        );
        dispatch({ type: 'SET_FIELD', key: 'outcomes', value: outcomes.length ? outcomes : [''] });

        // Sections + lessons — map to internal shape
        const rawSections = course.curriculum || course.sections || [];
        const sections = rawSections.map(section => ({
          tempId: `existing-${section.id}`,
          id: section.id,
          title: section.title || '',
          lessons: (section.lessons || []).map(lesson => ({
            tempId: `existing-lesson-${lesson.id}`,
            id: lesson.id,
            title: lesson.title || '',
            content: lesson.content || '',
            is_free: lesson.free ?? lesson.is_free ?? false,
            video_file: null,
            duration: lesson.duration || 0,
            video_error: null,
          }))
        }));
        dispatch({ type: 'SET_SECTIONS', sections });

      } catch (e) {
        console.error('Failed to load course for editing:', e);
        setError('Failed to load course data. Please try again.');
      } finally {
        setLoadingCourse(false);
      }
    };

    load();
  }, [editId, isEditMode]);

  // Save course updates (edit mode)
  const updateBaseCourse = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', state.title);
    formData.append('description', state.description);
    formData.append('price', state.price);
    formData.append('level', state.level);
    formData.append('category_id', state.category_id);
    formData.append('status', state.status);

    if (state.thumbnail) {
      formData.append('thumbnail_file', state.thumbnail);
    }

    // Outcomes
    const filteredOutcomes = state.outcomes.filter(o => o.trim() !== '');
    filteredOutcomes.forEach(outcome => {
      formData.append('outcomes[]', outcome);
    });

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${editId}/update`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to update course');
    }
    return editId;
  };

  // Create course (create mode)
  const createBaseCourse = async () => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    formData.append('title', state.title);
    formData.append('description', state.description);
    formData.append('price', state.price);
    formData.append('level', state.level);
    formData.append('category_id', state.category_id);
    formData.append('status', state.status);

    if (state.thumbnail) {
      formData.append('thumbnail_file', state.thumbnail);
    }

    const filteredOutcomes = state.outcomes.filter(o => o.trim() !== '');
    filteredOutcomes.forEach(outcome => {
      formData.append('outcomes[]', outcome);
    });

    const res = await fetch('http://127.0.0.1:8000/api/courses/structure', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create course');
    }

    const data = await res.json();
    return data.course_id || data.data?.id;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      navigate('/instructor/courses');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};
    setError('');

    if (step === 1) {
      if (!state.title?.trim())       errors.title = 'Course title is required';
      if (!state.description?.trim()) errors.description = 'Course description is required';
      if (!state.category_id)         errors.category_id = 'Please select a category';
      if (!state.price)               errors.price = 'Price is required';
    }
    if (step === 2) {
      const valid = state.outcomes.filter(o => o.trim() !== '');
      if (valid.length === 0) errors.outcome_0 = 'Please add at least one learning outcome';
    }
    if (step === 3) {
      const validSections = state.sections.filter(s => s.title.trim() !== '');
      if (validSections.length === 0) { setError('Please add at least one section'); return false; }
      for (const section of validSections) {
        if (!section.lessons?.some(l => l.title.trim() !== '')) {
          setError(`Section "${section.title}" must have at least one lesson`);
          return false;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Explicit update button handler (edit mode only)
  const handleUpdate = async () => {
    if (!validateStep(currentStep)) return;
    setUpdateSaving(true);
    setUpdateSuccess(false);
    setError('');
    try {
      await updateBaseCourse();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update course');
    } finally {
      setUpdateSaving(false);
    }
  };

  const nextStep = async () => {
    if (!validateStep(currentStep)) return;

    // In edit mode: just navigate freely, no API call
    if (isEditMode) {
      setCurrentStep(prev => prev + 1);
      setError('');
      return;
    }

    // Create mode: call API on step 2 to create the course
    if (currentStep === 2) {
      setLoading(true);
      try {
        const courseId = await createBaseCourse();
        setCreatedCourseId(courseId);
        setCurrentStep(prev => prev + 1);
      } catch (err) {
        setError(err.message || 'Failed to create course');
      } finally {
        setLoading(false);
      }
      return;
    }

    setCurrentStep(prev => prev + 1);
    setError('');
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  // Section handlers (same for create & edit — use createdCourseId)
  const handleCreateSection = async (title) => {
    if (!createdCourseId) throw new Error('Course not ready yet');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', title);
    const res = await fetch(`http://127.0.0.1:8000/api/courses/${createdCourseId}/sections`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create section');
    }
    const data = await res.json();
    return data.section?.id || data.data?.id || data.id;
  };

  const handleCreateLesson = async (sectionId, lessonData) => {
    if (!createdCourseId) throw new Error('Course not ready yet');
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('content', lessonData.content || '');
    formData.append('is_free', lessonData.is_free ? '1' : '0');
    formData.append('order', lessonData.order || 0);
    formData.append('section_id', sectionId);
    formData.append('duration', lessonData.duration || 0);
    if (lessonData.video_file) formData.append('video_file', lessonData.video_file);

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${createdCourseId}/lessons`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create lesson');
    }
    const data = await res.json();
    return data.lesson?.id || data.data?.id || data.id;
  };

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Outcomes' },
    { num: 3, label: 'Curriculum' },
    { num: 4, label: 'Review' },
  ];

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#592b98] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading course data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#592b98] mb-0.5">
              {isEditMode ? 'Edit Course' : 'Create Course'}
            </p>
            <h1 className="text-lg font-bold text-gray-900">
              {isEditMode ? state.title || 'Editing...' : 'New Course'}
            </h1>
          </div>
          <button
            onClick={() => navigate('/instructor/courses')}
            className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            ← Back to My Courses
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <section className="bg-white py-6 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-colors
                    ${currentStep >= s.num ? 'bg-[#592b98] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {currentStep > s.num ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : s.num}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium hidden sm:block
                    ${currentStep >= s.num ? 'text-[#592b98]' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 rounded ${currentStep > s.num ? 'bg-[#592b98]' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      {/* Steps Content */}
      <section className="bg-white py-6 sm:py-8 px-2 sm:px-4 mt-6 mx-4 max-w-4xl lg:mx-auto rounded-2xl border border-gray-200 mb-12 shadow-sm relative">
        <div className="space-y-4">
          {currentStep === 1 && <Step1_CourseInfo state={state} dispatch={dispatch} categories={categories} errors={fieldErrors} />}
          {currentStep === 2 && <Step2_Outcomes   state={state} dispatch={dispatch} errors={fieldErrors} />}
          {currentStep === 3 && (
            <Step3_Curriculum
              state={state}
              dispatch={dispatch}
              errors={fieldErrors}
              courseId={createdCourseId}
              onCreateSection={handleCreateSection}
              onCreateLesson={handleCreateLesson}
            />
          )}
          {currentStep === 4 && (
            <Step4_Review
              state={state}
              loading={loading}
              onSubmit={handleSubmit}
              onBack={prevStep}
              courseId={createdCourseId}
              isEditMode={isEditMode}
            />
          )}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6 gap-3 px-2 sm:px-6">
              {/* Left: Back */}
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
              ) : <div />}

              {/* Right: Update (edit mode) + Next */}
              <div className="flex items-center gap-4">
                {/* Update button — edit mode, steps 1 & 2 only */}
                {isEditMode && currentStep <= 2 && (
                  <>
                    {updateSuccess && (
                      <span className="text-sm text-green-600 font-bold flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Saved!
                      </span>
                    )}
                    <button
                      onClick={handleUpdate}
                      disabled={updateSaving}
                      className="px-6 py-2.5 border-2 border-[#592b98] text-[#592b98] rounded-xl font-bold text-sm hover:bg-[#f8f5ff] disabled:opacity-60 transition-colors"
                    >
                      {updateSaving ? 'Saving...' : 'Update Course'}
                    </button>
                  </>
                )}

                {/* Next / Create */}
                <button
                  onClick={nextStep}
                  disabled={loading}
                  className="px-8 py-2.5 bg-[#592b98] text-white rounded-xl font-bold text-sm hover:bg-[#3e1f6b] disabled:opacity-60 transition-colors shadow-sm"
                >
                  {loading ? 'Processing...' : 'Next Step →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CreateCourse;
