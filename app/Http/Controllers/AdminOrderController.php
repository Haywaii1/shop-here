<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class AdminOrderController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Order::with('items.product', 'user')->latest();

            if ($request->has('with_trashed')) {
                $query->withTrashed();
            }

            if ($request->has('only_trashed')) {
                $query->onlyTrashed();
            }

            $orders = $query->get();

            return response()->json($orders);
        } catch (\Throwable $e) {
            Log::error('Admin Orders Error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch orders',
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string',
        ]);

        $order = Order::findOrFail($id);
        $order->status = $request->status;

        $this->applyStatusTimestamps($order, $request->status);
        $order->save();

        return response()->json([
            'message' => 'Order updated',
            'order' => $order,
        ]);
    }

    public function prepareShipment($id)
    {
        $order = Order::findOrFail($id);

        if (!in_array($order->status, ['paid', 'payment_confirmed'], true)) {
            return response()->json([
                'message' => 'Only paid orders can be prepared for shipment',
            ], 400);
        }

        $order->status = 'preparing_shipment';
        $this->applyStatusTimestamps($order, 'preparing_shipment');
        $order->save();

        return response()->json([
            'message' => 'Preparing shipment',
            'order' => $order->fresh(),
        ]);
    }

    public function outForDelivery(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'preparing_shipment') {
            return response()->json([
                'message' => 'Order must be in preparation before delivery'
            ], 400);
        }

        $order->status = 'out_for_delivery';

        // ✅ generate tracking ONLY here
        if (!$order->tracking_number) {
            $order->tracking_number = $this->generateTrackingNumber($order);
        }

        $this->applyStatusTimestamps($order, 'out_for_delivery');

        $order->save();

        return response()->json([
            'message' => 'Order is out for delivery',
            'order' => $order
        ]);
    }

    public function markDelivered($id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'out_for_delivery') {
            return response()->json([
                'message' => 'Order must be out for delivery first',
            ], 400);
        }

        $order->status = 'delivered';
        $this->applyStatusTimestamps($order, 'delivered');
        $order->save();

        return response()->json([
            'message' => 'Order delivered',
            'order' => $order,
        ]);
    }

    private function applyStatusTimestamps(Order $order, string $status): void
    {
        switch ($status) {
            case 'paid':
            case 'payment_confirmed':
                $order->paid_at = $order->paid_at ?? Carbon::now();
                break;

            case 'preparing_shipment':
                $order->preparing_at = Carbon::now();
                break;

            case 'out_for_delivery':
                $order->shipped_at = Carbon::now();
                break;

            case 'delivered':
                $order->delivered_at = Carbon::now();
                break;
        }
    }

    private function generateTrackingNumber(Order $order): string
    {
        return 'TRK-' . strtoupper(Str::random(4)) . '-' . str_pad((string) $order->id, 6, '0', STR_PAD_LEFT);
    }

    public function destroy($id)
    {
        $order = Order::findOrFail($id);
        $order->delete();

        return response()->json([
            'message' => 'Order moved to trash',
        ]);
    }

    public function restore($id)
    {
        $order = Order::onlyTrashed()->findOrFail($id);
        $order->restore();

        return response()->json([
            'message' => 'Order restored',
            'order' => $order,
        ]);
    }

    public function forceDelete($id)
    {
        $order = Order::onlyTrashed()->findOrFail($id);
        $order->forceDelete();

        return response()->json([
            'message' => 'Order permanently deleted',
        ]);
    }
}
