<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Stripe\Webhook;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Course;
use App\Models\Enrollment;
use App\Events\CoursePurchased;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $endpointSecret = env('STRIPE_WEBHOOK_SECRET');

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                $endpointSecret
            );
        } catch (\Exception $e) {
            return response('Invalid', 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $this->handlePayment($event->data->object);
        }

        return response('OK', 200);
    }

    private function handlePayment($paymentIntent)
    {
        $metadata = $paymentIntent->metadata;

        $userId = $metadata['user_id'] ?? null;
        $courseIds = isset($metadata['courses'])
            ? json_decode($metadata['courses'], true)
            : null;

        if (!$userId || !$courseIds) {
            Log::error('Missing metadata: ' . $paymentIntent->id);
            return;
        }

        if (Order::where('stripe_payment_intent_id', $paymentIntent->id)->exists()) {
            return;
        }

        $courses = Course::whereIn('id', $courseIds)->get();

        if ($courses->isEmpty()) {
            Log::error('Courses not found');
            return;
        }

        DB::beginTransaction();

        try {
            $total = $courses->sum('price');

            $order = Order::create([
                'user_id' => $userId,
                'price' => $total,
                'status' => 'completed',
                'stripe_payment_intent_id' => $paymentIntent->id,
                'payment_method' => $paymentIntent->payment_method ?? 'card',
            ]);

            foreach ($courses as $course) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'price' => $course->price,
                ]);

                Enrollment::firstOrCreate([
                    'user_id' => $userId,
                    'course_id' => $course->id,
                ], [
                    'progress' => 0,
                    'enrolled_at' => now(),
                ]);
            }

            DB::commit();

            event(new CoursePurchased($order));

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage());
        }
    }
}