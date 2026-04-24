<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'img' => $this->thumbnail ? asset('storage/' . $this->thumbnail) : null,
            'thumbnail' => $this->thumbnail,
            'price' => $this->price,
            'oldPrice' => $this->price ? $this->price * 1.8 : null,
            'level' => $this->level,
            'status' => $this->status,
            'duration' => $this->duration ? $this->formatDuration($this->duration) : '0h 0m',
            'students' => $this->students_count ?? 0,
            'students_count' => $this->students_count ?? 0,
            'rating' => $this->rating ?? 4.5,
            'reviews' => $this->reviews_count ?? 120,
            'category' => $this->category ? ['id' => $this->category->id, 'name' => $this->category->name] : null,

            'instructor' => $this->whenLoaded('instructor', function () {
                $user = $this->instructor;
                $profile = $user?->instructorProfile;
                return [
                    'id' => $user?->id,
                    'name' => $user?->name ?? 'Unknown',
                    'role' => 'Instructor',
                    'avatar' => $profile?->avatar ? asset('storage/' . $profile->avatar) : ('https://ui-avatars.com/api/?name=' . urlencode($user?->name ?? 'User')),
                    'bio' => $profile?->bio ?? '',
                    'courses' => $user?->courses()->count() ?? 0,
                    'students' => $user?->courses()->sum('students_count') ?? 0,
                ];
            }),

            'outcomes' => $this->whenLoaded('outcomes', function () {
                return $this->outcomes->map(function ($outcome) {
                    return [
                        'id' => $outcome->id,
                        'description' => $outcome->description,
                        'order' => $outcome->order,
                    ];
                });
            }),

            'learnings' => $this->whenLoaded('outcomes', function () {
                return $this->outcomes->map(function ($outcome) {
                    return $outcome->description;
                });
            }),

            'curriculum' => $this->whenLoaded('sections', function () {
                return $this->sections->sortBy('order')->map(function ($section) {
                    return [
                        'id' => $section->id,
                        'title' => $section->title,
                        'lessons' => $section->lessons->sortBy('order')->map(function ($lesson) {
                            return [
                                'id' => $lesson->id,
                                'title' => $lesson->title,
                                'content' => $lesson->content,
                                'video_url' => $lesson->video_path ? asset('storage/' . $lesson->video_path) : null,
                                'duration' => $lesson->duration ? $this->formatDuration($lesson->duration) : '5m',
                                'free' => $lesson->is_free ?? false,
                            ];
                        })->values(),
                    ];
                });
            }),

            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }

    private function formatDuration($minutes)
    {
        $hours = floor($minutes / 60);
        $mins = $minutes % 60;
        return $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m";
    }
}
