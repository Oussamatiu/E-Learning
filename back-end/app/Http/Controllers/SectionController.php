<?php

namespace App\Http\Controllers;

use App\Models\Section;
use Illuminate\Http\Request;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $courseId)
    {
        try {
            $user = $request->user();
            if (!$user) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $sections = Section::where('course_id', $courseId)
                ->with('lessons')
                ->orderBy('order')
                ->get();

            return response()->json($sections, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch sections',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $courseId)
    {
        try {
            $user = $request->user();

            // Verify course exists and belongs to user
            $course = \App\Models\Course::where('id', $courseId)->firstOrFail();
           if(!$course){
                return response()->json([
                    'message' => 'Course not found'
                ], 404);
            }
           
            $this->authorize('create', Section::class);

            $request->validate([
                'title' => 'required|string|max:255',
               
                'order' => 'nullable|integer',
            ]);

            $section = Section::create([
                'course_id' => $course->id,
                'title' => $request->title,
                'order' => $request->order ?? 0,
            ]);

            return response()->json([
                'message' => 'Section created successfully',
                'section' => $section
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'message' => 'Course not found'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $courseId, $sectionId)
    {
        try {
            $user = $request->user();

            $section = Section::where('id', $sectionId)
                ->where('course_id', $courseId)
                ->with('lessons')
                ->firstOrFail();

            return response()->json($section, 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Section not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $courseId, $sectionId)
    {
        try {
            $user = $request->user();

            $section = Section::where('id', $sectionId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $this->authorize('update', $section);

            $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'order' => 'nullable|integer',
            ]);

            $section->update($request->only(['title', 'description', 'order']));

            return response()->json([
                'message' => 'Section updated successfully',
                'section' => $section
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update section',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $courseId, $sectionId)
    {
        try {
            $user = $request->user();

            $section = Section::where('id', $sectionId)
                ->where('course_id', $courseId)
                ->firstOrFail();

            $this->authorize('delete', $section);

            $section->delete();

            return response()->json([
                'message' => 'Section deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete section',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
