<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

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

// Public routes for users
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

// Public routes for admins
Route::prefix('admin/auth')->group(function () {
    Route::post('/register', [AdminAuthController::class, 'register']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::get('/roles', [AdminAuthController::class, 'getRoles']);
});

// Protected routes for users
Route::middleware(['auth:sanctum', 'role.user'])->prefix('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
});

// Protected routes for admins
Route::middleware(['auth:sanctum', 'role.admin'])->prefix('admin/auth')->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);
    Route::post('/refresh', [AdminAuthController::class, 'refresh']);
});

// Test routes for authenticated users
Route::middleware(['auth:sanctum', 'role.user'])->group(function () {
    Route::get('/user/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to user dashboard',
            'user' => auth()->user()
        ]);
    });
});

// Test routes for authenticated admins
Route::middleware(['auth:sanctum', 'role.admin'])->group(function () {
    Route::get('/admin/dashboard', function () {
        return response()->json([
            'message' => 'Welcome to admin dashboard',
            'admin' => auth()->user()->load('role')
        ]);
    });
});

// Admin CRUD routes for products
Route::middleware(['auth:sanctum', 'role.admin'])->prefix('admin')->group(function () {
    Route::apiResource('products', ProductController::class);
});
