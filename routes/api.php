<?php

use App\Http\Controllers\LinkApiController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('/links')->middleware('auth:sanctum')->group(function () {
    Route::post('/sync', [LinkApiController::class, 'sync'])->name('api.links.sync');
    Route::post('/', [LinkApiController::class, 'store'])->name('api.links.store');
    Route::get('/', [LinkApiController::class, 'index'])->name('api.links.index');
    Route::get('/{id}', [LinkApiController::class, 'show'])->name('api.links.show');
});

Route::post('/login', function (Request $request) {

    $validated = $request->validate([
        'email' => 'required',
        'password' => 'required',
    ]);

    if (!Auth::attempt($validated)) {
        return response()->json([
            'message' => 'User not found'
        ], 401);
    }

    $user = User::where('email', $validated['email'])->firstOrFail();
    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'access_token' => $token,
        'token_type' => 'Bearer'
    ]);
});
