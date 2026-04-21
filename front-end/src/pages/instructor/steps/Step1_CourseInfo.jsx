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
    return `w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent ${
      errors && errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    }`;
  };

  return (
    <div className="border border-gray-200 rounded-md p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Basic Information</h2>
      <p className="text-gray-600 mb-6">Tell us about your course</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title *</label>
          <input
            type="text"
            value={state.title}
            onChange={(e) => handleFieldChange('title', e.target.value)}
            className={getInputClass('title')}
            placeholder="e.g., Complete Web Development Bootcamp"
          />
          {errors && errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
          <textarea
            value={state.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            rows="4"
            className={getInputClass('description')}
            placeholder="What will students learn in your course?"
          />
          {errors && errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
            <input
              type="number"
              value={state.price}
              onChange={(e) => handleFieldChange('price', e.target.value)}
              step="0.01"
              min="0"
              className={getInputClass('price')}
              placeholder="0.00"
            />
            {errors && errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
            <select
              value={state.level}
              onChange={(e) => handleFieldChange('level', e.target.value)}
              className={getInputClass('level')}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors && errors.level && (
              <p className="mt-1 text-sm text-red-600">{errors.level}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={state.category_id}
              onChange={(e) => handleFieldChange('category_id', e.target.value)}
              className={getInputClass('category_id')}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            {errors && errors.category_id && (
              <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Thumbnail</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailChange}
            className={getInputClass('thumbnail')}
          />
          {state.thumbnailPreview && (
            <img src={state.thumbnailPreview} alt="Preview" className="mt-4 h-40 rounded-md object-cover" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1_CourseInfo;
