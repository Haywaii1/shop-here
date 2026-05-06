<?php

namespace App\Http\Controllers;

use App\Mail\OrderShippedMail;
use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Services\SmsService;

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

            return response()->json($query->get());
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
                'message' => 'Order must be in preparation before delivery',
            ], 400);
        }

        $order->status = 'out_for_delivery';

        if (!$order->tracking_number) {
            $order->tracking_number = $this->generateTrackingNumber($order);
        }

        $this->applyStatusTimestamps($order, 'out_for_delivery');
        $order->save();
        $order->load('user');

        // ✅ Send SMS
        if (!empty($order->user->phone)) {
            SmsService::send(
                $order->user->phone,
                "Your order is out for delivery. Tracking ID: {$order->tracking_number}"
            );
        }

        try {
            if ($order->user?->email) {
                Mail::to($order->user->email)->send(new OrderShippedMail($order));
            }
        } catch (\Throwable $e) {
            Log::error('Order shipped email failed', [
                'order_id' => $order->id,
                'message' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'message' => 'Order is out for delivery',
            'order' => $order,
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
        return 'TRK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(6)) . '-' . $order->id;
    }

    public function destroy($id)
    {
        Order::findOrFail($id)->delete();

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
        Order::onlyTrashed()->findOrFail($id)->forceDelete();

        return response()->json([
            'message' => 'Order permanently deleted',
        ]);
    }
}
