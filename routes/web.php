<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\PaymentController;


Route::delete('/products/{id}', [ProductController::class, 'destroy']);

// Route::get('/category-products/{categoryId}', [ProductController::class, 'byCategory']);
Route::get('/products/filter', [ProductController::class, 'filter']);

// Route::get('/cart', [CartController::class, 'index']);
// Route::post('/cart/add', [CartController::class, 'add']);
// Route::put('/cart/update/{id}', [CartController::class, 'update']);
// Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
// Route::delete('/cart/clear', [CartController::class, 'clear']);

Route::post('/checkout', [CheckoutController::class, 'checkout']);

Route::get('/reviews/{productId}',[ReviewController::class,'index']);
Route::post('/reviews',[ReviewController::class,'store']);


Route::get('/', function () {
    return view('welcome');
});

/* React Catch-All Route (MUST BE LAST) */
Route::get('/{any}', function () {
    return view('app');
})->where('any', '^(?!api|storage|sanctum).*$');