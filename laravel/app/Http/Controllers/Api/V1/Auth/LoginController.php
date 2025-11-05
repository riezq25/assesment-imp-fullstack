<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\Api\V1\Auth\Login\LoginResource;
use Illuminate\Support\Facades\Auth;

class LoginController extends ApiBaseController
{
    public function __invoke(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            return $this->responseService
                ->success(
                    new LoginResource($user),
                    'Berhasil login'
                );
        }

        return $this->responseService->unauthorized('Username atau password salah');
    }
}
