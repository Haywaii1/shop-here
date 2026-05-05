<?php

use Illuminate\Mail\Mailable;

class OrderConfirmationMail extends Mailable
{
    public $order;

    public function __construct($order)
    {
        $this->order = $order;
    }

    public function build()
    {
        return $this->subject('Order Confirmation')
            ->view('emails.order-confirmation');
    }
}