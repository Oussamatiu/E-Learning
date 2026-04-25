import React from 'react';

const Step2_Outcomes = ({ state, dispatch, errors }) => {
  const handleOutcomeChange = (index, value) => {
    dispatch({ type: 'UPDATE_OUTCOME', index, value });
  };

  const addOutcome = () => {
    dispatch({ type: 'ADD_OUTCOME' });
  };

  const removeOutcome = (index) => {
    dispatch({ type: 'DELETE_OUTCOME', index });
  };

  const getInputClass = (index) => {
    return `w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#592b98]/20 focus:border-[#592b98] outline-none ${
      errors && errors[`outcome_${index}`] ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''
    }`;
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Learning Outcomes</h2>
        <p className="text-sm text-gray-500">What will students achieve after taking your course? Clear outcomes help increase sales.</p>
      </div>

      <div className="space-y-4 max-w-3xl">
        {state.outcomes.map((outcome, index) => (
          <div key={index} className="flex items-start gap-4 group">
            {/* Number badge */}
            <div className="mt-1.5 w-8 h-8 rounded-full bg-[#f8f5ff] text-[#592b98] flex items-center justify-center font-bold text-xs flex-shrink-0 border border-[#e6dcf5]">
              {index + 1}
            </div>
            
            <div className="flex-1">
              <input
                type="text"
                value={outcome}
                onChange={(e) => handleOutcomeChange(index, e.target.value)}
                className={getInputClass(index)}
                placeholder="e.g., Build responsive websites using HTML, CSS, and JavaScript"
              />
              {errors && errors[`outcome_${index}`] && (
                <p className="mt-1.5 text-xs font-semibold text-red-500">{errors[`outcome_${index}`]}</p>
              )}
            </div>
            
            {/* Remove Button */}
            {state.outcomes.length > 1 && (
              <button
                type="button"
                onClick={() => removeOutcome(index)}
                className="mt-1.5 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                title="Remove outcome"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="max-w-3xl mt-6 ml-12">
        <button
          type="button"
          onClick={addOutcome}
          className="inline-flex items-center gap-2 text-[#592b98] font-bold text-sm hover:bg-[#f8f5ff] px-5 py-2.5 rounded-xl border border-transparent hover:border-[#e6dcf5] transition-all"
        >
          <span className="text-lg leading-none">+</span> Add Another Outcome
        </button>
      </div>
    </div>
  );
};

export default Step2_Outcomes;
