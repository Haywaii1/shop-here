<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{

    public function checkout(Request $request)
    {

        $request->validate([
            'payment_method' => 'required|string',
            'shipping_address' => 'required|string'
        ]);

        $cart = Cart::with(['items.product','items.variant'])
            ->where('session_id', session()->getId())
            ->first();

        if(!$cart || $cart->items->count() == 0){
            return response()->json([
                'message' => 'Cart is empty'
            ],400);
        }

        DB::beginTransaction();

        try{

            $total = 0;

            foreach($cart->items as $item){

                $price = $item->variant
                    ? $item->variant->price
                    : $item->product->price;

                $total += $price * $item->quantity;

            }

            /*
            ---------------------------
            CREATE ORDER
            ---------------------------
            */

            $order = Order::create([
                'user_id' => auth()->id(),
                'order_number' => 'ORD-'.Str::upper(Str::random(10)),
                'total' => $total,
                'status' => 'pending',
                'payment_method' => $request->payment_method
            ]);

            /*
            ---------------------------
            CREATE ORDER ITEMS
            ---------------------------
            */

            foreach($cart->items as $item){

                $price = $item->variant
                    ? $item->variant->price
                    : $item->product->price;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'variant_id' => $item->variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price
                ]);

                /*
                ---------------------------
                REDUCE STOCK
                ---------------------------
                */

                if($item->variant){

                    $item->variant->decrement('stock',$item->quantity);

                }else{

                    $item->product->decrement('stock',$item->quantity);

                }

            }

            /*
            ---------------------------
            CLEAR CART
            ---------------------------
            */

            $cart->items()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order->load('items.product')
            ]);

        }catch(\Exception $e){

            DB::rollBack();

            return response()->json([
                'message' => 'Checkout failed',
                'error' => $e->getMessage()
            ],500);

        }

    }

}