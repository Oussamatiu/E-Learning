import React from 'react';

const Step4_Review = ({ state, loading, onSubmit, onBack, courseId }) => {
  const filteredOutcomes = state.outcomes.filter(o => o.trim());

  return (
    <div className="p-2 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Review & Finalize</h2>
        <p className="text-sm text-gray-500">
          {courseId
            ? 'Your course structure is ready. Review the details below before finalizing.'
            : 'Review your course details before submitting for admin approval.'}
        </p>
      </div>

      {courseId && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-green-900">Course Successfully Initialized!</p>
            <p className="text-xs text-green-700 mt-0.5">Course ID: #{courseId}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        
        {/* Course Info Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-gray-900">Course Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Title</p>
              <p className="text-sm font-semibold text-gray-900">{state.title || <span className="text-gray-400 italic">Not set</span>}</p>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price</p>
                <p className="text-sm font-bold text-[#592b98]">${state.price || '0.00'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Level</p>
                <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-semibold capitalize">
                  {state.level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Outcomes Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h3 className="font-bold text-gray-900">Learning Outcomes ({filteredOutcomes.length})</h3>
          </div>
          {filteredOutcomes.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No outcomes added.</p>
          ) : (
            <ul className="space-y-3">
              {filteredOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="mt-0.5 shrink-0 text-[#592b98]">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                  <span className="text-gray-700 leading-snug">{outcome}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Content Summary */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-5 h-5 text-[#592b98]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            <h3 className="font-bold text-gray-900">Curriculum Outline</h3>
          </div>
          
          {state.sections.length === 0 ? (
            <p className="text-sm text-gray-400 italic">No sections added.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {state.sections.map((section, sIndex) => {
                const validLessons = section.lessons.filter(l => l.title.trim());
                return (
                  <div key={section.tempId} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="font-bold text-gray-900 text-sm mb-3 border-b border-gray-200 pb-2">
                      <span className="text-gray-400 mr-2">Section {sIndex + 1}:</span>
                      {section.title || <span className="italic font-normal">Untitled Section</span>}
                    </p>
                    {validLessons.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No lessons</p>
                    ) : (
                      <ul className="space-y-2">
                        {validLessons.map((lesson) => (
                          <li key={lesson.tempId} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#592b98]/40 shrink-0" />
                            <span className="flex-1 leading-snug">{lesson.title}</span>
                            {lesson.is_free && (
                              <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md shrink-0">Free</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <button
          onClick={onBack}
          className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={onSubmit}
          disabled={loading}
          className="px-8 py-2.5 bg-[#592b98] text-white rounded-xl font-bold text-sm hover:bg-[#3e1f6b] disabled:opacity-50 transition-colors shadow-sm"
        >
          {loading ? 'Processing...' : (courseId ? 'Finalize & View Courses' : 'Submit for Admin Review')}
        </button>
      </div>
    </div>
  );
};

export default Step4_Review;
