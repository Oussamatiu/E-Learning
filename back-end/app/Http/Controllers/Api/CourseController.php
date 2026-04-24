<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCourseRequest;
use App\Services\CourseService;
use Illuminate\Http\JsonResponse;

class CourseController extends Controller
{
    protected $courseService;

    public function __construct(CourseService $courseService)
    {
        $this->courseService = $courseService;
    }

    /**
     * Store a newly created course with all related entities.
     *
     * @param StoreCourseRequest $request
     * @return JsonResponse
     */
    public function store(StoreCourseRequest $request): JsonResponse
    {
        try {
            $course = $this->courseService->createFullCourse(
                $request->validated(),
                $request->user()->id
            );

            return response()->json([
                'success' => true,
                'message' => 'Course created successfully',
                'data' => $course
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create course',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing course with all related entities.
     *
     * @param StoreCourseRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(StoreCourseRequest $request, int $id): JsonResponse
    {
        try {
            $course = \App\Models\Course::findOrFail($id);

            $updated = $this->courseService->updateFullCourse(
                $course,
                $request->validated()
            );

            return response()->json([
                'success' => true,
                'message' => 'Course updated successfully',
                'data'    => $updated
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update course',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}