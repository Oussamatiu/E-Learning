<?php

namespace App\Policies;

use App\Models\Outcome;
use App\Models\User;

class OutcomePolicy
{
    /**
     * Determine if the given outcome can be created by the user.
     */
    public function create(User $user): bool
    {
        return $user->role?->title === 'instructor';
    }

    /**
     * Determine if the given outcome can be updated by the user.
     */
    public function update(User $user, Outcome $outcome): bool
    {
        return $user->role?->title === 'instructor'
            && $outcome->course->instructor->user_id === $user->id;
    }

    /**
     * Determine if the given outcome can be deleted by the user.
     */
    public function delete(User $user, Outcome $outcome): bool
    {
        return $user->role?->title === 'instructor'
            && $outcome->course->instructor->user_id === $user->id;
    }
}
