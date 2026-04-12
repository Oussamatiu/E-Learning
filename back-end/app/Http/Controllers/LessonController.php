<?php

namespace App\Http\Controllers;

use App\Models\ApiToken;
use App\Models\lesson;
use App\Models\User;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class LessonController extends Controller
{
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
        $token = $request->bearerToken();
        $apiToken = ApiToken::where('token', hash('sha256',$token))->first();
        $user = User::find($apiToken->user_id);
        Auth::login($user);
        $this->authorize('create', lesson::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'video' => 'nullable|file|mimes:mp4,mov,avi,wmv|max:512000',
            'duration' => 'required|integer',
        ]);
        $videoUrl = null;
        if ($request->hasFile('video')) {
            $videoUrl = $request->file('video')->store('lessons/videos', 'public');
        }
        $lesson = Lesson::create([
            'course_id' => $courseId,
            'title' => $request->title,
            'duration' => $request->duration,
            'video_url' => $videoUrl,
        ]);
        return response()->json([
            'message' => 'Lesson created successfully',
            'lesson' => [
                'id' => $lesson->id,
                'title' => $lesson->title,
                'video_url' => $lesson->video_url ? Storage::url($lesson->video_url) : null,
                'duration' => $lesson->duration,
                'course_id' => $lesson->course_id,
            ] 
        ], 201);
        
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
    public function update(Request $request, $courseId ,$lessonId)
    {
        try{
            $token = $request->bearerToken();
            $apiToken = ApiToken::where('token', hash('sha256',$token))->first();
            $user = User::find($apiToken->user_id);
            Auth::login($user);
            $lesson = Lesson::where('id', $lessonId)
                    ->where('course_id', $courseId)
                    ->first();
            $this->authorize('update', $lesson);
    
            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'video' => 'sometimes|nullable|file|mimes:mp4,mov,avi,wmv|max:512000',
                'duration' => 'sometimes|required|integer',
            ]);
    
            if ($request->hasFile('video')) {
                if ($lesson->video_url) {
                    Storage::disk('public')->delete($lesson->video_url);
                }
                $lesson->video_url = $request->file('video')->store('lessons/videos', 'public');
            }
    
            if ($request->has('title')) {
                $lesson->title = $request->title;
            }
            if ($request->has('duration')) {
                $lesson->duration = $request->duration;
            }
            $lesson->save();
    
            return response()->json([
                'message' => 'Lesson updated successfully',
                'lesson' => [
                    'id' => $lesson->id,
                    'title' => $lesson->title,
                    'video_url' => $lesson->video_url ? Storage::url($lesson->video_url) : null,
                    'duration' => $lesson->duration,
                    'course_id' => $lesson->course_id,
                ] 
            ], 200);
        }catch(ValidationException $e){
            return response()->json([
                "status" => false,
                "message" => $e->errors()
            ]);
        }catch(AuthorizationException $e){
            return response()->json([
                "status" => false,
                "message" => $e->getMessage()
            ]);
        }
            
    }

    /**
     * Remove the specified resource from storage.
     */
   public function destroy(Request $request, $courseId, $lessonId)
{
    try {
        $token = $request->bearerToken();
        $apiToken = ApiToken::where('token', hash('sha256', $token))->first();

        if (!$apiToken) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        $user = User::find($apiToken->user_id);
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        Auth::login($user);

        $lesson = Lesson::where('id', $lessonId)
                    ->where('course_id', $courseId)
                    ->first();

        $this->authorize('delete', $lesson);

        if ($lesson->video_url && Storage::disk('public')->exists($lesson->video_url)) {
            Storage::disk('public')->delete($lesson->video_url);
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
}
