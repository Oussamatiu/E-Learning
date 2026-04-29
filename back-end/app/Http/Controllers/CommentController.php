<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * GET /api/courses/{courseId}/comments
     * Public — list all comments for a course with user info.
     */
    public function index(string $courseId)
    {
        $comments = Comment::with(['user:id,name'])
            ->select('comments.*')
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->select('rating')
                    ->whereColumn('ratings.user_id', 'comments.user_id')
                    ->whereColumn('ratings.course_id', 'comments.course_id');
            }, 'user_rating')
            ->where('course_id', $courseId)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json([
            'data' => $comments->items(),
            'meta' => [
                'current_page' => $comments->currentPage(),
                'last_page'    => $comments->lastPage(),
                'per_page'     => $comments->perPage(),
                'total'        => $comments->total(),
            ],
        ]);
    }

    /**
     * POST /api/courses/{courseId}/comments
     * Protected — only enrolled users can comment.
     */
    public function store(Request $request, string $courseId)
    {
        $request->validate([
            'content' => 'required|string|min:1|max:2000',
        ]);

        $userId = $request->user()->id;

        $enrolled = Enrollment::where('user_id', $userId)
            ->where('course_id', $courseId)
            ->exists();

        if (!$enrolled) {
            return response()->json(['message' => 'You must be enrolled to comment'], 403);
        }

        $comment = Comment::create([
            'user_id'   => $userId,
            'course_id' => $courseId,
            'content'   => $request->input('content'),
        ]);

        return response()->json([
            'message' => 'Comment posted',
            'comment' => $comment->load('user:id,name'),
        ], 201);
    }
}
