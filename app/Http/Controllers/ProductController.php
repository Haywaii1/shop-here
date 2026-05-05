<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\ProductImage;
use App\Models\ProductVariant;

class ProductController extends Controller
{

    public function index()
    {
        $products = Product::with(['category', 'images', 'variants'])->latest()->get();
        return response()->json($products);
    }

    public function allVariants()
    {
        return ProductVariant::with('product')->latest()->get();
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'category_id' => 'required|exists:categories,id',
            'price' => 'required|numeric',
            'description' => 'nullable|string',
            'images.*' => 'image|mimes:jpg,jpeg,png'
        ]);

        // Generate slug
        $slug = Str::slug($request->name);
        $count = Product::where('slug', 'like', "$slug%")->count();

        if ($count > 0) {
            $slug = $slug . '-' . ($count + 1);
        }

        // ✅ Create product (NO image columns anymore)
        $product = Product::create([
            'name' => $request->name,
            'slug' => $slug,
            'category_id' => $request->category_id,
            'price' => $request->price,
            'description' => $request->description
        ]);

        // ✅ Save images into product_images table
        if ($request->hasFile('images')) {

            foreach ($request->file('images') as $index => $image) {

                $path = $image->store('products', 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'image_path' => $path,
                    'is_main' => $index === 0 // first image = main
                ]);
            }
        }

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product->load('images')
        ]);
    }


   
    public function storeVariants(Request $request, $productId)
    {

        foreach ($request->variants as $variant) {

            if (isset($variant['id'])) {

                // update existing variant
                $existing = ProductVariant::find($variant['id']);

                if ($existing) {
                    $existing->update([
                        'sku' => $variant['sku'],
                        'color' => $variant['color'],
                        'size' => $variant['size'],
                        'storage' => $variant['storage'],
                        'price' => $variant['price'],
                        'stock' => $variant['stock']
                    ]);
                }
            } else {

                // create new variant
                ProductVariant::create([
                    'product_id' => $productId,
                    'sku' => $variant['sku'],
                    'color' => $variant['color'],
                    'size' => $variant['size'],
                    'storage' => $variant['storage'],
                    'price' => $variant['price'],
                    'stock' => $variant['stock']
                ]);
            }
        }

        return response()->json([
            'message' => 'Variants saved successfully'
        ]);
    }

    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);

        return response()->json($product);
    }


    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $product->update([
            'name' => $request->name,
            'price' => $request->price,
            'category_id' => $request->category_id,
            'description' => $request->description
        ]);

        return response()->json([
            'product' => $product
        ]);
    }

    public function updateVariant(Request $request, $id)
    {
        $variant = ProductVariant::findOrFail($id);

        $variant->update([
            'sku' => $request->sku,
            'color' => $request->color,
            'size' => $request->size,
            'storage' => $request->storage,
            'price' => $request->price,
            'stock' => $request->stock
        ]);

        return response()->json([
            'variant' => $variant
        ]);
    }


    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        // delete variants
        $product->variants()->delete();

        // delete images
        $product->images()->delete();

        $product->delete();

        return response()->json([
            'message' => 'Product deleted'
        ]);
    }

    public function deleteVariant($id)
    {
        $variant = ProductVariant::findOrFail($id);

        $variant->delete();

        return response()->json([
            'message' => 'Variant deleted'
        ]);
    }


    public function byCategory($categoryId)
    {
        $products = Product::where('category_id', $categoryId)->get();

        return response()->json($products);
    }

    public function filter(Request $request)
    {
        $query = Product::with(['images', 'variants']);

        // Filter by category
        if ($request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by price range
        if ($request->min_price) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price', '<=', $request->max_price);
        }

        // Filter by variant color
        if ($request->color) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('color', $request->color);
            });
        }

        // Filter by storage
        if ($request->storage) {
            $query->whereHas('variants', function ($q) use ($request) {
                $q->where('storage', $request->storage);
            });
        }

        $products = $query->get();

        return response()->json($products);
    }
}
