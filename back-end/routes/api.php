<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseStructureController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\OutcomeController;
use App\Http\Controllers\Api\CourseController as ApiCourseController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/logout', [AuthController::class, 'logout'])->middleware('check.api.token');
Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
Route::get('/courses', [CourseController::class, 'index']);
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/instructor/courses', [CourseController::class, 'instructorCourses'])->middleware('auth:sanctum');
Route::post('/courses/structure', [CourseStructureController::class, 'store'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses', [ApiCourseController::class, 'store']);
    Route::put('/courses/{course}', [ApiCourseController::class, 'update']);
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Course thumbnail upload
    Route::put('/courses/{course}/thumbnail', [CourseController::class, 'updateThumbnail']);
});
    Route::get('/courses/{id}', [CourseController::class, 'show']);

// categories is public
Route::get('/categories', [CategorieController::class, 'index']);
Route::post('/courses/{courseId}/lessons', [LessonController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'destroy'])->middleware('auth:sanctum');
Route::put('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'update'])->middleware('auth:sanctum');
// Video streaming (protected - requires enrollment)
Route::get('/courses/{courseId}/lessons/{lessonId}/stream', [LessonController::class, 'streamVideo'])->middleware('auth:sanctum');
Route::resource('/courses/{courseId}/sections', SectionController::class)->middleware('auth:sanctum');

// Course outcomes routes
Route::post('/courses/{courseId}/outcomes', [OutcomeController::class, 'store'])->middleware('auth:sanctum');
Route::put('/courses/{courseId}/outcomes/{outcomeId}', [OutcomeController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/courses/{courseId}/outcomes/{outcomeId}', [OutcomeController::class, 'destroy'])->middleware('auth:sanctum');

Route::get('/videos/{path}', function ($path) {
    $fullPath = storage_path('app/private/' . $path);

    if (!file_exists($fullPath)) {
        abort(404);
    }

    return response()->file($fullPath);
})->where('path', '.*');