<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
    <h2>Order Confirmed</h2>

    <p>Hi {{ $order->user->name ?? 'Customer' }},</p>

    <p>Your order has been successfully placed.</p>

    <h3>Order Details</h3>
    <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
    <p><strong>Total Paid:</strong> N{{ number_format($order->total, 2) }}</p>
    <p><strong>Payment Method:</strong> {{ ucfirst($order->payment_method) }}</p>
    <p><strong>Date:</strong> {{ $order->paid_at }}</p>

    <h3>Items</h3>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse: collapse; width: 100%;">
        <thead>
            <tr>
                <th align="left">Product</th>
                <th align="left">Qty</th>
                <th align="left">Price</th>
            </tr>
        </thead>
        <tbody>
        @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product->name }}</td>
                <td>{{ $item->quantity }}</td>
                <td>N{{ number_format($item->price, 2) }}</td>
            </tr>
        @endforeach
        </tbody>
    </table>

    <h3>Delivery Info</h3>
    <p><strong>Estimated Delivery:</strong> {{ optional($order->estimated_delivery_at)->format('M d, Y') ?? '2-5 days' }}</p>

    <p><strong>Tracking ID:</strong> {{ $order->tracking_number ?? 'Will be available once shipped' }}</p>

    @if($order->tracking_number)
        <p>
            Track your order here:
            <a href="{{ url('/track-order/' . $order->tracking_number) }}">
                {{ url('/track-order/' . $order->tracking_number) }}
            </a>
        </p>
    @endif

    <p>Thanks for shopping with us.<br>{{ config('app.name') }}</p>
</div>
