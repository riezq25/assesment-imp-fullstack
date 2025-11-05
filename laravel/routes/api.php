<?php

use App\Http\Controllers\Api\V1\Auth\LoginController;
use Illuminate\Http\Request;
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
    });
});
