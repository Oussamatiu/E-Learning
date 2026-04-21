// Course validation
export const validateCourse = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Course title is required';
  } else if (data.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  } else if (data.title.length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  if (!data.subtitle?.trim()) {
    errors.subtitle = 'Course subtitle is required';
  } else if (data.subtitle.length > 200) {
    errors.subtitle = 'Subtitle must not exceed 200 characters';
  }

  if (!data.description?.trim()) {
    errors.description = 'Course description is required';
  } else if (data.description.length < 50) {
    errors.description = 'Description must be at least 50 characters';
  }

  if (!data.category) {
    errors.category = 'Please select a category';
  }

  if (!data.level) {
    errors.level = 'Please select a level';
  }

  if (!data.price && data.price !== 0) {
    errors.price = 'Price is required';
  } else if (data.price < 0) {
    errors.price = 'Price cannot be negative';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Section validation
export const validateSection = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Section title is required';
  } else if (data.title.length > 100) {
    errors.title = 'Title must not exceed 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Lesson validation
export const validateLesson = (data) => {
  const errors = {};

  if (!data.title?.trim()) {
    errors.title = 'Lesson title is required';
  } else if (data.title.length > 200) {
    errors.title = 'Title must not exceed 200 characters';
  }

  if (data.type === 'video' && !data.video_url && !data.video_file) {
    errors.video = 'Please upload a video or provide a video URL';
  }

  if (data.type === 'article' && !data.content?.trim()) {
    errors.content = 'Article content is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Profile validation
export const validateProfile = (data) => {
  const errors = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must not exceed 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Password validation
export const validatePassword = (data) => {
  const errors = {};

  if (!data.currentPassword) {
    errors.currentPassword = 'Current password is required';
  }

  if (!data.newPassword) {
    errors.newPassword = 'New password is required';
  } else if (data.newPassword.length < 8) {
    errors.newPassword = 'Password must be at least 8 characters';
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(data.newPassword)) {
    errors.newPassword = 'Password must contain uppercase, lowercase, and number';
  }

  if (data.newPassword !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
