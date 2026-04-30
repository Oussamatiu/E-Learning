<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCourseRequest;
use App\Http\Resources\CourseResource;
use App\Models\ApiToken;
use App\Models\Course;
use App\Models\Outcome;
use App\Services\CourseService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $query = Course::with('instructor', 'category')
                ->where('status', 'published'); // Only show published courses publicly

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhereHas('category', function($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      })
                      ->orWhereHas('instructor', function($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                });
            }

            if ($request->has('category')) {
                $query->whereHas('category', function($q) use ($request) {
                    $q->where('name', $request->category);
                });
            }

            if ($request->has('price')) {
                $price = $request->price;
                if ($price === 'Free') {
                    $query->where('price', 0);
                } elseif ($price === 'Paid') {
                    $query->where('price', '>', 0);
                }
            }

            if ($request->has('rating')) {
                $rating = $request->rating;
                if ($rating === '4.5 & up') $query->where('rating', '>=', 4.5);
                elseif ($rating === '4.0 & up') $query->where('rating', '>=', 4.0);
                elseif ($rating === '3.5 & up') $query->where('rating', '>=', 3.5);
            }

            $perPage = $request->input('per_page', 9);
            $courses = $query->paginate($perPage);

            return response()->json([
                'data' => CourseResource::collection($courses->items()),
                'meta' => [
                    'current_page' => $courses->currentPage(),
                    'last_page' => $courses->lastPage(),
                    'per_page' => $courses->perPage(),
                    'total' => $courses->total(),
                ],
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to fetch courses",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display instructor-owned courses.
     */
    public function instructorCourses(Request $request)
    {
        try {
            $user = $request->user();

            if (!$user || !$user->isInstructor()) {
                return response()->json([
                    'message' => 'Forbidden: instructor access required'
                ], 403);
            }

            $courses = Course::with(['category'])
                ->where('instructor_id', $user->id)
                ->withCount('enrollments as students_count')
                ->get();

            return response()->json(CourseResource::collection($courses), 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch instructor courses',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        

    }

    /**
     * Store a newly created resource in storage.
     */
   public function store(StoreCourseRequest $request)
{
    try {
        $user = $request->user();

        if (!$user) {
            throw new \Exception('USER_IS_NULL');
        }

        $this->authorize('create', Course::class);

        $validated = $request->validated();

        // Merge uploaded files with validated data
        if ($request->hasFile('thumbnail_file')) {
            $validated['thumbnail_file'] = $request->file('thumbnail_file');
        }

        // Merge lesson video files
        if (isset($validated['sections']) && is_array($validated['sections'])) {
            foreach ($validated['sections'] as $sIndex => $section) {
                if (isset($section['lessons']) && is_array($section['lessons'])) {
                    foreach ($section['lessons'] as $lIndex => $lesson) {
                        $lessonKey = "sections.{$sIndex}.lessons.{$lIndex}";
                        if ($request->hasFile("{$lessonKey}.video_file")) {
                            $validated['sections'][$sIndex]['lessons'][$lIndex]['video_file'] = $request->file("{$lessonKey}.video_file");
                        }
                    }
                }
            }
        }

        if (!$user->relationLoaded('instructor') && !$user->instructor) {
            throw new \Exception('INSTRUCTOR_NOT_FOUND');
        }

        // Use the CourseService to create everything in one transaction
        $courseService = app(\App\Services\CourseService::class);
        $course = $courseService->createFullCourse($validated, $user->instructor->id);

        return response()->json([
            "success" => true,
            "message" => "Course created successfully",
            "course" => new CourseResource($course)
        ], 201);

    } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
        return response()->json([
            "message" => "FORBIDDEN",
            "error" => $e->getMessage()
        ], 403);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            "message" => "VALIDATION_ERROR",
            "errors" => $e->errors()
        ], 422);

    } catch (\Exception $e) {
        return response()->json([
            "message" => "SERVER_ERROR",
            "error" => $e->getMessage()
        ], 500);
    }
}

   public function show(Request $request, string $id)
{
    try {
        $course = Course::with([
            'instructor.instructorProfile',
            'category',
            'outcomes',
            'sections.lessons',
        ])->withCount('ratings')->findOrFail($id);

        $isEnrolled = false;
        $user = $request->user('sanctum');

        if ($user) {
            // Admin can see everything without enrollment
            if ($user->role->title === 'admin') {
                $isEnrolled = true;
            } else {
                $isEnrolled = \App\Models\Enrollment::where('user_id', $user->id)
                    ->where('course_id', $course->id)
                    ->exists();
            }
        }

        $resource = (new CourseResource($course))->toArray($request);
        $resource['is_enrolled'] = $isEnrolled;

        return response()->json(['data' => $resource], 200);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json(['message' => 'Course not found'], 404);
    } catch (\Exception $e) {
        return response()->json(['message' => 'Failed to fetch course', 'error' => $e->getMessage()], 500);
    }
}

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $course = Course::findOrFail($id);
            $user = $request->user();

            if (!$user || !$user->isInstructor() || $course->instructor_id !== $user->id) {
                return response()->json(['message' => 'Forbidden: you do not own this course'], 403);
            }

            $request->validate([
                'title'          => 'sometimes|required|string|max:255',
                'description'    => 'sometimes|required|string',
                'price'          => 'nullable|numeric',
                'level'          => 'nullable|string',
                'status'         => 'nullable|string',
                'category_id'    => 'sometimes|required|exists:categories,id',
                'duration'       => 'nullable|integer',
                'students_count' => 'nullable|integer',
                'rating'         => 'nullable|numeric|min:0|max:5',
                'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:4096',
            ]);

            // Handle thumbnail upload
            if ($request->hasFile('thumbnail_file')) {
                $fileService = app(\App\Services\FileService::class);
                if ($course->thumbnail) {
                    $fileService->delete($course->thumbnail, 'public');
                }
                $course->thumbnail = $fileService->upload($request->file('thumbnail_file'), 'thumbnails', 'public');
            }

            // Instructors cannot publish directly — only admins can approve
            $fields = $request->only(['title', 'description', 'price', 'level', 'status', 'category_id', 'duration', 'students_count', 'rating']);
            if (isset($fields['status']) && $fields['status'] === 'published' && $course->status !== 'published') {
                unset($fields['status']);
            }

            $course->fill($fields);
            $course->save();

            // Update outcomes if provided
            if ($request->has('outcomes') && is_array($request->outcomes)) {
                $course->outcomes()->delete();
                foreach ($request->outcomes as $index => $outcomeText) {
                    if (trim($outcomeText) !== '') {
                        Outcome::create([
                            'course_id'   => $course->id,
                            'description' => $outcomeText,
                            'order'       => $index,
                        ]);
                    }
                }
            }

            return response()->json([
                "message" => "Course updated successfully",
                "course"  => new CourseResource($course->load('outcomes', 'category'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to update course",
                "error"   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update course thumbnail.
     */
    public function updateThumbnail(Request $request, string $id)
    {
        try {
            $user = $request->user();
            $course = Course::findOrFail($id);
            $this->authorize('update', $course);

            $request->validate([
                'thumbnail_file' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);

            if (!$request->hasFile('thumbnail_file')) {
                return response()->json([
                    "message" => "No file uploaded"
                ], 400);
            }

            $fileService = app(\App\Services\FileService::class);

            // Delete old thumbnail if exists
            if ($course->thumbnail) {
                $fileService->delete($course->thumbnail, 'public');
            }

            // Upload new thumbnail
            $thumbnailPath = $fileService->upload(
                $request->file('thumbnail_file'),
                'courses/thumbnails',
                'public'
            );

            $course->update(['thumbnail' => $thumbnailPath]);

            return response()->json([
                "message" => "Thumbnail updated successfully",
                "thumbnail_url" => $fileService->getUrl($thumbnailPath, 'public')
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to update thumbnail",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        try {
            $user = $request->user();
            $course = Course::findOrFail($id);
            $this->authorize('delete', $course);

            // Delete thumbnail if exists
            if ($course->thumbnail) {
                $fileService = app(\App\Services\FileService::class);
                $fileService->delete($course->thumbnail, 'public');
            }

            $course->delete();

            return response()->json([
                "message" => "Course deleted successfully"
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to delete course",
                "error" => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/courses/{id}/publish
     * Instructors submit for review (draft/rejected → pending_review).
     * Instructors can unpublish (published → draft).
     */
    public function publish(Request $request, $id)
    {
        $user   = $request->user();
        $course = Course::findOrFail($id);

        if (!$user->isInstructor() || $course->instructor_id !== $user->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if ($course->status === 'published') {
            $course->status = 'draft';
            $message = 'Course moved to draft.';
        } elseif (in_array($course->status, ['draft', 'rejected'])) {
            $course->status = 'pending_review';
            $message = 'Course submitted for admin review.';
        } else {
            return response()->json(['message' => 'Invalid status transition'], 400);
        }

        $course->save();

        return response()->json([
            'message' => $message,
            'status'  => $course->status,
        ]);
    }
}

