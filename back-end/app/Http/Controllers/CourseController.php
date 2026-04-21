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
            $query = Course::with('instructor', 'category');

            if ($request->has('search')) {
                $search = $request->search;
                $query->where('title', 'like', "%{$search}%")
                      ->orWhereHas('instructor.user', function($q) use ($search) {
                          $q->where('name', 'like', "%{$search}%");
                      });
            }

            if ($request->has('category')) {
                $query->whereHas('category', function($q) use ($request) {
                    $q->where('name', $request->category);
                });
            }

            $courses = $query->get();
            return response()->json(CourseResource::collection($courses), 200);
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

            if (!$user || $user->role?->title !== 'instructor') {
                return response()->json([
                    'message' => 'Forbidden: instructor access required'
                ], 403);
            }

            $instructor = $user->instructor;
            if (!$instructor) {
                return response()->json([
                    'message' => 'Instructor profile not found'
                ], 404);
            }

            $courses = Course::with('instructor', 'category')
                ->where('instructor_id', $instructor->id)
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

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $course = Course::with(['instructor.instructorProfile', 'category', 'outcomes', 'sections.lessons'])->findOrFail($id);

            return response()->json([
                'data' => new CourseResource($course)
            ], 200);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Course not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch course',
                'error' => $e->getMessage()
            ], 500);
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
            $user = $request->user();
            $course = Course::findOrFail($id);
            $this->authorize('update', $course);

            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'price' => 'nullable|numeric',
                'level' => 'nullable|string',
                'status' => 'nullable|string',
                'category_id' => 'sometimes|required|exists:categories,id',
                'image' => 'nullable|string',
                'duration' => 'nullable|integer',
                'students_count' => 'nullable|integer',
                'rating' => 'nullable|numeric|min:0|max:5',
                'thumbnail' => 'nullable|string',
            ]);

            $course->update($request->only(['title', 'description', 'price', 'level', 'status', 'category_id', 'image', 'duration', 'students_count', 'rating', 'thumbnail']));

            // Update course outcomes if provided
            if ($request->has('outcomes') && is_array($request->outcomes)) {
                // Delete existing outcomes
                $course->outcomes()->delete();

                // Create new outcomes
                foreach ($request->outcomes as $index => $outcomeText) {
                    Outcome::create([
                        'course_id' => $course->id,
                        'description' => $outcomeText,
                        'order' => $index,
                    ]);
                }
            }

            return response()->json([
                "message" => "Course updated successfully",
                "course" => new CourseResource($course->load('outcomes'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                "message" => "Failed to update course",
                "error" => $e->getMessage()
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
}
