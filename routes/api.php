<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CodeController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BrandController;
use App\Http\Controllers\ColorController;
use App\Http\Controllers\FrameController;
use App\Http\Controllers\StockController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::get('logout',[AuthController::class,'logout']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('admin')->group(function () {
        Route::apiResource('/users', UserController::class)->except(['show', 'update']);
    });
});
// Brands Routes
Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('brands', [BrandController::class, 'index']);
    Route::post('brands', [BrandController::class, 'store'])->middleware('admin');
    Route::get('brands/{brand}', [BrandController::class, 'show']);
    Route::put('brands/{brand}', [BrandController::class, 'update'])->middleware('admin');
    Route::delete('brands/{brand}', [BrandController::class, 'destroy'])->middleware('admin');
});

// Codes Routes
Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('codes', [CodeController::class, 'index']);
    Route::post('codes', [CodeController::class, 'store'])->middleware('admin');
    Route::get('codes/{code}', [CodeController::class, 'show']);
    Route::put('codes/{code}', [CodeController::class, 'update'])->middleware('admin');
    Route::delete('codes/{code}', [CodeController::class, 'destroy'])->middleware('admin');
});

// Colors Routes
Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('colors', [ColorController::class, 'index']);
    Route::post('colors', [ColorController::class, 'store'])->middleware('admin');
    Route::get('colors/{color}', [ColorController::class, 'show']);
    Route::put('colors/{color}', [ColorController::class, 'update'])->middleware('admin');
    Route::delete('colors/{color}', [ColorController::class, 'destroy'])->middleware('admin');
});

// Frames Routes
Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('frames', [FrameController::class, 'index']);
    Route::post('frames', [FrameController::class, 'store'])->middleware('admin');
    Route::get('frames/{frame}', [FrameController::class, 'show']);
    Route::post('frames/{frame}', [FrameController::class, 'update'])->middleware('admin');
    Route::delete('frames/{frame}', [FrameController::class, 'destroy'])->middleware('admin');
    Route::get('top-frames-by-stock-reduction', [FrameController::class, 'topFramesByStockReduction']);
});

// Stocks Routes
Route::middleware(['auth:sanctum'])->group(function() {
    Route::get('stocks', [StockController::class, 'index']);
    Route::post('stocks', [StockController::class, 'store'])->middleware('admin');
    Route::get('stocks/{stock}', [StockController::class, 'show']);
    Route::put('stocks/{stock}', [StockController::class, 'update'])->middleware('admin');
    Route::delete('stocks/{stock}', [StockController::class, 'destroy'])->middleware('admin');
    Route::get('/frames/{frameId}/stock-history', [StockController::class, 'getStockHistory']);

});


Route::post('login',[AuthController::class,'login']);
Route::post('register',[AuthController::class,'register']);
Route::get('hello', function () {
    return response()->json(['message' => 'Hello World ,App Works!...']);
});
Route::get('top-frames-by-stock-reduction', [FrameController::class, 'topFramesByStockReduction']);
Route::get('/frames/{frameId}/stock-history', [StockController::class, 'getStockHistory']);