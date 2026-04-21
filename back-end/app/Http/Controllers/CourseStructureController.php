<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Services\CourseService;
use Illuminate\Http\Request;

class CourseStructureController extends Controller
{
    /**
     * @var CourseService
     */
    protected $courseService;

    /**
     * Inject CourseService.
     */
    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Store a newly created course (basic info + outcomes + thumbnail).
     * Sections and lessons are created separately via their own endpoints.
     *
     * @param StoreCourseRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreCourseRequest $request)
    {
        try {
            $user = $request->user();

            if (!$user || !$user->isInstructor()) {
                return response()->json([
                    'message' => 'Instructor profile not found',
                    'user' => $user
                ], 404);
            }

            // Get validated data
            $validated = $request->validated();

            // Merge thumbnail file
            if ($request->hasFile('thumbnail_file')) {
                $validated['thumbnail_file'] = $request->file('thumbnail_file');
            }

            // Create course with basic info and outcomes only
            $course = $this->courseService->createCourseWithOutcomes(
                $validated,
                $user->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'course' => $course,
                'course_id' => $course->id
            ], 201);
        } catch (\Illuminate\Auth\Access\AuthorizationException $e) {
            return response()->json([
                'message' => 'Forbidden',
                'error' => $e->getMessage()
            ], 403);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create course',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
