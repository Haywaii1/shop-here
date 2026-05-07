<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CartController;



// 🔓 PUBLIC
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/register', [AuthController::class, 'adminRegister']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// 🔒 PROTECTED
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'me']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/filter', [ProductController::class, 'filter']);
Route::get('/products/{id}', [ProductController::class, 'show']);


Route::middleware(['auth:admin'])->prefix('admin')->group(function () {

    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{id}', [ProductController::class, 'show']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::post('/products/{id}/toggle-deal', [ProductController::class, 'toggleDeal']);

    Route::post('/products/{id}/variants', [ProductController::class, 'storeVariants']);
    Route::put('/variants/{id}', [ProductController::class, 'updateVariant']);
    Route::delete('/variants/{id}', [ProductController::class, 'deleteVariant']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/tree', [CategoryController::class, 'tree']);
    Route::get('/categories/{id}', [CategoryController::class, 'show']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    Route::get('/variants', [ProductController::class, 'allVariants']);
});


// Route::post('/orders', [OrderController::class, 'store']);

Route::middleware('auth:sanctum')->get('/orders', [OrderController::class, 'index']);
Route::middleware('auth:sanctum')->get('/orders/{order}', [OrderController::class, 'show']);
Route::middleware('auth:sanctum')->post('/orders', [OrderController::class, 'store']);
Route::middleware('auth:sanctum')->put('/orders/{id}/confirm-received', [OrderController::class, 'confirmReceived']);
// Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
//     Route::get('/orders', [OrderController::class, 'adminIndex']);
// });

Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::get('/orders', 'App\Http\Controllers\AdminOrderController@index');
    Route::put('/orders/{id}/status', 'App\Http\Controllers\AdminOrderController@updateStatus');
});

Route::middleware('auth:admin')->prefix('admin')->group(function () {
    Route::put('/orders/{id}/prepare', 'App\Http\Controllers\AdminOrderController@prepareShipment');
    Route::put('/orders/{id}/out-for-delivery', 'App\Http\Controllers\AdminOrderController@outForDelivery');
    Route::put('/orders/{id}/deliver', 'App\Http\Controllers\AdminOrderController@markDelivered');
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {


    Route::get('/categories', [CategoryController::class, 'index']);
});

Route::post('/payment/initialize', 'App\Http\Controllers\PaymentController@initialize');

Route::post('/payment/webhook', 'App\Http\Controllers\PaymentController@webhook');
Route::get('/payment/verify/{reference}', 'App\Http\Controllers\PaymentController@verify');


Route::get('/cart', [CartController::class, 'index']);
Route::post('/cart/add', [CartController::class, 'add']);
Route::put('/cart/update/{id}', [CartController::class, 'update']);
Route::delete('/cart/remove/{id}', [CartController::class, 'remove']);
Route::delete('/cart/clear', [CartController::class, 'clear']);

Route::get('/track-order/{tracking}', [OrderController::class, 'track']);

Route::get('/deals', [ProductController::class, 'deals']);
