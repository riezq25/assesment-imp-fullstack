<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Resources\Api\V1\Blog\Category\CategoryCollection;
use App\Http\Resources\Api\V1\Blog\Category\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends ApiBaseController
{
    public $resourceName = 'Kategori Blog';

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $page = $request->query('page', 1);
        $search = $request->query('q', null);

        $blogCategories = Category::query()
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->withCount('blogs')
            ->orderBy('name', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        return $this->responseService
            ->paginated(
                new CategoryCollection($blogCategories),
                $this->resourceName,
            );
    }

    public function show(Category $blogCategory)
    {
        return $this->responseService->showed(
            new CategoryResource($blogCategory),
            $this->resourceName,
        );
    }
}
