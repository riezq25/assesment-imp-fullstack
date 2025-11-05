<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Requests\Api\V1\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends ApiBaseController
{
    public function __invoke(RegisterRequest $request)
    {
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            $user->markEmailAsVerified();

            return $this->responseService
                ->success(
                    null,
                    'Berhasil mendaftar, silahkan login.'
                );
        } catch (\Throwable $th) {
            return $this->responseService
                ->error($th->getMessage());
        }
    }
}
