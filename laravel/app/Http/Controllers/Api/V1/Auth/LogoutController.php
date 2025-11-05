<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\LoginRequest;
use App\Http\Resources\Api\V1\Auth\Login\LoginResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LogoutController extends ApiBaseController
{
    public function __invoke(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return $this->responseService->success(null, 'Berhasil logout');
    }
}
