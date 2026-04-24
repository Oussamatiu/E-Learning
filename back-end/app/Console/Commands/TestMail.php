<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestMail extends Command
{
    protected $signature   = 'mail:test {email}';
    protected $description = 'Send a test email to verify SMTP config';

    public function handle(): void
    {
        $email = $this->argument('email');
        Mail::raw('✅ LearnTrack SMTP is working correctly!', function ($m) use ($email) {
            $m->to($email)->subject('LearnTrack - SMTP Test');
        });
        $this->info("Test email sent to {$email}");
    }
}
