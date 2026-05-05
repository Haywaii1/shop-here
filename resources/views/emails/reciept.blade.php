<h2>🧾 Order Receipt</h2>

<p>Hello {{ $order->user->name }},</p>

<p>Thank you for your purchase!</p>

<hr>

<p><strong>Order Number:</strong> {{ $order->order_number }}</p>
<p><strong>Total:</strong> ₦{{ number_format($order->total) }}</p>
<p><strong>Status:</strong> {{ $order->status }}</p>

<hr>

<h4>Items:</h4>

<ul>
@foreach ($order->items as $item)
    <li>
        {{ $item->product->name }} 
        (x{{ $item->quantity }}) - ₦{{ number_format($item->price) }}
    </li>
@endforeach
</ul>

<p>We appreciate your business ❤️</p>