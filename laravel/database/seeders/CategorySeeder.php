<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Technology'],
            ['name' => 'Business'],
            ['name' => 'Health & Wellness'],
            ['name' => 'Education'],
            ['name' => 'Entertainment']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
