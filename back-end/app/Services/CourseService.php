<?php

namespace App\Services;

use App\Models\Course;
use App\Models\Section;
use App\Models\Lesson;
use App\Models\Outcome;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Http\UploadedFile;

class CourseService
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }

    /**
     * Create a course with basic info and outcomes only (no sections/lessons).
     * Sections and lessons are created separately via their own endpoints.
     *
     * @param array $data
     * @param int $instructorId
     * @return Course
     */
    public function createCourseWithOutcomes(array $data, int $instructorId): Course
    {
        return DB::transaction(function () use ($data, $instructorId) {
            // 1. Handle thumbnail if provided
            $thumbnailPath = null;
            if (isset($data['thumbnail_file']) && $data['thumbnail_file'] instanceof \Illuminate\Http\UploadedFile) {
                $thumbnailPath = $this->fileService->upload($data['thumbnail_file'], 'courses/thumbnails', 'public');
            }

            // 2. Create the course
            $course = Course::create([
                'instructor_id'  => $instructorId,
                'category_id'    => $data['category_id'],
                'title'          => $data['title'],
                'description'    => $data['description'] ?? null,
                'price'          => $data['price'] ?? null,
                'level'          => $data['level'] ?? null,
                'status'         => $data['status'] ?? 'draft',
                'thumbnail'      => $thumbnailPath,
                'duration'       => 0,
                'students_count' => 0,
                'rating'         => 0,
            ]);

            // 3. Create outcomes
            foreach ($data['outcomes'] ?? [] as $index => $outcomeText) {
                $course->outcomes()->create([
                    'description' => $outcomeText,
                    'order'       => $index,
                ]);
            }

            return $course->load(['outcomes']);
        });
    }

    /**
     * Create a full course with all related entities in a single transaction.
     *
     * @param array $data
     * @param int $instructorId
     * @return Course
     */
    public function createFullCourse(array $data, int $instructorId): Course
    {
        logger('fjj');
        return DB::transaction(function () use ($data, $instructorId) {
            // 1. Handle thumbnail if provided
            $thumbnailPath = null;
            if (isset($data['thumbnail_file']) && $data['thumbnail_file'] instanceof \Illuminate\Http\UploadedFile) {
                $thumbnailPath = $this->fileService->upload($data['thumbnail_file'], 'courses/thumbnails', 'public');
            }

            // 2. Create the course
            $course = Course::create([
                'instructor_id'  => $instructorId,
                'category_id'    => $data['category_id'],
                'title'          => $data['title'],
                'description'    => $data['description'] ?? null,
                'price'          => $data['price'] ?? null,
                'level'          => $data['level'] ?? null,
                'status'         => $data['status'] ?? 'draft',
                'thumbnail'      => $thumbnailPath,
                'duration'       => 0,
                'students_count' => 0,
                'rating'         => 0,
            ]);

            // 3. Create outcomes
            foreach ($data['outcomes'] ?? [] as $index => $outcomeText) {
                $course->outcomes()->create([
                    'description' => $outcomeText,
                    'order'       => $index,
                ]);
            }

            // 4. Create sections and lessons
            $totalDuration = 0;
            foreach ($data['sections'] ?? [] as $sIndex => $sectionData) {
                $section = $course->sections()->create([
                    'title' => $sectionData['title'] ?? '',
                    'order' => $sectionData['order'] ?? $sIndex,
                ]);

                foreach ($sectionData['lessons'] ?? [] as $lIndex => $lessonData) {
                    $videoPath = null;
                    if (isset($lessonData['video_file']) && $lessonData['video_file'] instanceof \Illuminate\Http\UploadedFile) {
                        $videoPath = $this->fileService->upload($lessonData['video_file'], 'lessons/videos', 'local');
                    }

                    $lesson = $section->lessons()->create([
                        'title'      => $lessonData['title'] ?? '',
                        'content'    => $lessonData['content'] ?? null,
                        'video_path' => $videoPath,
                        'is_free'    => $lessonData['is_free'] ?? false,
                        'order'      => $lessonData['order'] ?? $lIndex,
                    ]);

                    $totalDuration += $lessonData['duration'] ?? 0;
                }
            }

            // 5. Update course duration
            $course->update(['duration' => $totalDuration]);

            return $course->load(['sections.lessons', 'outcomes']);
        });
    }

    /**
     * Update an existing course with all related entities.
     *
     * @param Course $course
     * @param array $data
     * @return Course
     */
    public function updateFullCourse(Course $course, array $data): Course
    {
        return DB::transaction(function () use ($course, $data) {
            // 1. Handle thumbnail upload if provided
            $thumbnailPath = $course->thumbnail;
            if (isset($data['course']['thumbnail_file']) && $data['course']['thumbnail_file'] instanceof UploadedFile) {
                $thumbnailPath = $this->fileService->replace(
                    $data['course']['thumbnail_file'],
                    $course->thumbnail,
                    'courses/thumbnails',
                    'public'
                );
            }

            // 2. Update course
            $course->update([
                'title' => $data['course']['title'],
                'description' => $data['course']['description'] ?? null,
                'category_id' => $data['course']['category_id'],
                'price' => $data['course']['price'] ?? null,
                'level' => $data['course']['level'] ?? null,
                'status' => $data['course']['status'] ?? 'draft',
                'thumbnail' => $thumbnailPath,
            ]);

            // 2. Delete existing outcomes and create new ones
            $course->outcomes()->delete();
            foreach ($data['outcomes'] ?? [] as $index => $outcomeData) {
                Outcome::create([
                    'course_id' => $course->id,
                    'description' => $outcomeData['description'],
                    'order' => $index,
                ]);
            }

            // 3. Delete existing sections and lessons, create new ones
            $course->sections()->delete();
            $totalDuration = 0;

            foreach ($data['sections'] ?? [] as $sectionIndex => $sectionData) {
                $section = Section::create([
                    'course_id' => $course->id,
                    'title' => $sectionData['title'],
                    'order' => $sectionIndex,
                ]);

                foreach ($sectionData['lessons'] ?? [] as $lessonIndex => $lessonData) {
                    // Handle video file upload if provided
                    $videoPath = null;
                    if (isset($lessonData['video_file']) && $lessonData['video_file'] instanceof UploadedFile) {
                        $videoPath = $this->fileService->upload($lessonData['video_file'], 'lessons/videos', 'local');
                    }

                    $lesson = Lesson::create([
                        'section_id' => $section->id,
                        'title' => $lessonData['title'],
                        'content' => $lessonData['content'] ?? null,
                        'video_path' => $videoPath,
                        'is_free' => $lessonData['is_free'] ?? false,
                        'order' => $lessonIndex,
                    ]);
                    $totalDuration += $lessonData['duration'] ?? 0;
                }
            }

            // 4. Update course duration
            $course->update(['duration' => $totalDuration]);

            return $course->load(['sections.lessons', 'outcomes']);
        });
    }
}