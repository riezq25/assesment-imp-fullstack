<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use App\Http\Controllers\Api\V1\Auth\LogoutController;
use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Controllers\Api\V1\Auth\RegisterController;
use App\Http\Controllers\Api\V1\Blog\CategoryController;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => 'v1',
    'as' => 'api.v1.'
], function () {
    Route::group([
        'prefix' => 'auth',
        'as' => 'auth.',
    ], function () {
        Route::post('/login', LoginController::class)->name('login');
        Route::post('/register', RegisterController::class)->name('register');

        Route::middleware('auth:sanctum')
            ->group(function () {
                Route::delete('/logout', LogoutController::class)->name('logout');
                Route::get('/profile', ProfileController::class)->name('profile');
            });
    });

    Route::middleware('auth:sanctum')
        ->group(function () {
            Route::apiResource(
                'blog-categories',
                CategoryController::class
            )
                ->only([
                    'index',
                    'show'
                ]);
        });
});
