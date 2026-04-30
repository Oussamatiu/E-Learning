<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Stripe\Webhook;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
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

        if (Payment::where('transaction_id', $paymentIntent->id)->exists()) {
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
            ]);

            Payment::create([
                'order_id' => $order->id,
                'amount' => $total,
                'provider' => 'stripe',
                'status' => 'completed',
                'transaction_id' => $paymentIntent->id,
                'payment_method' => $paymentIntent->payment_method ?? null,
                'payment_method_type' => $paymentIntent->payment_method_types[0] ?? 'card',
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