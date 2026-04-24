<?php

namespace App\Policies;

use App\Models\Lesson;
use App\Models\User;

class LessonPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Lesson $lesson): bool
    {
        return true;
    }

    /**
     * Only instructors can create lessons.
     */
    public function create(User $user): bool
    {
        return $user->isInstructor();
    }

    /**
     * Instructor must own the course the lesson belongs to.
     */
    public function update(User $user, Lesson $lesson): bool
    {
        if (!$user->isInstructor()) return false;

        // Walk: lesson → section → course → instructor_id
        $courseInstructorId = $lesson->section?->course?->instructor_id;
        return $courseInstructorId !== null && $courseInstructorId === $user->id;
    }

    /**
     * Same ownership check for delete.
     */
    public function delete(User $user, Lesson $lesson): bool
    {
        if (!$user->isInstructor()) return false;

        $courseInstructorId = $lesson->section?->course?->instructor_id;
        return $courseInstructorId !== null && $courseInstructorId === $user->id;
    }

    public function restore(User $user, Lesson $lesson): bool
    {
        return true;
    }

    public function forceDelete(User $user, Lesson $lesson): bool
    {
        return false;
    }
}
