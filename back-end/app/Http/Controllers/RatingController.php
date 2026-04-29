<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * POST /api/courses/{courseId}/rate
     * Create or update a rating. Only enrolled users.
     */
    public function rate(Request $request, string $courseId)
    {
        $request->validate([
            'rating' => 'required|integer|between:1,5',
        ]);

        $userId = $request->user()->id;

        $enrolled = Enrollment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->exists();

        if (!$enrolled) {
            return response()->json(['message' => 'You must be enrolled to rate'], 403);
        }

        $ratingValue = (int) $request->input('rating');

        Rating::updateOrCreate(
            ['user_id' => $userId, 'course_id' => $courseId],
            ['rating' => $ratingValue]
        );

        $avg = Rating::where('course_id', $courseId)->avg('rating');

        Course::where('id', $courseId)->update([
            'rating' => round($avg, 2),
        ]);

        $count = Rating::where('course_id', $courseId)->count();

        return response()->json([
            'message'     => 'Rating saved',
            'rating'      => $ratingValue,
            'average'     => round($avg, 2),
            'total_count' => $count,
        ]);
    }
}
