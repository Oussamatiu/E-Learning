<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Enrollment;
use App\Models\Course;
use App\Events\CoursePurchased;
use Stripe\Stripe;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        Stripe::setApiKey(env('STRIPE_SECRET'));
        
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');
        $payload = @file_get_contents('php://input');
        $sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

        $event = null;

        try {
            $event = Webhook::constructEvent(
                $payload, $sig_header, $endpoint_secret
            );
        } catch(\UnexpectedValueException $e) {
            // Invalid payload
            Log::error('Stripe webhook error: Invalid payload');
            return response('', 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            Log::error('Stripe webhook error: Invalid signature');
            return response('', 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $this->handlePaymentIntentSucceeded($paymentIntent);
        }

        return response()->json(['status' => 'success']);
    }

    private function handlePaymentIntentSucceeded($paymentIntent)
    {
        $metadata = $paymentIntent->metadata;
        
        if (!isset($metadata->user_id) || !isset($metadata->courses)) {
            Log::error('Stripe webhook error: Missing metadata in PaymentIntent ' . $paymentIntent->id);
            return;
        }

        $userId = $metadata->user_id;
        $courseIds = json_decode($metadata->courses, true);

        if (!$courseIds || !is_array($courseIds)) {
            Log::error('Stripe webhook error: Invalid courses metadata');
            return;
        }

        $courses = Course::whereIn('id', $courseIds)->get();
        if ($courses->isEmpty()) return;

        $totalPrice = $courses->sum('price');

        // Check if order already exists to prevent duplicate webhooks processing
        $existingOrder = Order::where('user_id', $userId)
                              ->where('price', $totalPrice)
                              ->where('status', 'completed')
                              ->whereHas('orderItems', function($q) use ($courseIds) {
                                  $q->whereIn('course_id', $courseIds);
                              })->first();
                              
        if ($existingOrder) {
            Log::info("Stripe webhook: Order already processed for Intent " . $paymentIntent->id);
            return;
        }

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id'   => $userId,
                'course_id' => $courses->first()->id, // satisfies FK based on old logic
                'price'     => $totalPrice,
                'status'    => 'completed',
            ]);

            foreach ($courses as $course) {
                OrderItem::create([
                    'order_id'  => $order->id,
                    'course_id' => $course->id,
                    'price'     => $course->price,
                ]);

                Enrollment::firstOrCreate([
                    'user_id'   => $userId,
                    'course_id' => $course->id,
                ], [
                    'progress' => 0,
                ]);
            }
           
            DB::commit();

            $order->load('orderItems.course.instructor');
            event(new CoursePurchased($order));
            
            Log::info("Stripe webhook: Successfully processed order {$order->id}");

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Stripe webhook DB error: ' . $e->getMessage());
        }
    }
}
