# Course Wizard - One-Call API Implementation

## Overview

The Course Wizard implements a **one-call API approach** for course creation, where a single API request creates a course with all its sections and lessons. This is achieved through:

1. **Backend**: `CourseService.php` with transaction support
2. **API Endpoint**: `POST /api/courses/structure`
3. **Frontend**: `CourseWizard.jsx` component

## Backend Implementation

### CourseService.php

The backend service handles everything in a single database transaction:

```php
public function createCourseStructure(array $data, int $instructorId): Course
{
    return DB::transaction(function () use ($data, $instructorId) {
        // 1. Create course
        $course = Course::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'instructor_id' => $instructorId,
            'status' => $data['status'] ?? 'draft',
            'price' => $data['price'] ?? 0,
            'level' => $data['level'] ?? 'beginner',
            'category_id' => $data['category_id'] ?? null,
            // ... other fields
        ]);

        // 2. Create sections and lessons
        $this->createSectionsAndLessons($course, $data['sections']);

        // 3. Return course with relationships
        $course->load(['sections.lessons']);
        return $course;
    });
}
```

### Key Benefits

- **Atomic Operations**: All database operations succeed or fail together
- **Data Integrity**: No orphaned sections or lessons
- **Performance**: Single database transaction
- **Simplicity**: One API call instead of multiple

## API Endpoint

### POST /api/courses/structure

**Authentication**: Requires `Bearer token`

**Request Body**:
```json
{
  "title": "Course Title",
  "description": "Course description",
  "category_id": 1,
  "price": 99.99,
  "level": "beginner",
  "status": "draft",
  "sections": [
    {
      "title": "Section 1",
      "order": 0,
      "lessons": [
        {
          "title": "Lesson 1",
          "content": "Lesson content",
          "order": 0
        }
      ]
    }
  ]
}
```

**Response**:
```json
{
  "message": "Course created successfully",
  "course": {
    "id": 123,
    "title": "Course Title",
    "sections": [
      {
        "id": 1,
        "title": "Section 1",
        "lessons": [
          {
            "id": 1,
            "title": "Lesson 1"
          }
        ]
      }
    ]
  }
}
```

## Frontend Implementation

### CourseWizard.jsx

The frontend component collects all course data and sends it in one request:

```javascript
// Step 1: Course Info (title, description, category, price, level)
// Step 2: Sections
// Step 3: Lessons
// Final: Submit all data to /api/courses/structure

const handleSubmit = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem('token');
    const response = await createCourseStructure(formData, token);
    toast.success('Course created successfully!');
    navigate('/instructor/courses');
  } catch (error) {
    console.error('Failed to create course:', error);
    toast.error(error.message || 'Failed to create course');
  } finally {
    setLoading(false);
  }
};
```

### Data Flow

1. **User fills out wizard steps**
2. **Data is validated client-side**
3. **Single API call to `/api/courses/structure`**
4. **Backend creates everything in transaction**
5. **User is redirected to courses list**

## Validation

### Backend Validation (StoreCourseStructureRequest.php)

```php
public function rules(): array
{
    return [
        'title' => 'required|string|max:255',
        'description' => 'required|string',
        'sections' => 'required|array|min:1',
        'sections.*.title' => 'required|string|max:255',
        'sections.*.description' => 'nullable|string',
        'sections.*.order' => 'nullable|integer',
        'sections.*.lessons' => 'nullable|array',
        'sections.*.lessons.*.title' => 'nullable|string|max:255',
        'sections.*.lessons.*.content' => 'nullable|string',
        'sections.*.lessons.*.order' => 'nullable|integer',
    ];
}
```

### Frontend Validation

- **Step 1**: Title, description, category required
- **Step 2**: At least one section with title required  
- **Step 3**: All lessons must have title and content

## Error Handling

### Backend Errors
- Validation errors return 422 with detailed messages
- Authorization errors return 403
- Server errors return 500

### Frontend Error Display
- User-friendly toast notifications
- Field-specific error messages
- Loading states during API calls

## Usage

### For Instructors

1. Navigate to `/instructor/create-course-wizard`
2. Fill in course information (Step 1)
3. Add sections (Step 2)
4. Add lessons to each section (Step 3)
5. Click "Create Course"

### For Developers

```javascript
import { createCourseStructure } from '../../../services/Coursesapi';

const courseData = {
  title: 'My Course',
  description: 'Course description',
  category_id: 1,
  price: 49.99,
  level: 'beginner',
  status: 'draft',
  sections: [
    {
      title: 'Introduction',
      lessons: [
        { title: 'Welcome', content: 'Hello!' }
      ]
    }
  ]
};

const response = await createCourseStructure(courseData, authToken);
```

## Comparison: Wizard vs Traditional Approach

### Traditional Approach (Multiple Calls)
```
1. POST /api/courses → Create course
2. POST /api/courses/{id}/sections → Create section 1  
3. POST /api/courses/{id}/lessons → Create lesson 1.1
4. POST /api/courses/{id}/lessons → Create lesson 1.2
5. POST /api/courses/{id}/sections → Create section 2
6. POST /api/courses/{id}/lessons → Create lesson 2.1
... and so on
```

### Wizard Approach (One Call)
```
1. POST /api/courses/structure → Create everything at once
```

## Files Modified/Created

### Backend (Already Existing)
- `app/Services/CourseService.php` - Transaction-based course creation
- `app/Http/Controllers/CourseStructureController.php` - API endpoint
- `app/Http/Requests/StoreCourseStructureRequest.php` - Validation

### Frontend (Updated)
- `src/services/Coursesapi.js` - `createCourseStructure` function
- `src/pages/instructor/pages/CourseWizard.jsx` - Complete wizard component

### Routes
- `POST /api/courses/structure` - Main endpoint
- `GET /api/categories` - Categories for dropdown

## Testing

Run the test script:
```bash
node test_course_wizard.js
```

## Best Practices

1. **Always use transactions** for operations that create multiple related records
2. **Validate data** both client-side and server-side
3. **Handle errors gracefully** with user-friendly messages
4. **Use loading states** to prevent duplicate submissions
5. **Keep API responses consistent** with proper status codes

## Future Enhancements

1. Add progress saving (draft courses)
2. Add preview functionality
3. Support for course images/videos
4. Bulk lesson import
5. Course template system

## Troubleshooting

### Common Issues

**Issue**: "Sections are required"
- **Solution**: Add at least one section in Step 2

**Issue**: "Category is required"
- **Solution**: Select a category in Step 1

**Issue**: "Lesson title is required"
- **Solution**: All lessons must have titles in Step 3

**Issue**: 403 Forbidden
- **Solution**: Check authentication token

**Issue**: 422 Validation Error
- **Solution**: Check the error messages for specific field issues

## Conclusion

The Course Wizard provides a **streamlined, efficient, and user-friendly** way to create courses with all their content in a single operation. This approach:

- ✅ Reduces API calls from N+1 to just 1
- ✅ Ensures data integrity with transactions
- ✅ Provides better user experience
- ✅ Simplifies error handling
- ✅ Improves performance

The implementation is production-ready and follows Laravel/Laravel best practices.