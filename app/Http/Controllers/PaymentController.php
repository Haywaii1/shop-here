<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Throwable;
use App\Services\SmsService;

class PaymentController extends Controller
{
    public function initialize(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'amount' => 'required|numeric',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.variant_id' => 'nullable|exists:product_variants,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $draft = $this->buildDraftFromItems($request->items, auth()->id(), $request->email);

            if ((float) $draft['amount'] !== (float) $request->amount) {
                return response()->json([
                    'message' => 'Order total mismatch',
                ], 400);
            }

            $paymentReference = 'PAY_' . Str::uuid()->toString();

            Cache::put(
                $this->draftCacheKey($paymentReference),
                $draft,
                now()->addHours(6)
            );

            $response = $this->paystackRequest(false)->post(
                rtrim(config('services.paystack.payment_url'), '/') . '/transaction/initialize',
                [
                    'email' => $request->email,
                    'amount' => $draft['amount'] * 100,
                    'reference' => $paymentReference,
                    'callback_url' => config('services.paystack.callback_url'),
                    'metadata' => [
                        'payment_reference' => $paymentReference,
                        'user_id' => auth()->id(),
                        'payment_method' => 'paystack',
                    ],
                ]
            );

            if (!$response->successful()) {
                Cache::forget($this->draftCacheKey($paymentReference));

                Log::warning('Paystack Init Upstream Error', [
                    'status' => $response->status(),
                    'body' => $response->json() ?? $response->body(),
                ]);

                return response()->json(
                    $response->json() ?: ['message' => 'Payment initialization failed'],
                    $response->status()
                );
            }

            return response()->json($response->json(), $response->status());
        } catch (ConnectionException $e) {
            Log::error('Paystack Init Connection Error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to reach Paystack right now. Check your internet connection or SSL/cURL setup and try again.',
            ], 502);
        } catch (\Exception $e) {
            if ($this->isTransportError($e)) {
                Log::error('Paystack Init Connection Error', [
                    'message' => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Unable to reach Paystack right now. Check your internet connection or SSL/cURL setup and try again.',
                ], 502);
            }

            Log::error('Paystack Init Error', [
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Payment initialization failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function verify($reference)
    {
        try {
            $response = $this->paystackRequest()
                ->get(rtrim(config('services.paystack.payment_url'), '/') . "/transaction/verify/{$reference}");

            $data = $response->json();

            if (
                !$response->ok()
                || !($data['status'] ?? false)
                || ($data['data']['status'] ?? null) !== 'success'
            ) {
                return response()->json(['message' => 'Payment failed'], 400);
            }

            $order = $this->finalizeSuccessfulPayment($reference, ($data['data']['amount'] ?? 0) / 100);

            return response()->json([
                'message' => 'Payment verified',
                'order' => $order,
            ]);
        } catch (ConnectionException $e) {
            Log::error('Payment Verify Connection Error', [
                'reference' => $reference,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Unable to reach Paystack right now. Please try verification again shortly.',
            ], 502);
        } catch (\Throwable $e) {
            if ($this->isTransportError($e)) {
                Log::error('Payment Verify Connection Error', [
                    'reference' => $reference,
                    'message' => $e->getMessage(),
                ]);

                return response()->json([
                    'message' => 'Unable to reach Paystack right now. Please try verification again shortly.',
                ], 502);
            }

            Log::error('Payment Verify Error', [
                'reference' => $reference,
                'message' => $e->getMessage(),
            ]);

            return response()->json([
                'message' => 'Payment verification failed',
            ], 500);
        }
    }

    public function webhook(Request $request)
    {
        $signature = $request->header('x-paystack-signature');
        $secret = env('PAYSTACK_SECRET_KEY');

        if ($signature !== hash_hmac('sha512', $request->getContent(), $secret)) {
            return response()->json(['message' => 'Invalid signature'], 401);
        }

        $event = $request->all();

        if (($event['event'] ?? null) !== 'charge.success') {
            return response()->json(['message' => 'Event ignored']);
        }

        $data = $event['data'] ?? null;

        if (!$data) {
            return response()->json(['message' => 'Invalid payload'], 400);
        }

        $reference = $data['reference'] ?? null;

        if (!$reference) {
            return response()->json(['message' => 'Missing payment reference'], 400);
        }

        try {
            $order = $this->finalizeSuccessfulPayment($reference, ($data['amount'] ?? 0) / 100);

            Log::info('Payment processed', [
                'reference' => $reference,
                'order_id' => $order->id,
            ]);

            return response()->json(['message' => 'Order updated']);
        } catch (\Throwable $e) {
            Log::error('Webhook failed', [
                'reference' => $reference,
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Error processing'], 500);
        }
    }

    private function buildDraftFromItems(array $items, int $userId, string $email): array
    {
        $amount = 0;
        $lineItems = [];

        foreach ($items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $variant = null;

            if (!empty($item['variant_id'])) {
                $variant = ProductVariant::findOrFail($item['variant_id']);
            }

            $price = $variant ? $variant->price : $product->price;
            $stock = $variant ? $variant->stock : $product->stock;

            if ($stock < $item['quantity']) {
                abort(400, "{$product->name} is out of stock");
            }

            $lineItems[] = [
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => (int) $item['quantity'],
                'price' => (float) $price,
            ];

            $amount += $price * $item['quantity'];
        }

        return [
            'user_id' => $userId,
            'email' => $email,
            'payment_method' => 'paystack',
            'amount' => (float) $amount,
            'items' => $lineItems,
        ];
    }

    private function finalizeSuccessfulPayment(string $reference, float $amountPaid): Order
    {
        $order = DB::transaction(function () use ($reference, $amountPaid) {
            $existingOrder = Order::with('items.product')
                ->where('payment_reference', $reference)
                ->lockForUpdate()
                ->first();

            if ($existingOrder) {
                if ($existingOrder->status === 'paid') {
                    return $existingOrder;
                }

                throw new \RuntimeException('Order exists in invalid payment state.');
            }

            $draft = Cache::get($this->draftCacheKey($reference));

            if (!$draft) {
                throw new \RuntimeException('Payment draft not found or expired.');
            }

            if ((float) $draft['amount'] !== (float) $amountPaid) {
                throw new \RuntimeException('Amount mismatch');
            }

            $order = Order::create([
                'user_id' => $draft['user_id'],
                'order_number' => 'ORD-' . strtoupper(uniqid()),
                'total' => $draft['amount'],
                'status' => 'paid',
                'payment_method' => $draft['payment_method'],
                'payment_reference' => $reference,
                'paid_at' => now(),
                'tracking_number' => null,
            ]);

            foreach ($draft['items'] as $lineItem) {
                $product = Product::lockForUpdate()->findOrFail($lineItem['product_id']);
                $variant = $lineItem['product_variant_id']
                    ? ProductVariant::lockForUpdate()->findOrFail($lineItem['product_variant_id'])
                    : null;

                if ($variant) {
                    $variant->decrement('stock', $lineItem['quantity']);
                } else {
                    $product->decrement('stock', $lineItem['quantity']);
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $lineItem['product_id'],
                    'product_variant_id' => $lineItem['product_variant_id'],
                    'quantity' => $lineItem['quantity'],
                    'price' => $lineItem['price'],
                ]);
            }

            return $order->fresh(['items.product', 'user']);
        });

        Cache::forget($this->draftCacheKey($reference));

        try {
            if ($order->user?->email) {
                Mail::to($order->user->email)->send(new OrderConfirmationMail($order));
            }
        } catch (\Throwable $e) {
            Log::error('Order confirmation email failed', [
                'order_id' => $order->id,
                'reference' => $reference,
                'message' => $e->getMessage(),
            ]);
        }

        if ($order->user && !empty($order->user->phone)) {
            try {
                if ($order->user && !empty($order->user->phone)) {
                    SmsService::send(
                        $order->user->phone,
                        "Your order {$order->order_number} has been confirmed. We will notify you when it's shipped."
                    );
                }
            } catch (\Throwable $e) {
                Log::error('SMS failed', [
                    'order_id' => $order->id,
                    'phone' => $order->user->phone ?? null,
                    'message' => $e->getMessage(),
                ]);
            }
        }

        return $order;
    }

    private function draftCacheKey(string $reference): string
    {
        return "paystack_checkout_draft:{$reference}";
    }

    private function paystackRequest(bool $withRetry = true)
    {
        $curlOptions = [];
        $verifySsl = (bool) config('services.paystack.verify_ssl', true);

        if (defined('CURLOPT_SSLVERSION') && defined('CURL_SSLVERSION_TLSv1_2')) {
            $curlOptions[CURLOPT_SSLVERSION] = CURL_SSLVERSION_TLSv1_2;
        }

        $request = Http::withToken(config('services.paystack.secret_key'))
            ->acceptJson()
            ->timeout(30)
            ->connectTimeout(15)
            ->withOptions([
                'verify' => $verifySsl,
                'proxy' => [
                    'http' => '',
                    'https' => '',
                    'no' => ['127.0.0.1', 'localhost'],
                ],
                'curl' => $curlOptions,
            ]);

        if ($withRetry) {
            $request = $request->retry(2, 500);
        }

        return $request;
    }

    private function isTransportError(Throwable $e): bool
    {
        $message = strtolower($e->getMessage());

        return str_contains($message, 'curl error')
            || str_contains($message, 'ssl_read')
            || str_contains($message, 'connection reset')
            || str_contains($message, 'could not connect')
            || str_contains($message, 'timed out');
    }
}
