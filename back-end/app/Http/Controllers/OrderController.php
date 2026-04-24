<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Enrollment;
use App\Models\Course;
use App\Events\CoursePurchased;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'courses'     => 'required|array',
            'courses.*.id' => 'required|exists:courses,id',
        ]);

        $user      = $request->user();
        $courseIds = collect($request->courses)->pluck('id')->toArray();
        $courses   = Course::whereIn('id', $courseIds)->get();

        if ($courses->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid courses found.'
            ], 400);
        }

        // Prevent buying a course the student already owns
        $alreadyOwned = Enrollment::where('user_id', $user->id)
            ->whereIn('course_id', $courseIds)
            ->pluck('course_id');

        if ($alreadyOwned->isNotEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'You already own one or more of these courses.',
                'owned_course_ids' => $alreadyOwned,
            ], 422);
        }

        $totalPrice = $courses->sum('price');

        try {
            DB::beginTransaction();

            // Create Order
            $order = Order::create([
                'user_id'   => $user->id,
                'course_id' => $courses->first()->id, // satisfies FK
                'price'     => $totalPrice,
                'status'    => 'completed',
            ]);

            foreach ($courses as $course) {
                // Create Order Item
                OrderItem::create([
                    'order_id'  => $order->id,
                    'course_id' => $course->id,
                    'price'     => $course->price,
                ]);

                // Enroll student
                Enrollment::firstOrCreate([
                    'user_id'   => $user->id,
                    'course_id' => $course->id,
                ], [
                    'progress' => 0,
                ]);
            }

            DB::commit();

            // Load items + course + instructor so the listener can use them
            $order->load('orderItems.course.instructor');

            // Fire event → SendEmailToInstructor listener will send the email
            event(new CoursePurchased($order));

            return response()->json([
                'success' => true,
                'message' => 'Checkout successful',
                'order'   => $order,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Checkout failed. Please try again later.'
            ], 500);
        }
    }
}
