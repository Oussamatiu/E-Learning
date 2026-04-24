<?php

namespace App\Http\Controllers;

use App\Models\InstructorProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class InstructorProfileController extends Controller
{
    /**
     * GET /api/instructor/profile
     * Returns current instructor's profile.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        if (!$user->isInstructor()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $profile = $user->instructorProfile;
        return response()->json([
            'profile' => $profile,
        ]);
    }

    /**
     * POST /api/instructor/profile
     * Create or update the instructor profile.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        if (!$user->isInstructor()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'bio'          => 'nullable|string|max:1000',
            'headline'     => 'nullable|string|max:255',
            'expertise'    => 'nullable|string|max:500',
            'website'      => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only(['bio', 'headline', 'expertise', 'website', 'linkedin_url']);
        $data['user_id'] = $user->id;

        // Handle avatar upload
        if ($request->hasFile('avatar')) {
            $path = $request->file('avatar')->store('avatars', 'public');
            $data['avatar'] = $path;
        }

        $profile = InstructorProfile::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile saved successfully!',
            'profile' => $profile,
        ]);
    }
}
