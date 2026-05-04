<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InstructorNotified extends Mailable
{
    use Queueable, SerializesModels;

    public array $courses;
    public Order  $order;

    public function __construct(array $courses, Order $order)
    {
        $this->courses = $courses;
        $this->order  = $order;
    }

    public function envelope(): Envelope
    {
        $count = count($this->courses);
        $subject = $count === 1
            ? '🎉 New Sale: ' . $this->courses[0]->title
            : "🎉 New Sales: {$count} courses purchased";

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.instructor',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
