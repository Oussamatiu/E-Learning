<?php

namespace App\Http\Controllers;

use App\Http\Resources\CourseResource;
use App\Models\ApiToken;
use App\Models\Course;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class CourseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $courses = Course::with('instructor', 'category')->get();
        return response()->json(CourseResource::collection($courses), 200);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $token = $request->bearerToken();
        $apiToken = ApiToken::where('token', hash('sha256',$token))->first();
        $user = User::find($apiToken->user_id);
        Auth::login($user);
        $this->authorize('create', Course::class);

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'nullable|numeric',
            'level' => 'nullable|string',
            'status' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
        ]);
        
       
        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'instructor_id' => $user->id,
            'price' => $request->price,
            'level' => $request->level,
            'status' => $request->status,
            'category_id' => $request->category_id,
        ]);

        return response()->json([
            "message" => "Course created successfully",
            "course" => new CourseResource($course)
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
    public function update(Request $request, string $id)
    {
        $token = $request->bearerToken();
        $apiToken = ApiToken::where('token', hash('sha256',$token))->first();
        $user = User::find($apiToken->user_id);
        Auth::login($user);
        $course = Course::findOrFail($id);
        $this->authorize('update', $course);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'nullable|numeric',
            'level' => 'nullable|string',
            'status' => 'nullable|string',
            'category_id' => 'sometimes|required|exists:categories,id',
        ]);

        $course->update($request->only(['title', 'description', 'price', 'level', 'status', 'category_id']));

        return response()->json([
            "message" => "Course updated successfully",
            "course" => new CourseResource($course)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        $token = $request->bearerToken();
        $apiToken = ApiToken::where('token', hash('sha256',$token))->first();
        $user = User::find($apiToken->user_id);
        Auth::login($user);
        $course = Course::findOrFail($id);
        $this->authorize('delete', $course);

        $course->delete();

        return response()->json([
            "message" => "Course deleted successfully"
        ], 200);
    }
}
