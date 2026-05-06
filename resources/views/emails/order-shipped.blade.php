<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
    <h2>Your Order Is On The Way</h2>

    <p>Hi {{ $order->user->name ?? 'Customer' }},</p>

    <p>Good news. Your order is now <strong>out for delivery</strong>.</p>

    <h3>Order Info</h3>
    <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
    <p><strong>Tracking ID:</strong> {{ $order->tracking_number }}</p>

    <p>Please be available to receive your package.</p>

    <p>
        Track your order here:
        <a href="{{ url('/track-order/' . $order->tracking_number) }}">
            {{ url('/track-order/' . $order->tracking_number) }}
        </a>
    </p>

    <p>Thanks,<br>{{ config('app.name') }}</p>
</div>
