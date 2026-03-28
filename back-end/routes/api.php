<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\LessonController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']); 
Route::post('/logout', [AuthController::class, 'logout'])->middleware('check.api.token');
Route::get('/verify-email', [AuthController::class, 'verifyEmail']);
Route::resource('/courses', CourseController::class)->middleware('check.api.token');
Route::post('/courses/{courseId}/lessons', [LessonController::class, 'store']);