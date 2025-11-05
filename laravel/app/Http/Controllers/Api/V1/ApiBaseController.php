<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ApiResponseService;

class ApiBaseController extends Controller
{
    protected $responseService;

    public function __construct()
    {
        $this->responseService = new ApiResponseService;
    }
}
