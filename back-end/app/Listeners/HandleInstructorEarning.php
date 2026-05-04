<?php

namespace App\Listeners;

use App\Events\CoursePurchased;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HandleInstructorEarning implements ShouldQueue
{
    use InteractsWithQueue;

    // ✅ أضف هذين السطرين فقط
    public $tries = 1;
    public $maxExceptions = 1;

    private const INSTRUCTOR_SHARE = 0.70;

    public function __construct() {}

    public function handle(CoursePurchased $event): void
    {
        $order = \App\Models\Order::with('orderItems.course.instructor')
            ->findOrFail($event->order->id);

        foreach ($order->orderItems as $item) {
            $course     = $item->course;
            $instructor = $course?->instructor;

            if (!$instructor) {
                Log::warning("HandleInstructorEarning: course {$course?->id} has no instructor. Skipping.");
                continue;
            }

            $earning = round($item->price * self::INSTRUCTOR_SHARE, 2);

            try {
                DB::transaction(function () use ($instructor, $order, $course, $earning) {

                    $alreadyProcessed = WalletTransaction::where('user_id', $instructor->id)
                        ->where('order_id', $order->id)
                        ->where('type', 'credit')
                        ->exists();

                    if ($alreadyProcessed) {
                        Log::info("HandleInstructorEarning: already credited instructor {$instructor->id} for order {$order->id}. Skipping.");
                        return;
                    }

                    $wallet = Wallet::firstOrCreate(
                        ['user_id' => $instructor->id],
                        ['balance' => 0]
                    );

                    WalletTransaction::create([
                        'user_id'     => $instructor->id,
                        'order_id'    => $order->id,
                        'amount'      => $earning,
                        'type'        => 'credit',
                        'description' => "Sale: {$course->title} (Order #{$order->id})",
                    ]);

                    $wallet->credit($earning);

                    Log::info("HandleInstructorEarning: credited \${$earning} to instructor {$instructor->id} for course {$course->title}.");
                });

            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                Log::warning("HandleInstructorEarning: duplicate transaction blocked for instructor {$instructor->id}, order {$order->id}.");
            } catch (\Exception $e) {
                Log::error("HandleInstructorEarning: failed for instructor {$instructor->id} — " . $e->getMessage());
                // ✅ لا ترمي الـ exception لأنه بيسبب retry
                // throw $e; ← احذف هذا
            }
        }
    }

    public function failed(CoursePurchased $event, \Throwable $exception): void
    {
        Log::error("HandleInstructorEarning JOB FAILED for order {$event->order->id}: " . $exception->getMessage());
    }
}