<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;

class CartController extends Controller
{

    /*
    -------------------------
    GET CART
    -------------------------
    */

    public function index(Request $request)
    {
        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('session_id', session()->getId())
            ->first();

        if (!$cart) {
            return response()->json(['items' => [], 'total' => 0]);
        }

        $total = $cart->items->sum(function ($item) {
            return ($item->final_price ?? $item->price) * $item->quantity;
        });

        return response()->json([
            'cart' => $cart,
            'total' => $total
        ]);
    }

    /*
    -------------------------
    ADD TO CART
    -------------------------
    */

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::with('variants')->findOrFail($request->product_id);

        $variant = null;
        $stock = $product->stock ?? 0;
        $price = $product->price;

        // ✅ If variant exists
        if ($request->variant_id) {
            $variant = $product->variants->where('id', $request->variant_id)->first();

            if (!$variant) {
                return response()->json(['message' => 'Variant not found'], 404);
            }

            $stock = $variant->stock;
            $price = $variant->price ?? $product->price;
        }

        // 🚫 STOCK CHECK
        if ($stock <= 0) {
            return response()->json([
                'message' => 'Product is out of stock'
            ], 400);
        }

        if ($request->quantity > $stock) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }

        // 💸 DISCOUNT (example logic)
        $discountPercent = $product->discount_percent ?? 0;
        $finalPrice = $price;

        if ($discountPercent > 0) {
            $finalPrice = $price - ($price * $discountPercent / 100);
        }

        $cart = Cart::firstOrCreate([
            'session_id' => session()->getId()
        ]);

        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('variant_id', $request->variant_id)
            ->first();

        if ($item) {

            // 🚫 Prevent exceeding stock
            if (($item->quantity + $request->quantity) > $stock) {
                return response()->json([
                    'message' => 'Exceeds available stock'
                ], 400);
            }

            $item->increment('quantity', $request->quantity);
        } else {

            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'variant_id' => $request->variant_id,
                'quantity' => $request->quantity,

                // ✅ SAVE SNAPSHOT
                'price' => $price,
                'final_price' => $finalPrice,
                'discount_percent' => $discountPercent
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart'
        ]);
    }

    /*
    -------------------------
    UPDATE CART ITEM
    -------------------------
    */

    public function update(Request $request, $id)
    {

        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $item = CartItem::findOrFail($id);

        $item->update([
            'quantity' => $request->quantity
        ]);

        return response()->json([
            'message' => 'Cart updated'
        ]);
    }

    /*
    -------------------------
    REMOVE ITEM
    -------------------------
    */

    public function remove($id)
    {

        $item = CartItem::findOrFail($id);

        $item->delete();

        return response()->json([
            'message' => 'Item removed'
        ]);
    }

    /*
    -------------------------
    CLEAR CART
    -------------------------
    */

    public function clear()
    {

        $cart = Cart::where('session_id', session()->getId())->first();

        if ($cart) {

            $cart->items()->delete();
        }

        return response()->json([
            'message' => 'Cart cleared'
        ]);
    }
}
