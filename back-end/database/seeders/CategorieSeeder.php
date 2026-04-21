<?php

namespace Database\Seeders;


use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Programming', 'slug' => 'programming'],
            ['name' => 'Design', 'slug' => 'design'],
            ['name' => 'Data Science', 'slug' => 'data-science'],
            ['name' => 'Marketing', 'slug' => 'marketing'],
            ['name' => 'Business', 'slug' => 'business'],
            ['name' => 'Finance', 'slug' => 'finance'],
            ['name' => 'Photography', 'slug' => 'photography'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}