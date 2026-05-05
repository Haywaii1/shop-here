<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;

class ReviewController extends Controller
{

    /*
    -------------------------
    GET PRODUCT REVIEWS
    -------------------------
    */

    public function index($productId)
    {

        $reviews = Review::with('user')
            ->where('product_id',$productId)
            ->latest()
            ->get();

        return response()->json($reviews);

    }


    /*
    -------------------------
    ADD REVIEW
    -------------------------
    */

    public function store(Request $request)
    {

        $request->validate([
            'product_id'=>'required|exists:products,id',
            'rating'=>'required|integer|min:1|max:5',
            'comment'=>'nullable|string'
        ]);

        $review = Review::create([
            'user_id'=>auth()->id(),
            'product_id'=>$request->product_id,
            'rating'=>$request->rating,
            'comment'=>$request->comment
        ]);

        return response()->json([
            'message'=>'Review added successfully',
            'review'=>$review
        ]);

    }

}