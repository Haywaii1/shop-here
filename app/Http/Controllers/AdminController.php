<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Category;

class AdminController extends Controller
{
    public function dashboard()
    {
        $products = Product::count();
        $categories = Category::count();
        $variants = ProductVariant::count();

        // ✅ Handle null stock + ensure integer comparison
        $lowStock = ProductVariant::whereNotNull('stock')
            ->where('stock', '<', 5)
            ->count();

        return response()->json([
            'products' => $products,
            'categories' => $categories,
            'variants' => $variants,
            'low_stock' => $lowStock,
        ]);
    }
}