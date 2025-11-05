<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Resources\Api\V1\Auth\ProfileResource;
use Illuminate\Http\Request;

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
