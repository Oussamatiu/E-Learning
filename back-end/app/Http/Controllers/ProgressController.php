<?php

namespace App\Http\Controllers;

use App\Models\Enrollment;
use App\Models\Lesson;
use App\Models\LessonProgress;
use Illuminate\Http\Request;

class ProgressController extends Controller
{
    /**
     * Get all completed lesson IDs for the student in a course.
     * GET /api/courses/{courseId}/progress
     */
    public function index(Request $request, $courseId)
    {
        $user = $request->user();

        $completed = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('completed', true)
            ->pluck('lesson_id');

        // Total lessons in course (via sections)
        $totalLessons = Lesson::whereHas('section', fn($q) => $q->where('course_id', $courseId))->count();

        $progressPct = $totalLessons > 0
            ? round(($completed->count() / $totalLessons) * 100, 2)
            : 0;

        return response()->json([
            'completed_lessons' => $completed,
            'total_lessons'     => $totalLessons,
            'progress'          => $progressPct,
        ]);
    }

    /**
     * Mark a lesson as complete (or toggle off).
     * POST /api/courses/{courseId}/lessons/{lessonId}/progress
     */
    public function toggle(Request $request, $courseId, $lessonId)
    {
        $user = $request->user();

        // Verify enrollment
        $enrollment = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->first();

        if (!$enrollment) {
            return response()->json(['message' => 'You are not enrolled in this course'], 403);
        }

        // Verify lesson belongs to course
        $lesson = Lesson::whereHas('section', fn($q) => $q->where('course_id', $courseId))
            ->where('id', $lessonId)
            ->first();

        if (!$lesson) {
            return response()->json(['message' => 'Lesson not found in this course'], 404);
        }

        // Toggle: create or delete the progress record
        $existing = LessonProgress::where('user_id', $user->id)
            ->where('lesson_id', $lessonId)
            ->first();

        if ($existing) {
            $existing->delete();
            $completed = false;
        } else {
            LessonProgress::create([
                'user_id'      => $user->id,
                'lesson_id'    => $lessonId,
                'course_id'    => $courseId,
                'completed'    => true,
                'completed_at' => now(),
            ]);
            $completed = true;
        }

        // Recalculate and save progress percentage on the enrollment
        $totalLessons    = Lesson::whereHas('section', fn($q) => $q->where('course_id', $courseId))->count();
        $completedCount  = LessonProgress::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->where('completed', true)
            ->count();

        $progressPct = $totalLessons > 0
            ? round(($completedCount / $totalLessons) * 100, 2)
            : 0;

        $enrollment->update(['progress' => $progressPct]);

        return response()->json([
            'completed'      => $completed,
            'progress'       => $progressPct,
            'completed_count'=> $completedCount,
            'total_lessons'  => $totalLessons,
        ]);
    }
}
