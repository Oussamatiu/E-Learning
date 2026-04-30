<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use App\Models\InstructorProfile;
use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        

        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@elarning.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => 3, // admin role
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Instructor User
        $instructor = User::create([
            'name' => 'John Instructor',
            'email' => 'instructor@elarning.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => 2, // instructor role
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        InstructorProfile::create([
            'user_id' => $instructor->id,
            'bio' => 'Full stack developer with 10 years of experience.',
            'expertise' => 'PHP, Laravel, React, Node.js',
            'headline' => 'Expert Instructor',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Create Student User
        $student = User::create([
            'name' => 'Jane Student',
            'email' => 'student@elarning.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password'),
            'role_id' => 1, // student role
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
