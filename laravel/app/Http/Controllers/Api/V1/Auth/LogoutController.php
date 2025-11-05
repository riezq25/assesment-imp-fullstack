<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\ApiBaseController;
use Illuminate\Http\Request;

class LogoutController extends ApiBaseController
{
    public function __invoke(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->responseService->success(null, 'Berhasil logout');
    }
}
