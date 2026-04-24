<?php

namespace App\Listeners;

use App\Events\CoursePurchased;
use App\Mail\InstructorNotified;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendEmailToInstructor
{
    public function __construct() {}

    public function handle(CoursePurchased $event): void
    {
        // Reload order with all needed relations to be safe
        $order = $event->order->load('orderItems.course.instructor');

        foreach ($order->orderItems as $item) {
            $course     = $item->course;
            $instructor = $course?->instructor;

            if (!$instructor || !$instructor->email) {
                Log::warning("CoursePurchased: no instructor email for course ID " . ($course?->id));
                continue;
            }

            Mail::to($instructor->email)
                ->send(new InstructorNotified($course, $order));

            Log::info("CoursePurchased: email sent to {$instructor->email} for course {$course->title}");
        }
    }
}
