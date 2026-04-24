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

    /**
     * Instructor's cut (70% of course price).
     */
    private const INSTRUCTOR_SHARE = 0.70;

    public function __construct() {}

    public function handle(CoursePurchased $event): void
    {
        // Always re-fetch from DB to ensure relations are fresh after unserialization
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

                    // ── Idempotency check ──────────────────────────────────
                    // If a credit transaction already exists for this instructor + order, skip.
                    $alreadyProcessed = WalletTransaction::where('user_id', $instructor->id)
                        ->where('order_id', $order->id)
                        ->where('type', 'credit')
                        ->exists();

                    if ($alreadyProcessed) {
                        Log::info("HandleInstructorEarning: already credited instructor {$instructor->id} for order {$order->id}. Skipping.");
                        return;
                    }

                    // ── Get or create wallet ───────────────────────────────
                    $wallet = Wallet::firstOrCreate(
                        ['user_id' => $instructor->id],
                        ['balance' => 0]
                    );

                    // ── Record transaction ─────────────────────────────────
                    WalletTransaction::create([
                        'user_id'     => $instructor->id,
                        'order_id'    => $order->id,
                        'amount'      => $earning,
                        'type'        => 'credit',
                        'description' => "Sale: {$course->title} (Order #{$order->id})",
                    ]);

                    // ── Increment balance atomically ───────────────────────
                    $wallet->credit($earning);

                    Log::info("HandleInstructorEarning: credited \${$earning} to instructor {$instructor->id} for course {$course->title}.");
                });

            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // Race condition: another worker already processed this — safe to ignore
                Log::warning("HandleInstructorEarning: duplicate transaction blocked for instructor {$instructor->id}, order {$order->id}.");
            } catch (\Exception $e) {
                Log::error("HandleInstructorEarning: failed for instructor {$instructor->id} — " . $e->getMessage());
                throw $e; // Re-throw so the queue marks the job as failed
            }
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(CoursePurchased $event, \Throwable $exception): void
    {
        Log::error("HandleInstructorEarning JOB FAILED for order {$event->order->id}: " . $exception->getMessage());
    }
}
