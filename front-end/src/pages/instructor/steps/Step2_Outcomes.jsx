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
    return `flex-1 px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent ${
      errors && errors[`outcome_${index}`] ? 'border-red-500' : 'border-gray-300'
    }`;
  };

  return (
    <div className="border border-gray-200 rounded-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Learning Outcomes</h2>
      <p className="text-gray-600 mb-6">What will students achieve after taking your course?</p>

      <div className="space-y-3">
        {state.outcomes.map((outcome, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-1 flex items-center gap-3">
              <span className="w-6 h-6 bg-[#f8f5ff] text-[#592b98] rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleOutcomeChange(index, e.target.value)}
                  className={getInputClass(index)}
                  placeholder={`Outcome ${index + 1}`}
                />
                {errors && errors[`outcome_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">{errors[`outcome_${index}`]}</p>
                )}
              </div>
            </div>
            {state.outcomes.length > 1 && (
              <button
                type="button"
                onClick={() => removeOutcome(index)}
                className="p-3 text-red-600 hover:bg-red-50 rounded-md flex-shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addOutcome}
        className="mt-4 flex items-center gap-2 text-[#592b98] hover:bg-[#f8f5ff] px-4 py-2 rounded-md"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Outcome
      </button>
    </div>
  );
};

export default Step2_Outcomes;
