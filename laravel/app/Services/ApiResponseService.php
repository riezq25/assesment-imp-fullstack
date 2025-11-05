<?php

namespace App\Services;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Pagination\LengthAwarePaginator;
use Symfony\Component\HttpFoundation\Response;

class ApiResponseService
{
    public static function success(
        $data = null,
        string $message = 'Success',
        int $code = Response::HTTP_OK
    ): JsonResponse {
        $response = [
            'message' => $message,
        ];

        if ($data) {
            $response['data'] = $data;
        }

        return response()->json($response, $code);
    }

    public static function error(
        string $message = 'Error',
        $errors = null,
        int $code = Response::HTTP_INTERNAL_SERVER_ERROR
    ): JsonResponse {
        if ($errors) {
            $data = [
                'message' => $errors->getMessage() ?? $message,
            ];

            if (config('app.debug')) {
                $data['errors'] = [
                    'message' => $errors->getMessage() ?? $errors,
                    'line' => $errors->getLine() ?? null,
                    'file' => $errors->getFile() ?? null,
                    'trace' => $errors->getTrace() ?? null,
                ];
            }

            return response()
                ->json($data, $code);
        }

        return response()->json([
            'message' => $message,
        ], $code);
    }

    public static function paginated(
        LengthAwarePaginator|ResourceCollection $paginator,
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil diambil.';
        if ($resourceName) {
            $message = 'Berhasil mengambil data '.$resourceName.'.';
        }

        return response()->json([
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total_data' => $paginator->total(),
            ],
        ]);
    }

    public static function created(
        $data = null,
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil ditambahkan.';
        if ($resourceName) {
            $message = 'Berhasil menambahkan data '.$resourceName.'.';
        }

        return self::success($data, $message, RESPONSE::HTTP_CREATED);
    }

    public static function updated(
        $data = null,
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil diubah.';
        if ($resourceName) {
            $message = 'Berhasil mengubah data '.$resourceName.'.';
        }

        return self::success($data, $message);
    }

    public static function deleted(
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil dihapus.';
        if ($resourceName) {
            $message = 'Berhasil menghapus data '.$resourceName.'.';
        }

        return self::success(null, $message);
    }

    public static function retrieved(
        $data = null,
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil diambil.';
        if ($resourceName) {
            $message = 'Berhasil mengambil data '.$resourceName.'.';
        }

        return self::success($data, $message);
    }

    public static function showed(
        $data = null,
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data berhasil ditampilkan.';
        if ($resourceName) {
            $message = 'Berhasil menampilkan data '.$resourceName.'.';
        }

        return self::success($data, $message);
    }

    public static function notFound(
        string $id = 'Data not found',
        ?string $resourceName = null
    ): JsonResponse {
        $message = 'Data tidak ditemukan.';
        if ($resourceName) {
            $message = 'Tidak ditemukan data '.$resourceName.' dengan ID '.$id.'.';
        }

        return self::error($message, null, Response::HTTP_NOT_FOUND);
    }

    public static function unauthorized(
        string $message = 'Unauthorized'
    ): JsonResponse {
        return self::error(
            $message,
            null,
            Response::HTTP_UNAUTHORIZED
        );
    }

    public static function forbidden(
        string $message = 'Forbidden'
    ): JsonResponse {
        return self::error(
            $message,
            null,
            Response::HTTP_FORBIDDEN
        );
    }
}
