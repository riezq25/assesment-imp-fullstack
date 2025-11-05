<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\Blog\BlogCollection;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends ApiBaseController
{
    public $resourceName = 'Blog';

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);
        $search = $request->query('q', null);

        $blogs = Blog::query()
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return $this->responseService->paginated(
            new BlogCollection($blogs),
            $this->resourceName,
        );
    }

    public function store(Request $request)
    {
        //
    }

    public function show(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        //
    }

    public function destroy(string $id)
    {
        //
    }
}
