const courseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.key]: action.value
      };

    case 'SET_THUMBNAIL':
      return {
        ...state,
        thumbnail: action.thumbnail,
        thumbnailPreview: action.preview
      };

    case 'ADD_OUTCOME':
      return {
        ...state,
        outcomes: [...state.outcomes, '']
      };

    case 'UPDATE_OUTCOME':
      return {
        ...state,
        outcomes: state.outcomes.map((outcome, index) =>
          index === action.index ? action.value : outcome
        )
      };

    case 'DELETE_OUTCOME':
      return {
        ...state,
        outcomes: state.outcomes.filter((_, index) => index !== action.index)
      };

    case 'ADD_SECTION':
      return {
        ...state,
        sections: [...state.sections, {
          tempId: Date.now().toString(),
          title: '',
          order: state.sections.length,
          lessons: []
        }]
      };

    case 'ADD_SECTION_WITH_ID':
      return {
        ...state,
        sections: [...state.sections, {
          id: action.sectionId,
          tempId: Date.now().toString(),
          title: action.title,
          order: state.sections.length,
          lessons: []
        }]
      };

    case 'UPDATE_SECTION':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.tempId
            ? { ...s, title: action.title }
            : s
        )
      };

    case 'UPDATE_SECTION_WITH_ID':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.tempId
            ? { ...s, id: action.sectionId, title: action.title }
            : s
        )
      };

    case 'DELETE_SECTION':
      return {
        ...state,
        sections: state.sections.filter(s => s.tempId !== action.tempId)
      };

    case 'ADD_LESSON':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: [...s.lessons, {
                  tempId: Date.now().toString(),
                  title: '',
                  content: '',
                  video_file: null,
                  video_url: '',
                  is_free: false,
                  duration: 0,
                  order: s.lessons.length
                }]
              }
            : s
        )
      };

    case 'ADD_LESSON_WITH_ID':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: [...s.lessons, {
                  id: action.lessonId,
                  tempId: Date.now().toString(),
                  title: action.lessonData.title,
                  content: action.lessonData.content || '',
                  is_free: action.lessonData.is_free || false,
                  order: action.lessonData.order || 0,
                  video_file: null
                }]
              }
            : s
        )
      };

    case 'UPDATE_LESSON':
      return {
        ...state,
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

    case 'UPDATE_LESSON_WITH_ID':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: s.lessons.map(l =>
                  l.tempId === action.lessonTempId
                    ? { ...l, id: action.lessonId }
                    : l
                )
              }
            : s
        )
      };

    case 'DELETE_LESSON':
      return {
        ...state,
        sections: state.sections.map(s =>
          s.tempId === action.sectionTempId
            ? {
                ...s,
                lessons: s.lessons.filter(l => l.tempId !== action.lessonTempId)
              }
            : s
        )
      };

    case 'SET_SECTIONS':
      return {
        ...state,
        sections: action.sections
      };

    default:
      return state;
  }
};

export default courseReducer;
