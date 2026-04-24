<?php

namespace App\Mail;

use App\Models\Course;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InstructorNotified extends Mailable
{
    use Queueable, SerializesModels;

    public Course $course;
    public Order  $order;

    public function __construct(Course $course, Order $order)
    {
        $this->course = $course;
        $this->order  = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 New Sale: ' . $this->course->title,
        );
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
