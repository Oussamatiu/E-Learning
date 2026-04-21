import React from 'react';

const Step4_Review = ({ state, loading, onSubmit, onBack, courseId }) => {
  const filteredOutcomes = state.outcomes.filter(o => o.trim());

  return (
    <div className="border border-gray-200 rounded-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
      <p className="text-gray-600 mb-6">
        {courseId
          ? 'Your course has been created. Review and finalize before completing.'
          : 'Review your course details before publishing'}
      </p>

      {courseId && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-800">
            <span className="font-semibold">Course created!</span> ID: #{courseId}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {/* Course Info Summary */}
        <div className="bg-gray-50 rounded-md p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Course Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Title:</span>
              <span className="font-medium text-gray-900">{state.title || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Price:</span>
              <span className="font-medium text-gray-900">${state.price || '0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Level:</span>
              <span className="font-medium text-gray-900 capitalize">{state.level}</span>
            </div>
          </div>
        </div>

        {/* Outcomes Summary */}
        <div className="bg-gray-50 rounded-md p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Learning Outcomes ({filteredOutcomes.length})</h3>
          <ul className="space-y-2">
            {filteredOutcomes.map((outcome, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="w-5 h-5 bg-[#f8f5ff] text-[#592b98] rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-700">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Summary */}
        <div className="bg-gray-50 rounded-md p-5">
          <h3 className="font-semibold text-gray-900 mb-3">Course Content</h3>
          <div className="space-y-3">
            {state.sections.map((section) => (
              <div key={section.tempId}>
                <p className="font-medium text-gray-900 text-sm">{section.title}</p>
                <ul className="ml-4 mt-2 space-y-1">
                  {section.lessons.filter(l => l.title.trim()).map((lesson, lIndex) => (
                    <li key={lesson.tempId} className="text-sm text-gray-600">
                      • {lesson.title} {lesson.is_free && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-2">Free</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-8 py-3 bg-[#592b98] text-white rounded-md font-semibold hover:bg-[#3e1f6b] disabled:opacity-50"
        >
          {loading ? 'Finishing...' : (courseId ? 'Finish' : 'Create Course')}
        </button>
      </div>
    </div>
  );
};

export default Step4_Review;
