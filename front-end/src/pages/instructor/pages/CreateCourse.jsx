import React, { useReducer, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createCourse, createSection, createLesson } from '../../../services/Coursesapi';
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
  const [state, dispatch]       = useReducer(courseReducer, initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading]   = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError]       = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [createdCourseId, setCreatedCourseId] = useState(null);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Create course first (basic info + outcomes + thumbnail)
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

    // Outcomes
    const filteredOutcomes = state.outcomes.filter(o => o.trim() !== '');
    filteredOutcomes.forEach(outcome => {
      formData.append('outcomes[]', outcome);
    });

    const res = await fetch('http://127.0.0.1:8000/api/courses/structure', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Error response from server:', errorData);
      throw new Error(errorData.message || 'Failed to create course');
    }

    const data = await res.json();
    return data.course_id || data.data?.id;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Course and curriculum already created via API buttons
      // Just navigate back to courses list
      navigate('/instructor/courses');
    } catch (err) {
      setError(err.message || 'Failed to create course');
      console.error('Error creating course:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (step) => {
    const errors = {};
    setError('');

    if (step === 1) {
      if (!state.title || state.title.trim() === '') {
        errors.title = 'Course title is required';
      }
      if (!state.description || state.description.trim() === '') {
        errors.description = 'Course description is required';
      }
      if (!state.category_id) {
        errors.category_id = 'Please select a category';
      }
      if (!state.price) {
        errors.price = 'Price is required';
      }
    }
    if (step === 2) {
      const validOutcomes = state.outcomes.filter(o => o.trim() !== '');
      if (validOutcomes.length === 0) {
        errors.outcome_0 = 'Please add at least one learning outcome';
      }
    }
    if (step === 3) {
      const validSections = state.sections.filter(s => s.title.trim() !== '');
      if (validSections.length === 0) {
        setError('Please add at least one section');
        return false;
      }
      for (const section of validSections) {
        const validLessons = section.lessons.filter(l => l.title.trim() !== '');
        if (validLessons.length === 0) {
          setError(`Section "${section.title}" must have at least one lesson`);
          return false;
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = async() => {
    if (validateStep(currentStep)) {
      if(currentStep === 2){
          setLoading(true);
          try {
            const courseId = await createBaseCourse();
            console.log('Created course with ID:', courseId);
            setCreatedCourseId(courseId);
            setCurrentStep(prev => prev + 1);
          } catch (err) {
            setError(err.message || 'Failed to create course');
            console.error('Error creating course:', err);
          }finally {
              setLoading(false);
          }
        return;
      }
      setCurrentStep(prev => prev + 1);
      setError('');
    }
  };

  // Create a single section via API
  const handleCreateSection = async (title) => {
    if (!createdCourseId) {
      throw new Error('Course not created yet');
    }
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', title);

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${createdCourseId}/sections`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Error creating section:', errorData);
      throw new Error(errorData.message || 'Failed to create section');
    }

    const data = await res.json();
    return data.section?.id || data.data?.id || data.id;
  };

  // Create a single lesson via API
  const handleCreateLesson = async (sectionId, lessonData) => {
    if (!createdCourseId) {
      throw new Error('Course not created yet');
    }
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('title', lessonData.title);
    formData.append('content', lessonData.content || '');
    formData.append('is_free', lessonData.is_free ? '1' : '0');
    formData.append('order', lessonData.order || 0);
    formData.append('section_id', sectionId);

    if (lessonData.video_file) {
      formData.append('video_file', lessonData.video_file);
    }

    const res = await fetch(`http://127.0.0.1:8000/api/courses/${createdCourseId}/lessons`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create lesson');
    }

    const data = await res.json();
    return data.lesson?.id || data.data?.id || data.id;
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const steps = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Outcomes' },
    { num: 3, label: 'Curriculum' },
    { num: 4, label: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Progress Steps */}
      <section className="bg-white py-8 px-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.num}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors
                    ${currentStep >= s.num ? 'bg-[#592b98] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {s.num}
                  </div>
                  <span className={`text-xs mt-2 font-medium hidden sm:block
                    ${currentStep >= s.num ? 'text-[#592b98]' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 rounded
                    ${currentStep > s.num ? 'bg-[#592b98]' : 'bg-gray-200'}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Error */}
      {error && (
        <div className="max-w-4xl mx-auto mt-4 px-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        </div>
      )}

      {/* Steps Content */}
      <section className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          {currentStep === 1 && <Step1_CourseInfo  state={state} dispatch={dispatch} categories={categories} errors={fieldErrors} />}
          {currentStep === 2 && <Step2_Outcomes    state={state} dispatch={dispatch} errors={fieldErrors} />}
          {currentStep === 3 && <Step3_Curriculum  state={state} dispatch={dispatch} errors={fieldErrors} courseId={createdCourseId} onCreateSection={handleCreateSection} onCreateLesson={handleCreateLesson} />}
          {currentStep === 4 && <Step4_Review      state={state} loading={loading} onSubmit={handleSubmit} onBack={prevStep} courseId={createdCourseId} />}

          {/* Navigation */}
          {currentStep < 4 && (
            <div className="flex justify-between pt-4">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={nextStep}
                className="px-8 py-3 bg-[#592b98] text-white rounded-md font-semibold hover:bg-[#3e1f6b]"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
};

export default CreateCourse;
