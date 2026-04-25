import React from 'react';

const Step1_CourseInfo = ({ state, dispatch, categories, errors }) => {
  const handleFieldChange = (key, value) => {
    dispatch({ type: 'SET_FIELD', key, value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      dispatch({
        type: 'SET_THUMBNAIL',
        thumbnail: file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const getInputClass = (fieldName) => {
    return `w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-2 focus:ring-[#592b98]/20 focus:border-[#592b98] outline-none ${
      errors && errors[fieldName] ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : ''
    }`;
  };

  return (
    <div className="p-2 sm:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-2">Basic Information</h2>
        <p className="text-sm text-gray-500">Provide the core details of your course to help students understand what they will learn.</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={state.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className={getInputClass('title')}
            placeholder="e.g., Complete Web Development Bootcamp"
          />
          {errors && errors.title && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
          <textarea
            value={state.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows="5"
            className={getInputClass('description')}
            placeholder="Detail what the course covers, who it's for, and why they should take it..."
          />
          {errors && errors.description && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.description}</p>}
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (USD) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">$</span>
              <input
                type="number"
                value={state.price}
                onChange={(e) => handleFieldChange('price', e.target.value)}
                step="0.01"
                min="0"
                className={`${getInputClass('price')} pl-8`}
                placeholder="0.00"
              />
            </div>
            {errors && errors.price && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Level <span className="text-red-500">*</span></label>
            <select
              value={state.level}
              onChange={(e) => handleFieldChange('level', e.target.value)}
              className={getInputClass('level')}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors && errors.level && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.level}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Category <span className="text-red-500">*</span></label>
            <select
              value={state.category_id}
              onChange={(e) => handleFieldChange('category_id', e.target.value)}
              className={getInputClass('category_id')}
            >
              <option value="" disabled>Select category...</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors && errors.category_id && <p className="mt-1.5 text-xs font-semibold text-red-500">{errors.category_id}</p>}
          </div>
        </div>

        {/* Thumbnail */}
        <div className="pt-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Course Thumbnail</label>
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
              <div className="relative border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-50 hover:border-[#592b98]/50 transition-colors cursor-pointer p-6 flex flex-col items-center justify-center text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="w-8 h-8 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-semibold text-[#592b98]">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
              </div>
            </div>
            
            {/* Preview Box */}
            <div className="w-full sm:w-64 flex-shrink-0">
              {state.thumbnailPreview ? (
                <div className="rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <img src={state.thumbnailPreview} alt="Preview" className="w-full h-36 object-cover" />
                </div>
              ) : (
                <div className="h-36 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 text-sm">
                  No image selected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1_CourseInfo;
