<?php

namespace App\Models;

use App\Helpers\FileHelper;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Mattiverse\Userstamps\Traits\Userstamps;

class Blog extends Model
{
    use HasFactory, HasUuids, Userstamps;

    const FEATURED_IMAGE_PATH = 'blogs';

    protected $guarded = [
        'id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getFeaturedImageUrlAttribute()
    {
        return FileHelper::getTempUrl($this->featured_image);
    }
}
