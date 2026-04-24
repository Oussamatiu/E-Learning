<?php

namespace App\Policies;

use App\Models\Outcome;
use App\Models\User;

class OutcomePolicy
{
    public function create(User $user): bool
    {
        return $user->isInstructor();
    }

    public function update(User $user, Outcome $outcome): bool
    {
        return $user->isInstructor()
            && $outcome->course?->instructor_id === $user->id;
    }

    public function delete(User $user, Outcome $outcome): bool
    {
        return $user->isInstructor()
            && $outcome->course?->instructor_id === $user->id;
    }
}
