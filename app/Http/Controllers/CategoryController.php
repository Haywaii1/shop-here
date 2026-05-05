<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{

    // Show all categories
    public function index()
    {
        $categories = Category::with('parent')->latest()->get();

        return response()->json($categories);
    }


    // Store new category
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id
        ]);

        return response()->json([
            'message' => 'Category created successfully',
            'category' => $category
        ]);
    }


    // Show single category
    public function show($id)
    {
        $category = Category::with('children')->findOrFail($id);

        return response()->json($category);
    }


    // Update category
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        $category->update([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id
        ]);

        return response()->json([
            'message' => 'Category updated successfully'
        ]);
    }


    // Delete category
    public function destroy($id)
    {
        $category = Category::findOrFail($id);

        $category->delete();

        return response()->json([
            'message' => 'Category deleted successfully'
        ]);
    }


    // Get full category tree (for sidebar)
    public function tree()
    {
        $categories = Category::with('childrenRecursive')
            ->whereNull('parent_id')
            ->get();

        return response()->json($categories);
    }

}