<h2>Order Confirmed 🎉</h2>

<p>Order #: {{ $order->order_number }}</p>
<p>Total: ₦{{ number_format($order->total, 2) }}</p>

<h3>Items:</h3>
<ul>
@foreach($order->items as $item)
    <li>{{ $item->product->name }} x {{ $item->quantity }}</li>
@endforeach
</ul>

<p><strong>Estimated Delivery:</strong> {{ now()->addDays(3)->format('D, M j') }}</p>

<p>Thank you for your purchase!</p>