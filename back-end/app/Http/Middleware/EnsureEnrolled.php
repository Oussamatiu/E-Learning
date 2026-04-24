<?php

namespace App\Http\Middleware;

use App\Models\Enrollment;
use Closure;
use Illuminate\Http\Request;

class EnsureEnrolled
{
    /**
     * Block access to course learning routes if the user has no Enrollment record.
     * This is the ONLY security gate — frontend cannot bypass this.
     */
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated. Please login to access this course.',
            ], 401);
        }

        $courseId = $request->route('courseId') ?? $request->route('id') ?? $request->route('course');

        if (!$courseId) {
            return response()->json(['message' => 'Course not specified.'], 400);
        }

        $enrolled = Enrollment::where('user_id', $user->id)
            ->where('course_id', $courseId)
            ->exists();

        if (!$enrolled) {
            return response()->json([
                'message'  => 'Access denied. You must purchase this course to access it.',
                'enrolled' => false,
            ], 403);
        }

        return $next($request);
    }
}
