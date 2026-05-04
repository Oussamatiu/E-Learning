<?php

namespace App\Providers;

use App\Events\CoursePurchased;
use App\Listeners\HandleInstructorEarning;
use App\Listeners\SendEmailToInstructor;

use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        
        Event::listen(CoursePurchased::class, SendEmailToInstructor::class);   
        Event::listen(CoursePurchased::class, HandleInstructorEarning::class); 
    }
}
