<?php

namespace App\Listeners;

use App\Events\CoursePurchased;
use App\Mail\InstructorNotified;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEmailToInstructor implements ShouldQueue
{
    use InteractsWithQueue;

    // ✅ محاولة واحدة فقط
    public $tries = 1;
    public $maxExceptions = 1;

    public function __construct() {}

    public function handle(CoursePurchased $event): void
    {
        $order = $event->order->load('orderItems.course.instructor');

        // ✅ تحقق إذا الـ email اتبعت قبل كده
        $cacheKey = 'instructor_email_sent_order_' . $order->id;
        if (cache()->has($cacheKey)) {
            Log::info("SendEmailToInstructor: email already sent for order {$order->id}. Skipping.");
            return;
        }

        $byInstructor = [];
        foreach ($order->orderItems as $item) {
            $course     = $item->course;
            $instructor = $course?->instructor;

            if (!$instructor || !$instructor->email) {
                Log::warning("CoursePurchased: no instructor email for course ID " . ($course?->id));
                continue;
            }

            $email = $instructor->email;
            if (!isset($byInstructor[$email])) {
                $byInstructor[$email] = [
                    'instructor' => $instructor,
                    'courses'    => [],
                ];
            }
            $byInstructor[$email]['courses'][] = $course;
        }

        foreach ($byInstructor as $email => $data) {
            Mail::to($email)
                ->send(new InstructorNotified($data['courses'], $order));

            $courseTitles = collect($data['courses'])->pluck('title')->implode(', ');
            Log::info("CoursePurchased: email sent to {$email} for courses: {$courseTitles}");
        }

        // ✅ سجل إن الـ email اتبعت
        cache()->put($cacheKey, true, now()->addHours(24));
    }

    public function failed(CoursePurchased $event, \Throwable $exception): void
    {
        Log::error("SendEmailToInstructor FAILED for order {$event->order->id}: " . $exception->getMessage());
    }
}