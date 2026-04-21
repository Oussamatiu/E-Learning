const curriculumReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SECTION':
      return {
        sections: [...state.sections, {
          tempId: Date.now().toString(),
          title: 'New Section',
          order: state.sections.length,
          lessons: []
        }]
      };

    case 'UPDATE_SECTION':
      return {
        sections: state.sections.map(s =>
          s.tempId === action.tempId
            ? { ...s, title: action.title }
            : s
        )
      };

    case 'DELETE_SECTION':
      return {
        sections: state.sections.filter(s => s.tempId !== action.tempId)
      };

    case 'ADD_LESSON':
      return {
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: [...s.lessons, {
                  tempId: Date.now().toString(),
                  title: action.lesson.title || '',
                  content: action.lesson.content || '',
                  video_url: action.lesson.video_url || '',
                  is_free: action.lesson.is_free || false,
                  duration: action.lesson.duration || 0,
                  order: s.lessons.length,
                }]
              }
            : s
        )
      };

    case 'UPDATE_LESSON':
      return {
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: s.lessons.map(l =>
                  l.tempId === action.lessonTempId
                    ? { ...l, ...action.updates }
                    : l
                )
              }
            : s
        )
      };

    case 'DELETE_LESSON':
      return {
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: s.lessons.filter(l =>
                  l.tempId !== action.lessonTempId
                )
              }
            : s
        )
      };

    default:
      return state;
  }
};

export default curriculumReducer;
