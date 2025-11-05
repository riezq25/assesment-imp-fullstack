<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@email.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Seed categories first
        $this->call([
            CategorySeeder::class,
        ]);
        
        // Then seed blogs that depend on categories
        $this->call([
            BlogSeeder::class,
        ]);
    }
}
