<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;


class OrderReceipt extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    // ✅ PASS ORDER DATA
    public function __construct($order)
    {
        $this->order = $order;
    }

    // ✅ SUBJECT
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Order Receipt',
        );
    }

    // ✅ VIEW
    public function content(): Content
    {
        return new Content(
            view: 'emails.receipt',
            with: [
                'order' => $this->order
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}