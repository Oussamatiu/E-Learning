<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseStructureController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\LessonController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\OutcomeController;
use App\Http\Controllers\Api\CourseController as ApiCourseController;
use App\Http\Controllers\OrderController;
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
    Route::get('/user', [AuthController::class, 'me']);
    Route::put('/user', [AuthController::class, 'update']);

    Route::post('/courses', [ApiCourseController::class, 'store']);
    Route::put('/courses/{course}', [ApiCourseController::class, 'update']);
    Route::post('/courses/{id}/update', [CourseController::class, 'update']); // FormData update (edit page)
    Route::delete('/courses/{id}', [CourseController::class, 'destroy']);

    // Course thumbnail upload
    Route::put('/courses/{course}/thumbnail', [CourseController::class, 'updateThumbnail']);

    // Checkout
    Route::post('/orders/checkout', [\App\Http\Controllers\OrderController::class, 'checkout']);
    Route::get('/orders/verify/{paymentIntentId}', [\App\Http\Controllers\OrderController::class, 'verifyPayment']);

    // Student Enrollments
    Route::get('/student/enrollments', [\App\Http\Controllers\EnrollmentController::class, 'index']);

    // Instructor Profile
    Route::get('/instructor/profile',  [\App\Http\Controllers\InstructorProfileController::class, 'show']);
    Route::post('/instructor/profile', [\App\Http\Controllers\InstructorProfileController::class, 'store']);

    // Course Progress (student) — enrollment required
    Route::get('/courses/{courseId}/progress', [\App\Http\Controllers\ProgressController::class, 'index'])->middleware('enrolled');
    Route::post('/courses/{courseId}/lessons/{lessonId}/progress', [\App\Http\Controllers\ProgressController::class, 'toggle'])->middleware('enrolled');

    // Comments & Ratings (enrollment checked inside controllers)
    Route::post('/courses/{courseId}/comments', [\App\Http\Controllers\CommentController::class, 'store']);
    Route::post('/courses/{courseId}/rate', [\App\Http\Controllers\RatingController::class, 'rate']);
});
    Route::get('/courses/{id}', [CourseController::class, 'show']); // public but injects is_enrolled
    Route::get('/courses/{courseId}/comments', [\App\Http\Controllers\CommentController::class, 'index']);

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
Route::get('/payment/status', [OrderController::class, 'paymentStatus'])->middleware('auth:sanctum');

// Admin routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/admin/dashboard', [\App\Http\Controllers\AdminController::class, 'dashboard']);
    Route::get('/admin/courses', [\App\Http\Controllers\AdminController::class, 'courses']);
    Route::post('/admin/courses/{id}/approve', [\App\Http\Controllers\AdminController::class, 'approveCourse']);
    Route::post('/admin/courses/{id}/reject', [\App\Http\Controllers\AdminController::class, 'rejectCourse']);
    Route::delete('/admin/courses/{id}', [\App\Http\Controllers\AdminController::class, 'deleteCourse']);
    Route::get('/admin/users', [\App\Http\Controllers\AdminController::class, 'users']);
    Route::post('/admin/users/{id}/toggle', [\App\Http\Controllers\AdminController::class, 'toggleUserStatus']);
    Route::get('/admin/payments', [\App\Http\Controllers\AdminController::class, 'payments']);
});