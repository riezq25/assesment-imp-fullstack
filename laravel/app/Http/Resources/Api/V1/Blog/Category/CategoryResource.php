<?php

namespace App\Http\Resources\Api\V1\Blog\Category;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $request->only(['id', 'name']);

        return parent::toArray($request);
    }
}
