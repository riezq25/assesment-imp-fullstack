<?php

namespace App\Http\Resources\Api\V1\Blog;

use App\Http\Resources\Api\V1\Auth\ProfileResource;
use App\Http\Resources\Api\V1\Blog\Category\CategoryResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BlogDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'featured_image' => $this->featured_image_url,
            'content' => $this->content,
            'category_id' => $this->category_id,
            'category' => new CategoryResource($this->category),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'created_by' => $this->created_by,
            'updated_by' => $this->updated_by,
            'creator' => new ProfileResource($this->creator),
            'editor' => new ProfileResource($this->editor),
        ];
    }
}
