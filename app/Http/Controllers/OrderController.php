<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Order;
use App\Models\OrderItem;
use Carbon\Carbon;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::with([
            'user:id,name,email',
            'items.product.images',
        ])
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function show(Request $request, Order $order)
    {
        abort_if($order->user_id !== $request->user()->id, 403);

        $order->load([
            'user:id,name,email',
            'items.product.images',
        ]);

        return response()->json($order);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|string|in:card,transfer,paystack'
        ]);

        return DB::transaction(function () use ($request) {
            $total = 0;
            $lineItems = [];

            foreach ($request->items as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                $variant = null;

                if (!empty($item['variant_id'])) {
                    $variant = ProductVariant::lockForUpdate()->findOrFail($item['variant_id']);
                }

                $price = $variant ? $variant->price : $product->price;
                $stock = $variant ? $variant->stock : $product->stock;

                if ($stock < $item['quantity']) {
                    abort(400, "{$product->name} is out of stock");
                }

                $lineItems[] = [
                    'product_id' => $product->id,
                    'product_variant_id' => $variant?->id,
                    'quantity' => $item['quantity'],
                    'price' => $price
                ];

                $total += $price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => auth()->id() ?? 1,
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total' => 0,
                'status' => 'pending',
                'payment_method' => $request->payment_method
            ]);

            foreach ($lineItems as $lineItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $lineItem['product_id'],
                    'product_variant_id' => $lineItem['product_variant_id'],
                    'quantity' => $lineItem['quantity'],
                    'price' => $lineItem['price']
                ]);
            }

            $order->update([
                'total' => $total
            ]);

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product')
            ]);
        });
    }
    public function confirmReceived($id)
    {
        $order = Order::where('user_id', auth()->id())->findOrFail($id);

        if (!in_array($order->status, ['out_for_delivery', 'delivered'])) {
            return response()->json([
                'message' => 'Order is not ready to be confirmed'
            ], 400);
        }

        $order->status = 'received';

        // ✅ mark as delivered + received time
        $order->delivered_at = $order->delivered_at ?? now();

        $order->save();

        return response()->json([
            'message' => 'Order confirmed as received',
            'order' => $order
        ]);
    }

    public function applyStatusTimestamps(Order $order, $status)
    {
        switch ($status) {
            case 'received':
                $order->paid_at = $order->paid_at ?? Carbon::now();
                break;

            case 'preparing':
                $order->preparing_at = Carbon::now();
                break;

            case 'shipped':
            case 'out_for_delivery':
                $order->shipped_at = Carbon::now();
                break;

            case 'delivered':
                $order->delivered_at = Carbon::now();
                break;
        }
    }
}
