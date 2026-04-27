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
            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

            $paymentIntent = \Stripe\PaymentIntent::create([
                'amount' => max(50, round($totalPrice * 100)), // minimum 50 cents, amount in cents
                'currency' => 'usd',
                'metadata' => [
                    'user_id' => $user->id,
                    'courses' => json_encode($courseIds),
                ],
            ]);

            return response()->json([
                'success' => true,
                'clientSecret' => $paymentIntent->client_secret
            ]);

        } catch (\Exception $e) {
            Log::error('Stripe PaymentIntent error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to initialize payment. Please try again later.'
            ], 500);
        }
    }
}
