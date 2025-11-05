<?php

namespace App\Http\Resources\Api\V1\Blog;

use App\Http\Controllers\Api\V1\Auth\ProfileController;
use App\Http\Resources\Api\V1\Blog\Category\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'        => $this->id,
            'title'     => $this->title,
            'featured_image' => $this->featured_image_url,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->category),
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
            'creator'   => new ProfileController($this->creator),
        ];
    }
}
