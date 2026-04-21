<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            ['id' => 1, 'title' => 'student', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'title' => 'instructor', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'title' => 'admin', 'created_at' => now(), 'updated_at' => now()],
        ];

        Role::insert($roles);
    }
}
