<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\Api\V1\Auth\Login\LoginResource;
use App\Http\Resources\Api\V1\Auth\ProfileResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends ApiBaseController
{
    public function __invoke(Request $request)
    {
        return $this->responseService->showed(
            new ProfileResource($request->user()),
            'Profile',
        );
    }
}
