<?php

namespace App\Http\Controllers;

use App\Models\Outcome;
use App\Models\Course;
use Illuminate\Http\Request;

class OutcomeController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $courseId)
    {
        try {
            $user = $request->user();

            $course = Course::findOrFail($courseId);

            if ($user->id !== $course->instructor->user_id) {
                return response()->json([
                    'message' => 'Forbidden: You do not own this course'
                ], 403);
            }

            $request->validate([
                'description' => 'required|string',
                'order' => 'nullable|integer',
            ]);

            $outcome = Outcome::create([
                'course_id' => $courseId,
                'description' => $request->description,
                'order' => $request->order ?? 0,
            ]);

            return response()->json([
                'message' => 'Course outcome created successfully',
                'outcome' => $outcome
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create course outcome',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $courseId, $outcomeId)
    {
        try {
            $user = $request->user();

            $outcome = Outcome::where('id', $outcomeId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $course = $outcome->course;

            if ($user->id !== $course->instructor->user_id) {
                return response()->json([
                    'message' => 'Forbidden: You do not own this course'
                ], 403);
            }

            $request->validate([
                'description' => 'sometimes|required|string',
                'order' => 'nullable|integer',
            ]);

            $outcome->update($request->only(['description', 'order']));

            return response()->json([
                'message' => 'Course outcome updated successfully',
                'outcome' => $outcome
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update course outcome',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $courseId, $outcomeId)
    {
        try {
            $user = $request->user();

            $outcome = Outcome::where('id', $outcomeId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $course = $outcome->course;

            if ($user->id !== $course->instructor->user_id) {
                return response()->json([
                    'message' => 'Forbidden: You do not own this course'
                ], 403);
            }

            $outcome->delete();

            return response()->json([
                'message' => 'Course outcome deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete course outcome',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
