<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\User;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json([
            'stats' => [
                'total_users' => User::count(),
                'total_courses' => Course::count(),
                'published_courses' => Course::where('status', 'published')->count(),
                'pending_courses' => Course::where('status', 'pending_review')->count(),
                'total_orders' => Order::count(),
                'total_revenue' => Payment::where('status', 'completed')->sum('amount'),
                'total_enrollments' => Enrollment::count(),
            ],
        ]);
    }

    public function courses(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $status = $request->query('status');
        $query = Course::with(['instructor:id,name', 'category:id,name'])
            ->orderBy('created_at', 'desc');

        if ($status) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(20));
    }

    public function approveCourse(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $course = Course::findOrFail($id);
        $course->update(['status' => 'published']);

        return response()->json(['message' => 'Course approved', 'course' => $course]);
    }

    public function rejectCourse(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $course = Course::findOrFail($id);
        $course->update(['status' => 'rejected']);

        return response()->json(['message' => 'Course rejected', 'course' => $course]);
    }

    public function users(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            User::with('role:id,title')
                ->orderBy('created_at', 'desc')
                ->paginate(20)
        );
    }

    public function toggleUserStatus(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json(['message' => 'Cannot suspend admin'], 403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'message' => $user->is_active ? 'User activated' : 'User suspended',
            'user' => $user,
        ]);
    }

    public function payments(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(
            Payment::with(['order.user:id,name'])
                ->orderBy('created_at', 'desc')
                ->paginate(20)
        );
    }

    public function deleteCourse(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $course = Course::findOrFail($id);
        $course->delete();

        return response()->json(['message' => 'Course deleted']);
    }
}
