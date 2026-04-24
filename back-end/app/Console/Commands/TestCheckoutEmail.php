<?php

namespace App\Console\Commands;

use App\Events\CoursePurchased;
use App\Models\Order;
use Illuminate\Console\Command;

class TestCheckoutEmail extends Command
{
    protected $signature   = 'mail:test-checkout {orderId}';
    protected $description = 'Fire CoursePurchased event to test full email pipeline';

    public function handle(): void
    {
        $orderId = $this->argument('orderId');
        $order   = Order::with('orderItems.course.instructor')->find($orderId);

        if (!$order) {
            $this->error("Order #{$orderId} not found.");
            return;
        }

        $this->info("Firing CoursePurchased for Order #{$order->id}...");

        event(new CoursePurchased($order));

        $this->info('Done — check your inbox!');
    }
}
