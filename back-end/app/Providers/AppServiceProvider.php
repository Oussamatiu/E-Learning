<?php

namespace App\Providers;

use App\Events\CoursePurchased;
use App\Listeners\HandleInstructorEarning;
use App\Listeners\SendEmailToInstructor;
use App\Models\Outcome;
use App\Policies\OutcomePolicy;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        // Register event → listeners
        Event::listen(CoursePurchased::class, SendEmailToInstructor::class);   // sync email
        Event::listen(CoursePurchased::class, HandleInstructorEarning::class); // queued wallet credit
    }
}
