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

        'image' => $this->image,
        'thumbnail' => $this->thumbnail,

        'price' => $this->price,
        'level' => $this->level,
        'status' => $this->status,

        'duration' => $this->duration,
        'students_count' => $this->students_count,
        'rating' => $this->rating,

        'instructor' => $this->whenLoaded('instructor', function () {
            return [
                'id' => $this->instructor?->id,
                'name' => $this->instructor?->user?->name,
            ];
        }),

        'category' => $this->whenLoaded('category', function () {
            return [
                'id' => $this->category?->id,
                'name' => $this->category?->name,
            ];
        }),

        'created_at' => $this->created_at,
        'updated_at' => $this->updated_at,
    ];
}
}
