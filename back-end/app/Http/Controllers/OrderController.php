<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Enrollment;
use App\Models\Course;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'course_ids' => 'required|array',
            'course_ids.*' => 'required|exists:courses,id',
        ]);

        $user = $request->user();
        $courseIds = $request->course_ids;

        $courses = Course::whereIn('id', $courseIds)
            ->where('status', 'published')
            ->get();

        if ($courses->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'No valid courses found'
            ], 400);
        }

        $alreadyOwned = Enrollment::where('user_id', $user->id)
            ->whereIn('course_id', $courseIds)
            ->pluck('course_id');

        if ($alreadyOwned->isNotEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Already owned'
            ], 422);
        }

        try {
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

            $session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'mode' => 'payment',

                'line_items' => $courses->map(function ($course) {
                    return [
                        'price_data' => [
                            'currency' => 'usd',
                            'product_data' => [
                                'name' => $course->title,
                            ],
                            'unit_amount' => $course->price * 100,
                        ],
                        'quantity' => 1,
                    ];
                })->values()->toArray(),

                'success_url' => 'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => 'http://localhost:5173/cart',

                // metadata للـ session (اختياري)
                'metadata' => [
                    'user_id' => $user->id,
                ],

                // هذا هو المهم فعلاً
                'payment_intent_data' => [
                    'metadata' => [
                        'user_id' => $user->id,
                        'courses' => json_encode($courseIds),
                    ],
                ],
            ]);

            return response()->json([
                'success' => true,
                'url' => $session->url
            ]);

        } catch (\Exception $e) {
            Log::error('Stripe error: ' . $e->getMessage());

            return response()->json([
                'success' => false
            ], 500);
        }
    }
   public function paymentStatus(Request $request)
{
    try {
        $user = $request->user();
        $sessionId = $request->query('session_id');

        if (!$sessionId) {
            return response()->json(['success' => false]);
        }

        $order = Order::where('stripe_session_id', $sessionId)
            ->where('user_id', $user->id)
            ->first();

        return response()->json([
            'success' => $order && $order->status === 'completed'
        ]);

    } catch (\Exception $e) {
        Log::error($e->getMessage());

        return response()->json([
            'success' => false
        ], 500);
    }
}
}