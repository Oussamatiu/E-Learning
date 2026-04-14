import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const CourseStructure = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([
    {
      id: 1,
      title: 'Introduction to React',
      description: 'Get started with React and learn the fundamentals',
      lessons: [
        { id: 1, title: 'Welcome to the Course', type: 'video', duration: '2:30', completed: true },
        { id: 2, title: 'What is React?', type: 'video', duration: '10:15', completed: false },
        { id: 3, title: 'Setting Up Your Environment', type: 'article', duration: '5 min read', completed: false }
      ]
    },
    {
      id: 2,
      title: 'React Components & Props',
      description: 'Learn how to build reusable components',
      lessons: [
        { id: 4, title: 'Understanding Components', type: 'video', duration: '12:45', completed: false },
        { id: 5, title: 'Working with Props', type: 'video', duration: '15:20', completed: false },
        { id: 6, title: 'Component Patterns Quiz', type: 'quiz', duration: '10 questions', completed: false }
      ]
    }
  ]);

  const [expandedSection, setExpandedSection] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);

  const addSection = () => {
    const newSection = {
      id: Date.now(),
      title: 'New Section',
      description: '',
      lessons: []
    };
    setSections([...sections, newSection]);
  };

  const addLesson = (sectionId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: [...section.lessons, {
            id: Date.now(),
            title: 'New Lesson',
            type: 'video',
            duration: '0:00',
            completed: false
          }]
        };
      }
      return section;
    }));
  };

  const deleteSection = (sectionId) => {
    setSections(sections.filter(s => s.id !== sectionId));
  };

  const deleteLesson = (sectionId, lessonId) => {
    setSections(sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          lessons: section.lessons.filter(l => l.id !== lessonId)
        };
      }
      return section;
    }));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'article':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'quiz':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Topbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/instructor/create-course')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Course Creation
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Course Curriculum Builder</h1>
            <p className="text-gray-600 text-sm mt-1">Organize your course content into sections and lessons</p>
          </div>
          <button
            onClick={addSection}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#592b98] text-white rounded-md font-medium text-sm hover:bg-[#3e1f6b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add Section
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="py-4 px-6">
            <p className="text-sm text-gray-600">Total Sections</p>
            <p className="text-2xl font-bold text-gray-900">{sections.length}</p>
          </Card>
          <Card className="py-4 px-6">
            <p className="text-sm text-gray-600">Total Lessons</p>
            <p className="text-2xl font-bold text-gray-900">{sections.reduce((acc, s) => acc + s.lessons.length, 0)}</p>
          </Card>
          <Card className="py-4 px-6">
            <p className="text-sm text-gray-600">Total Duration</p>
            <p className="text-2xl font-bold text-gray-900">~45 min</p>
          </Card>
          <Card className="py-4 px-6">
            <p className="text-sm text-gray-600">Content Types</p>
            <p className="text-2xl font-bold text-gray-900">3</p>
          </Card>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, sectionIndex) => (
            <Card key={section.id} padding="p-0" className="overflow-hidden">
              {/* Section Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <button
                      onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === section.id ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 bg-[#592b98] text-white rounded-md text-sm font-bold">
                        {sectionIndex + 1}
                      </span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-sm text-gray-500">{section.lessons.length} lessons • {section.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addLesson(section.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#592b98] font-medium hover:bg-purple-100 rounded-md transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Lesson
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Lessons */}
              {expandedSection === section.id && (
                <div className="divide-y divide-gray-100">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md text-gray-500 text-sm">
                          {lessonIndex + 1}
                        </div>
                        <div className={`p-2 rounded-md ${
                          lesson.type === 'video' ? 'bg-blue-100 text-blue-600' :
                          lesson.type === 'article' ? 'bg-green-100 text-green-600' :
                          'bg-yellow-100 text-yellow-600'
                        }`}>
                          {getTypeIcon(lesson.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-500 capitalize">{lesson.type}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{lesson.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/instructor/lesson-editor/${lesson.id}`)}
                          className="px-3 py-1.5 text-sm text-[#592b98] font-medium hover:bg-purple-100 rounded-md transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteLesson(section.id, lesson.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}

                  {section.lessons.length === 0 && (
                    <div className="px-6 py-8 text-center text-gray-500">
                      <svg className="mx-auto h-10 w-10 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-sm">No lessons yet. Click "Add Lesson" to get started.</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-blue-900 text-sm">Best Practices for Course Structure</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800">
                <li>• Keep lessons focused and under 15 minutes when possible</li>
                <li>• Group related topics into logical sections</li>
                <li>• Mix content types (videos, articles, quizzes) for engagement</li>
                <li>• Start each section with clear learning objectives</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CourseStructure;
