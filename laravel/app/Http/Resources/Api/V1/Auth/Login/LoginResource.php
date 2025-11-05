<?php

namespace App\Http\Resources\Api\V1\Auth\Login;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LoginResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = $this->resource;
        $token = $user->createToken('api')->plainTextToken;

        return [
            'user' => $user->only('id', 'name', 'email', 'avatar'),
            'token' => $token,
        ];
    }
}
