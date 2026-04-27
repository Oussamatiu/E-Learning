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
Route::get('/courses', [CourseController::class, 'index']); // only published (filtered in controller)
Route::get('/categories', [CategorieController::class, 'index']);
Route::get('/instructor/courses', [CourseController::class, 'instructorCourses'])->middleware('auth:sanctum');
Route::get('/instructor/wallet', [\App\Http\Controllers\WalletController::class, 'index'])->middleware('auth:sanctum');
Route::post('/courses/{id}/publish', [CourseController::class, 'publish'])->middleware('auth:sanctum');
Route::post('/courses/structure', [CourseStructureController::class, 'store'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/courses', [ApiCourseController::class, 'store']);
    Route::put('/courses/{course}', [ApiCourseController::class, 'update']);
    Route::post('/courses/{id}/update', [CourseController::class, 'update']); // FormData update (edit page)
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Course thumbnail upload
    Route::put('/courses/{course}/thumbnail', [CourseController::class, 'updateThumbnail']);

    // Checkout
    Route::post('/orders/checkout', [\App\Http\Controllers\OrderController::class, 'checkout']);

    // Student Enrollments
    Route::get('/student/enrollments', [\App\Http\Controllers\EnrollmentController::class, 'index']);

    // Instructor Profile
    Route::get('/instructor/profile',  [\App\Http\Controllers\InstructorProfileController::class, 'show']);
    Route::post('/instructor/profile', [\App\Http\Controllers\InstructorProfileController::class, 'store']);

    // Course Progress (student) — enrollment required
    Route::get('/courses/{courseId}/progress', [\App\Http\Controllers\ProgressController::class, 'index'])->middleware('enrolled');
    Route::post('/courses/{courseId}/lessons/{lessonId}/progress', [\App\Http\Controllers\ProgressController::class, 'toggle'])->middleware('enrolled');
});
    Route::get('/courses/{id}', [CourseController::class, 'show']); // public but injects is_enrolled

// categories is public
Route::get('/categories', [CategorieController::class, 'index']);
Route::post('/courses/{courseId}/lessons', [LessonController::class, 'store'])->middleware('auth:sanctum');
Route::delete('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'destroy'])->middleware('auth:sanctum');
Route::put('/courses/{courseId}/lessons/{lessonId}',[LessonController::class, 'update'])->middleware('auth:sanctum');
// Video streaming — enrollment required (this is the key security gate)
Route::get('/courses/{courseId}/lessons/{lessonId}/stream', [LessonController::class, 'streamVideo'])->middleware(['auth:sanctum', 'enrolled']);
Route::resource('/courses/{courseId}/sections', SectionController::class)->middleware('auth:sanctum');

// Course outcomes routes
Route::post('/courses/{courseId}/outcomes', [OutcomeController::class, 'store'])->middleware('auth:sanctum');
Route::put('/courses/{courseId}/outcomes/{outcomeId}', [OutcomeController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/courses/{courseId}/outcomes/{outcomeId}', [OutcomeController::class, 'destroy'])->middleware('auth:sanctum');

// Stripe Webhook (Must be public, signature verified inside)
Route::post('/webhook/stripe', [\App\Http\Controllers\StripeWebhookController::class, 'handleWebhook']);