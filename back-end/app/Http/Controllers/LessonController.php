<?php

namespace App\Http\Controllers;

use App\Models\Lesson;
use App\Models\Enrollment;
use App\Services\FileService;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class LessonController extends Controller
{
    protected FileService $fileService;

    public function __construct(FileService $fileService)
    {
        $this->fileService = $fileService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, string $courseId)
    {
        try {
            $user = $request->user();
            $this->authorize('create', Lesson::class);

            // Verify course exists
            $course = \App\Models\Course::where('id', $courseId)->firstOrFail();

            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'nullable|string',
                'video_file' => 'nullable|file|mimes:mp4,mov,avi,wmv,webm|max:512000',
                'duration' => 'nullable|integer|min:0',
                'section_id' => 'required|exists:sections,id',
                'is_free' => 'nullable|boolean',
                'order' => 'nullable|integer|min:0',
            ]);

            $videoPath = null;
            if ($request->hasFile('video_file')) {
                $videoPath = $this->fileService->upload($request->file('video_file'), 'lessons/videos', 'public');
            }

            $lesson = Lesson::create([
                'title' => $request->title,
                'content' => $request->content ?? null,
                'video_path' => $videoPath,
                'duration' => $request->duration ?? 0,
                'section_id' => $request->section_id,
                'is_free' => $request->is_free ?? false,
                'order' => $request->order ?? 0,
            ]);

            return response()->json([
                'message' => 'Lesson created successfully',
                'lesson' => $lesson
            ], 201);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Course or Section not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create lesson',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $lesson = Lesson::findOrFail($id);
        
        return response()->json([
            'id' => $lesson->id,
            'title' => $lesson->title,
            'video_url' => $lesson->video_url ? Storage::url($lesson->video_url) : null,
            'duration' => $lesson->duration,
            'course_id' => $lesson->course_id,
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $courseId, $lessonId)
    {
        try {
            $user = $request->user();
            $lesson = Lesson::findOrFail($lessonId);

            // Inline ownership check — avoids redirect-to-login 500
            $instructorId = $lesson->section?->course?->instructor_id;
            if (!$user || !$user->isInstructor() || $instructorId !== $user->id) {
                return response()->json(['status' => false, 'message' => 'Forbidden'], 403);
            }

            $request->validate([
                'title'      => 'sometimes|required|string|max:255',
                'content'    => 'sometimes|nullable|string',
                'is_free'    => 'sometimes|boolean',
                'video_file' => 'sometimes|nullable|file|mimes:mp4,mov,avi,wmv,webm|max:512000',
                'duration'   => 'sometimes|nullable|integer',
                'section_id' => 'nullable|exists:sections,id',
            ]);

            if ($request->hasFile('video_file')) {
                if ($lesson->video_path) {
                    $this->fileService->delete($lesson->video_path, 'public');
                }
                $lesson->video_path = $this->fileService->upload($request->file('video_file'), 'lessons/videos', 'public');
            }

            if ($request->has('title'))      $lesson->title      = $request->title;
            if ($request->has('content'))    $lesson->content    = $request->content;
            if ($request->has('is_free'))    $lesson->is_free    = $request->boolean('is_free');
            if ($request->has('duration'))   $lesson->duration   = $request->duration;
            if ($request->has('section_id')) $lesson->section_id = $request->section_id;

            $lesson->save();

            return response()->json([
                'message' => 'Lesson updated successfully',
                'lesson'  => [
                    'id'         => $lesson->id,
                    'title'      => $lesson->title,
                    'content'    => $lesson->content,
                    'is_free'    => $lesson->is_free,
                    'duration'   => $lesson->duration,
                    'section_id' => $lesson->section_id,
                ]
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                "status"  => false,
                "message" => $e->errors()
            ], 422);
        } catch (AuthorizationException $e) {
            return response()->json([
                "status"  => false,
                "message" => $e->getMessage()
            ], 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $courseId, $lessonId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            $lesson = Lesson::where('id', $lessonId)
                        ->where('course_id', $courseId)
                        ->first();

            $this->authorize('delete', $lesson);

            // Delete video file if exists
            if ($lesson->video_path) {
                $this->fileService->delete($lesson->video_path, 'local');
            }

            $lesson->delete();

            return response()->json([
                'message' => 'Lesson deleted successfully',
            ], 200);

        } catch (AuthorizationException $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 422);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Stream lesson video (only for enrolled users).
     */
    public function streamVideo(Request $request, $courseId, $lessonId)
    {
        try {
            $user = $request->user();

            if (!$user) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            $lesson = Lesson::where('id', $lessonId)
                ->where('course_id', $courseId)
                ->with(['section.course'])
                ->firstOrFail();

            if (!$lesson->video_path) {
                return response()->json(['error' => 'Video not found'], 404);
            }

            // Check if user is enrolled in the course
            $courseId = $lesson->section->course->id;
            $isEnrolled = Enrollment::where('user_id', $user->id)
                ->where('course_id', $courseId)
                ->where('status', 'active')
                ->exists();

            // Allow if user is instructor of the course or enrolled student
            $isInstructor = $lesson->section->course->instructor_id === $user->id;

            if (!$isEnrolled && !$isInstructor) {
                return response()->json(['error' => 'You are not enrolled in this course'], 403);
            }

            // Check if video exists
            if (!$this->fileService->exists($lesson->video_path, 'local')) {
                return response()->json(['error' => 'Video file not found'], 404);
            }

            // Get file contents
            $fileContents = $this->fileService->getContents($lesson->video_path, 'local');

            // Determine mime type
            $mimeType = Storage::disk('local')->mimeType($lesson->video_path) ?: 'video/mp4';

            // Return streamed response
            return response($fileContents, 200, [
                'Content-Type' => $mimeType,
                'Content-Length' => strlen($fileContents),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
