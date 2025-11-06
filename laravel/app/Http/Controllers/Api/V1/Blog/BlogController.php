<?php

namespace App\Http\Controllers\Api\V1\Blog;

use App\Helpers\FileHelper;
use App\Http\Controllers\Api\V1\ApiBaseController;
use App\Http\Requests\Api\V1\Blog\BlogStoreRequest;
use App\Http\Requests\Api\V1\Blog\BlogUpdateRequest;
use App\Http\Resources\Api\V1\Blog\BlogCollection;
use App\Http\Resources\Api\V1\Blog\BlogDetailResource;
use App\Http\Resources\Api\V1\Blog\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;

class BlogController extends ApiBaseController
{
    public $resourceName = 'Blog';

    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 9);
        $page = $request->query('page', 1);
        $search = $request->query('q', null);
        $isOwner = $request->query('is_owner', null);
        $categoryId = $request->query('category_id', null);

        $blogs = Blog::query()
            ->when($search, function ($query) use ($search) {
                $query->where('title', 'like', "%{$search}%")
                    ->orWhere('content', 'like', "%{$search}%");
            })
            ->when($isOwner == true, function ($query) {
                $query->where('created_by', auth()->id());
            })
            ->when($categoryId, function ($query) use ($categoryId) {
                $query->where('category_id', $categoryId);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return $this->responseService->paginated(
            new BlogCollection($blogs),
            $this->resourceName,
        );
    }

    public function store(BlogStoreRequest $request)
    {
        try {
            $validated = $request->validated();

            $featuredImage = $request->file('featured_image');
            if ($featuredImage) {
                $upload = FileHelper::uploadFile(Blog::FEATURED_IMAGE_PATH, $featuredImage);

                $validated['featured_image'] = $upload->path;
            }

            $blog = Blog::create($validated);

            return $this->responseService->created(
                new BlogResource($blog),
                $this->resourceName,
            );
        } catch (\Throwable $th) {
            return $this->responseService->error(
                $th->getMessage(),
                $th
            );
        }
    }

    public function show(string $slug)
    {
        $blog = Blog::query()
            ->where('slug', $slug)
            ->firstOrFail();

        return $this->responseService->showed(
            new BlogDetailResource($blog),
            $this->resourceName,
        );
    }

    public function update(BlogUpdateRequest $request, string $slug)
    {
        try {
            $validated = $request->validated();

            $blog = Blog::query()
                ->where('slug', $slug)
                ->firstOrFail();

            if ($blog->created_by != auth()->id()) {
                return $this->responseService->forbidden(
                    'Anda tidak berhak mengupdate blog ini'
                );
            }

            $featuredImage = $request->file('featured_image');
            if ($featuredImage) {
                $upload = FileHelper::uploadFile(Blog::FEATURED_IMAGE_PATH, $featuredImage);

                $validated['featured_image'] = $upload->path;
            }

            $blog->update($validated);

            return $this->responseService->updated(
                new BlogResource($blog),
                $this->resourceName,
            );
        } catch (\Throwable $th) {
            return $this->responseService->error(
                $th->getMessage(),
                $th
            );
        }
    }

    public function destroy(string $slug)
    {
        try {
            $blog = Blog::query()
                ->where('slug', $slug)
                ->firstOrFail();

            if ($blog->created_by != auth()->id()) {
                return $this->responseService->forbidden(
                    'Anda tidak berhak menghapus blog ini'
                );
            }

            $blog->delete();

            return $this->responseService->deleted(
                $this->resourceName,
            );
        } catch (\Throwable $th) {
            return $this->responseService->error(
                $th->getMessage(),
                $th
            );
        }
    }
}
