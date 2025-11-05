<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Category;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();
        $categories = Category::pluck('id');
        $user = User::first();

        // Ensure the blogs directory exists in storage
        if (! Storage::exists(Blog::FEATURED_IMAGE_PATH)) {
            Storage::makeDirectory(Blog::FEATURED_IMAGE_PATH);
        }

        // Copy placeholder image to storage if it doesn't exist
        $storagePath = null;
        $placeholderPath = public_path('images/placeholder.png');
        if (file_exists($placeholderPath)) {
            $storagePath = Blog::FEATURED_IMAGE_PATH.'/placeholder.png';
            if (! Storage::exists($storagePath)) {
                Storage::put($storagePath, file_get_contents($placeholderPath));
            }
        }

        for ($i = 0; $i < 20; $i++) {
            $title = $faker->sentence();
            $slug = Str::slug($title).'-'.uniqid();

            Blog::create([
                'title' => $title,
                'slug' => $slug,
                'content' => $faker->paragraphs(5, true),
                'featured_image' => $storagePath,
                'category_id' => $faker->randomElement($categories),
                'created_by' => $user->id,
                'updated_by' => $user->id,
            ]);
        }
    }
}
