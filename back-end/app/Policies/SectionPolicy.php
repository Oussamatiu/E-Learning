<?php

namespace App\Policies;

use App\Models\Section;
use App\Models\User;

class SectionPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isInstructor();
    }

    public function view(User $user, Section $section): bool
    {
        return $user->isInstructor()
            && $section->course?->instructor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isInstructor();
    }

    public function update(User $user, Section $section): bool
    {
        return $user->isInstructor()
            && $section->course?->instructor_id === $user->id;
    }

    public function delete(User $user, Section $section): bool
    {
        return $user->isInstructor()
            && $section->course?->instructor_id === $user->id;
    }

    public function restore(User $user, Section $section): bool
    {
        return $user->isInstructor()
            && $section->course?->instructor_id === $user->id;
    }

    public function forceDelete(User $user, Section $section): bool
    {
        return false;
    }
}
